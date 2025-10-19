import { useNavigate, useLocation } from "react-router-dom";
import { Home, Rocket, Users, Lightbulb, MessageCircle } from "lucide-react";
import { cn } from "@/lib/innovator/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
export function FishtankNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  useEffect(() => {
    loadPendingRequests();
    const channel = supabase.channel('navigation_updates').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'connections'
    }, () => {
      loadPendingRequests();
    }).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'team_invitations'
    }, () => {
      loadPendingRequests();
    }).subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);
  const loadPendingRequests = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;

      // Count connection requests
      const {
        count: connectionCount
      } = await supabase.from('connections').select('*', {
        count: 'exact',
        head: true
      }).eq('connected_user_id', user.id).eq('status', 'pending');

      // Count team invitations
      const {
        count: invitationCount
      } = await supabase.from('team_invitations').select('*', {
        count: 'exact',
        head: true
      }).eq('invited_user_id', user.id).eq('status', 'pending');
      setPendingRequestsCount((connectionCount || 0) + (invitationCount || 0));
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };
  const navItems = [{
    path: "/innovator",
    icon: Home,
    label: "Home"
  }, {
    path: "/innovator/tank",
    icon: Rocket,
    label: "Tank"
  }, {
    path: "/innovator/network",
    icon: Users,
    label: "Network"
  }, {
    path: "/innovator/collaborate",
    icon: Lightbulb,
    label: "Collaborate"
  }, {
    path: "/innovator/messaging",
    icon: MessageCircle,
    label: "Messages",
    badge: pendingRequestsCount
  }];
  return <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      
    </nav>;
}
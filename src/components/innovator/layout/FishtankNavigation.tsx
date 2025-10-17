import { useNavigate, useLocation } from "react-router-dom";
import { Home, Rocket, Users, Lightbulb, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export function FishtankNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  useEffect(() => {
    loadPendingRequests();

    const channel = supabase
      .channel('navigation_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections'
      }, () => {
        loadPendingRequests();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_invitations'
      }, () => {
        loadPendingRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPendingRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Count connection requests
      const { count: connectionCount } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('connected_user_id', user.id)
        .eq('status', 'pending');

      // Count team invitations
      const { count: invitationCount } = await supabase
        .from('team_invitations')
        .select('*', { count: 'exact', head: true })
        .eq('invited_user_id', user.id)
        .eq('status', 'pending');

      setPendingRequestsCount((connectionCount || 0) + (invitationCount || 0));
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/tank", icon: Rocket, label: "Tank" },
    { path: "/network", icon: Users, label: "Network" },
    { path: "/collaborate", icon: Lightbulb, label: "Collaborate" },
    { path: "/messaging", icon: MessageCircle, label: "Messages", badge: pendingRequestsCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

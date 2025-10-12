import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCheck, UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FriendRequest {
  id: string;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
    role: string;
  };
}

interface FriendRequestsProps {
  onRequestHandled: () => void;
}

export function FriendRequests({ onRequestHandled }: FriendRequestsProps) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('friend_requests')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections'
      }, () => {
        loadRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('connections')
        .select(`
          id,
          user_id,
          created_at
        `)
        .eq('connected_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (conn) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, role')
            .eq('id', conn.user_id)
            .single();

          return {
            ...conn,
            profiles: profile || { id: conn.user_id, full_name: 'Unknown', avatar_url: '', role: 'User' }
          };
        })
      );

      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, accept: boolean) => {
    try {
      if (accept) {
        const { error } = await supabase
          .from('connections')
          .update({ status: 'accepted' })
          .eq('id', requestId);

        if (error) throw error;

        // Create message thread
        const { data: connection } = await supabase
          .from('connections')
          .select('user_id, connected_user_id')
          .eq('id', requestId)
          .single();

        if (connection) {
          const { error: threadError } = await supabase.rpc(
            'create_direct_message_thread',
            { 
              participant_ids: [connection.user_id, connection.connected_user_id]
            }
          );

          if (threadError) throw threadError;
        }

        toast({
          title: "Request Accepted",
          description: "You can now message each other!"
        });
      } else {
        const { error } = await supabase
          .from('connections')
          .delete()
          .eq('id', requestId);

        if (error) throw error;

        toast({
          title: "Request Declined",
          description: "Friend request declined"
        });
      }

      loadRequests();
      onRequestHandled();
    } catch (error) {
      console.error('Error handling request:', error);
      toast({
        title: "Error",
        description: "Failed to handle request",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-border pb-4">
      <div className="px-4 py-2">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">Friend Requests ({requests.length})</h3>
        <div className="space-y-2">
          {requests.map((request) => (
            <Card key={request.id} className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.profiles.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {request.profiles.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{request.profiles.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{request.profiles.role || 'User'}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRequest(request.id, true)}
                    className="h-8"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequest(request.id, false)}
                    className="h-8"
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

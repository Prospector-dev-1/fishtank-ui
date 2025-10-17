import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, Users } from "lucide-react";
import { toast } from "sonner";

interface TeamInvitation {
  id: string;
  innovation_id: string;
  invited_user_id: string;
  invited_by_user_id: string;
  role: string;
  permission_level?: 'founder' | 'co_founder' | 'member' | 'collaborator' | 'admin';
  status: string;
  created_at: string;
  innovations?: {
    title: string;
    company_name: string;
  };
  inviter?: {
    full_name: string;
    avatar_url: string;
    email: string;
  };
}

const PERMISSION_LABELS = {
  founder: { label: 'Founder', icon: '👑' },
  co_founder: { label: 'Co-founder', icon: '⭐' },
  member: { label: 'Team Member', icon: '👤' },
  collaborator: { label: 'Collaborator', icon: '🤝' },
  admin: { label: 'Admin', icon: '⚙️' },
};

export function TeamInvitations() {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadInvitations();

    const channel = supabase
      .channel('team_invitations_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_invitations'
      }, () => {
        loadInvitations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadInvitations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          innovations!innovation_id (
            title,
            company_name
          ),
          inviter:profiles!invited_by_user_id (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('invited_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (invitation: TeamInvitation) => {
    setProcessingIds(prev => new Set(prev).add(invitation.id));
    try {
      // Add to team_members
      const { error: teamError } = await supabase
        .from('team_members')
        .insert({
          innovation_id: invitation.innovation_id,
          user_id: invitation.invited_user_id,
          role: invitation.role,
          permission_level: invitation.permission_level || 'member'
        } as any);

      if (teamError) throw teamError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from('team_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      // Mark related notification as read
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', invitation.invited_user_id)
        .eq('type', 'team_invitation')
        .contains('message', [invitation.innovations?.title || '']);

      toast.success(`You joined ${invitation.innovations?.title}'s team!`);
      await loadInvitations();
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast.error(error.message || 'Failed to accept invitation');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitation.id);
        return newSet;
      });
    }
  };

  const handleDecline = async (invitation: TeamInvitation) => {
    setProcessingIds(prev => new Set(prev).add(invitation.id));
    try {
      const { error: updateError } = await supabase
        .from('team_invitations')
        .update({ status: 'declined' })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', invitation.invited_user_id)
        .eq('type', 'team_invitation')
        .contains('message', [invitation.innovations?.title || '']);

      toast.success('Invitation declined');
      await loadInvitations();
    } catch (error: any) {
      console.error('Error declining invitation:', error);
      toast.error(error.message || 'Failed to decline invitation');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitation.id);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading invitations...</div>
        </CardContent>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Users className="w-5 h-5" />
          Team Invitation{invitations.length > 1 ? 's' : ''} 
          <Badge variant="default" className="ml-auto">{invitations.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-start gap-4 p-4 rounded-lg border-2 border-primary/30 bg-background shadow-sm"
          >
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarImage src={invitation.inviter?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {invitation.inviter?.full_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-base">
                    {invitation.inviter?.full_name || invitation.inviter?.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm leading-relaxed">
                    invited you to join{' '}
                    <span className="font-semibold text-primary">
                      {invitation.innovations?.title || 'an innovation'}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Role:</span>
                    <Badge variant="secondary" className="font-medium">
                      {invitation.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    {invitation.permission_level && (
                      <Badge variant="outline" className="font-medium gap-1">
                        <span>{PERMISSION_LABELS[invitation.permission_level].icon}</span>
                        {PERMISSION_LABELS[invitation.permission_level].label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAccept(invitation)}
                  disabled={processingIds.has(invitation.id)}
                  className="flex items-center gap-1.5 font-medium"
                >
                  <Check className="w-4 h-4" />
                  Accept & Join Team
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDecline(invitation)}
                  disabled={processingIds.has(invitation.id)}
                  className="flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Decline
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

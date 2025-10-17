import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserPlus, Users, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  permission_level?: 'founder' | 'co_founder' | 'member' | 'collaborator' | 'admin';
  joined_at: string;
  profile?: {
    full_name: string;
    avatar_url: string;
    email: string;
  };
}
interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  profile?: {
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
  };
}
interface TeamManagementProps {
  innovationId: string;
}
const PERMISSION_LEVELS = [{
  value: 'founder',
  label: 'Founder',
  description: 'Complete control (auto-assigned to creator)',
  icon: '👑'
}, {
  value: 'co_founder',
  label: 'Co-founder',
  description: 'Full access except deletion',
  icon: '⭐'
}, {
  value: 'member',
  label: 'Team Member',
  description: 'Create pitches & view analytics',
  icon: '👤'
}, {
  value: 'collaborator',
  label: 'Collaborator',
  description: 'Listed on team only',
  icon: '🤝'
}];
export function TeamManagement({
  innovationId
}: TeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('Member');
  const [selectedPermission, setSelectedPermission] = useState<'co_founder' | 'member' | 'collaborator'>('member');
  const [isLoading, setIsLoading] = useState(true);
  const [innovationTitle, setInnovationTitle] = useState<string>('');
  const [innovationOwnerId, setInnovationOwnerId] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  useEffect(() => {
    loadCurrentUser();
    loadInnovation();
    loadTeamMembers();
    loadConnections();
  }, [innovationId]);
  const loadCurrentUser = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };
  const loadInnovation = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('innovations').select('title, user_id').eq('id', innovationId).single();
      if (error) throw error;
      setInnovationTitle(data?.title || '');
      setInnovationOwnerId(data?.user_id || '');

      // Auto-add owner as Founder if not already in team
      if (data?.user_id) {
        await ensureOwnerInTeam(data.user_id);
      }
    } catch (error) {
      console.error('Error loading innovation:', error);
    }
  };
  const ensureOwnerInTeam = async (ownerId: string) => {
    try {
      const {
        data: existingMember
      } = await supabase.from('team_members').select('id').eq('innovation_id', innovationId).eq('user_id', ownerId).single();
      if (!existingMember) {
        await supabase.from('team_members').insert({
          innovation_id: innovationId,
          user_id: ownerId,
          role: 'Founder',
          permission_level: 'founder'
        } as any);
      }
    } catch (error) {
      console.log('Owner already in team or error adding:', error);
    }
  };
  const loadTeamMembers = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('team_members').select(`
          id,
          user_id,
          role,
          permission_level,
          joined_at,
          profiles:user_id (
            full_name,
            avatar_url,
            email
          )
        `).eq('innovation_id', innovationId);
      if (error) throw error;
      const membersWithProfile = (data || []).map((member: any) => ({
        ...member,
        profile: Array.isArray(member.profiles) ? member.profiles[0] : member.profiles
      }));
      setTeamMembers(membersWithProfile);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const loadConnections = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data,
        error
      } = await supabase.from('connections').select(`
          id,
          user_id,
          connected_user_id,
          profiles:connected_user_id (
            id,
            full_name,
            avatar_url,
            email
          )
        `).eq('user_id', user.id).eq('status', 'accepted');
      if (error) throw error;
      const connectionsWithProfile = (data || []).map(conn => ({
        ...conn,
        profile: Array.isArray(conn.profiles) ? conn.profiles[0] : conn.profiles
      }));
      setConnections(connectionsWithProfile);
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };
  const handleAddMember = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select a person and role');
      return;
    }
    setIsAddingMember(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if already a team member
      const {
        data: existingMember
      } = await supabase.from('team_members').select('id').eq('innovation_id', innovationId).eq('user_id', selectedUser).single();
      if (existingMember) {
        toast.error('User is already a team member');
        return;
      }

      // Get inviter and invited user profiles
      const {
        data: invitedProfile
      } = await supabase.from('profiles').select('full_name, email').eq('id', selectedUser).single();

      // Create invitation
      const {
        error: inviteError
      } = await supabase.from('team_invitations').insert({
        innovation_id: innovationId,
        invited_user_id: selectedUser,
        invited_by_user_id: user.id,
        role: selectedRole,
        permission_level: selectedPermission,
        status: 'pending'
      } as any);
      if (inviteError) throw inviteError;

      // Create notification
      const permissionLabel = PERMISSION_LEVELS.find(p => p.value === selectedPermission)?.label || selectedPermission;
      await supabase.from('notifications').insert({
        user_id: selectedUser,
        type: 'team_invitation',
        title: 'Team Invitation',
        message: `You've been invited to join ${innovationTitle} as ${selectedRole} with ${permissionLabel} permissions`,
        link: '/messaging'
      });
      const userName = invitedProfile?.full_name || invitedProfile?.email || 'User';
      toast.success(`Invitation sent to ${userName}`);
      setSelectedUser('');
      setSelectedRole('Member');
      setSelectedPermission('member');
      await loadTeamMembers();
    } catch (error: any) {
      console.error('Error adding team member:', error);
      toast.error(error.message || 'Failed to add team member');
    } finally {
      setIsAddingMember(false);
    }
  };
  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const {
        error
      } = await supabase.from('team_members').update({
        role: newRole
      }).eq('id', memberId);
      if (error) throw error;
      toast.success('Role updated');
      await loadTeamMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };
  const handleUpdatePermission = async (memberId: string, member: TeamMember, newPermission: 'founder' | 'co_founder' | 'member' | 'collaborator') => {
    if (member.user_id === innovationOwnerId) {
      toast.error('Cannot change founder\'s permissions');
      return;
    }
    if (newPermission === 'founder') {
      toast.error('Only the innovation creator can be the founder');
      return;
    }
    try {
      const {
        error
      } = await supabase.from('team_members').update({
        permission_level: newPermission
      } as any).eq('id', memberId);
      if (error) throw error;
      toast.success('Permission level updated');
      await loadTeamMembers();
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission level');
    }
  };
  const handleRemoveMember = async (memberId: string) => {
    try {
      const {
        error
      } = await supabase.from('team_members').delete().eq('id', memberId);
      if (error) throw error;
      toast.success('Team member removed');
      await loadTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
    }
  };
  const handleLeaveTeam = async () => {
    if (!currentUserId) return;
    try {
      const {
        error
      } = await supabase.from('team_members').delete().eq('innovation_id', innovationId).eq('user_id', currentUserId);
      if (error) throw error;
      toast.success('You have left the team');
      window.location.href = '/tank';
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error('Failed to leave team');
    }
  };
  const isOwner = currentUserId === innovationOwnerId;
  const currentUserMember = teamMembers.find(m => m.user_id === currentUserId);
  const canManageTeam = isOwner || currentUserMember?.permission_level === 'co_founder' || currentUserMember?.permission_level === 'founder';
  const availableConnections = connections.filter(conn => !teamMembers.some(member => member.user_id === conn.connected_user_id));
  const getPermissionBadge = (permission?: string) => {
    if (!permission) return null;
    const config = PERMISSION_LEVELS.find(p => p.value === permission);
    if (!config) return null;
    return;
  };
  return <Card className="ios-card bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{innovationTitle} Team</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {!isOwner && currentUserMember && <Button size="sm" variant="outline" onClick={handleLeaveTeam} className="rounded-full text-destructive border-destructive hover:bg-destructive/10">
                Leave Team
              </Button>}
            {canManageTeam && <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Select Person</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Choose from connections" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {availableConnections.length === 0 ? <div className="p-4 text-center text-sm text-muted-foreground">
                              No available connections
                            </div> : availableConnections.map(conn => <SelectItem key={conn.connected_user_id} value={conn.connected_user_id}>
                                {conn.profile?.full_name || conn.profile?.email}
                              </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input placeholder="e.g. CTO, Designer" value={selectedRole} onChange={e => setSelectedRole(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Permission Level</Label>
                      <Select value={selectedPermission} onValueChange={(value: any) => setSelectedPermission(value)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {PERMISSION_LEVELS.filter(p => p.value !== 'founder').map(level => <SelectItem key={level.value} value={level.value}>
                              <div className="flex items-center gap-2">
                                <span>{level.icon}</span>
                                <div>
                                  <div className="font-medium">{level.label}</div>
                                  <div className="text-xs text-muted-foreground">{level.description}</div>
                                </div>
                              </div>
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleAddMember} disabled={isAddingMember || !selectedUser || !selectedRole} className="w-full">
                      {isAddingMember ? 'Adding...' : 'Add to Team'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </div> : teamMembers.length === 0 ? <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No team members yet</p>
          </div> : <div className="space-y-3">
            {teamMembers.map(member => <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.profile?.avatar_url} />
                    <AvatarFallback>
                      {member.profile?.full_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">
                        {member.profile?.full_name || member.profile?.email || 'Unknown'}
                      </p>
                      {getPermissionBadge(member.permission_level)}
                    </div>
                    <div className="flex items-center gap-2">
                      {canManageTeam ? <>
                          <Select value={member.role} onValueChange={newRole => handleUpdateRole(member.id, newRole)}>
                            <SelectTrigger className="w-auto h-6 text-xs border-none bg-secondary hover:bg-secondary/80 px-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="Founder">Founder</SelectItem>
                              <SelectItem value="Co-founder">Co-founder</SelectItem>
                              <SelectItem value="CTO">CTO</SelectItem>
                              <SelectItem value="CEO">CEO</SelectItem>
                              <SelectItem value="Designer">Designer</SelectItem>
                              <SelectItem value="Developer">Developer</SelectItem>
                              <SelectItem value="Member">Member</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={member.permission_level} onValueChange={(value: any) => handleUpdatePermission(member.id, member, value)} disabled={member.user_id === innovationOwnerId}>
                            <SelectTrigger className="w-auto h-6 text-xs border-none bg-secondary hover:bg-secondary/80 px-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              {PERMISSION_LEVELS.map(level => <SelectItem key={level.value} value={level.value} disabled={level.value === 'founder'}>
                                  <span className="flex items-center gap-2">
                                    <span>{level.icon}</span>
                                    {level.label}
                                  </span>
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                        </> : <span className="text-xs text-muted-foreground">{member.role}</span>}
                    </div>
                  </div>
                </div>
                {canManageTeam && member.user_id !== innovationOwnerId && <Button size="sm" variant="ghost" onClick={() => handleRemoveMember(member.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>}
              </div>)}
          </div>}
      </CardContent>
    </Card>;
}
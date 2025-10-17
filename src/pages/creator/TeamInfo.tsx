import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/creator/ui/button";
import { Card } from "@/components/creator/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/creator/ui/avatar";
import { Badge } from "@/components/creator/ui/badge";
import { Separator } from "@/components/creator/ui/separator";
import { Switch } from "@/components/creator/ui/switch";
import { Input } from "@/components/creator/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/creator/ui/dialog";
import { useNavigation } from "@/contexts/NavigationContext";
import {
  ArrowLeft,
  Users,
  Phone,
  Video,
  UserPlus,
  Search,
  Image,
  Star,
  Bell,
  Palette,
  Download,
  Clock,
  Settings,
  Lock,
  Shield,
  Link as LinkIcon,
  ChevronRight,
  Plus,
  Copy,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  joined_at: string;
}

interface Team {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export default function TeamInfo() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hideNavigation, showNavigation } = useNavigation();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [creatorName, setCreatorName] = useState<string>("");
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  useEffect(() => {
    hideNavigation();
    return () => showNavigation();
  }, [hideNavigation, showNavigation]);

  useEffect(() => {
    if (teamId && user) {
      loadTeamData();
    }
  }, [teamId, user]);

  const loadTeamData = async () => {
    try {
      // Fetch team details
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();

      if (teamError) throw teamError;
      setTeam(teamData);
      setIsCreator(teamData.created_by === user?.id);

      // Fetch creator profile
      const { data: creatorProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", teamData.created_by)
        .single();

      if (creatorProfile) {
        setCreatorName(creatorProfile.full_name);
      }

      // Fetch team members with profiles
      const { data: membersData, error: membersError } = await supabase
        .from("team_members")
        .select(`
          user_id,
          joined_at,
          profiles!inner(full_name, avatar_url)
        `)
        .eq("team_id", teamId);

      if (membersError) throw membersError;

      const formattedMembers = membersData.map((m: any) => ({
        user_id: m.user_id,
        full_name: m.profiles.full_name,
        avatar_url: m.profiles.avatar_url,
        joined_at: m.joined_at,
      }));

      // Sort: current user first, then creator, then others
      formattedMembers.sort((a, b) => {
        if (a.user_id === user?.id) return -1;
        if (b.user_id === user?.id) return 1;
        if (a.user_id === teamData.created_by) return -1;
        if (b.user_id === teamData.created_by) return 1;
        return 0;
      });

      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error loading team data:", error);
      toast.error("Failed to load team information");
    } finally {
      setLoading(false);
    }
  };

  const handleExitGroup = async () => {
    if (!user || !teamId) return;

    const confirmed = window.confirm("Are you sure you want to exit this group?");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("You have left the group");
      navigate("/inbox");
    } catch (error) {
      console.error("Error exiting group:", error);
      toast.error("Failed to exit group");
    }
  };

  const handleDeleteGroup = async () => {
    if (!user || !teamId || !isCreator) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this group? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const { error } = await supabase.from("teams").delete().eq("id", teamId);

      if (error) throw error;

      toast.success("Group deleted successfully");
      navigate("/inbox");
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    }
  };

  const handleEditTeam = () => {
    if (!team) return;
    setNewTeamName(team.name);
    setEditDialogOpen(true);
  };

  const handleSaveTeamName = async () => {
    if (!teamId || !newTeamName.trim()) return;

    try {
      const { error } = await supabase
        .from("teams")
        .update({ name: newTeamName.trim() })
        .eq("id", teamId);

      if (error) throw error;

      setTeam({ ...team!, name: newTeamName.trim() });
      toast.success("Team name updated");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating team name:", error);
      toast.error("Failed to update team name");
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/team/${teamId}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  };

  const filteredMembers = members.filter((member) =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Team not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border/20 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/inbox")}
          className="hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Group info</h1>
        {isCreator && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:bg-accent"
            onClick={handleEditTeam}
          >
            Edit
          </Button>
        )}
        {!isCreator && <div className="w-16" />}
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center py-8 px-4">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mb-4">
          <Users className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-1">{team.name}</h2>
        <p className="text-sm text-muted-foreground">
          Group · <span className="text-primary">{members.length} members</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-4 px-4 mb-6">
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-accent"
          onClick={() => toast.info("Audio call feature coming soon")}
        >
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Audio</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-accent"
          onClick={() => toast.info("Video call feature coming soon")}
        >
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <Video className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Video</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-accent"
          onClick={() => toast.info("Add member feature coming soon")}
        >
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Add</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-accent"
          onClick={() => toast.info("Search feature coming soon")}
        >
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Search</span>
        </Button>
      </div>

      {/* Settings Cards */}
      <Card className="mx-4 mb-4 bg-card border-border/20">
        <div className="divide-y divide-border/20">
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 h-auto hover:bg-accent rounded-none first:rounded-t-lg"
            onClick={() => toast.info("Media browser coming soon")}
          >
            <div className="flex items-center gap-3">
              <Image className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Media, links and docs</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">0</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 h-auto hover:bg-accent rounded-none"
            onClick={() => toast.info("Starred messages coming soon")}
          >
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Starred</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">None</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 h-auto hover:bg-accent rounded-none"
            onClick={() => toast.info("Notification settings coming soon")}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Notifications</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 h-auto hover:bg-accent rounded-none last:rounded-b-lg"
            onClick={() => toast.info("Chat theme customization coming soon")}
          >
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Chat theme</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </Card>

      {/* Privacy & Permissions */}
      <Card className="mx-4 mb-4 bg-card border-border/20">
        <div className="divide-y divide-border/20">
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 h-auto hover:bg-accent rounded-none first:rounded-t-lg"
            onClick={() => toast.info("Disappearing messages coming soon")}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Disappearing messages</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Off</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>

          {isCreator && (
            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-3 h-auto hover:bg-accent rounded-none"
              onClick={() => toast.info("Group permissions coming soon")}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Group permissions</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Lock chat</span>
            </div>
            <Switch onCheckedChange={(checked) => toast.info(checked ? "Chat locked" : "Chat unlocked")} />
          </div>

          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 h-auto hover:bg-accent rounded-none last:rounded-b-lg"
            onClick={() => toast.info("Encryption settings coming soon")}
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Encryption</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </Card>

      {/* Members Section */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {filteredMembers.length} MEMBERS
          </h3>
          {members.length > 0 && (
            <div className="relative flex-1 max-w-[200px] ml-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          )}
        </div>

        <Card className="bg-card border-border/20">
          <div className="divide-y divide-border/20">
            {isCreator && (
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto hover:bg-accent rounded-none first:rounded-t-lg"
                onClick={() => toast.info("Add members feature coming soon")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-primary">Add members</span>
                </div>
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 h-auto hover:bg-accent rounded-none"
              onClick={() => setInviteDialogOpen(true)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <LinkIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-primary">Invite via link or QR code</span>
              </div>
            </Button>

            {filteredMembers.map((member) => (
              <Button
                key={member.user_id}
                variant="ghost"
                className="w-full justify-between px-4 py-3 h-auto hover:bg-accent rounded-none last:rounded-b-lg"
                onClick={() => navigate(`/creators/${member.user_id}`)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_id}`}
                      alt={member.full_name}
                    />
                    <AvatarFallback>
                      {member.full_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {member.full_name}
                      {member.user_id === user?.id && (
                        <span className="text-muted-foreground ml-1">(You)</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.user_id === team.created_by && (
                    <Badge variant="secondary" className="text-xs">
                      Admin
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-center text-primary hover:bg-accent"
          onClick={() => toast.success("Added to favorites")}
        >
          Add to Favorites
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center text-primary hover:bg-accent"
          onClick={() => toast.info("Export chat feature coming soon")}
        >
          Export chat
        </Button>
      </div>

      <Separator className="my-4" />

      {/* Danger Zone */}
      <div className="px-4 pb-8 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-center text-red-500 hover:bg-accent"
          onClick={handleExitGroup}
        >
          Exit group
        </Button>
        {isCreator && (
          <Button
            variant="ghost"
            className="w-full justify-center text-red-500 hover:bg-accent"
            onClick={handleDeleteGroup}
          >
            Delete group
          </Button>
        )}
        {!isCreator && (
          <Button
            variant="ghost"
            className="w-full justify-center text-red-500 hover:bg-accent"
            onClick={() => toast.info("Report group feature coming soon")}
          >
            Report group
          </Button>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pb-8">
        <p>
          Created by {team.created_by === user?.id ? "you" : creatorName}
        </p>
        <p>{new Date(team.created_at).toLocaleDateString()}</p>
      </div>

      {/* Edit Team Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group Name</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter group name"
              maxLength={50}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTeamName} disabled={!newTeamName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to Group</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Share this link with others:</p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/team/${teamId}`}
                  readOnly
                  className="flex-1"
                />
                <Button size="icon" onClick={handleCopyInviteLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <div className="p-4 bg-white rounded-lg">
                <QrCode className="h-32 w-32 text-primary" />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Scan QR code or share the link to invite members
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setInviteDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

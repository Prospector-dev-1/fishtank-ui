import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Search, ArrowRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/creator/ui/use-toast";

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableUsers: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  onTeamCreated: () => void;
}

export default function CreateTeamModal({
  open,
  onOpenChange,
  availableUsers,
  onTeamCreated
}: CreateTeamModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [teamName, setTeamName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const filteredUsers = availableUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleNext = () => {
    if (selectedUsers.size === 0) {
      toast({
        title: "Select members",
        description: "Please select at least one member for your team",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
  };

  const handleCreate = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a name for your team",
        variant: "destructive"
      });
      return;
    }

    if (!user) return;

    try {
      setCreating(true);

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamName.trim(),
          created_by: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as member, filter out current user from selectedUsers to avoid duplicates
      const members = [
        { team_id: team.id, user_id: user.id },
        ...Array.from(selectedUsers)
          .filter(userId => userId !== user.id)
          .map(userId => ({
            team_id: team.id,
            user_id: userId
          }))
      ];

      const { error: membersError } = await supabase
        .from('team_members')
        .insert(members);

      if (membersError) throw membersError;

      toast({
        title: "Team created!",
        description: `${teamName} has been created successfully`
      });

      // Reset and close
      setStep(1);
      setSelectedUsers(new Set());
      setTeamName("");
      setSearchQuery("");
      onOpenChange(false);
      onTeamCreated();
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedUsers(new Set());
    setTeamName("");
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Add Team Members" : "Name Your Team"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            {/* Selected count */}
            {selectedUsers.size > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                <Users className="h-4 w-4" />
                <span>{selectedUsers.size} member{selectedUsers.size !== 1 ? 's' : ''} selected</span>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* User list */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No members found</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-border"
                    />
                    <span className="flex-1 font-medium">{user.name}</span>
                  </label>
                ))
              )}
            </div>

            {/* Next button */}
            <Button
              onClick={handleNext}
              disabled={selectedUsers.size === 0}
              className="w-full"
              size="lg"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected members preview */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Team Members</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedUsers).map(userId => {
                  const user = availableUsers.find(u => u.id === userId);
                  if (!user) return null;
                  return (
                    <div key={userId} className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-xs font-medium">{user.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team name input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Name</label>
              <Input
                placeholder="Enter team name..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                maxLength={50}
                autoFocus
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!teamName.trim() || creating}
                className="flex-1"
              >
                {creating ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

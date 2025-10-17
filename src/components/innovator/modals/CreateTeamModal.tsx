import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { teamsAPI } from "@/lib/fishtankApiExtended";
import { toast } from "sonner";
import { Plus, X, Users } from "lucide-react";

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  welcomeMessage: z.string().optional(),
  members: z.array(z.string()).min(1, "At least one member is required")
});

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateTeamModal = ({ open, onOpenChange, onSuccess }: CreateTeamModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState('');

  // Mock connections/users that can be added to team
  const mockConnections = [
    { id: 'user1', name: 'Sarah Kim', avatar: 'SK' },
    { id: 'user2', name: 'Michael Chen', avatar: 'MC' },
    { id: 'user3', name: 'Jessica Kumar', avatar: 'JK' },
    { id: 'user4', name: 'David Park', avatar: 'DP' }
  ];

  const form = useForm({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      welcomeMessage: '',
      members: []
    }
  });

  const addMember = (userId: string) => {
    if (!selectedMembers.includes(userId)) {
      const updated = [...selectedMembers, userId];
      setSelectedMembers(updated);
      form.setValue('members', updated);
    }
  };

  const removeMember = (userId: string) => {
    const updated = selectedMembers.filter(id => id !== userId);
    setSelectedMembers(updated);
    form.setValue('members', updated);
  };

  const filteredConnections = mockConnections.filter(conn =>
    conn.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
    !selectedMembers.includes(conn.id)
  );

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await teamsAPI.createTeam({
        name: data.name,
        welcomeMessage: data.welcomeMessage,
        members: [...data.members, 'current-user'], // Add current user as owner
        roles: {
          'current-user': 'owner',
          ...data.members.reduce((acc: any, memberId: string) => {
            acc[memberId] = 'member';
            return acc;
          }, {})
        }
      });
      
      toast.success("Team created successfully!");
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      form.reset();
      setSelectedMembers([]);
    } catch (error) {
      toast.error("Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create Team
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Name */}
          <div>
            <Label htmlFor="name">Team Name *</Label>
            <Input
              id="name"
              placeholder="e.g. EcoTrack Core Team"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Welcome Message */}
          <div>
            <Label htmlFor="welcomeMessage">Welcome Message (optional)</Label>
            <Textarea
              id="welcomeMessage"
              placeholder="Welcome to the team! Let's build something amazing together."
              className="min-h-[80px]"
              {...form.register("welcomeMessage")}
            />
          </div>

          {/* Add Members */}
          <div>
            <Label>Add Members *</Label>
            <div className="space-y-3">
              {/* Search */}
              <Input
                placeholder="Search connections..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />

              {/* Available connections */}
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filteredConnections.map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                    onClick={() => addMember(conn.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                        {conn.avatar}
                      </div>
                      <span className="text-sm">{conn.name}</span>
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>

              {/* Selected members */}
              {selectedMembers.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Selected Members:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMembers.map((memberId) => {
                      const member = mockConnections.find(c => c.id === memberId);
                      return (
                        <Badge key={memberId} variant="secondary" className="cursor-pointer">
                          {member?.name}
                          <X 
                            className="w-3 h-3 ml-1" 
                            onClick={() => removeMember(memberId)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {form.formState.errors.members && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.members.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
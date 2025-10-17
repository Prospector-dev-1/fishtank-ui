import { useState } from "react";
import { ChevronLeft, Plus, Mail, Crown, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/innovator/ui/button";
import { Card } from "@/components/innovator/ui/card";
import { Input } from "@/components/innovator/ui/input";
import { Badge } from "@/components/innovator/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/innovator/ui/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Editor" | "Viewer";
  status: "Active" | "Pending" | "Inactive";
  joinedAt: string;
  avatar: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "tm1",
    name: "Alex Founder",
    email: "alex@novapay.com",
    role: "Owner",
    status: "Active",
    joinedAt: "2024-01-15",
    avatar: "AF"
  },
  {
    id: "tm2", 
    name: "Sarah Chen",
    email: "sarah@novapay.com",
    role: "Editor",
    status: "Active", 
    joinedAt: "2024-02-01",
    avatar: "SC"
  },
  {
    id: "tm3",
    name: "Mike Developer",
    email: "mike@novapay.com", 
    role: "Viewer",
    status: "Pending",
    joinedAt: "2024-03-10",
    avatar: "MD"
  }
];

export default function TeamManagement() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Editor" | "Viewer">("Editor");

  const handleInvite = () => {
    if (!inviteEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send an invitation.",
        variant: "destructive"
      });
      return;
    }

    // Add new pending member
    const newMember: TeamMember = {
      id: `tm${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "Pending",
      joinedAt: new Date().toISOString().split("T")[0],
      avatar: inviteEmail.charAt(0).toUpperCase() + inviteEmail.charAt(1).toUpperCase()
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail("");
    
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${inviteEmail} as ${inviteRole}`
    });
  };

  const handleRemoveMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member?.role === "Owner") {
      toast({
        title: "Cannot Remove Owner",
        description: "You cannot remove the project owner.",
        variant: "destructive"
      });
      return;
    }

    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    toast({
      title: "Member Removed",
      description: "Team member has been removed from the project."
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner": return "bg-primary/10 text-primary";
      case "Editor": return "bg-success/10 text-success";
      case "Viewer": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success";
      case "Pending": return "bg-warning/10 text-warning";
      case "Inactive": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container-mobile px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold">Team Management</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="container-mobile px-4 py-6 space-y-6">
        {/* Invite Section */}
        <Card className="card-elevated p-6">
          <h2 className="font-semibold text-lg mb-4">Invite Team Member</h2>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Enter email address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "Editor" | "Viewer")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <Button onClick={handleInvite} className="px-8">
                <Mail className="w-4 h-4 mr-2" />
                Send Invite
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Editor:</strong> Can edit project details and upload content<br/>
              <strong>Viewer:</strong> Can view project but cannot make changes
            </div>
          </div>
        </Card>

        {/* Team Members List */}
        <Card className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Team Members ({teamMembers.length})</h2>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-medium text-primary text-sm">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRoleColor(member.role)}>
                        {member.role === "Owner" && <Crown className="w-3 h-3 mr-1" />}
                        {member.role}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {member.role !== "Owner" && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Permissions Info */}
        <Card className="card-elevated p-6">
          <h3 className="font-semibold mb-3">Role Permissions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-primary">Owner</strong>
              <p className="text-muted-foreground">Full access including team management, billing, and project deletion</p>
            </div>
            <div>
              <strong className="text-success">Editor</strong>
              <p className="text-muted-foreground">Can edit project details, upload content, and manage investor communications</p>
            </div>
            <div>
              <strong className="text-muted-foreground">Viewer</strong>
              <p className="text-muted-foreground">Read-only access to view project details and analytics</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
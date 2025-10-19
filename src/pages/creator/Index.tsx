import { useState, useEffect } from "react";
import { 
  Briefcase, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Star,
  Clock,
  DollarSign,
  Plus,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Palette,
  Code,
  Megaphone,
  Brain,
  Film,
  Mail,
  UserPlus,
  X,
  Check,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/creator/ui/card";
import { Button } from "@/components/creator/ui/button";
import { Badge } from "@/components/creator/ui/badge";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "@/components/creator/ProfileHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeInvitations, setActiveInvitations] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadInvitations();
      loadFriendRequests();
      loadNotifications();
      loadEarnings();
      loadMilestones();
      loadUnreadMessages();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(5);
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadEarnings = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("earnings")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", {
          ascending: false,
        });
      if (error) throw error;
      setEarnings(data || []);
    } catch (error) {
      console.error("Error loading earnings:", error);
    }
  };

  const loadMilestones = async () => {
    if (!user) return;
    try {
      // Get milestones for the user's contracts
      const { data: contracts, error: contractsError } = await supabase
        .from("contracts")
        .select("id")
        .eq("creator_id", user.id);
      if (contractsError) throw contractsError;
      if (contracts && contracts.length > 0) {
        const contractIds = contracts.map((c) => c.id);
        const { data: milestonesData, error: milestonesError } = await supabase
          .from("milestones")
          .select("*, contracts(title)")
          .in("contract_id", contractIds)
          .in("status", ["pending", "in_progress", "submitted"])
          .order("due_date", {
            ascending: true,
          });
        if (milestonesError) throw milestonesError;
        setMilestones(milestonesData || []);
      }
    } catch (error) {
      console.error("Error loading milestones:", error);
    }
  };

  const loadUnreadMessages = async () => {
    if (!user) return;
    try {
      const { count, error } = await supabase
        .from("messages")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("recipient_id", user.id)
        .eq("read", false);
      if (error) throw error;
      setUnreadMessagesCount(count || 0);
    } catch (error) {
      console.error("Error loading unread messages:", error);
    }
  };

  const loadInvitations = async () => {
    if (!user) return;
    try {
      // First get invitations
      const { data: invitationsData, error: invError } = await supabase
        .from("invitations")
        .select("*")
        .eq("to_creator_id", user.id)
        .eq("status", "pending")
        .order("created_at", {
          ascending: false,
        });
      if (invError) throw invError;

      // Then get profile data for each sender
      if (invitationsData && invitationsData.length > 0) {
        const senderIds = invitationsData.map((inv) => inv.from_user_id);
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", senderIds);
        if (profileError) throw profileError;
        const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
        const formattedInvitations = invitationsData.map((inv: any) => {
          const profile = profileMap.get(inv.from_user_id);
          return {
            id: inv.id,
            title: inv.role,
            from: profile?.full_name || "Unknown User",
            avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${inv.from_user_id}`,
            budget: inv.milestones?.[0]?.compensation?.amount || 0,
            timeline: `${inv.milestones?.length || 0} milestones`,
            message: inv.note || "No message provided",
            status: inv.status,
          };
        });
        setActiveInvitations(formattedInvitations);
      } else {
        setActiveInvitations([]);
      }
    } catch (error) {
      console.error("Error loading invitations:", error);
    }
  };

  const loadFriendRequests = async () => {
    if (!user) return;
    try {
      // Get friend requests where user is the recipient
      const { data: requests, error: requestError } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("to_user_id", user.id)
        .eq("status", "pending")
        .order("created_at", {
          ascending: false,
        });
      if (requestError) throw requestError;

      // Get sender profiles
      if (requests && requests.length > 0) {
        const senderIds = requests.map((req) => req.from_user_id);
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", senderIds);
        if (profileError) throw profileError;
        const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
        const formattedRequests = requests.map((req: any) => {
          const profile = profileMap.get(req.from_user_id);
          return {
            id: req.id,
            from_user_id: req.from_user_id,
            name: profile?.full_name || "Unknown User",
            avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.from_user_id}`,
          };
        });
        setFriendRequests(formattedRequests);
      } else {
        setFriendRequests([]);
      }
    } catch (error) {
      console.error("Error loading friend requests:", error);
    }
  };

  const handleAcceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("friend_requests")
        .update({
          status: "accepted",
        })
        .eq("id", requestId);
      if (error) throw error;

      // Reload friend requests
      loadFriendRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("friend_requests")
        .update({
          status: "declined",
        })
        .eq("id", requestId);
      if (error) throw error;

      // Reload friend requests
      loadFriendRequests();
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  // Calculate earnings metrics from real data
  const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount), 0);
  const releasedEarnings = earnings
    .filter((e) => e.status === "released")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const pendingEarnings = earnings.filter((e) => e.status === "pending").reduce((sum, e) => sum + Number(e.amount), 0);
  const heldEarnings = earnings.filter((e) => e.status === "held").reduce((sum, e) => sum + Number(e.amount), 0);

  // Get current month earnings
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEarnings = earnings
    .filter((e) => new Date(e.created_at) >= currentMonthStart)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  // Format milestones as tasks
  const thisWeekTasks = milestones.slice(0, 3).map((milestone) => ({
    id: milestone.id,
    title: milestone.title,
    project: (milestone as any).contracts?.title || "Project",
    due: milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : "No due date",
    status: milestone.status === "in_progress" ? "in-progress" : milestone.status,
  }));

  // Get pending releases from earnings
  const pendingReleases = earnings
    .filter((e) => e.status === "pending")
    .map((e) => ({
      id: e.id,
      description: `Payment from ${e.contract_id ? "contract" : "milestone"}`,
      amount: Number(e.amount),
    }));

  // Metric cards data (using real data where possible)
  const metrics = [
    { label: "New Chats", value: unreadMessagesCount.toString(), icon: MessageCircle, color: "text-primary" },
    { label: "Active Jobs", value: milestones.length.toString(), icon: Briefcase, color: "text-primary" },
    { label: "Response Rate", value: "94%", icon: MessageCircle, color: "text-primary", progress: 94 },
    { label: "Quality Score", value: "96%", icon: CheckCircle, color: "text-primary", progress: 96 },
  ];

  // Project data for workroom (using real milestone data)
  const projects = thisWeekTasks.slice(0, 2).map((task, index) => ({
    id: task.id,
    name: task.title,
    status: task.status === "in-progress" ? "In Progress" : "Awaiting Review",
    progress: task.status === "in-progress" ? 65 : 90,
    dueDate: task.due,
    statusColor: task.status === "in-progress" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
  }));

  // Categories for browse section
  const categories = [
    {
      name: "Design",
      description: "Logos, branding, UI/UX",
      icon: Palette,
      color: "bg-gray-100"
    },
    {
      name: "Development",
      description: "Web, mobile, backend", 
      icon: Code,
      color: "bg-gray-100"
    },
    {
      name: "Marketing",
      description: "Social, ads, growth",
      icon: Megaphone,
      color: "bg-gray-100"
    },
    {
      name: "AI & Data",
      description: "ML, automations",
      icon: Brain,
      color: "bg-gray-100"
    },
    {
      name: "Content",
      description: "Video, copy, socials",
      icon: Film,
      color: "bg-gray-100"
    }
  ];

  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6 relative animate-fade-in">
      <ProfileHeader />

      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-slate-50">
            Good morning, {userProfile?.full_name?.split(" ")[0] || "there"}!{" "}
          </h1>
          <p className="text-muted-foreground text-lg">Ready to create something amazing?</p>
        </div>
      </div>

      {/* New Metric Cards */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up">
        {metrics.map((metric, index) => (
          <Card 
            key={index} 
            className="p-6 text-center shadow-card hover:shadow-elegant transition-all duration-200 cursor-pointer active:scale-[0.98]"
            onClick={() => {
              if (metric.label === "New Chats") navigate("/inbox");
              if (metric.label === "Active Jobs") navigate("/discover");
            }}
          >
            <CardContent className="p-0">
              <metric.icon className={`h-8 w-8 mx-auto mb-3 ${metric.color}`} strokeWidth={1.5} />
              <div className="text-2xl font-bold text-foreground mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                {metric.label}
              </div>
              {metric.progress && (
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${metric.progress}%` }}
                  ></div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings Overview Widget */}
      <Card 
        className="bg-gradient-primary text-white shadow-elegant animate-scale-in cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        onClick={() => navigate('/creator/earnings')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-white/80 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold tracking-tight">${totalEarnings.toLocaleString()}</p>
              <p className="text-white/70 text-sm">Released: ${releasedEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm mb-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <p className="text-white/80 font-medium text-xs">Held</p>
              <p className="font-semibold text-base">${heldEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <p className="text-white/80 font-medium text-xs">Pending</p>
              <p className="font-semibold text-base">${pendingEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <p className="text-white/80 font-medium text-xs">This Month</p>
              <p className="font-semibold text-base">${thisMonthEarnings.toLocaleString()}</p>
            </div>
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/creator/earnings');
            }}
          >
            View Full Details
            <DollarSign className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <Card className="shadow-card animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="bg-accent/10 p-2 rounded-full">
                <UserPlus className="h-5 w-5 text-accent" />
              </div>
              Friend Requests ({friendRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-xl bg-gradient-subtle border border-accent/10 hover:shadow-elegant transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-12 h-12 rounded-full border-2 border-accent/20 cursor-pointer"
                    onClick={() => navigate(`/creator/creators/${request.from_user_id}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-semibold text-base cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/creator/creators/${request.from_user_id}`)}
                    >
                      {request.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">Wants to connect with you</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="shadow-sm" onClick={() => handleAcceptFriendRequest(request.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeclineFriendRequest(request.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Invitations */}
      {activeInvitations.length > 0 && (
        <Card className="shadow-card animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              New Invitations ({activeInvitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="p-4 rounded-xl bg-gradient-subtle border border-primary/10 hover:shadow-elegant transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={invitation.avatar}
                    alt={invitation.from}
                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base">{invitation.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      From {invitation.from} • <span className="font-semibold text-success">${invitation.budget}</span>{" "}
                      • {invitation.timeline}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{invitation.message}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 shadow-sm">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Workroom Section */}
      <div className="space-y-4 animate-slide-up">
        <h2 className="text-xl font-bold text-foreground">Your Workroom</h2>
        <div className="space-y-3">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="p-4 shadow-card hover:shadow-elegant transition-all duration-200">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <Badge className={`text-xs px-2 py-1 ${project.statusColor}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Due {project.dueDate}
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-muted-foreground">No active projects</p>
                <p className="text-sm text-muted-foreground">Start exploring opportunities!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up">
        <Button
          variant="outline"
          className="h-auto p-6 flex flex-col gap-3 shadow-card hover:shadow-elegant transition-all duration-200"
          onClick={() => navigate("/creator/proposals")}
        >
          <div className="bg-primary/10 p-3 rounded-full">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-semibold">Post Service</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto p-6 flex flex-col gap-3 shadow-card hover:shadow-elegant transition-all duration-200"
          onClick={() => navigate("/creator/settings")}
        >
          <div className="bg-accent/10 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-accent" />
          </div>
          <span className="text-sm font-semibold">Set Availability</span>
        </Button>
      </div>

      {/* Browse by Category */}
      <div className="space-y-4 animate-slide-up">
        <h2 className="text-xl font-bold text-foreground">Browse by category</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="p-4 shadow-card hover:shadow-elegant transition-all duration-200 cursor-pointer active:scale-[0.98]"
              onClick={() => navigate("/discover")}
            >
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-muted/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <category.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* This Week Tasks */}
      <Card className="shadow-card animate-slide-up">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="bg-accent/10 p-2 rounded-full">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {thisWeekTasks.length > 0 ? (
            thisWeekTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-subtle border hover:shadow-card transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base">{task.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{task.project}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      task.status === "in-progress" ? "default" : task.status === "submitted" ? "secondary" : "outline"
                    }
                    className="text-xs mb-2 font-medium"
                  >
                    {task.status === "in-progress" && <Clock className="h-3 w-3 mr-1" />}
                    {task.status === "submitted" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {task.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground font-medium">{task.due}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Clock className="h-8 w-8" />
              </div>
              <p className="font-medium">No active tasks</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Releases */}
      <Card className="shadow-card animate-slide-up">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="bg-success/10 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            Pending Releases
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingReleases.map((release) => (
            <div
              key={release.id}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-subtle border border-success/20 hover:shadow-card transition-all duration-200"
            >
              <div>
                <p className="font-semibold text-base">{release.description}</p>
                <p className="text-sm text-muted-foreground">Processing...</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-success text-lg">${release.amount}</p>
                <Badge variant="outline" className="text-xs border-success/50 text-success font-medium">
                  Pending
                </Badge>
              </div>
            </div>
          ))}
          {pendingReleases.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <DollarSign className="h-8 w-8" />
              </div>
              <p className="font-medium">No pending releases</p>
              <p className="text-sm">Your payments are up to date</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="shadow-card animate-slide-up">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{notification.message}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="bg-muted/30 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Mail className="h-8 w-8" />
              </div>
              <p className="font-medium">No notifications yet</p>
              <p className="text-sm">We'll notify you when something happens</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
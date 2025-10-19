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
  Settings,
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
    {
      label: "New Chats",
      value: unreadMessagesCount.toString(),
      icon: MessageCircle,
      color: "text-primary",
    },
    {
      label: "Active Jobs",
      value: milestones.length.toString(),
      icon: Briefcase,
      color: "text-primary",
    },
    {
      label: "Response Rate",
      value: "94%",
      icon: MessageCircle,
      color: "text-primary",
      progress: 94,
    },
    {
      label: "Quality Score",
      value: "96%",
      icon: CheckCircle,
      color: "text-primary",
      progress: 96,
    },
  ];

  // Project data for workroom (using real milestone data)
  const projects = thisWeekTasks.slice(0, 2).map((task, index) => ({
    id: task.id,
    name: task.title,
    status: task.status === "in-progress" ? "In Progress" : "Awaiting Review",
    progress: task.status === "in-progress" ? 65 : 90,
    dueDate: task.due,
    statusColor: task.status === "in-progress" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800",
  }));

  // Categories for browse section
  const categories = [
    {
      name: "Design",
      description: "Logos, branding, UI/UX",
      icon: Palette,
      color: "bg-gray-100",
    },
    {
      name: "Development",
      description: "Web, mobile, backend",
      icon: Code,
      color: "bg-gray-100",
    },
    {
      name: "Marketing",
      description: "Social, ads, growth",
      icon: Megaphone,
      color: "bg-gray-100",
    },
    {
      name: "Content",
      description: "Video, copy, socials",
      icon: Film,
      color: "bg-gray-100",
    },
  ];
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile-Optimized Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-bold text-foreground">Home</h1>
          <ProfileHeader />
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <div className="px-4 py-4 space-y-6">
        {/* Welcome Card - Mobile Optimized */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Hey {userProfile?.full_name?.split(" ")[0] || "there"}, ready to help build the next big thing?
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Find innovation projects that match your skills and interests.
                </p>
              </div>
              <Star className="h-5 w-5 text-primary flex-shrink-0 ml-2" fill="currentColor" />
            </div>

            <div className="space-y-2 mb-3">
              <Button
                className="w-full bg-foreground hover:bg-foreground/90 text-background shadow-sm"
                onClick={() => navigate("/creator/discover")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Browse Projects
              </Button>
              <Button
                variant="outline"
                className="w-full border-border/50"
                onClick={() => navigate("/creator/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Button>
            </div>

            <div className="pt-3 border-t border-border/20">
              <p className="text-xs text-muted-foreground">Trending: AI • Marketing • App Dev</p>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Overview - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className={`p-4 text-center shadow-card ${
                metric.label === "New Chats"
                  ? "hover:shadow-elegant transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  : ""
              }`}
              onClick={() => {
                if (metric.label === "New Chats") navigate("/creator/inbox");
              }}
            >
              <CardContent className="p-0">
                <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} strokeWidth={1.5} />
                <div className="text-xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="text-xs text-muted-foreground mb-2">{metric.label}</div>
                {metric.progress && (
                  <div className="w-full bg-muted/30 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${metric.progress}%`,
                      }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Earnings Overview - Mobile Optimized */}
        <Card
          className="bg-gradient-primary text-white shadow-card cursor-pointer"
          onClick={() => navigate("/creator/earnings")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-white/80 text-xs font-medium">Total Earnings</p>
                <p className="text-2xl font-bold tracking-tight">${totalEarnings.toLocaleString()}</p>
                <p className="text-white/70 text-xs">Released: ${releasedEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 p-2 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <p className="text-white/80 font-medium text-xs">Balance</p>
                <p className="font-semibold text-sm">${releasedEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <p className="text-white/80 font-medium text-xs">Next Payout</p>
                <p className="font-semibold text-sm">Oct 25</p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <p className="text-white/80 font-medium text-xs">Held</p>
                <p className="font-semibold text-sm">${heldEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <p className="text-white/80 font-medium text-xs">Pending</p>
                <p className="font-semibold text-sm">${pendingEarnings.toLocaleString()}</p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/creator/earnings");
              }}
            >
              View Full Details
              <DollarSign className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        {/* Friend Requests - Mobile Optimized */}
        {friendRequests.length > 0 && (
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="bg-accent/10 p-1.5 rounded-full">
                  <UserPlus className="h-4 w-4 text-accent" />
                </div>
                Friend Requests ({friendRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {friendRequests.map((request) => (
                <div key={request.id} className="p-3 rounded-lg bg-gradient-subtle border border-accent/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={request.avatar}
                      alt={request.name}
                      className="w-10 h-10 rounded-full border-2 border-accent/20 cursor-pointer"
                      onClick={() => navigate(`/creator/creators/${request.from_user_id}`)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/creator/creators/${request.from_user_id}`)}
                      >
                        {request.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">Wants to connect with you</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="shadow-sm h-8 w-8 p-0"
                        onClick={() => handleAcceptFriendRequest(request.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeclineFriendRequest(request.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Invitations - Mobile Optimized */}
        {activeInvitations.length > 0 && (
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                New Invitations ({activeInvitations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeInvitations.map((invitation) => (
                <div key={invitation.id} className="p-3 rounded-lg bg-gradient-subtle border border-primary/10">
                  <div className="flex items-start gap-3">
                    <img
                      src={invitation.avatar}
                      alt={invitation.from}
                      className="w-10 h-10 rounded-full border-2 border-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{invitation.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        From {invitation.from} •{" "}
                        <span className="font-semibold text-success">${invitation.budget}</span> • {invitation.timeline}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{invitation.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 shadow-sm text-xs h-8">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs h-8">
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

        {/* Workroom Section - Mobile Optimized */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Your Workroom</h2>
          <div className="space-y-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Card key={project.id} className="p-3 shadow-card">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm text-foreground">{project.name}</h3>
                      <Badge className={`text-xs px-2 py-0.5 ${project.statusColor}`}>{project.status}</Badge>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-1.5 mb-2">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${project.progress}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Due {project.dueDate}
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="bg-muted/30 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm text-muted-foreground">No active projects</p>
                  <p className="text-xs text-muted-foreground">Start exploring opportunities!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Browse by Category - Mobile Optimized */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="p-3 shadow-card hover:shadow-elegant transition-all duration-200 cursor-pointer active:scale-[0.98]"
                onClick={() => navigate("discover")}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-muted/30 rounded-full flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-xs mb-0.5">{category.name}</h3>
                      <p className="text-xs text-muted-foreground leading-tight">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;

import { IOSHeader } from "@/components/creator/ui/ios-header";
import { IOSCard, IOSCardContent, IOSCardDescription, IOSCardHeader, IOSCardTitle } from "@/components/creator/ui/ios-card";
import { IOSButton } from "@/components/creator/ui/ios-button";
import { IOSBadge } from "@/components/creator/ui/ios-badge";
import { Briefcase, Users, MessageCircle, TrendingUp, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Active Projects", value: "24", icon: Briefcase, color: "text-primary" },
    { label: "Connections", value: "156", icon: Users, color: "text-success" },
    { label: "Messages", value: "8", icon: MessageCircle, color: "text-info" },
  ];

  const recentActivity = [
    {
      id: 1,
      title: "New project opportunity",
      description: "Xenova Tech is looking for a frontend developer",
      time: "2 hours ago",
      badge: { label: "Featured", variant: "primary" as const },
    },
    {
      id: 2,
      title: "Network update",
      description: "Marcus Kim endorsed you for React Development",
      time: "5 hours ago",
      badge: { label: "Endorsement", variant: "success" as const },
    },
    {
      id: 3,
      title: "Collaboration invite",
      description: "Sarah Chen invited you to join EcoCart team",
      time: "1 day ago",
      badge: { label: "Invite", variant: "info" as const },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* iOS-Style Header */}
      <IOSHeader largeTitle="Home" />

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-6 space-y-6">
        {/* Welcome Card */}
        <IOSCard className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <IOSCardHeader>
            <div className="flex items-start justify-between">
              <div>
                <IOSCardTitle className="mb-2">Welcome back! 👋</IOSCardTitle>
                <IOSCardDescription>
                  You have 3 new opportunities waiting
                </IOSCardDescription>
              </div>
              <Star className="h-6 w-6 text-primary" fill="currentColor" />
            </div>
          </IOSCardHeader>
          <IOSCardContent>
            <IOSButton
              fullWidth
              onClick={() => navigate("/discover")}
              className="shadow-sm"
            >
              Explore Opportunities
            </IOSButton>
          </IOSCardContent>
        </IOSCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <IOSCard 
              key={index} 
              className="p-4 text-center hover:scale-105 transition-transform duration-220 cursor-pointer active:scale-95"
              onClick={() => {
                if (stat.label === "Messages") navigate("/inbox");
                if (stat.label === "Connections") navigate("/network");
                if (stat.label === "Active Projects") navigate("/discover");
              }}
            >
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} strokeWidth={2} />
              <div className="text-title-2 font-bold text-foreground mb-0.5">
                {stat.value}
              </div>
              <div className="text-caption-1 text-muted-foreground truncate">
                {stat.label}
              </div>
            </IOSCard>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-title-2 font-semibold">Recent Activity</h2>
            <button className="text-subhead text-primary font-medium active:opacity-60 transition-opacity duration-120">
              See All
            </button>
          </div>

          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <IOSCard
                key={activity.id}
                className="p-4 hover:shadow-lg transition-shadow duration-220 active:scale-[0.99] cursor-pointer"
                onClick={() => {
                  // Handle navigation based on activity type
                  if (activity.badge.label === "Featured") navigate("/discover");
                  if (activity.badge.label === "Endorsement") navigate("/network");
                  if (activity.badge.label === "Invite") navigate("/inbox");
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body font-semibold text-foreground truncate">
                        {activity.title}
                      </h3>
                      <IOSBadge variant={activity.badge.variant} size="sm">
                        {activity.badge.label}
                      </IOSBadge>
                    </div>
                    <p className="text-subhead text-muted-foreground line-clamp-2 mb-1">
                      {activity.description}
                    </p>
                    <span className="text-caption-1 text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </IOSCard>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <IOSCard className="p-4">
          <h3 className="text-title-3 font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <IOSButton
              variant="secondary"
              fullWidth
              onClick={() => navigate("/discover")}
              className="justify-start"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Browse Projects</span>
            </IOSButton>
            <IOSButton
              variant="secondary"
              fullWidth
              onClick={() => navigate("/network")}
              className="justify-start"
            >
              <Users className="h-5 w-5" />
              <span>Grow Network</span>
            </IOSButton>
            <IOSButton
              variant="secondary"
              fullWidth
              onClick={() => navigate("/inbox")}
              className="justify-start"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Check Messages</span>
            </IOSButton>
          </div>
        </IOSCard>
      </div>
    </div>
  );
};

export default Index;
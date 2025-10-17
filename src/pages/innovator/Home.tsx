import { useNavigate } from "react-router-dom";
import { Button } from "@/components/innovator/ui/button";
import { Card } from "@/components/innovator/ui/card";
import { Badge } from "@/components/innovator/ui/badge";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { Rocket, TrendingUp, Zap, Users, Lightbulb, Play, ArrowRight, Sparkles, Target, Award, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
export default function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    pitches: 0,
    views: 0,
    connections: 0
  });
  useEffect(() => {
    loadUserData();
  }, []);
  const loadUserData = async () => {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (user) {
      setUserName(user.email?.split('@')[0] || "Innovator");

      // Load user stats
      const {
        data: innovations
      } = await supabase.from('innovations').select('id').eq('user_id', user.id);
      const {
        data: pitches
      } = await supabase.from('pitches').select('id').eq('user_id', user.id);
      setStats({
        pitches: pitches?.length || 0,
        views: 0,
        // To be implemented with analytics
        connections: 0 // To be implemented
      });
    }
  };
  const quickActions = [{
    icon: Rocket,
    title: "Create Pitch",
    description: "Share your innovation",
    color: "bg-gradient-primary",
    action: () => navigate('/innovator/tank/pitch/new')
  }, {
    icon: Users,
    title: "Explore Network",
    description: "Find collaborators",
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    action: () => navigate('/innovator/network')
  }, {
    icon: Target,
    title: "Find Opportunities",
    description: "Discover projects",
    color: "bg-gradient-to-br from-orange-500 to-red-500",
    action: () => navigate('/innovator/collaborate')
  }];
  const recentActivity = [{
    icon: Play,
    text: "Your pitch gained 12 new views",
    time: "2h ago",
    color: "text-primary"
  }, {
    icon: Users,
    text: "3 new connection requests",
    time: "5h ago",
    color: "text-purple-500"
  }, {
    icon: Sparkles,
    text: "Featured in Innovation Feed",
    time: "1d ago",
    color: "text-accent"
  }];
  return <div className="min-h-screen bg-background pb-20">
      <FishtankHeader showLogo={true} showProfile={true} />
      
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="relative section-padding pt-8 mx-0 py-[25px]">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome back, <span className="gradient-text">{userName}</span>
            </h1>
            <p className="text-muted-foreground">Let's build something amazing today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Card className="ios-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stats.pitches}</div>
              <div className="text-xs text-muted-foreground mt-1">Pitches</div>
            </Card>
            <Card className="ios-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stats.views}</div>
              <div className="text-xs text-muted-foreground mt-1">Views</div>
            </Card>
            <Card className="ios-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stats.connections}</div>
              <div className="text-xs text-muted-foreground mt-1">Network</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-padding">
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, idx) => <Card key={idx} className="ios-card p-4 cursor-pointer hover-lift active:scale-95 transition-smooth" onClick={action.action}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>)}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section-padding">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Recent Activity</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/analytics')}>
            View All
          </Button>
        </div>
        <Card className="ios-card p-4">
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => <div key={idx} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              </div>)}
          </div>
        </Card>
      </div>

      {/* Trending Section */}
      <div className="section-padding">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trending Now
          </h2>
        </div>
        <div className="swipe-container gap-3 -mx-4 px-4">
          {[{
          title: "AI Innovation",
          tag: "Hot",
          color: "bg-red-500"
        }, {
          title: "Green Tech",
          tag: "New",
          color: "bg-green-500"
        }, {
          title: "FinTech",
          tag: "Rising",
          color: "bg-blue-500"
        }].map((trend, idx) => <Card key={idx} className="swipe-item ios-card p-4 w-40 cursor-pointer hover-lift" onClick={() => navigate('/network')}>
              <Badge className={`${trend.color} text-white border-0 mb-2`}>
                {trend.tag}
              </Badge>
              <h3 className="font-semibold text-sm">{trend.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.floor(Math.random() * 50) + 10} projects
              </p>
            </Card>)}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="section-padding">
        <h2 className="section-title">Explore</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="ios-card p-6 cursor-pointer hover-lift text-center" onClick={() => navigate('/innovator/tank')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-3">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-sm">My Tank</h3>
          </Card>
          <Card className="ios-card p-6 cursor-pointer hover-lift text-center" onClick={() => navigate('/innovator/collaborate')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-sm">Collaborate</h3>
          </Card>
        </div>
      </div>
    </div>;
}
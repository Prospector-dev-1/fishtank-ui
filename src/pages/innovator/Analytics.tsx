import { useState } from "react";
import { ChevronLeft, Eye, Users, MessageCircle, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/innovator/ui/button";
import { Card } from "@/components/innovator/ui/card";
import { useNavigate } from "react-router-dom";
export default function Analytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("30d");
  const stats = {
    totalViews: 1247,
    uniqueViewers: 89,
    investorInterest: 15,
    messagesSent: 24,
    ndaRequests: 8
  };
  const viewsData = [{
    date: "Mar 1",
    views: 45
  }, {
    date: "Mar 5",
    views: 67
  }, {
    date: "Mar 10",
    views: 89
  }, {
    date: "Mar 15",
    views: 123
  }, {
    date: "Mar 20",
    views: 98
  }, {
    date: "Mar 25",
    views: 156
  }, {
    date: "Mar 30",
    views: 134
  }];
  const topReferrers = [{
    source: "Direct",
    visits: 456,
    percentage: 36
  }, {
    source: "LinkedIn",
    visits: 234,
    percentage: 19
  }, {
    source: "Angel List",
    visits: 187,
    percentage: 15
  }, {
    source: "Search",
    visits: 156,
    percentage: 12
  }, {
    source: "Other",
    visits: 214,
    percentage: 18
  }];
  return <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container-mobile px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate("/innovator")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold">Analytics</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="container-mobile px-4 py-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {[{
          key: "7d",
          label: "7 Days"
        }, {
          key: "30d",
          label: "30 Days"
        }, {
          key: "90d",
          label: "90 Days"
        }].map(({
          key,
          label
        }) => <Button key={key} variant={timeRange === key ? "default" : "outline"} size="sm" onClick={() => setTimeRange(key)} className="whitespace-nowrap">
              {label}
            </Button>)}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Views</div>
              </div>
            </div>
          </Card>
          
          <Card className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.uniqueViewers}</div>
                <div className="text-xs text-muted-foreground">Unique Viewers</div>
              </div>
            </div>
          </Card>
          
          <Card className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.investorInterest}</div>
                <div className="text-xs text-muted-foreground">Interested</div>
              </div>
            </div>
          </Card>
          
          <Card className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.messagesSent}</div>
                <div className="text-xs text-muted-foreground">Messages</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Views Chart */}
        <Card className="card-elevated p-6">
          <h3 className="font-semibold text-lg mb-4">Views Over Time</h3>
          <div className="space-y-3">
            {viewsData.map((data, index) => <div key={data.date} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{data.date}</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="h-2 bg-primary rounded-full transition-all duration-300" style={{
                  width: `${data.views / 200 * 100}%`
                }} />
                  </div>
                  <span className="text-sm font-medium w-8">{data.views}</span>
                </div>
              </div>)}
          </div>
        </Card>

        {/* Top Referrers */}
        

        {/* Recent Activity */}
        <Card className="card-elevated p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm">Sarah Chen viewed your project</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm">New investor match found</div>
                <div className="text-xs text-muted-foreground">5 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm">NDA request from Innovation Ventures</div>
                <div className="text-xs text-muted-foreground">1 day ago</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}
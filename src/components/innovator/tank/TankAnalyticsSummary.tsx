import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Eye, Clock, Users, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/innovator/ui/progress";
import { format } from "date-fns";
import type { Pitch } from "@/types";

interface TankAnalyticsSummaryProps {
  pitches: Pitch[];
}

interface AnalyticsMetrics {
  totalViews: number;
  avgEngagement: number;
  avgWatchTime: number;
  investorInterest: number;
  weeklyTrend: number;
}

interface ViewData {
  date: string;
  views: number;
}

export const TankAnalyticsSummary = ({ pitches }: TankAnalyticsSummaryProps) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [viewsOverTime, setViewsOverTime] = useState<ViewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pitches.length === 0) {
      setIsLoading(false);
      return;
    }
    calculateMetrics();
  }, [pitches]);

  const calculateMetrics = async () => {
    try {
      const pitchIds = pitches.map(p => p.id);
      
      // Check if any pitch belongs to a mock innovation
      const hasMockPitches = pitches.some(p => p.innovation_id.startsWith('innovation_'));
      
      if (hasMockPitches) {
        // Generate mock analytics data for demo
        const totalViews = Math.floor(Math.random() * 300) + 150;
        const avgEngagement = Math.floor(Math.random() * 40) + 35; // 35-75%
        const avgWatchTime = Math.floor(Math.random() * 30) + 45; // 45-75 seconds
        const investorInterest = Math.floor(Math.random() * 20) + 15; // 15-35 unique viewers
        const weeklyTrend = Math.floor(Math.random() * 60) - 10; // -10% to +50%
        
        setMetrics({
          totalViews,
          avgEngagement,
          avgWatchTime,
          investorInterest,
          weeklyTrend
        });
        
        // Generate mock views over time (last 7 days)
        const mockViewsOverTime: ViewData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          mockViewsOverTime.push({
            date: date.toISOString().split('T')[0],
            views: Math.floor(Math.random() * 50) + 10
          });
        }
        setViewsOverTime(mockViewsOverTime);
        setIsLoading(false);
        return;
      }
      
      const { data: analyticsData, error } = await supabase
        .from('pitch_analytics')
        .select('*')
        .in('pitch_id', pitchIds);

      if (error) throw error;

      if (!analyticsData || analyticsData.length === 0) {
        setMetrics({
          totalViews: 0,
          avgEngagement: 0,
          avgWatchTime: 0,
          investorInterest: 0,
          weeklyTrend: 0
        });
        setIsLoading(false);
        return;
      }

      // Calculate total views
      const totalViews = analyticsData.reduce((sum: number, record: any) => sum + (record.views || 0), 0);

      // Calculate average engagement rate
      const avgEngagement = analyticsData.length > 0
        ? analyticsData.reduce((sum: number, record: any) => sum + (Number(record.engagement_rate) || 0), 0) / analyticsData.length
        : 0;

      // Calculate average watch time
      const avgWatchTime = analyticsData.length > 0
        ? analyticsData.reduce((sum: number, record: any) => sum + (record.avg_watch_time || 0), 0) / analyticsData.length
        : 0;

      // Calculate investor interest (unique viewers)
      const investorInterest = analyticsData.reduce((sum: number, record: any) => sum + (record.unique_viewers || 0), 0);

      // Calculate 7-day trend
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const recentViews = analyticsData
        .filter((record: any) => new Date(record.date) >= sevenDaysAgo)
        .reduce((sum: number, record: any) => sum + (record.views || 0), 0);

      const previousViews = analyticsData
        .filter((record: any) => {
          const date = new Date(record.date);
          return date >= fourteenDaysAgo && date < sevenDaysAgo;
        })
        .reduce((sum: number, record: any) => sum + (record.views || 0), 0);

      const weeklyTrend = previousViews > 0 
        ? ((recentViews - previousViews) / previousViews) * 100 
        : recentViews > 0 ? 100 : 0;

      setMetrics({
        totalViews,
        avgEngagement: Math.round(avgEngagement * 100) / 100,
        avgWatchTime: Math.round(avgWatchTime),
        investorInterest,
        weeklyTrend: Math.round(weeklyTrend)
      });

      // Prepare views over time data (last 7 days)
      const viewsByDate = analyticsData.reduce((acc: Record<string, number>, record: any) => {
        const dateKey = record.date;
        acc[dateKey] = (acc[dateKey] || 0) + (record.views || 0);
        return acc;
      }, {} as Record<string, number>);

      const sortedViews = Object.entries(viewsByDate)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .slice(-7)
        .map(([date, views]) => ({ date, views: views as number }));

      setViewsOverTime(sortedViews);
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setMetrics({
        totalViews: 0,
        avgEngagement: 0,
        avgWatchTime: 0,
        investorInterest: 0,
        weeklyTrend: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ios-card p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-muted/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics || pitches.length === 0) {
    return (
      <div className="ios-card p-4 mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Analytics Overview</h3>
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">No analytics data yet. Create and publish pitches to see insights.</p>
        </div>
      </div>
    );
  }

  const formatWatchTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  };

  const metricCards = [
    {
      label: "Total Views",
      value: metrics.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-500"
    },
    {
      label: "Avg Engagement",
      value: `${metrics.avgEngagement}%`,
      icon: Target,
      color: "text-green-500"
    },
    {
      label: "Avg Watch Time",
      value: formatWatchTime(metrics.avgWatchTime),
      icon: Clock,
      color: "text-orange-500"
    },
    {
      label: "Investor Interest",
      value: metrics.investorInterest.toLocaleString(),
      icon: Users,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="ios-card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Analytics Overview</h3>
        {metrics.weeklyTrend !== 0 && (
          <div className={`flex items-center gap-1 text-xs ${metrics.weeklyTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {metrics.weeklyTrend > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(metrics.weeklyTrend)}% 7d</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-muted/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <div className="text-xl font-semibold">{metric.value}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
        {viewsOverTime.length > 0 ? (
          <div className="space-y-3">
            {viewsOverTime.map((data) => {
              const maxViews = Math.max(...viewsOverTime.map(v => v.views));
              const percentage = (data.views / maxViews) * 100;
              
              return (
                <div key={data.date} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-16 flex-shrink-0">
                    {format(new Date(data.date), 'MMM d')}
                  </span>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm font-semibold w-12 text-right">
                    {data.views}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No view data yet. Views will appear here once your pitches get traction.
          </div>
        )}
      </div>
    </div>
  );
};

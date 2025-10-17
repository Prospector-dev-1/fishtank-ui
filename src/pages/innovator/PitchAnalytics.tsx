import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Eye, Users, Clock, Activity, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/innovator/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/innovator/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTeamPermissions } from "@/hooks/innovator/useTeamPermissions";
import type { Pitch } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/innovator/ui/chart";

interface AnalyticsData {
  date: string;
  views: number;
  unique_viewers: number;
  avg_watch_time: number;
  engagement_rate: number;
}

export default function PitchAnalytics() {
  const { pitchId } = useParams();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { canViewAnalytics, isLoading: permissionsLoading } = useTeamPermissions(pitch?.innovation_id);

  useEffect(() => {
    if (pitchId) {
      loadPitchAndAnalytics();
    }
  }, [pitchId]);

  useEffect(() => {
    if (!permissionsLoading && pitch && !canViewAnalytics) {
      toast.error('You do not have permission to view analytics');
      navigate('/innovator/tank');
    }
  }, [canViewAnalytics, permissionsLoading, pitch, navigate]);

  const loadPitchAndAnalytics = async () => {
    try {
      // Load pitch data
      const { data: pitchData, error: pitchError } = await supabase
        .from('pitches')
        .select('*')
        .eq('id', pitchId)
        .single();

      if (pitchError) throw pitchError;
      setPitch(pitchData as unknown as Pitch);

      // Load analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('pitch_analytics')
        .select('*')
        .eq('pitch_id', pitchId)
        .order('date', { ascending: true });

      if (analyticsError) throw analyticsError;
      setAnalytics((analyticsData || []) as AnalyticsData[]);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/innovator/tank')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tank
            </Button>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold mb-2">Pitch Not Found</h1>
              <p className="text-muted-foreground">The requested pitch could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate total metrics
  const totalViews = analytics.reduce((sum, day) => sum + (day.views || 0), 0);
  const totalUniqueViewers = analytics.reduce((sum, day) => sum + (day.unique_viewers || 0), 0);
  const avgWatchTime = analytics.length > 0
    ? Math.round(analytics.reduce((sum, day) => sum + (day.avg_watch_time || 0), 0) / analytics.length)
    : 0;
  const avgEngagementRate = analytics.length > 0
    ? (analytics.reduce((sum, day) => sum + (day.engagement_rate || 0), 0) / analytics.length).toFixed(1)
    : '0.0';

  // Format data for chart
  const chartData = analytics.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: item.views || 0,
    uniqueViewers: item.unique_viewers || 0,
  }));

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--primary))",
    },
    uniqueViewers: {
      label: "Unique Viewers",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b">
        <div className="p-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/innovator/tank')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tank
            </Button>
          </div>
          
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{pitch.title || 'Pitch Analytics'}</h1>
              <p className="text-muted-foreground">{pitch.caption || 'Track your pitch performance and engagement'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Total Views</span>
              </div>
              <div className="text-3xl font-bold">{totalViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">Unique Viewers</span>
              </div>
              <div className="text-3xl font-bold">{totalUniqueViewers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Avg Watch Time</span>
              </div>
              <div className="text-3xl font-bold">{avgWatchTime}s</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Engagement Rate</span>
              </div>
              <div className="text-3xl font-bold">{avgEngagementRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Views Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Views Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="var(--color-views)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-views)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="uniqueViewers" 
                      stroke="var(--color-uniqueViewers)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-uniqueViewers)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No analytics data available yet</p>
                <p className="text-sm mt-2">Data will appear once your pitch starts getting views</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Engagement Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Engagement Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">{pitch.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Visibility</p>
                  <p className="text-sm text-muted-foreground capitalize">{pitch.visibility}</p>
                </div>
              </div>

              {pitch.hashtags && pitch.hashtags.length > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-2">Hashtags</p>
                  <div className="flex flex-wrap gap-2">
                    {pitch.hashtags.map((tag, i) => (
                      <span key={i} className="text-sm px-2 py-1 bg-background rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(pitch.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

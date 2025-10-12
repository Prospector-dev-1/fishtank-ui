import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MetricDisplay } from '@/components/MetricDisplay';
import { EnhancedCard } from '@/components/EnhancedCard';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { mockStartups } from '@/data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Brain, 
  Zap,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Calendar,
  Star,
  Filter,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  muted: 'hsl(var(--muted-foreground))'
};

const userProfile = {
  sectors: ['Fintech', 'HealthTech', 'AI'],
  stages: ['Pre-Seed', 'Seed', 'Series A'],
  investmentRange: [50000, 500000] as [number, number],
  riskTolerance: 'moderate' as const,
  previousInvestments: ['s_001', 's_002'],
  preferences: {
    teamSize: 3,
    geographicFocus: ['North America', 'Europe'],
    businessModel: ['SaaS', 'Marketplace']
  }
};

export function InvestmentDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeMetric, setActiveMetric] = useState<'value' | 'growth' | 'risk'>('value');
  
  const { 
    recommendations, 
    insights, 
    isAnalyzing, 
    lastAnalysis,
    getTopRecommendations,
    refreshAnalysis 
  } = useAIRecommendations(userProfile, mockStartups);

  // Generate mock time series data
  const generateTimeSeriesData = () => {
    const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : selectedTimeframe === '90d' ? 90 : 365;
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      portfolioValue: 1000000 + Math.random() * 200000 - 100000,
      dealFlow: Math.floor(Math.random() * 10) + 5,
      engagement: Math.random() * 100
    }));
  };

  const timeSeriesData = useMemo(generateTimeSeriesData, [selectedTimeframe]);

  // Portfolio analytics
  const portfolioAnalytics = useMemo(() => {
    const totalInvested = 1250000;
    const currentValue = 1580000;
    const totalReturn = ((currentValue - totalInvested) / totalInvested) * 100;
    
    const sectorDistribution = mockStartups.reduce((acc, startup) => {
      acc[startup.sector] = (acc[startup.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const stageDistribution = mockStartups.reduce((acc, startup) => {
      acc[startup.stage] = (acc[startup.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInvested,
      currentValue,
      totalReturn,
      sectorDistribution: Object.entries(sectorDistribution).map(([sector, count]) => ({
        name: sector,
        value: count,
        color: COLORS.primary
      })),
      stageDistribution: Object.entries(stageDistribution).map(([stage, count]) => ({
        name: stage,
        value: count
      }))
    };
  }, []);

  const topRecommendations = getTopRecommendations(5);

  const marketMetrics = {
    dealFlow: 47,
    avgValuation: '12.5M',
    hotSectors: ['AI/ML', 'CleanTech', 'HealthTech'],
    riskIndex: 6.2
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-display">Investment Intelligence</h1>
          <p className="text-body text-muted-foreground">
            AI-powered insights and portfolio analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAnalysis}
            disabled={isAnalyzing}
            className="min-h-[44px]"
          >
            <RefreshCw size={16} className={cn('mr-2', isAnalyzing && 'animate-spin')} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
          
          <Button variant="outline" size="sm" className="min-h-[44px]">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" className="min-h-[44px]">
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnhancedCard variant="elevated" className="p-6">
          <MetricDisplay
            value={`$${(portfolioAnalytics.currentValue / 1000000).toFixed(1)}M`}
            label="Portfolio Value"
            trend="up"
            trendValue="+12.3%"
            icon={<DollarSign size={24} />}
            variant="primary"
          />
        </EnhancedCard>
        
        <EnhancedCard variant="elevated" className="p-6">
          <MetricDisplay
            value={marketMetrics.dealFlow}
            label="Deal Flow (30d)"
            trend="up"
            trendValue="+8.2%"
            icon={<Activity size={24} />}
            variant="success"
          />
        </EnhancedCard>
        
        <EnhancedCard variant="elevated" className="p-6">
          <MetricDisplay
            value={topRecommendations.length}
            label="AI Recommendations"
            icon={<Brain size={24} />}
            variant="warning"
          />
        </EnhancedCard>
        
        <EnhancedCard variant="elevated" className="p-6">
          <MetricDisplay
            value={marketMetrics.riskIndex}
            label="Risk Index"
            trend={marketMetrics.riskIndex > 7 ? 'up' : 'down'}
            trendValue={marketMetrics.riskIndex > 7 ? 'High' : 'Moderate'}
            icon={<AlertTriangle size={24} />}
            variant={marketMetrics.riskIndex > 7 ? 'warning' : 'default'}
          />
        </EnhancedCard>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="min-h-[44px]">Overview</TabsTrigger>
          <TabsTrigger value="recommendations" className="min-h-[44px]">AI Insights</TabsTrigger>
          <TabsTrigger value="portfolio" className="min-h-[44px]">Portfolio</TabsTrigger>
          <TabsTrigger value="market" className="min-h-[44px]">Market Intel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Portfolio Performance Chart */}
          <EnhancedCard variant="glass" className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 size={20} />
                    <span>Portfolio Performance</span>
                  </CardTitle>
                  <CardDescription>
                    Track your investment performance over time
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-2">
                  {(['7d', '30d', '90d', '1y'] as const).map(period => (
                    <Button
                      key={period}
                      variant={selectedTimeframe === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe(period)}
                      className="min-h-[32px]"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                    <XAxis dataKey="date" stroke={COLORS.muted} />
                    <YAxis stroke={COLORS.muted} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="portfolioValue"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#portfolioGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </EnhancedCard>

          {/* Deal Flow & Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedCard variant="glass" className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity size={20} />
                  <span>Deal Flow Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                      <XAxis dataKey="date" stroke={COLORS.muted} />
                      <YAxis stroke={COLORS.muted} />
                      <Tooltip />
                      <Bar dataKey="dealFlow" fill={COLORS.secondary} radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target size={20} />
                  <span>Engagement Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                      <XAxis dataKey="date" stroke={COLORS.muted} />
                      <YAxis stroke={COLORS.muted} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke={COLORS.success} 
                        strokeWidth={3}
                        dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </EnhancedCard>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* AI Insights Header */}
          <EnhancedCard variant="elevated" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Brain size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Investment Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  {lastAnalysis ? `Last updated: ${lastAnalysis.toLocaleTimeString()}` : 'Analyzing...'}
                </p>
              </div>
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Zap size={16} className="animate-pulse" />
                  <span>AI analyzing market data...</span>
                </div>
              )}
            </div>
          </EnhancedCard>

          {/* Market Insights */}
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <EnhancedCard key={index} variant="glass" className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={cn(
                    'p-2 rounded-lg',
                    insight.impact === 'positive' && 'bg-success/10 text-success',
                    insight.impact === 'negative' && 'bg-destructive/10 text-destructive',
                    insight.impact === 'neutral' && 'bg-muted/10 text-muted-foreground'
                  )}>
                    {insight.type === 'market_trend' && <TrendingUp size={20} />}
                    {insight.type === 'sector_analysis' && <PieChart size={20} />}
                    {insight.type === 'risk_assessment' && <AlertTriangle size={20} />}
                    {insight.type === 'opportunity' && <Target size={20} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {insight.dataPoints.map((point, pointIndex) => (
                        <Badge key={pointIndex} variant="secondary" className="text-xs">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </EnhancedCard>
            ))}
          </div>

          {/* Top Recommendations */}
          <EnhancedCard variant="glass" className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star size={20} />
                <span>Top AI Recommendations</span>
              </CardTitle>
              <CardDescription>
                Startups ranked by our AI algorithm based on your preferences
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {topRecommendations.map((rec, index) => {
                  const startup = mockStartups.find(s => s.id === rec.startupId);
                  if (!startup) return null;
                  
                  return (
                    <div key={rec.startupId} className="flex items-center space-x-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="text-lg font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold">{startup.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {startup.stage}
                          </Badge>
                          <Badge 
                            variant={rec.riskLevel === 'low' ? 'default' : rec.riskLevel === 'medium' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {rec.riskLevel} risk
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {startup.tagline}
                        </p>
                        
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground">Score:</span>
                            <Progress value={rec.score * 100} className="w-20 h-2" />
                            <span className="text-xs font-medium">{Math.round(rec.score * 100)}%</span>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            {Math.round(rec.confidence * 100)}% confidence
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {rec.reasoning.slice(0, 2).map((reason, reasonIndex) => (
                            <Badge key={reasonIndex} variant="outline" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline" className="min-h-[36px]">
                        View Details
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Portfolio Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedCard variant="glass" className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart size={20} />
                  <span>Sector Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={portfolioAnalytics.sectorDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        stroke="none"
                      >
                        {portfolioAnalytics.sectorDistribution.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={Object.values(COLORS)[index % Object.values(COLORS).length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 size={20} />
                  <span>Investment Stage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioAnalytics.stageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.muted} />
                      <XAxis dataKey="name" stroke={COLORS.muted} />
                      <YAxis stroke={COLORS.muted} />
                      <Tooltip />
                      <Bar dataKey="value" fill={COLORS.primary} radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </EnhancedCard>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          {/* Market Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketMetrics.hotSectors.map((sector, index) => (
              <EnhancedCard key={sector} variant="elevated" className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                  <div className="text-lg font-semibold">{sector}</div>
                  <div className="text-sm text-muted-foreground">Hot Sector</div>
                </div>
              </EnhancedCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
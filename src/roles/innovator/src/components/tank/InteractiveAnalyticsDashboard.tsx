import { useState } from 'react';
import { 
  Eye, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart as RechartsPieChart, 
  Cell, 
  LineChart, 
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
  Pie
} from 'recharts';

interface InteractiveAnalyticsDashboardProps {
  profileViews: number;
  ndaSignatures: number;
  meetingsScheduled: number;
  fundingCommitted: number;
}

export function InteractiveAnalyticsDashboard({ 
  profileViews, 
  ndaSignatures, 
  meetingsScheduled, 
  fundingCommitted 
}: InteractiveAnalyticsDashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'funnel' | 'trends'>('overview');

  const conversionData = [
    { name: 'Profile Views', value: profileViews, color: 'hsl(var(--primary))' },
    { name: 'NDA Signatures', value: ndaSignatures, color: 'hsl(var(--warning))' },
    { name: 'Meetings', value: meetingsScheduled, color: 'hsl(var(--accent))' },
    { name: 'Funding', value: fundingCommitted / 100, color: 'hsl(var(--success))' }
  ];

  const trendData = [
    { week: 'Week 1', views: 15, ndas: 3, meetings: 1, funding: 0 },
    { week: 'Week 2', views: 28, ndas: 8, meetings: 3, funding: 0 },
    { week: 'Week 3', views: profileViews - 43, ndas: ndaSignatures - 11, meetings: meetingsScheduled - 4, funding: 1 },
    { week: 'Week 4', views: profileViews, ndas: ndaSignatures, meetings: meetingsScheduled, funding: fundingCommitted / 100 }
  ];

  const metrics = [
    {
      title: 'Profile Views',
      value: profileViews.toString(),
      icon: Eye,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+23%',
      trendUp: true
    },
    {
      title: 'NDA Signatures',
      value: ndaSignatures.toString(),
      icon: FileText,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: '+45%',
      trendUp: true
    },
    {
      title: 'Meetings Scheduled',
      value: meetingsScheduled.toString(),
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Funding Committed',
      value: `$${fundingCommitted}K`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+100%',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, index) => (
          <Card 
            key={metric.title} 
            className="card-interactive hover:scale-105 transition-smooth cursor-pointer group"
            onClick={() => console.log(`Clicked on ${metric.title}`)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`p-1.5 sm:p-2 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-smooth`}>
                  <metric.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${metric.color}`} />
                </div>
                <div className={`text-xs sm:text-sm font-medium ${metric.trendUp ? 'text-success' : 'text-destructive'}`}>
                  {metric.trend}
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{metric.title}</p>
                <p className="text-lg sm:text-2xl font-bold group-hover:text-primary transition-smooth">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Analytics Tabs */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analytics Dashboard
            </CardTitle>
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3">Overview</TabsTrigger>
                <TabsTrigger value="funnel" className="text-xs sm:text-sm px-2 sm:px-3">Funnel</TabsTrigger>
                <TabsTrigger value="trends" className="text-xs sm:text-sm px-2 sm:px-3">Trends</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversion Funnel Chart */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Conversion Funnel
                  </h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Pipeline Distribution */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Pipeline Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <RechartsPieChart>
                      <Pie
                        data={conversionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {conversionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            {/* Funnel Tab */}
            <TabsContent value="funnel">
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {conversionData.map((stage, index) => (
                    <div key={stage.name} className="text-center group">
                      <div className="relative mb-3 sm:mb-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-smooth">
                          <div 
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: stage.color }}
                          >
                            {index === 0 && <Eye className="w-5 h-5 sm:w-8 sm:h-8" />}
                            {index === 1 && <FileText className="w-5 h-5 sm:w-8 sm:h-8" />}
                            {index === 2 && <Calendar className="w-5 h-5 sm:w-8 sm:h-8" />}
                            {index === 3 && <DollarSign className="w-5 h-5 sm:w-8 sm:h-8" />}
                          </div>
                        </div>
                        {index < conversionData.length - 1 && (
                          <div className="hidden lg:block absolute top-8 sm:top-10 left-full w-8 h-0.5 bg-border transform -translate-y-0.5" />
                        )}
                      </div>
                      <h3 className="font-medium text-xs sm:text-sm mb-2 px-1">{stage.name}</h3>
                      <p className="text-xl sm:text-3xl font-bold mb-1">{stage.value}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {profileViews > 0 ? ((stage.value / profileViews) * 100).toFixed(1) : '0'}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends">
                <Card className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                    Performance Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="views" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="ndas" stackId="1" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="meetings" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="funding" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
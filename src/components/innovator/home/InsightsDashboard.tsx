import { Card } from "@/components/innovator/ui/card";
import { Badge } from "@/components/innovator/ui/badge";
import { Button } from "@/components/innovator/ui/button";
import { Progress } from "@/components/innovator/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  ArrowUpRight,
  Zap,
  ChevronRight
} from "lucide-react";

interface Insight {
  id: string;
  type: 'performance' | 'recommendation' | 'goal';
  title: string;
  description: string;
  value?: string;
  progress?: number;
  trend?: 'up' | 'down' | 'stable';
  actionLabel?: string;
  priority: 'high' | 'medium' | 'low';
}

export const InsightsDashboard = () => {
  const insights: Insight[] = [
    {
      id: '1',
      type: 'performance',
      title: 'Profile Views Trending Up',
      description: '127% increase in profile views this week',
      value: '+127%',
      trend: 'up',
      priority: 'high'
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Optimize Pitch Timing',
      description: 'Schedule pitches between 2-4 PM for 40% better engagement',
      actionLabel: 'Schedule Now',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'goal',
      title: 'Funding Goal Progress',
      description: 'You\'re 65% towards your $750K funding target',
      progress: 65,
      priority: 'high'
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Network Expansion',
      description: 'Connect with 3 more fintech investors to boost visibility',
      actionLabel: 'Browse Investors',
      priority: 'medium'
    }
  ];

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="w-4 h-4" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4" />;
      case 'goal':
        return <Target className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'medium':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'low':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Insights & Recommendations</h2>
        <Button variant="ghost" size="sm">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-smooth"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getPriorityColor(insight.priority)}`}>
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm leading-tight">
                    {insight.title}
                  </h3>
                  {insight.value && (
                    <Badge variant="secondary" className="text-xs">
                      {insight.value}
                      {insight.trend === 'up' && (
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                  {insight.description}
                </p>
                
                {insight.progress !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{insight.progress}%</span>
                    </div>
                    <Progress value={insight.progress} className="h-1.5" />
                  </div>
                )}
                
                {insight.actionLabel && (
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    {insight.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
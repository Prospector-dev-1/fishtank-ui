import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  FileSignature, 
  Calendar, 
  DollarSign,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface PipelineStage {
  stage: 'view' | 'nda' | 'meeting' | 'funding';
  label: string;
  count: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

interface ProgressPipelineProps {
  totalViews: number;
  ndaSignatures: number; 
  meetingsScheduled: number;
  fundingCommitments: number;
  className?: string;
}

export function ProgressPipeline({ 
  totalViews, 
  ndaSignatures, 
  meetingsScheduled, 
  fundingCommitments,
  className 
}: ProgressPipelineProps) {
  const stages: PipelineStage[] = [
    {
      stage: 'view',
      label: 'Profile Views',
      count: totalViews,
      percentage: 100,
      icon: <Eye className="w-4 h-4" />,
      color: 'bg-blue-500'
    },
    {
      stage: 'nda',
      label: 'NDA Signatures',
      count: ndaSignatures,
      percentage: totalViews > 0 ? (ndaSignatures / totalViews) * 100 : 0,
      icon: <FileSignature className="w-4 h-4" />,
      color: 'bg-yellow-500'
    },
    {
      stage: 'meeting',
      label: 'Meetings Scheduled',
      count: meetingsScheduled,
      percentage: totalViews > 0 ? (meetingsScheduled / totalViews) * 100 : 0,
      icon: <Calendar className="w-4 h-4" />,
      color: 'bg-purple-500'
    },
    {
      stage: 'funding',
      label: 'Funding Commitments',
      count: fundingCommitments,
      percentage: totalViews > 0 ? (fundingCommitments / totalViews) * 100 : 0,
      icon: <DollarSign className="w-4 h-4" />,
      color: 'bg-green-500'
    }
  ];

  const conversionRate = totalViews > 0 ? ((fundingCommitments / totalViews) * 100).toFixed(1) : '0';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Investor Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Pipeline Flow */}
        <div className="flex items-center justify-between mb-6">
          {stages.map((stage, index) => (
            <div key={stage.stage} className="flex items-center">
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center text-white mb-2`}>
                  {stage.icon}
                </div>
                <p className="text-xs font-medium">{stage.label}</p>
                <p className="text-lg font-bold">{stage.count}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {stage.percentage.toFixed(1)}%
                </Badge>
              </div>
              {index < stages.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-3" />
              )}
            </div>
          ))}
        </div>

        {/* Conversion Summary */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Overall Conversion Rate</p>
              <p className="text-xs text-muted-foreground">Views to Funding</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{conversionRate}%</p>
              <p className="text-xs text-muted-foreground">
                {fundingCommitments} of {totalViews} investors
              </p>
            </div>
          </div>
        </div>

        {/* Stage Details */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {stages.slice(1).map((stage) => (
            <div key={stage.stage} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <div className="flex-1">
                <p className="text-xs font-medium">{stage.count} {stage.label}</p>
                <p className="text-xs text-muted-foreground">{stage.percentage.toFixed(1)}% of views</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  FileSignature, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight,
  User,
  Building
} from 'lucide-react';

interface InvestorInteraction {
  id: string;
  investorName: string;
  investorFirm: string;
  avatar: string;
  stage: 'viewed' | 'nda_requested' | 'nda_signed' | 'meeting_scheduled' | 'funding_committed';
  viewCount: number;
  lastViewed: string;
  ndaSignedAt?: string;
  meetingScheduledAt?: string;
  fundingAmount?: number;
  investorType: 'Angel' | 'VC' | 'PE' | 'Strategic';
  interestLevel: 'Low' | 'Medium' | 'High';
  notes?: string;
}

interface InvestorTimelineProps {
  interactions: InvestorInteraction[];
  className?: string;
}

export function InvestorTimeline({ interactions, className }: InvestorTimelineProps) {
  const stages = [
    { key: 'viewed', label: 'Viewed', icon: Eye, color: 'bg-blue-500' },
    { key: 'nda_requested', label: 'NDA Requested', icon: FileSignature, color: 'bg-yellow-500' },
    { key: 'nda_signed', label: 'NDA Signed', icon: CheckCircle, color: 'bg-green-500' },
    { key: 'meeting_scheduled', label: 'Meeting', icon: Calendar, color: 'bg-purple-500' },
    { key: 'funding_committed', label: 'Invested', icon: DollarSign, color: 'bg-emerald-500' }
  ];

  const getStageProgress = (stage: string) => {
    const stageIndex = stages.findIndex(s => s.key === stage);
    return ((stageIndex + 1) / stages.length) * 100;
  };

  const getInterestBadge = (level: string) => {
    const variants = {
      Low: 'secondary',
      Medium: 'default', 
      High: 'destructive'
    } as const;
    return variants[level as keyof typeof variants] || 'secondary';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Investor Pipeline Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {interactions.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No investor interactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="relative">
                {/* Investor Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={interaction.avatar} 
                    alt={interaction.investorName}
                    className="w-10 h-10 rounded-full border-2 border-background"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{interaction.investorName}</p>
                      <Badge variant={getInterestBadge(interaction.interestLevel)} className="text-xs">
                        {interaction.interestLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building className="w-3 h-3" />
                      <span>{interaction.investorFirm}</span>
                      <span>•</span>
                      <span>{interaction.investorType}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{interaction.viewCount} views</p>
                    <p className="text-xs text-muted-foreground">
                      Last: {new Date(interaction.lastViewed).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="ml-13 mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{Math.round(getStageProgress(interaction.stage))}%</span>
                  </div>
                  <Progress value={getStageProgress(interaction.stage)} className="h-2 mb-3" />
                  
                  {/* Stage Indicators */}
                  <div className="flex items-center justify-between">
                    {stages.map((stage, index) => {
                      const StageIcon = stage.icon;
                      const isCompleted = stages.findIndex(s => s.key === interaction.stage) >= index;
                      const isCurrent = stage.key === interaction.stage;
                      
                      return (
                        <div key={stage.key} className="flex flex-col items-center gap-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? stage.color + ' text-white' 
                              : 'bg-muted text-muted-foreground'
                          } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                            <StageIcon className="w-4 h-4" />
                          </div>
                          <p className={`text-xs text-center ${isCurrent ? 'font-medium' : 'text-muted-foreground'}`}>
                            {stage.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Funding Amount (if applicable) */}
                {interaction.stage === 'funding_committed' && interaction.fundingAmount && (
                  <div className="ml-13 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Funding Committed
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${interaction.fundingAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes (if applicable) */}
                {interaction.notes && (
                  <div className="ml-13 p-2 mt-2 bg-muted/30 rounded text-xs text-muted-foreground">
                    {interaction.notes}
                  </div>
                )}

                {/* Separator */}
                {interactions.indexOf(interaction) < interactions.length - 1 && (
                  <div className="border-b my-4" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  FileSignature, 
  Calendar, 
  DollarSign, 
  ChevronDown, 
  ChevronUp,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Target
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

interface InvestorPitchCardProps {
  pitchId: string;
  pitchTitle: string;
  pitchType: 'Video' | 'Deck' | 'Document';
  publishedAt: string;
  interactions: InvestorInteraction[];
  onViewDetails: (pitchId: string) => void;
  onTrackInterest: (pitchId: string) => void;
  onReviewNDA: (pitchId: string) => void;
  onViewFunding: (pitchId: string) => void;
}

export function InvestorPitchCard({ 
  pitchId,
  pitchTitle, 
  pitchType,
  publishedAt,
  interactions,
  onViewDetails,
  onTrackInterest,
  onReviewNDA,
  onViewFunding
}: InvestorPitchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalViews = interactions.reduce((sum, i) => sum + i.viewCount, 0);
  const ndaSignatures = interactions.filter(i => i.stage === 'nda_signed' || i.stage === 'meeting_scheduled' || i.stage === 'funding_committed').length;
  const meetingsScheduled = interactions.filter(i => i.stage === 'meeting_scheduled' || i.stage === 'funding_committed').length;
  const fundingCommitments = interactions.filter(i => i.stage === 'funding_committed');
  const totalFunding = fundingCommitments.reduce((sum, i) => sum + (i.fundingAmount || 0), 0);

  const getStageProgress = () => {
    const stages = ['viewed', 'nda_requested', 'nda_signed', 'meeting_scheduled', 'funding_committed'];
    const maxStage = Math.max(...interactions.map(i => stages.indexOf(i.stage)));
    return ((maxStage + 1) / stages.length) * 100;
  };

  const getStageColor = (stage: string) => {
    const colors = {
      viewed: 'bg-blue-500',
      nda_requested: 'bg-yellow-500', 
      nda_signed: 'bg-green-500',
      meeting_scheduled: 'bg-purple-500',
      funding_committed: 'bg-emerald-500'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-500';
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {pitchTitle}
              <Badge variant="outline" className="text-xs">
                {pitchType}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Published {new Date(publishedAt).toLocaleDateString()}
            </p>
          </div>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-medium">
              <Eye className="w-3 h-3" />
              {totalViews}
            </div>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-medium">
              <FileSignature className="w-3 h-3" />
              {ndaSignatures}
            </div>
            <p className="text-xs text-muted-foreground">NDAs</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-medium">
              <Calendar className="w-3 h-3" />
              {meetingsScheduled}
            </div>
            <p className="text-xs text-muted-foreground">Meetings</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-medium">
              <DollarSign className="w-3 h-3" />
              {fundingCommitments.length}
            </div>
            <p className="text-xs text-muted-foreground">Funding</p>
          </div>
        </div>

        {/* Progress Pipeline */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Pipeline Progress</span>
            <span>{Math.round(getStageProgress())}%</span>
          </div>
          <Progress value={getStageProgress()} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={() => onTrackInterest(pitchId)} className="flex-1">
            <Target className="w-3 h-3 mr-1" />
            Track Interest
          </Button>
          <Button size="sm" variant="outline" onClick={() => onReviewNDA(pitchId)} className="flex-1">
            <FileSignature className="w-3 h-3 mr-1" />
            Review NDAs
          </Button>
          <Button size="sm" variant="outline" onClick={() => onViewFunding(pitchId)} className="flex-1">
            <DollarSign className="w-3 h-3 mr-1" />
            View Funding
          </Button>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Investor Engagement ({interactions.length})
              </h4>
              <div className="space-y-3">
                {interactions.slice(0, 5).map((interaction) => (
                  <div key={interaction.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <img 
                      src={interaction.avatar} 
                      alt={interaction.investorName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{interaction.investorName}</p>
                        <Badge variant={getInterestBadge(interaction.interestLevel)} className="text-xs">
                          {interaction.interestLevel}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{interaction.investorFirm}</p>
                    </div>
                    <div className="text-right">
                      <div className={`w-3 h-3 rounded-full ${getStageColor(interaction.stage)}`} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {interaction.viewCount} views
                      </p>
                    </div>
                  </div>
                ))}
                {interactions.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => onViewDetails(pitchId)}>
                    View All {interactions.length} Investors
                  </Button>
                )}
              </div>
            </div>

            {fundingCommitments.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Funding Commitments
                </h4>
                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Committed</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${totalFunding.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fundingCommitments.length} investor{fundingCommitments.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
import { Eye, FileText, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface InvestorAnalyticsProps {
  profileViews: number;
  ndaSignatures: number;
  meetingsScheduled: number;
  fundingCommitted: number;
}

export function InvestorAnalytics({ 
  profileViews, 
  ndaSignatures, 
  meetingsScheduled, 
  fundingCommitted 
}: InvestorAnalyticsProps) {
  const actualFundingCommitments = fundingCommitted > 0 ? Math.ceil(fundingCommitted / 250000) : 0; // Estimate number of commitments
  const ndaConversionRate = profileViews > 0 ? (ndaSignatures / profileViews * 100).toFixed(1) : '0.0';
  const meetingConversionRate = profileViews > 0 ? (meetingsScheduled / profileViews * 100).toFixed(1) : '0.0';
  const fundingConversionRate = profileViews > 0 ? (actualFundingCommitments / profileViews * 100).toFixed(1) : '0.0';
  const overallConversionRate = profileViews > 0 ? (actualFundingCommitments / profileViews * 100).toFixed(1) : '0.0';

  const metrics = [
    {
      title: 'Profile Views',
      value: profileViews.toString(),
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      title: 'NDA Signatures',
      value: ndaSignatures.toString(),
      icon: FileText,
      color: 'text-yellow-500'
    },
    {
      title: 'Meetings Scheduled',
      value: meetingsScheduled.toString(),
      icon: Calendar,
      color: 'text-purple-500'
    },
    {
      title: 'Funding Committed',
      value: `$${fundingCommitted}K`,
      icon: DollarSign,
      color: 'text-green-500'
    }
  ];

  const pipelineStages = [
    { name: 'Profile Views', value: profileViews, percentage: 100, color: 'bg-blue-500' },
    { name: 'NDA Signatures', value: ndaSignatures, percentage: parseFloat(ndaConversionRate), color: 'bg-yellow-500' },
    { name: 'Meetings Scheduled', value: meetingsScheduled, percentage: parseFloat(meetingConversionRate), color: 'bg-purple-500' },
    { name: 'Funding Commitments', value: actualFundingCommitments, percentage: parseFloat(fundingConversionRate), color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="bg-card/50 border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Investor Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Overall Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Pipeline Flow */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {pipelineStages.map((stage, index) => (
                <div key={stage.name} className="text-center">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center`}>
                        {index === 0 && <Eye className="w-6 h-6 text-white" />}
                        {index === 1 && <FileText className="w-6 h-6 text-white" />}
                        {index === 2 && <Calendar className="w-6 h-6 text-white" />}
                        {index === 3 && <DollarSign className="w-6 h-6 text-white" />}
                      </div>
                    </div>
                    {index < pipelineStages.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-6 h-0.5 bg-border transform -translate-y-0.5" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{stage.name}</h3>
                  <p className="text-2xl font-bold mb-1">{stage.value}</p>
                  <p className="text-sm text-muted-foreground">{stage.percentage}%</p>
                </div>
              ))}
            </div>

            {/* Overall Conversion Rate */}
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Overall Conversion Rate</h3>
                  <p className="text-sm text-muted-foreground">Views to Funding</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{overallConversionRate}%</p>
                  <p className="text-sm text-muted-foreground">{actualFundingCommitments} of {profileViews} investors</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">
                    <span className="font-medium">{ndaSignatures} NDA Signatures</span>
                    <span className="text-muted-foreground ml-2">{ndaConversionRate}% of views</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm">
                    <span className="font-medium">{meetingsScheduled} Meetings Scheduled</span>
                    <span className="text-muted-foreground ml-2">{meetingConversionRate}% of views</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">
                    <span className="font-medium">{actualFundingCommitments} Funding Commitments</span>
                    <span className="text-muted-foreground ml-2">{fundingConversionRate}% of views</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
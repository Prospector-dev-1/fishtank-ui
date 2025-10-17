import { Clock, User, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';

interface Investor {
  name: string;
  org: string;
  stage: string;
  lastActivity: string;
}

interface InvestorPipelineListProps {
  investors: Investor[];
  pitchName: string;
}

const STAGE_INDEX: Record<string, number> = {
  "Viewed": 1,
  "NDA Signed": 2,
  "Meeting": 3,
  "Deal": 4,
  "Invested": 5
};

const STAGE_PROGRESS: Record<string, number> = {
  "Viewed": 20,
  "NDA Signed": 40,
  "Meeting": 60,
  "Deal": 80,
  "Invested": 100
};

const STAGE_COLORS: Record<string, string> = {
  "Viewed": "bg-blue-500",
  "NDA Signed": "bg-yellow-500",
  "Meeting": "bg-orange-500",
  "Deal": "bg-purple-500",
  "Invested": "bg-green-500"
};

export function InvestorPipelineList({ investors, pitchName }: InvestorPipelineListProps) {
  if (investors.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No investor interactions yet</h3>
          <p className="text-muted-foreground">
            No investors have interacted with "{pitchName}" yet. Share your pitch to start attracting investor attention.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {investors.map((investor, index) => (
        <Card key={`${investor.name}-${index}`} className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold">{investor.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {investor.org}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={`${STAGE_COLORS[investor.stage]} text-white border-0`}
                >
                  {investor.stage}
                </Badge>
                <div className="text-right text-sm">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(investor.lastActivity), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{STAGE_PROGRESS[investor.stage]}%</span>
              </div>
              <Progress value={STAGE_PROGRESS[investor.stage]} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Viewed</span>
                <span>NDA</span>
                <span>Meeting</span>
                <span>Deal</span>
                <span>Invested</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
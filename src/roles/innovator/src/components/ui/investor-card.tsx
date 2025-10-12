import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScorePill } from "@/components/ui/score-pill";
import { MessageSquare, Calendar, Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestorCardProps {
  investor: {
    id: string;
    name: string;
    firm: string;
    avatar: string;
    thesis: string[];
    stages: string[];
    matchScore: number;
    status: "pending" | "interested" | "contacted" | "declined";
    requiresNDA: boolean;
    description: string;
  };
  onAction: (investorId: string, action: string) => void;
  className?: string;
}

export const InvestorCard = ({ investor, onAction, className }: InvestorCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "interested": return "bg-success/10 text-success border-success/20";
      case "contacted": return "bg-primary/10 text-primary border-primary/20";
      case "declined": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "interested": return "Interested";
      case "contacted": return "Contacted";
      case "declined": return "Declined";
      default: return "New Match";
    }
  };

  return (
    <Card className={cn("card-interactive p-6", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-medium text-primary text-sm">
              {investor.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{investor.name}</h3>
              <p className="text-muted-foreground text-sm">{investor.firm}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ScorePill score={investor.matchScore} />
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border",
              getStatusColor(investor.status)
            )}>
              {getStatusText(investor.status)}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {investor.description}
        </p>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-muted-foreground">Focus:</span>
            {investor.thesis.slice(0, 3).map((area) => (
              <Badge key={area} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
            {investor.thesis.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{investor.thesis.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-muted-foreground">Stages:</span>
            {investor.stages.map((stage) => (
              <Badge key={stage} variant="outline" className="text-xs">
                {stage}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button
            size="sm"
            variant={investor.status === "contacted" ? "secondary" : "default"}
            onClick={() => onAction(investor.id, "message")}
            disabled={investor.status === "declined"}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            {investor.status === "contacted" ? "Messaged" : "Message"}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction(investor.id, "schedule")}
            disabled={investor.status === "declined"}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Schedule
          </Button>
          
          {investor.requiresNDA && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction(investor.id, "nda")}
              disabled={investor.status === "declined"}
            >
              <Shield className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction(investor.id, "view")}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
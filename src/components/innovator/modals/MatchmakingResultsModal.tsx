import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/innovator/ui/dialog";
import { Button } from "@/components/innovator/ui/button";
import { Card, CardContent } from "@/components/innovator/ui/card";
import { Badge } from "@/components/innovator/ui/badge";
import { Share2, Lock, Star, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface MatchmakingResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  innovationTitle?: string;
}

export const MatchmakingResultsModal = ({ open, onOpenChange, innovationTitle }: MatchmakingResultsModalProps) => {
  const mockInvestors = [
    {
      id: "1",
      name: "Sarah Williams",
      firm: "Climate Capital",
      location: "Toronto, ON",
      reason: "Focuses on Climate Tech + Seed stage",
      match: 95,
      avatar: "SW"
    },
    {
      id: "2",
      name: "Michael Chen",
      firm: "AI Ventures",
      location: "Vancouver, BC", 
      reason: "AI/ML specialist + MVP stage",
      match: 88,
      avatar: "MC"
    },
    {
      id: "3",
      name: "Jessica Kumar",
      firm: "GreenTech Partners",
      location: "Montreal, QC",
      reason: "Sustainability focus + Canadian startups",
      match: 82,
      avatar: "JK"
    }
  ];

  const handleShareTeaser = (investorName: string) => {
    toast.success(`Teaser shared with ${investorName}!`);
  };

  const handleInviteNDA = (investorName: string) => {
    toast.success(`NDA invitation sent to ${investorName}!`);
  };

  const handleSave = (investorName: string) => {
    toast.success(`${investorName} saved to your connections!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Investor Matches</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Here are the investors who are best matched with "{innovationTitle}"
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {mockInvestors.map((investor) => (
            <Card key={investor.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">
                        {investor.avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{investor.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {investor.firm}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {investor.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-green-600">{investor.match}%</span>
                    </div>
                    <Badge variant="secondary">Match</Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm bg-blue-50 text-blue-800 p-2 rounded-lg">
                    <strong>Why this match:</strong> {investor.reason}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleShareTeaser(investor.name)}
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Share Teaser
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleInviteNDA(investor.name)}
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    Invite to NDA
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleSave(investor.name)}
                  >
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4 border-t">
          <Button 
            className="w-full" 
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
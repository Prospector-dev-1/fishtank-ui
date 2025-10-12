import { useState } from "react";
import { AlertTriangle, Upload, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { disputes } from "@/lib/creatorData";
import type { Dispute } from "@/lib/types";

export default function Disputes() {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showNewDispute, setShowNewDispute] = useState(false);
  const [newDisputeData, setNewDisputeData] = useState({
    title: "",
    description: "",
    evidence: [] as File[]
  });

  const mockDisputes: Dispute[] = [
    {
      id: "dispute1",
      contractId: "contract1",
      milestoneId: "m2",
      title: "Milestone deliverables rejected without valid reason",
      description: "The client rejected my pitch deck deliverables without providing specific feedback or requesting revisions as outlined in our contract.",
      evidence: [
        { name: "Original_Deliverables.pdf", url: "/files/deliverables.pdf" },
        { name: "Client_Communications.png", url: "/files/screenshot.png" }
      ],
      status: 'open',
      resolution: undefined,
      createdAt: "2024-01-28T15:00:00Z",
      deadline: "2024-02-04T15:00:00Z"
    }
  ];

  const allDisputes = [...disputes, ...mockDisputes];

  const getStatusColor = (status: Dispute['status']) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_review': return 'secondary';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setNewDisputeData(prev => ({
        ...prev,
        evidence: Array.from(files)
      }));
    }
  };

  const submitDispute = () => {
    console.log('Submitting dispute:', newDisputeData);
    setShowNewDispute(false);
    setNewDisputeData({ title: "", description: "", evidence: [] });
  };

  const daysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dispute Center</h1>
          <p className="text-muted-foreground">Resolve payment and project issues</p>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowNewDispute(true)}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          New Dispute
        </Button>
      </div>

      {allDisputes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Active Disputes</h3>
            <p className="text-muted-foreground mb-4">
              All your projects are running smoothly!
            </p>
            <p className="text-sm text-muted-foreground">
              If you encounter issues with payments or deliverables, you can open a dispute for resolution.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {allDisputes.map((dispute) => (
            <Card key={dispute.id} className="border-l-4 border-l-destructive">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{dispute.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Contract ID: {dispute.contractId} • Milestone: {dispute.milestoneId}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(dispute.status) as any} className="text-xs">
                    {dispute.status.replace('_', ' ')}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {dispute.description}
                </p>

                {dispute.evidence.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Evidence:</p>
                    {dispute.evidence.map((evidence, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        • {evidence.name}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Created: {new Date(dispute.createdAt).toLocaleDateString()}</span>
                  {dispute.status === 'open' && (
                    <span className="text-destructive font-medium">
                      {daysUntilDeadline(dispute.deadline)} days to resolve
                    </span>
                  )}
                </div>

                {dispute.resolution && (
                  <div className="p-3 bg-success/10 rounded-lg mb-3">
                    <p className="text-sm font-medium text-success mb-1">Resolution:</p>
                    <p className="text-sm text-muted-foreground">{dispute.resolution}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Messages
                  </Button>
                  {dispute.status === 'open' && (
                    <Button size="sm" variant="ghost">
                      <Upload className="h-3 w-3 mr-1" />
                      Add Evidence
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">How Disputes Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <div>
              <p className="text-sm font-medium">Submit your dispute</p>
              <p className="text-xs text-muted-foreground">Provide details and evidence</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <div>
              <p className="text-sm font-medium">Platform review</p>
              <p className="text-xs text-muted-foreground">Our team reviews within 72 hours</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <div>
              <p className="text-sm font-medium">Resolution</p>
              <p className="text-xs text-muted-foreground">Fair outcome based on evidence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Dispute Modal */}
      {showNewDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Open New Dispute</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Issue Title</label>
                <Input
                  value={newDisputeData.title}
                  onChange={(e) => setNewDisputeData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Detailed Description</label>
                <Textarea
                  value={newDisputeData.description}
                  onChange={(e) => setNewDisputeData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Explain the issue in detail, including timeline and any communication..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Evidence (Screenshots, messages, files)</label>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="mt-1"
                />
                {newDisputeData.evidence.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newDisputeData.evidence.map((file, i) => (
                      <div key={i} className="text-sm text-muted-foreground">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-1">Before submitting:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Try to resolve the issue directly with the client</li>
                  <li>• Provide clear evidence of the problem</li>
                  <li>• Be specific about the desired resolution</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowNewDispute(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={submitDispute}
                disabled={!newDisputeData.title || !newDisputeData.description}
              >
                Submit Dispute
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
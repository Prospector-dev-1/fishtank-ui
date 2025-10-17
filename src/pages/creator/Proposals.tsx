import { useState } from "react";
import { Plus, Edit3, Send, Trash2, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { proposals, briefs } from "@/lib/creatorData";
import type { Proposal, Milestone } from "@/lib/types";

export default function Proposals() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [showComposer, setShowComposer] = useState(false);

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'draft': return <Edit3 className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'countered': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'declined': return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'countered': return 'secondary';
      case 'accepted': return 'success';
      case 'declined': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    if (selectedTab === 'all') return true;
    return proposal.status === selectedTab;
  });

  const ProposalComposer = ({ proposal }: { proposal?: Proposal }) => {
    const [formData, setFormData] = useState({
      title: proposal?.title || "",
      summary: proposal?.summary || "",
      timeline: proposal?.timeline || "",
      notes: proposal?.notes || "",
      milestones: proposal?.milestones || [
        { id: '1', title: '', description: '', due: '', price: 0, status: 'not_funded' as const, deliverables: [] }
      ]
    });

    const addMilestone = () => {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, {
          id: Date.now().toString(),
          title: '',
          description: '',
          due: '',
          price: 0,
          status: 'not_funded' as const,
          deliverables: []
        }]
      }));
    };

    const updateMilestone = (index: number, field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        milestones: prev.milestones.map((milestone, i) => 
          i === index ? { ...milestone, [field]: value } : milestone
        )
      }));
    };

    const removeMilestone = (index: number) => {
      setFormData(prev => ({
        ...prev,
        milestones: prev.milestones.filter((_, i) => i !== index)
      }));
    };

    const totalAmount = formData.milestones.reduce((sum, m) => sum + (m.price || 0), 0);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {proposal ? 'Edit Proposal' : 'Create Proposal'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Startup Pitch Deck Design"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Summary</label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief description of what you'll deliver..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Timeline</label>
              <Input
                value={formData.timeline}
                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                placeholder="2 weeks"
                className="mt-1"
              />
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Milestones</label>
                <Button size="sm" variant="outline" onClick={addMilestone}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {formData.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        placeholder="Milestone title"
                        className="text-sm"
                      />
                      {formData.milestones.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMilestone(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <Textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      placeholder="Deliverables and requirements"
                      className="text-sm"
                      rows={2}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={milestone.due}
                        onChange={(e) => updateMilestone(index, 'due', e.target.value)}
                        className="text-sm"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm">$</span>
                        <Input
                          type="number"
                          value={milestone.price}
                          onChange={(e) => updateMilestone(index, 'price', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="text-sm pl-6"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right mt-2">
                <span className="text-sm font-medium">
                  Total: <span className="text-lg text-primary">${totalAmount}</span>
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information or requirements..."
                className="mt-1"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowComposer(false);
                setEditingProposal(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Save as draft
                console.log('Saving draft:', formData);
                setShowComposer(false);
                setEditingProposal(null);
              }}
            >
              Save Draft
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                // Send proposal
                console.log('Sending proposal:', formData);
                setShowComposer(false);
                setEditingProposal(null);
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">Manage your project proposals</p>
        </div>
        <Button size="sm" onClick={() => setShowComposer(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">{proposals.filter(p => p.status === 'draft').length}</div>
            <div className="text-xs text-muted-foreground">Draft</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">{proposals.filter(p => p.status === 'sent').length}</div>
            <div className="text-xs text-muted-foreground">Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-success">{proposals.filter(p => p.status === 'accepted').length}</div>
            <div className="text-xs text-muted-foreground">Won</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-muted-foreground">{proposals.filter(p => p.status === 'declined').length}</div>
            <div className="text-xs text-muted-foreground">Lost</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="accepted">Won</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4 mt-6">
          {filteredProposals.map((proposal) => {
            const brief = briefs.find(b => b.id === proposal.briefId);
            
            return (
              <Card key={proposal.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{proposal.title}</h4>
                      <p className="text-sm text-muted-foreground">{brief?.title}</p>
                    </div>
                    <Badge variant={getStatusColor(proposal.status) as any} className="text-xs">
                      {getStatusIcon(proposal.status)}
                      <span className="ml-1">{proposal.status}</span>
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {proposal.summary}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">${proposal.totalAmount}</span>
                    <span className="text-muted-foreground">{proposal.timeline}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {proposal.status === 'draft' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingProposal(proposal)}
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredProposals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No proposals found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Composer Modal */}
      {(showComposer || editingProposal) && (
        <ProposalComposer proposal={editingProposal || undefined} />
      )}
    </div>
  );
}
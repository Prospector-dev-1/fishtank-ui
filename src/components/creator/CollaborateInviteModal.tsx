import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Creator, Milestone } from '@/lib/creatorTypes';
import { NDAModal } from './NDAModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CollaborateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
}

export function CollaborateInviteModal({ isOpen, onClose, creator }: CollaborateInviteModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [role, setRole] = useState('');
  const [note, setNote] = useState('');
  const [splitPct, setSplitPct] = useState('');
  const [ndaRequired, setNdaRequired] = useState(false);
  const [showNDA, setShowNDA] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: '',
      due: '',
      deliverables: '',
      compensation: { type: 'hourly', hourlyRate: 0, estHours: 0 }
    }
  ]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: Date.now().toString(),
        title: '',
        due: '',
        deliverables: '',
        compensation: { type: 'hourly', hourlyRate: 0, estHours: 0 }
      }
    ]);
  };

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(m => m.id !== id));
    }
  };

  const updateMilestone = (id: string, field: string, value: any) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    ));
  };

  const updateCompensation = (id: string, compensation: any) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, compensation } : milestone
    ));
  };

  const handleSubmit = () => {
    if (!role.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please specify the role"
      });
      return;
    }

    if (milestones.some(m => !m.title.trim() || !m.due || !m.deliverables.trim())) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Please complete all milestone fields"
      });
      return;
    }

    if (ndaRequired) {
      setShowNDA(true);
      return;
    }

    sendInvite();
  };

  const sendInvite = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to send invitations"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('invitations')
        .insert({
          from_user_id: user.id,
          to_creator_id: creator.id,
          role,
          note: note || null,
          split_pct: splitPct ? parseInt(splitPct) : null,
          nda_required: ndaRequired,
          milestones: milestones,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Invite Sent",
        description: `Collaboration invite sent to ${creator.name}`
      });
      
      // Reset form
      setRole('');
      setNote('');
      setSplitPct('');
      setNdaRequired(false);
      setMilestones([{
        id: '1',
        title: '',
        due: '',
        deliverables: '',
        compensation: { type: 'hourly', hourlyRate: 0, estHours: 0 }
      }]);
      
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send invitation. Please try again."
      });
    }
  };

  const handleNDAAgree = () => {
    setShowNDA(false);
    sendInvite();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-neutral-700">
            <h2 className="text-xl font-semibold text-white">
              Invite {creator.name} to Collaborate
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Set up roles, milestones, and compensation for your collaboration
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">Role *</Label>
              <Input
                id="role"
                placeholder="e.g., Lead Developer, Brand Designer, Marketing Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
              <div className="flex gap-2 flex-wrap">
                {creator.skills.slice(0, 3).map(skill => (
                  <button
                    key={skill}
                    onClick={() => setRole(skill + " Specialist")}
                    className="text-xs px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300"
                  >
                    {skill} Specialist
                  </button>
                ))}
              </div>
            </div>

            {/* Split Percentage */}
            <div className="space-y-2">
              <Label htmlFor="split" className="text-white">Your Split % (optional)</Label>
              <Input
                id="split"
                type="number"
                placeholder="e.g., 60 (for 60/40 split)"
                value={splitPct}
                onChange={(e) => setSplitPct(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">Milestones *</Label>
                <Button
                  onClick={addMilestone}
                  variant="outline"
                  size="sm"
                  className="border-neutral-700 text-neutral-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>

              {milestones.map((milestone, index) => (
                <Card key={milestone.id} className="bg-neutral-800 border-neutral-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white">
                        Milestone {index + 1}
                      </CardTitle>
                      {milestones.length > 1 && (
                        <Button
                          onClick={() => removeMilestone(milestone.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-neutral-300">Title</Label>
                        <Input
                          placeholder="Milestone name"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                          className="bg-neutral-900 border-neutral-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-neutral-300">Due Date</Label>
                        <Input
                          type="date"
                          value={milestone.due}
                          onChange={(e) => updateMilestone(milestone.id, 'due', e.target.value)}
                          className="bg-neutral-900 border-neutral-600 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-neutral-300">Deliverables</Label>
                      <Textarea
                        placeholder="What will be delivered?"
                        value={milestone.deliverables}
                        onChange={(e) => updateMilestone(milestone.id, 'deliverables', e.target.value)}
                        className="bg-neutral-900 border-neutral-600 text-white"
                        rows={2}
                      />
                    </div>

                    {/* Compensation */}
                    <div className="space-y-3">
                      <Label className="text-neutral-300">Compensation</Label>
                      <Select
                        value={milestone.compensation.type}
                        onValueChange={(type) => {
                          const newComp = 
                            type === 'hourly' ? { type: 'hourly', hourlyRate: 0, estHours: 0 } :
                            type === 'equity' ? { type: 'equity', equityPct: 0 } :
                            type === 'commission' ? { type: 'commission', commissionPct: 0 } :
                            { type: 'fixed', amount: 0 };
                          updateCompensation(milestone.id, newComp);
                        }}
                      >
                        <SelectTrigger className="bg-neutral-900 border-neutral-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly Rate</SelectItem>
                          <SelectItem value="equity">Equity %</SelectItem>
                          <SelectItem value="commission">Commission %</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>

                      {milestone.compensation.type === 'hourly' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-neutral-400 text-xs">Rate ($/hr)</Label>
                            <Input
                              type="number"
                              placeholder="Rate"
                              value={milestone.compensation.hourlyRate || ''}
                              onChange={(e) => updateCompensation(milestone.id, {
                                ...milestone.compensation,
                                hourlyRate: Number(e.target.value)
                              })}
                              className="bg-neutral-900 border-neutral-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-neutral-400 text-xs">Est. Hours</Label>
                            <Input
                              type="number"
                              placeholder="Hours"
                              value={milestone.compensation.estHours || ''}
                              onChange={(e) => updateCompensation(milestone.id, {
                                ...milestone.compensation,
                                estHours: Number(e.target.value)
                              })}
                              className="bg-neutral-900 border-neutral-600 text-white"
                            />
                          </div>
                        </div>
                      )}

                      {milestone.compensation.type === 'equity' && (
                        <div>
                          <Label className="text-neutral-400 text-xs">Equity %</Label>
                          <Input
                            type="number"
                            placeholder="Percentage"
                            value={milestone.compensation.equityPct || ''}
                            onChange={(e) => updateCompensation(milestone.id, {
                              ...milestone.compensation,
                              equityPct: Number(e.target.value)
                            })}
                            className="bg-neutral-900 border-neutral-600 text-white"
                          />
                        </div>
                      )}

                      {milestone.compensation.type === 'commission' && (
                        <div>
                          <Label className="text-neutral-400 text-xs">Commission %</Label>
                          <Input
                            type="number"
                            placeholder="Percentage"
                            value={milestone.compensation.commissionPct || ''}
                            onChange={(e) => updateCompensation(milestone.id, {
                              ...milestone.compensation,
                              commissionPct: Number(e.target.value)
                            })}
                            className="bg-neutral-900 border-neutral-600 text-white"
                          />
                        </div>
                      )}

                      {milestone.compensation.type === 'fixed' && (
                        <div>
                          <Label className="text-neutral-400 text-xs">Fixed Amount ($)</Label>
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={milestone.compensation.amount || ''}
                            onChange={(e) => updateCompensation(milestone.id, {
                              ...milestone.compensation,
                              amount: Number(e.target.value)
                            })}
                            className="bg-neutral-900 border-neutral-600 text-white"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-white">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Additional details about the collaboration..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
                rows={3}
              />
            </div>

            {/* NDA */}
            <div className="flex items-center space-x-3">
              <Switch
                id="nda"
                checked={ndaRequired}
                onCheckedChange={setNdaRequired}
              />
              <Label htmlFor="nda" className="text-white">
                Require NDA before collaboration
              </Label>
            </div>
          </div>

          <div className="p-6 border-t border-neutral-700 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Send Invite
            </Button>
          </div>
        </div>
      </div>

      <NDAModal
        isOpen={showNDA}
        onClose={() => setShowNDA(false)}
        onAgree={handleNDAAgree}
        startupName={creator.name}
      />
    </>
  );
}
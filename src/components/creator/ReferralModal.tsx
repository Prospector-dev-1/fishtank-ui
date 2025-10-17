import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { creators } from '@/data/creators';
import { useToast } from '@/hooks/use-toast';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCreatorId?: string;
}

export function ReferralModal({ isOpen, onClose, currentCreatorId }: ReferralModalProps) {
  const { toast } = useToast();
  const [selectedCreator, setSelectedCreator] = useState('');
  const [referralPercent, setReferralPercent] = useState('');
  const [note, setNote] = useState('');

  const availableCreators = creators.filter(c => c.id !== currentCreatorId);

  const handleSubmit = () => {
    if (!selectedCreator) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Please select a creator to refer to"
      });
      return;
    }

    const percent = Number(referralPercent);
    if (!percent || percent < 1 || percent > 50) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Referral percentage must be between 1-50%"
      });
      return;
    }

    // Mock: Add to referrals state and create system messages
    toast({
      title: "Referral Sent",
      description: `Referral sent with ${percent}% commission rate`
    });

    // Reset form
    setSelectedCreator('');
    setReferralPercent('');
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-neutral-700">
          <h2 className="text-xl font-semibold text-white">Refer a Lead</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Share a potential client and earn a referral commission
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Creator Selection */}
          <div className="space-y-2">
            <Label htmlFor="creator" className="text-white">Refer to Creator *</Label>
            <Select value={selectedCreator} onValueChange={setSelectedCreator}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Select a creator" />
              </SelectTrigger>
              <SelectContent>
                {availableCreators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{creator.name}</div>
                        <div className="text-xs text-neutral-400">{creator.headline}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Referral Percentage */}
          <div className="space-y-2">
            <Label htmlFor="percent" className="text-white">Referral Commission % *</Label>
            <Input
              id="percent"
              type="number"
              min="1"
              max="50"
              placeholder="e.g., 10"
              value={referralPercent}
              onChange={(e) => setReferralPercent(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
            <p className="text-xs text-neutral-400">
              Commission you'll earn from their project (1-50%)
            </p>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-white">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Details about the lead or why they're a good fit..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
              rows={3}
            />
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
            Send Referral
          </Button>
        </div>
      </div>
    </div>
  );
}
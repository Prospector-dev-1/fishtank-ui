import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EndorsementPromptProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  creatorId: string;
}

export function EndorsementPrompt({ isOpen, onClose, creatorName, creatorId }: EndorsementPromptProps) {
  const { toast } = useToast();
  const [endorsementText, setEndorsementText] = useState('');

  const handleSubmit = () => {
    if (!endorsementText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please write an endorsement"
      });
      return;
    }

    if (endorsementText.length > 180) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Endorsement must be 180 characters or less"
      });
      return;
    }

    // Mock: Add endorsement to creator's profile
    toast({
      title: "Endorsement Sent",
      description: `Your endorsement for ${creatorName} has been published`
    });

    setEndorsementText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-neutral-700">
          <h2 className="text-xl font-semibold text-white">Write an Endorsement</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Share your experience working with {creatorName}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endorsement" className="text-white">Your Endorsement *</Label>
            <Textarea
              id="endorsement"
              placeholder={`"${creatorName} delivered exceptional work and was a pleasure to collaborate with..."`}
              value={endorsementText}
              onChange={(e) => setEndorsementText(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
              rows={4}
              maxLength={180}
            />
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Keep it concise and specific</span>
              <span className={endorsementText.length > 160 ? "text-yellow-400" : "text-neutral-400"}>
                {endorsementText.length}/180
              </span>
            </div>
          </div>

          <div className="bg-neutral-800/50 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-2">Preview:</p>
            <div className="text-sm text-neutral-200 italic">
              "{endorsementText || "Your endorsement will appear here..."}"
            </div>
            <div className="text-xs text-neutral-400 mt-2">
              — Your Name, Your Role
            </div>
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
            disabled={!endorsementText.trim()}
          >
            Publish Endorsement
          </Button>
        </div>
      </div>
    </div>
  );
}
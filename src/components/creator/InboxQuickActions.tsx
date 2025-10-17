import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Handshake, Image, Shield, Users } from 'lucide-react';
import { CollaborateInviteModal } from './CollaborateInviteModal';
import { ReferralModal } from './ReferralModal';
import { NDAModal } from './NDAModal';
import { creators } from '@/data/creators';
import { useToast } from '@/hooks/use-toast';

interface InboxQuickActionsProps {
  recipientId?: string;
  currentUserId: string;
}

export function InboxQuickActions({ recipientId, currentUserId }: InboxQuickActionsProps) {
  const { toast } = useToast();
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [showPortfolioPicker, setShowPortfolioPicker] = useState(false);

  const recipient = recipientId ? creators.find(c => c.id === recipientId) : null;
  const currentUser = creators.find(c => c.id === currentUserId);

  const handleSharePortfolio = () => {
    setShowPortfolioPicker(true);
  };

  const handlePortfolioSelect = (item: any) => {
    // Mock: Insert portfolio item as message
    toast({
      title: "Portfolio Shared",
      description: `Shared "${item.title}" in the conversation`
    });
    setShowPortfolioPicker(false);
  };

  const handleRequestNDA = () => {
    setShowNDAModal(true);
  };

  const handleNDARequest = () => {
    setShowNDAModal(false);
    toast({
      title: "NDA Request Sent",
      description: "The other party will be prompted to review and sign the NDA"
    });
  };

  return (
    <>
      <div className="flex gap-2 p-4 border-t bg-card/50 backdrop-blur-sm overflow-x-auto">
        <div className="flex gap-2 min-w-max mx-auto max-w-md">
          {/* Invite to Contract */}
          {recipient && (
            <Button
              onClick={() => setShowCollabModal(true)}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <Handshake className="h-4 w-4" />
              Invite
            </Button>
          )}

          {/* Share Portfolio */}
          {currentUser?.portfolio && (
            <Button
              onClick={handleSharePortfolio}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <Image className="h-4 w-4" />
              Portfolio
            </Button>
          )}

          {/* Request NDA */}
          <Button
            onClick={handleRequestNDA}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            NDA
          </Button>

          {/* Refer Lead */}
          <Button
            onClick={() => setShowReferralModal(true)}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Refer
          </Button>
        </div>
      </div>

      {/* Portfolio Picker Modal */}
      {showPortfolioPicker && currentUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
          <div className="bg-card border rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Share Portfolio Item</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select an item to share in the conversation
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {currentUser.portfolio.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePortfolioSelect(item)}
                    className="text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    />
                    <h3 className="text-sm font-medium truncate">
                      {item.title}
                    </h3>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPortfolioPicker(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {recipient && (
        <CollaborateInviteModal
          isOpen={showCollabModal}
          onClose={() => setShowCollabModal(false)}
          creator={recipient}
        />
      )}

      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        currentCreatorId={currentUserId}
      />

      <NDAModal
        isOpen={showNDAModal}
        onClose={() => setShowNDAModal(false)}
        onAgree={handleNDARequest}
        startupName="Collaboration NDA"
      />
    </>
  );
}
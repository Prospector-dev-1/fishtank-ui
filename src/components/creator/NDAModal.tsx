import React from 'react';
import { Button } from '@/components/ui/button';

interface NDAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  startupName: string;
}

export function NDAModal({ isOpen, onClose, onAgree, startupName }: NDAModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-white">Non-Disclosure Agreement</h3>
        <p className="text-sm text-neutral-300 mb-4">
          {startupName} requires you to sign an NDA before accessing detailed information.
        </p>
        
        <div className="bg-neutral-800 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto text-xs text-neutral-300 leading-relaxed">
          <p className="mb-3">
            <strong>MUTUAL NON-DISCLOSURE AGREEMENT</strong>
          </p>
          <p className="mb-3">
            This Non-Disclosure Agreement ("Agreement") is entered into by and between {startupName} ("Company") and the undersigned party ("Recipient").
          </p>
          <p className="mb-3">
            <strong>1. Confidential Information:</strong> Any and all technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information.
          </p>
          <p className="mb-3">
            <strong>2. Non-Disclosure:</strong> Recipient agrees to hold all Confidential Information in strict confidence and not to disclose such information to any third parties without prior written consent.
          </p>
          <p className="mb-3">
            <strong>3. Term:</strong> This Agreement shall remain in effect for a period of three (3) years from the date of signing.
          </p>
          <p>
            By clicking "Agree & Continue" below, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            Decline
          </Button>
          <Button
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); onAgree(); }}
          >
            Agree & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
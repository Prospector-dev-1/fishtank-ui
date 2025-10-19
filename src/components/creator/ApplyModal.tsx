import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

// Startup type - no longer from mockData
interface Startup {
  id: string;
  name: string;
  [key: string]: any;
}

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  startup: Startup;
  role: string;
}

type CompensationType = 'equity' | 'commission' | 'hourly';

export function ApplyModal({ isOpen, onClose, onSubmit, startup, role }: ApplyModalProps) {
  const [note, setNote] = useState('');
  const [compensationType, setCompensationType] = useState<CompensationType>('equity');
  const [equityPct, setEquityPct] = useState('0.5');
  const [commissionPct, setCommissionPct] = useState('10');
  const [hourlyRate, setHourlyRate] = useState('35');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const payload = {
      startupId: startup.id,
      role,
      note,
      compensationType,
      ...(compensationType === 'equity' && { equityPct: parseFloat(equityPct) }),
      ...(compensationType === 'commission' && { commissionPct: parseFloat(commissionPct) }),
      ...(compensationType === 'hourly' && { hourlyRate: parseFloat(hourlyRate) })
    };
    
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-white">Apply as {role}</h3>
        <p className="text-sm text-neutral-300 mb-4">{startup.name}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-200 block mb-2">
              Why are you interested in this role?
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe your interest and relevant experience..."
              className="bg-neutral-800 border-neutral-700 text-white"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-200 block mb-3">
              Preferred Compensation
            </label>
            <div className="flex rounded-lg border border-neutral-700 overflow-hidden">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCompensationType('equity'); }}
                className={`flex-1 px-3 py-2 text-sm ${
                  compensationType === 'equity'
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Equity
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCompensationType('commission'); }}
                className={`flex-1 px-3 py-2 text-sm ${
                  compensationType === 'commission'
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Commission
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCompensationType('hourly'); }}
                className={`flex-1 px-3 py-2 text-sm ${
                  compensationType === 'hourly'
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Hourly
              </button>
            </div>
          </div>

          {compensationType === 'equity' && (
            <div>
              <label className="text-sm font-medium text-neutral-200 block mb-2">
                Equity Percentage
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={equityPct}
                onChange={(e) => setEquityPct(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
                placeholder="0.5"
              />
            </div>
          )}

          {compensationType === 'commission' && (
            <div>
              <label className="text-sm font-medium text-neutral-200 block mb-2">
                Commission Percentage
              </label>
              <Input
                type="number"
                step="1"
                min="0"
                max="50"
                value={commissionPct}
                onChange={(e) => setCommissionPct(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
                placeholder="10"
              />
            </div>
          )}

          {compensationType === 'hourly' && (
            <div>
              <label className="text-sm font-medium text-neutral-200 block mb-2">
                Hourly Rate (USD)
              </label>
              <Input
                type="number"
                step="5"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
                placeholder="35"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  startupName: string;
}

export function TimeReminderModal({ isOpen, onClose, startupName }: TimeReminderModalProps) {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { toast } = useToast();

  const timeOptions = [
    { value: '15min', label: 'In 15 minutes' },
    { value: '30min', label: 'In 30 minutes' },
    { value: '1hour', label: 'In 1 hour' },
    { value: '2hours', label: 'In 2 hours' },
    { value: 'tomorrow', label: 'Tomorrow morning' },
    { value: 'week', label: 'In a week' }
  ];

  const handleSetReminder = () => {
    if (!selectedTime) {
      toast({
        title: "Please select a time",
        description: "Choose when you'd like to be reminded.",
        variant: "destructive"
      });
      return;
    }

    const selectedOption = timeOptions.find(option => option.value === selectedTime);
    
    // In a real app, this would set an actual notification
    toast({
      title: "Reminder Set! 🔔",
      description: `We'll remind you ${selectedOption?.label.toLowerCase()} to view ${startupName}'s NDA and send them a message.`,
      duration: 4000
    });

    onClose();
    setSelectedTime('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Set Reminder for {startupName}
          </DialogTitle>
          <DialogDescription>
            Choose when you'd like to be reminded to view the NDA and message this innovator.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Remind me:
            </label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select reminder time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">What happens next:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• You'll get a notification at the selected time</li>
                <li>• Review and sign the NDA agreement</li>
                <li>• Send a message to the innovator</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSetReminder} disabled={!selectedTime}>
            Set Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from "@/components/investor/ui/use-toast";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientAvatar?: string;
  startupName: string;
}

export function MessageModal({ 
  isOpen, 
  onClose, 
  recipientName, 
  recipientAvatar, 
  startupName 
}: MessageModalProps) {
  const [subject, setSubject] = useState(`Interest in ${startupName}`);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSend = () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    // Mock sending functionality
    toast({
      title: "Message sent!",
      description: `Your message to ${recipientName} has been sent successfully.`,
    });
    
    setMessage('');
    setSubject(`Interest in ${startupName}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-xl shadow-xl border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={recipientAvatar} alt={recipientName} />
              <AvatarFallback>
                {recipientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-h3 font-semibold">Message {recipientName}</h3>
              <p className="text-sm text-muted-foreground">{startupName}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
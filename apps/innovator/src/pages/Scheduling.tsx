import { useState } from "react";
import { ChevronLeft, Calendar, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

const mockTimeSlots: TimeSlot[] = [
  { id: "1", date: "2024-03-20", time: "10:00 AM", available: true },
  { id: "2", date: "2024-03-20", time: "2:00 PM", available: true },
  { id: "3", date: "2024-03-21", time: "11:00 AM", available: true },
  { id: "4", date: "2024-03-21", time: "3:00 PM", available: false },
  { id: "5", date: "2024-03-22", time: "9:00 AM", available: true },
  { id: "6", date: "2024-03-22", time: "1:00 PM", available: true },
];

export default function Scheduling() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const investorId = searchParams.get("investor");
  const investorName = searchParams.get("name") || "Investor";
  
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [step, setStep] = useState<"select" | "confirm">("select");

  const toggleSlot = (slotId: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else if (prev.length < 3) {
        return [...prev, slotId];
      } else {
        toast({
          title: "Slot Limit Reached",
          description: "You can select up to 3 time slots",
          variant: "destructive"
        });
        return prev;
      }
    });
  };

  const handleSubmit = () => {
    if (selectedSlots.length === 0) {
      toast({
        title: "No Slots Selected",
        description: "Please select at least one time slot",
        variant: "destructive"
      });
      return;
    }

    setStep("confirm");
  };

  const handleConfirm = () => {
    toast({
      title: "Meeting Request Sent",
      description: `Your meeting request has been sent to ${investorName}. They will respond within 24 hours.`
    });
    navigate("/matches");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="container-mobile px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setStep("select")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-semibold">Confirm Meeting</h1>
              <div className="w-10" />
            </div>
          </div>
        </div>

        <div className="container-mobile px-4 py-6 space-y-6">
          <Card className="card-elevated p-6 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Ready to Send</h2>
            <p className="text-muted-foreground mb-6">
              You're requesting a meeting with {investorName}
            </p>

            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-left">Proposed Times:</h3>
              {selectedSlots.map(slotId => {
                const slot = mockTimeSlots.find(s => s.id === slotId);
                return slot ? (
                  <div key={slotId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">{formatDate(slot.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{slot.time}</span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>

            <Button onClick={handleConfirm} className="w-full" size="lg">
              Send Meeting Request
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container-mobile px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate("/matches")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold">Schedule Meeting</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="container-mobile px-4 py-6 space-y-6">
        <Card className="card-elevated p-6">
          <h2 className="text-lg font-semibold mb-2">Meeting with {investorName}</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Select up to 3 time slots that work for you. The investor will choose one that fits their schedule.
          </p>
          
          <div className="space-y-4">
            {Object.entries(mockTimeSlots.reduce((groups: { [key: string]: TimeSlot[] }, slot) => {
              const date = slot.date;
              if (!groups[date]) groups[date] = [];
              groups[date].push(slot);
              return groups;
            }, {})).map(([date, slots]) => (
              <div key={date}>
                <h3 className="font-medium mb-3">{formatDate(date)}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlots.includes(slot.id) ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => toggleSlot(slot.id)}
                      className="justify-start h-auto p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{slot.time}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          {selectedSlots.length}/3 slots selected
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={selectedSlots.length === 0}
          className="w-full" 
          size="lg"
        >
          Continue ({selectedSlots.length} slot{selectedSlots.length !== 1 ? 's' : ''} selected)
        </Button>
      </div>
    </div>
  );
}
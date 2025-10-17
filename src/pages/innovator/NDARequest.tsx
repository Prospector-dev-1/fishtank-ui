import { useState } from "react";
import { ChevronLeft, Shield, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function NDARequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const investorId = searchParams.get("investor");
  const investorName = searchParams.get("name") || "Investor";
  
  const [template, setTemplate] = useState("standard");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"select" | "message" | "confirm">("select");

  const templates = [
    {
      id: "standard",
      name: "Standard NDA",
      description: "Basic mutual non-disclosure agreement suitable for most discussions",
      duration: "2 years"
    },
    {
      id: "strict",
      name: "Strict NDA", 
      description: "Enhanced protection with additional clauses for sensitive information",
      duration: "3 years"
    }
  ];

  const handleNext = () => {
    if (step === "select") {
      setStep("message");
    } else if (step === "message") {
      setStep("confirm");
    }
  };

  const handleSend = () => {
    toast({
      title: "NDA Request Sent",
      description: `NDA request sent to ${investorName}. They will review and respond within 48 hours.`
    });
    navigate("/matches");
  };

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="container-mobile px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setStep("message")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-semibold">Confirm NDA Request</h1>
              <div className="w-10" />
            </div>
          </div>
        </div>

        <div className="container-mobile px-4 py-6 space-y-6">
          <Card className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">NDA Request Summary</h2>
                <p className="text-sm text-muted-foreground">Review before sending</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipient:</label>
                <p className="text-muted-foreground">{investorName}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Template:</label>
                <p className="text-muted-foreground">
                  {templates.find(t => t.id === template)?.name}
                </p>
              </div>

              {message && (
                <div>
                  <label className="text-sm font-medium">Message:</label>
                  <p className="text-muted-foreground text-sm bg-muted p-3 rounded-lg">
                    {message}
                  </p>
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2">What happens next?</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• {investorName} will receive the NDA request via email</li>
                  <li>• They have 48 hours to review and respond</li>
                  <li>• Once signed, they can access your full project details</li>
                  <li>• You'll be notified when the NDA is executed</li>
                </ul>
              </div>
            </div>
          </Card>

          <Button onClick={handleSend} className="w-full" size="lg">
            <Send className="w-4 h-4 mr-2" />
            Send NDA Request
          </Button>
        </div>
      </div>
    );
  }

  if (step === "message") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="container-mobile px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setStep("select")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-semibold">Add Message</h1>
              <div className="w-10" />
            </div>
          </div>
        </div>

        <div className="container-mobile px-4 py-6 space-y-6">
          <Card className="card-elevated p-6">
            <h2 className="font-semibold text-lg mb-2">Personal Message</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Add a personal note to accompany your NDA request (optional)
            </p>

            <Textarea
              placeholder="Hi [Investor Name], I'd like to share more detailed information about my project with you. Please review and sign this NDA so we can discuss the opportunity further."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />

            <div className="text-xs text-muted-foreground mt-2">
              This message will be included with the NDA request email.
            </div>
          </Card>

          <Button onClick={handleNext} className="w-full" size="lg">
            Continue
          </Button>
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
            <h1 className="font-semibold">NDA Request</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="container-mobile px-4 py-6 space-y-6">
        <Card className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h2 className="font-semibold">Requesting NDA from {investorName}</h2>
              <p className="text-sm text-muted-foreground">Protect your confidential information</p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground">
              Once the NDA is signed, the investor will gain access to your complete project details, 
              including financials, technical specifications, and strategic plans.
            </p>
          </div>
        </Card>

        <div className="space-y-3">
          <h3 className="font-semibold">Choose NDA Template</h3>
          {templates.map((t) => (
            <Card 
              key={t.id}
              className={`p-4 cursor-pointer transition-all ${
                template === t.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setTemplate(t.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{t.name}</div>
                  <p className="text-sm text-muted-foreground mb-2">{t.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Duration: {t.duration}
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  template === t.id 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground'
                }`}>
                  {template === t.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={handleNext} className="w-full" size="lg">
          Continue with {templates.find(t => t.id === template)?.name}
        </Button>
      </div>
    </div>
  );
}
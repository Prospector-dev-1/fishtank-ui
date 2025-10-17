import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
const NDAgreement = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);
  const handleBack = () => {
    navigate(-1);
  };
  const handleAgree = () => {
    if (isAgreed) {
      navigate(`/startup/${id}`);
    }
  };
  const ndaText = `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on the date of your acceptance below by and between the startup company ("Company") and the investor ("Recipient").

1. CONFIDENTIAL INFORMATION
The Company may disclose certain confidential and proprietary information including but not limited to:
• Business plans, financial projections, and strategic plans
• Technical specifications, product roadmaps, and development plans
• Customer lists, market research, and competitive analysis
• Trade secrets, know-how, and proprietary processes

2. OBLIGATIONS OF RECIPIENT
Recipient agrees to:
• Hold all Confidential Information in strict confidence
• Use the information solely for evaluation purposes
• Not disclose any information to third parties without written consent
• Return or destroy all materials upon request

3. TERM
This Agreement shall remain in effect for a period of two (2) years from the date of acceptance.

4. REMEDIES
Recipient acknowledges that any breach may cause irreparable harm for which monetary damages would be inadequate.

5. GOVERNING LAW
This Agreement shall be governed by the laws of Delaware.

By clicking "I Agree" below, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement.
  `;
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-lg font-semibold">Non-Disclosure Agreement</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-safe-bottom">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Please Review and Accept the NDA to Proceed</CardTitle>
            <p className="text-muted-foreground text-center text-sm">
              This agreement protects confidential startup information
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {ndaText}
              </div>
            </ScrollArea>

            <div className="flex items-center space-x-2">
              <Checkbox id="agreement" checked={isAgreed} onCheckedChange={checked => setIsAgreed(checked === true)} />
              <label htmlFor="agreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I have read and agree to the terms of this Non-Disclosure Agreement
              </label>
            </div>

            <Button onClick={handleAgree} disabled={!isAgreed} className="w-full" size="lg">
              I Agree - View Startup Details
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default NDAgreement;
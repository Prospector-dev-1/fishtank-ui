import { useState } from "react";
import { DollarSign, TrendingUp, Clock, CreditCard, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { payouts, currentCreator } from "@/lib/creatorData";

export default function Earnings() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [showStripeModal, setShowStripeModal] = useState(false);

  const heldAmount = payouts
    .filter(p => p.status === 'held')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const pendingAmount = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const availableAmount = payouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'held': return 'secondary';
      case 'pending': return 'default';
      case 'paid': return 'success';
      default: return 'secondary';
    }
  };

  const mockAnalytics = {
    week: { revenue: 900, change: 15 },
    month: { revenue: 3600, change: 23 },
    year: { revenue: currentCreator.earnings, change: 45 }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">Track your income and payouts</p>
        </div>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">${heldAmount}</div>
            <div className="text-xs text-muted-foreground mt-1">Held</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">${pendingAmount}</div>
            <div className="text-xs text-muted-foreground mt-1">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">${availableAmount}</div>
            <div className="text-xs text-muted-foreground mt-1">Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <Card className="bg-gradient-primary text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Revenue This {selectedPeriod}</p>
              <p className="text-3xl font-bold">${mockAnalytics[selectedPeriod].revenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-white/80" />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-white/20">
              +{mockAnalytics[selectedPeriod].change}%
            </Badge>
            <span className="text-white/80 text-sm">vs last {selectedPeriod}</span>
          </div>
          
          <div className="flex gap-2 mt-4">
            {(['week', 'month', 'year'] as const).map((period) => (
              <Button
                key={period}
                size="sm"
                variant={selectedPeriod === period ? "secondary" : "ghost"}
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {period}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payout Setup */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payout Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Stripe Connect</p>
                <p className="text-xs text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button size="sm" onClick={() => setShowStripeModal(true)}>
              Setup
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Connect your Stripe account to receive automatic payouts
          </p>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-6">
          {payouts.map((payout) => (
            <Card key={payout.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">${payout.amount}</span>
                  </div>
                  <Badge variant={getStatusColor(payout.status) as any} className="text-xs">
                    {payout.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {payout.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{new Date(payout.createdAt).toLocaleDateString()}</span>
                  {payout.processedAt && (
                    <span>Paid: {new Date(payout.processedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-6">
          {payouts.filter(p => p.status === 'pending').map((payout) => (
            <Card key={payout.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-semibold">${payout.amount}</span>
                  </div>
                  <Badge variant="default" className="text-xs">
                    Processing
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {payout.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expected payout in 2-3 business days
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="paid" className="space-y-3 mt-6">
          {payouts.filter(p => p.status === 'paid').map((payout) => (
            <Card key={payout.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span className="font-semibold">${payout.amount}</span>
                  </div>
                  <Badge variant="success" className="text-xs">
                    Paid
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {payout.description}
                </p>
                <p className="text-xs text-success">
                  Paid on {payout.processedAt && new Date(payout.processedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Stripe Setup Modal */}
      {showStripeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Setup Payouts</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium mb-2">Stripe Connect</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Stripe account to receive automatic payouts for completed milestones.
                </p>
                <Button className="w-full">
                  Connect Stripe Account
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Automatic payouts for released milestones</p>
                <p>• Standard Stripe processing fees apply</p>
                <p>• Secure and encrypted transactions</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowStripeModal(false)}
              >
                Later
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowStripeModal(false);
                  // In real app, would redirect to Stripe Connect
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
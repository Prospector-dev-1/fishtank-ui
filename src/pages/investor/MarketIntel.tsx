import { useState } from 'react';
import { Button } from '@/components/investor/ui/button';
import { Card } from '@/components/investor/ui/card';
import { Badge } from '@/components/investor/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/investor/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  DollarSign,
  Activity,
  Building2,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from 'lucide-react';

interface MarketTrend {
  id: string;
  title: string;
  sector: string;
  type: 'opportunity' | 'risk' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  description: string;
  metrics: {
    dealVolume: string;
    avgValuation: string;
    trend: string;
  };
  actionable: boolean;
  timeframe: string;
}

interface SectorData {
  name: string;
  dealCount: number;
  totalFunding: string;
  avgValuation: string;
  quarterlyGrowth: number;
  hotness: number;
  topDeal: string;
}

const marketTrends: MarketTrend[] = [
  {
    id: '1',
    title: 'AI Healthcare Surge',
    sector: 'HealthTech',
    type: 'opportunity',
    impact: 'high',
    confidence: 94,
    description: 'AI-powered healthcare startups seeing unprecedented investor interest. 300% increase in deal volume, driven by FDA approvals and proven ROI.',
    metrics: {
      dealVolume: '47 deals',
      avgValuation: '$12.3M',
      trend: '+185%'
    },
    actionable: true,
    timeframe: 'Q4 2024'
  },
  {
    id: '2',
    title: 'Fintech Correction',
    sector: 'Fintech',
    type: 'risk',
    impact: 'medium',
    confidence: 87,
    description: 'Payment processors facing valuation pressure. Interest rates and regulatory scrutiny impacting growth multiples.',
    metrics: {
      dealVolume: '23 deals',
      avgValuation: '$8.1M',
      trend: '-32%'
    },
    actionable: true,
    timeframe: 'Q4 2024'
  },
  {
    id: '3',
    title: 'CleanTech Renaissance',
    sector: 'CleanTech',
    type: 'opportunity',
    impact: 'high',
    confidence: 91,
    description: 'Government incentives and corporate sustainability mandates driving massive investment in clean technology solutions.',
    metrics: {
      dealVolume: '34 deals',
      avgValuation: '$15.2M',
      trend: '+220%'
    },
    actionable: true,
    timeframe: 'Q4 2024'
  },
  {
    id: '4',
    title: 'B2B SaaS Maturation',
    sector: 'SaaS',
    type: 'neutral',
    impact: 'medium',
    confidence: 76,
    description: 'B2B SaaS market reaching maturity. Focus shifting to profitability and sustainable growth metrics.',
    metrics: {
      dealVolume: '156 deals',
      avgValuation: '$9.7M',
      trend: '+8%'
    },
    actionable: false,
    timeframe: 'Q4 2024'
  }
];

const sectorData: SectorData[] = [
  {
    name: 'AI/ML',
    dealCount: 89,
    totalFunding: '$1.2B',
    avgValuation: '$13.5M',
    quarterlyGrowth: 145,
    hotness: 95,
    topDeal: 'VitalAI - $5M Series A'
  },
  {
    name: 'HealthTech',
    dealCount: 67,
    totalFunding: '$890M',
    avgValuation: '$13.3M',
    quarterlyGrowth: 78,
    hotness: 88,
    topDeal: 'MedFlow - $12M Series B'
  },
  {
    name: 'CleanTech',
    dealCount: 45,
    totalFunding: '$750M',
    avgValuation: '$16.7M',
    quarterlyGrowth: 156,
    hotness: 91,
    topDeal: 'SolarGrid - $25M Series A'
  },
  {
    name: 'Fintech',
    dealCount: 34,
    totalFunding: '$420M',
    avgValuation: '$12.4M',
    quarterlyGrowth: -23,
    hotness: 45,
    topDeal: 'PayFlow - $8M Seed'
  },
  {
    name: 'EdTech',
    dealCount: 28,
    totalFunding: '$285M',
    avgValuation: '$10.2M',
    quarterlyGrowth: 34,
    hotness: 67,
    topDeal: 'LearnAI - $6M Series A'
  }
];

export default function MarketIntel() {
  const [activeTab, setActiveTab] = useState('trends');

  const getTrendIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-5 h-5 text-green-600" />;
      case 'risk': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'neutral': return <Activity className="w-5 h-5 text-blue-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendBorder = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-l-green-500';
      case 'risk': return 'border-l-red-500';
      case 'neutral': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  const getHotnessColor = (hotness: number) => {
    if (hotness >= 90) return 'bg-red-500';
    if (hotness >= 80) return 'bg-orange-500';
    if (hotness >= 70) return 'bg-yellow-500';
    if (hotness >= 60) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const TrendCard = ({ trend }: { trend: MarketTrend }) => (
    <Card className={`p-4 border-l-4 ${getTrendBorder(trend.type)} hover:shadow-lg transition-all`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {getTrendIcon(trend.type)}
              <h3 className="text-lg font-semibold truncate">{trend.title}</h3>
              <Badge variant="outline" className="text-xs shrink-0">
                {trend.confidence}%
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">{trend.sector}</Badge>
              <Badge variant="outline" className="text-xs">{trend.impact}</Badge>
              <Badge variant="outline" className="text-xs">{trend.timeframe}</Badge>
            </div>
          </div>
          {trend.actionable && (
            <Button size="sm" className="shrink-0">
              Act
            </Button>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">{trend.description}</p>

        <div className="grid grid-cols-3 gap-2 bg-muted/30 p-3 rounded-lg">
          <div className="text-center">
            <div className="text-base font-bold text-primary">{trend.metrics.dealVolume}</div>
            <div className="text-xs text-muted-foreground">Volume</div>
          </div>
          <div className="text-center">
            <div className="text-base font-bold text-primary">{trend.metrics.avgValuation}</div>
            <div className="text-xs text-muted-foreground">Avg Val</div>
          </div>
          <div className="text-center">
            <div className={`text-base font-bold ${trend.metrics.trend.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
              {trend.metrics.trend}
            </div>
            <div className="text-xs text-muted-foreground">Change</div>
          </div>
        </div>
      </div>
    </Card>
  );

  const SectorCard = ({ sector }: { sector: SectorData }) => (
    <Card className="p-4 hover:shadow-lg transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold truncate">{sector.name}</h3>
            <p className="text-xs text-muted-foreground">{sector.dealCount} deals</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-base font-bold text-primary">{sector.totalFunding}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-muted-foreground">Avg Val</div>
            <div className="text-sm font-semibold">{sector.avgValuation}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Growth</div>
            <div className={`text-sm font-semibold flex items-center gap-1 ${
              sector.quarterlyGrowth > 0 ? 'text-success' : 'text-destructive'
            }`}>
              {sector.quarterlyGrowth > 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(sector.quarterlyGrowth)}%
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Sector Hotness</span>
            <span className="font-medium">{sector.hotness}°</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getHotnessColor(sector.hotness)}`}
              style={{ width: `${sector.hotness}%` }}
            />
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Top Deal</div>
          <div className="font-medium">{sector.topDeal}</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
            <p className="text-muted-foreground">Real-time market trends and sector analysis</p>
          </div>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-primary">342</div>
            <div className="text-sm text-muted-foreground">Total Deals Q4</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-success">$8.2B</div>
            <div className="text-sm text-muted-foreground">Total Funding</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-warning">$12.3M</div>
            <div className="text-sm text-muted-foreground">Avg Valuation</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">+45%</div>
            <div className="text-sm text-muted-foreground">QoQ Growth</div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="trends" className="text-xs sm:text-sm px-2 sm:px-4">Trends</TabsTrigger>
            <TabsTrigger value="sectors" className="text-xs sm:text-sm px-2 sm:px-4">Sectors</TabsTrigger>
            <TabsTrigger value="opportunities" className="text-xs sm:text-sm px-2 sm:px-4">Opportunities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            {marketTrends.map(trend => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </TabsContent>

          <TabsContent value="sectors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectorData.map(sector => (
                <SectorCard key={sector.name} sector={sector} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <div className="space-y-4">
              {marketTrends.filter(trend => trend.type === 'opportunity' && trend.actionable).map(trend => (
                <Card key={trend.id} className="p-6 border-l-4 border-l-green-500">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-green-700">{trend.title}</h3>
                        <p className="text-green-600">{trend.sector} • {trend.confidence}% confidence</p>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Target className="w-4 h-4 mr-2" />
                        Explore Deals
                      </Button>
                    </div>
                    <p className="text-muted-foreground">{trend.description}</p>
                    <div className="grid grid-cols-3 gap-4 bg-green-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-700">{trend.metrics.dealVolume}</div>
                        <div className="text-xs text-green-600">Active Deals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-700">{trend.metrics.avgValuation}</div>
                        <div className="text-xs text-green-600">Target Valuation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-700">{trend.metrics.trend}</div>
                        <div className="text-xs text-green-600">Market Growth</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
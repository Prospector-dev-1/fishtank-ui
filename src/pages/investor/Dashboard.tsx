import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/investor/ui/button";
import { Card } from "@/components/investor/ui/card";
import { Badge } from "@/components/investor/ui/badge";
import { TrendingUp, AlertCircle, Clock, DollarSign, Users, Target, Calendar, FileText, ExternalLink, ChevronRight, BarChart3, TrendingDown, AlertTriangle, Activity, Building2, ArrowUpRight, ArrowDownRight, Zap, ArrowRight, Play, Eye, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/investor/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/investor/ui/carousel";
import { mockStartups } from "@/data/investor/mockData";
interface Deal {
  id: string;
  company: string;
  stage: string;
  valuation: string;
  askAmount: string;
  sector: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "review" | "diligence" | "decision" | "pending";
  founder: string;
  lastUpdate: string;
}
interface MarketTrend {
  id: string;
  title: string;
  sector: string;
  type: "opportunity" | "risk" | "neutral";
  impact: "high" | "medium" | "low";
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
const urgentDeals: Deal[] = [{
  id: "1",
  company: "QuantumLedger",
  stage: "Series A",
  valuation: "$25M",
  askAmount: "$2M",
  sector: "Fintech",
  dueDate: "2025-01-02",
  priority: "high",
  status: "decision",
  founder: "Sofia Chen",
  lastUpdate: "2h ago"
}, {
  id: "2",
  company: "VitalAI",
  stage: "Seed",
  valuation: "$8M",
  askAmount: "$500K",
  sector: "HealthTech",
  dueDate: "2025-01-05",
  priority: "high",
  status: "diligence",
  founder: "Dr. Rachel Kim",
  lastUpdate: "4h ago"
}];
const pipelineDeals: Deal[] = [{
  id: "3",
  company: "GreenMile",
  stage: "Pre-Seed",
  valuation: "$3M",
  askAmount: "$100K",
  sector: "CleanTech",
  dueDate: "2025-01-15",
  priority: "medium",
  status: "review",
  founder: "Alex Thompson",
  lastUpdate: "1d ago"
}, {
  id: "4",
  company: "CodeMentor",
  stage: "Pre-Seed",
  valuation: "$5M",
  askAmount: "$250K",
  sector: "EdTech",
  dueDate: "2025-01-20",
  priority: "medium",
  status: "pending",
  founder: "Priya Patel",
  lastUpdate: "2d ago"
}];
const marketTrends: MarketTrend[] = [{
  id: "1",
  title: "AI Healthcare Surge",
  sector: "HealthTech",
  type: "opportunity",
  impact: "high",
  confidence: 94,
  description: "AI-powered healthcare startups seeing unprecedented investor interest. 300% increase in deal volume, driven by FDA approvals and proven ROI.",
  metrics: {
    dealVolume: "47 deals",
    avgValuation: "$12.3M",
    trend: "+185%"
  },
  actionable: true,
  timeframe: "Q4 2024"
}, {
  id: "2",
  title: "Fintech Correction",
  sector: "Fintech",
  type: "risk",
  impact: "medium",
  confidence: 87,
  description: "Payment processors facing valuation pressure. Interest rates and regulatory scrutiny impacting growth multiples.",
  metrics: {
    dealVolume: "23 deals",
    avgValuation: "$8.1M",
    trend: "-32%"
  },
  actionable: true,
  timeframe: "Q4 2024"
}, {
  id: "3",
  title: "CleanTech Renaissance",
  sector: "CleanTech",
  type: "opportunity",
  impact: "high",
  confidence: 91,
  description: "Government incentives and corporate sustainability mandates driving massive investment in clean technology solutions.",
  metrics: {
    dealVolume: "34 deals",
    avgValuation: "$15.2M",
    trend: "+220%"
  },
  actionable: true,
  timeframe: "Q4 2024"
}, {
  id: "4",
  title: "B2B SaaS Maturation",
  sector: "SaaS",
  type: "neutral",
  impact: "medium",
  confidence: 76,
  description: "B2B SaaS market reaching maturity. Focus shifting to profitability and sustainable growth metrics.",
  metrics: {
    dealVolume: "156 deals",
    avgValuation: "$9.7M",
    trend: "+8%"
  },
  actionable: false,
  timeframe: "Q4 2024"
}];
const sectorData: SectorData[] = [{
  name: "AI/ML",
  dealCount: 89,
  totalFunding: "$1.2B",
  avgValuation: "$13.5M",
  quarterlyGrowth: 145,
  hotness: 95,
  topDeal: "VitalAI - $5M Series A"
}, {
  name: "HealthTech",
  dealCount: 67,
  totalFunding: "$890M",
  avgValuation: "$13.3M",
  quarterlyGrowth: 78,
  hotness: 88,
  topDeal: "MedFlow - $12M Series B"
}, {
  name: "CleanTech",
  dealCount: 45,
  totalFunding: "$750M",
  avgValuation: "$16.7M",
  quarterlyGrowth: 156,
  hotness: 91,
  topDeal: "SolarGrid - $25M Series A"
}, {
  name: "Fintech",
  dealCount: 34,
  totalFunding: "$420M",
  avgValuation: "$12.4M",
  quarterlyGrowth: -23,
  hotness: 45,
  topDeal: "PayFlow - $8M Seed"
}, {
  name: "EdTech",
  dealCount: 28,
  totalFunding: "$285M",
  avgValuation: "$10.2M",
  quarterlyGrowth: 34,
  hotness: 67,
  topDeal: "LearnAI - $6M Series A"
}];
const portfolioMetrics = {
  totalInvested: "$4.2M",
  activeDeals: 7,
  pipelineValue: "$12.8M",
  unreadMessages: 3,
  avgTicketSize: "$600K",
  sectors: ["Fintech", "HealthTech", "CleanTech", "EdTech"],
  quarterlyReturn: "+18.5%"
};

// Top 5 pitches of the day based on interest and views
const top5Pitches = mockStartups.map(startup => ({
  ...startup,
  score: startup.metrics.interest + startup.metrics.views * 0.5
})).sort((a, b) => b.score - a.score).slice(0, 5);
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"urgent" | "pipeline">("urgent");
  const [marketTab, setMarketTab] = useState<"trends" | "sectors" | "opportunities">("trends");
  const [isButtonSticky, setIsButtonSticky] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "decision":
        return "bg-destructive text-destructive-foreground";
      case "diligence":
        return "bg-warning text-warning-foreground";
      case "review":
        return "bg-primary text-primary-foreground";
      case "pending":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-destructive bg-destructive/5";
      case "medium":
        return "border-l-warning bg-warning/5";
      case "low":
        return "border-l-muted bg-muted/5";
      default:
        return "border-l-muted bg-muted/5";
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (buttonRef.current && tabsRef.current) {
        const buttonTop = buttonRef.current.offsetTop;
        const tabsTop = tabsRef.current.offsetTop;
        const scrollY = window.scrollY;
        if (scrollY > tabsTop) {
          setIsTabsSticky(true);
          setIsButtonSticky(false);
        } else if (scrollY > buttonTop) {
          setIsButtonSticky(true);
          setIsTabsSticky(false);
        } else {
          setIsButtonSticky(false);
          setIsTabsSticky(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const getTrendIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Target className="w-5 h-5 text-green-600" />;
      case "risk":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "neutral":
        return <Activity className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };
  const getTrendBorder = (type: string) => {
    switch (type) {
      case "opportunity":
        return "border-l-green-500";
      case "risk":
        return "border-l-red-500";
      case "neutral":
        return "border-l-blue-500";
      default:
        return "border-l-gray-500";
    }
  };
  const getHotnessColor = (hotness: number) => {
    if (hotness >= 90) return "bg-red-500";
    if (hotness >= 80) return "bg-orange-500";
    if (hotness >= 70) return "bg-yellow-500";
    if (hotness >= 60) return "bg-blue-500";
    return "bg-gray-500";
  };
  const DealCard = ({
    deal,
    isUrgent = false
  }: {
    deal: Deal;
    isUrgent?: boolean;
  }) => <Card className={`p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(deal.priority)}`} onClick={() => navigate(`/investor/startup/${deal.id}`)}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate">{deal.company}</h3>
            <p className="text-sm text-muted-foreground truncate">{deal.founder}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {deal.stage}
              </Badge>
              <Badge className={getStatusColor(deal.status)} variant="outline">
                {deal.status}
              </Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-medium">{deal.askAmount}</div>
            <div className="text-xs text-muted-foreground">{deal.sector}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Due {new Date(deal.dueDate).toLocaleDateString()}</span>
          {isUrgent && <div className="flex items-center gap-1 text-destructive text-xs">
              <AlertCircle className="w-3 h-3" />
              Urgent
            </div>}
        </div>
      </div>
    </Card>;
  const TrendCard = ({
    trend
  }: {
    trend: MarketTrend;
  }) => {
    return <Card className={`p-4 border-l-4 ${getTrendBorder(trend.type)} hover:shadow-lg transition-all`}>
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
                <Badge variant="outline" className="text-xs">
                  {trend.sector}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {trend.impact}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {trend.timeframe}
                </Badge>
              </div>
            </div>
            {trend.actionable && <Button size="sm" className="shrink-0">
                Act
              </Button>}
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
              <div className={`text-base font-bold ${trend.metrics.trend.startsWith("+") ? "text-success" : "text-destructive"}`}>
                {trend.metrics.trend}
              </div>
              <div className="text-xs text-muted-foreground">Change</div>
            </div>
          </div>
        </div>
      </Card>;
  };
  const SectorCard = ({
    sector
  }: {
    sector: SectorData;
  }) => <Card className="p-4 hover:shadow-lg transition-all">
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
            <div className={`text-sm font-semibold flex items-center gap-1 ${sector.quarterlyGrowth > 0 ? "text-success" : "text-destructive"}`}>
              {sector.quarterlyGrowth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
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
            <div className={`h-2 rounded-full ${getHotnessColor(sector.hotness)}`} style={{
            width: `${sector.hotness}%`
          }} />
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Top Deal</div>
          <div className="font-medium">{sector.topDeal}</div>
        </div>
      </div>
    </Card>;
  return <div className="min-h-screen bg-background pb-20">
      {/* Sticky Headers */}
      {isButtonSticky && !isTabsSticky && <div className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border p-4">
          <div className="flex justify-center">
            <Button onClick={() => navigate("/investor/discover")} className="w-full max-w-sm h-12 text-base font-semibold">
              Enter Tank
            </Button>
          </div>
        </div>}

      {isTabsSticky && <div className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border p-4">
          <div className="flex justify-center">
            <Tabs value={marketTab} onValueChange={value => setMarketTab(value as "trends" | "sectors" | "opportunities")}>
              <TabsList className="grid w-full grid-cols-3 h-12 max-w-sm">
                <TabsTrigger value="trends" className="text-xs sm:text-sm px-2 sm:px-4">
                  Trends
                </TabsTrigger>
                <TabsTrigger value="sectors" className="text-xs sm:text-sm px-2 sm:px-4">
                  Sectors
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="text-xs sm:text-sm px-2 sm:px-4">
                  Opportunities
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>}

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Discover Your Next Investment</h1>
            <p className="text-muted-foreground text-sm md:text-base">Explore top pitches and emerging opportunities</p>
          </div>
          
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-primary">{portfolioMetrics.activeDeals}</div>
            <div className="text-sm text-muted-foreground">Innovators contacted</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-success">{portfolioMetrics.unreadMessages}</div>
            <div className="text-sm text-muted-foreground">Unread messages</div>
          </Card>
        </div>

        {/* Top 5 of the Day */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                Top 5 of the Day
              </h2>
              <p className="text-muted-foreground text-sm">Most engaging pitches today</p>
            </div>
          </div>

          <Carousel opts={{
          align: "start",
          loop: true
        }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {top5Pitches.map((pitch, index) => <CarouselItem key={pitch.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group" onClick={() => navigate(`/investor/startup/${pitch.id}`)}>
                    <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <img src={pitch.poster} alt={pitch.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </div>
                      <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />#{index + 1}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg truncate">{pitch.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{pitch.tagline}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {pitch.stage}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {pitch.sector}
                        </Badge>
                      </div>
                      
                    </div>
                  </Card>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        </div>

        {/* Industry Categories Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What would you like to see</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Software Card */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Software</h3>
              <ul className="space-y-2 mb-6 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>B2B SaaS platforms</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>AI automation tools</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Enterprise workflow systems</span>
                </li>
              </ul>
              <Button variant="ghost" className="group p-0 h-auto font-semibold" onClick={() => navigate("/investor/discover")}>
                View
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Hardware Card */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Hardware</h3>
              <ul className="space-y-2 mb-6 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Robotics and IoT devices</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Wearables and sensors</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Smart manufacturing tech</span>
                </li>
              </ul>
              <Button variant="ghost" className="group p-0 h-auto font-semibold" onClick={() => navigate("/investor/discover")}>
                View
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Biotech Card */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Biotech</h3>
              <ul className="space-y-2 mb-6 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Genetic engineering</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Medical diagnostics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Bio-based materials</span>
                </li>
              </ul>
              <Button variant="ghost" className="group p-0 h-auto font-semibold" onClick={() => navigate("/investor/discover")}>
                View
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Consumer Goods Card */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Consumer Goods</h3>
              <ul className="space-y-2 mb-6 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Lifestyle and retail products</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Food and beverage innovation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Smart home essentials</span>
                </li>
              </ul>
              <Button variant="ghost" className="group p-0 h-auto font-semibold" onClick={() => navigate("/investor/discover")}>
                View
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Fintech Card */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Fintech</h3>
              <ul className="space-y-2 mb-6 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Blockchain solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Digital payments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Investment platforms</span>
                </li>
              </ul>
              <Button variant="ghost" className="group p-0 h-auto font-semibold" onClick={() => navigate("/investor/discover")}>
                View
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>

            {/* Climate Card */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Climate</h3>
              <ul className="space-y-2 mb-6 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Renewable energy tech</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Carbon capture solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Sustainable materials</span>
                </li>
              </ul>
              <Button variant="ghost" className="group p-0 h-auto font-semibold" onClick={() => navigate("/investor/discover")}>
                View
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}
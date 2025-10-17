import { useState } from 'react';
import { Button } from '@/components/investor/ui/button';
import { Card } from '@/components/investor/ui/card';
import { Badge } from '@/components/investor/ui/badge';
import { Input } from '@/components/investor/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/investor/ui/select';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Building2,
  Clock,
  Eye,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Deal {
  id: string;
  company: string;
  founder: string;
  stage: string;
  sector: string;
  valuation: string;
  askAmount: string;
  description: string;
  nextMilestone: string;
  lastContact: string;
  status: 'new' | 'reviewing' | 'diligence' | 'negotiating' | 'passed';
  priority: 'high' | 'medium' | 'low';
  matchScore: number;
  location: string;
  teamSize: number;
  revenue: string;
  growth: string;
}

const mockDeals: Deal[] = [
  {
    id: '1',
    company: 'QuantumLedger',
    founder: 'Sofia Chen',
    stage: 'Series A',
    sector: 'Fintech',
    valuation: '$25M',
    askAmount: '$2M',
    description: 'AI-powered treasury management for SMBs',
    nextMilestone: 'Close Series A by Q1 2025',
    lastContact: '2h ago',
    status: 'negotiating',
    priority: 'high',
    matchScore: 95,
    location: 'San Francisco, CA',
    teamSize: 12,
    revenue: '$180K ARR',
    growth: '+300% YoY'
  },
  {
    id: '2',
    company: 'VitalAI',
    founder: 'Dr. Rachel Kim',
    stage: 'Seed',
    sector: 'HealthTech',
    valuation: '$8M',
    askAmount: '$500K',
    description: 'AI-powered remote patient monitoring',
    nextMilestone: 'FDA approval Q2 2025',
    lastContact: '4h ago',
    status: 'diligence',
    priority: 'high',
    matchScore: 89,
    location: 'Boston, MA',
    teamSize: 8,
    revenue: '$45K ARR',
    growth: '+250% YoY'
  },
  {
    id: '3',
    company: 'GreenMile',
    founder: 'Alex Thompson',
    stage: 'Pre-Seed',
    sector: 'CleanTech',
    valuation: '$3M',
    askAmount: '$100K',
    description: 'Carbon-neutral last-mile delivery',
    nextMilestone: 'Launch in 5 cities',
    lastContact: '1d ago',
    status: 'reviewing',
    priority: 'medium',
    matchScore: 76,
    location: 'Austin, TX',
    teamSize: 5,
    revenue: '$12K MRR',
    growth: '+180% YoY'
  },
  {
    id: '4',
    company: 'CodeMentor',
    founder: 'Priya Patel',
    stage: 'Pre-Seed',
    sector: 'EdTech',
    valuation: '$5M',
    askAmount: '$250K',
    description: 'AI tutoring for programming education',
    nextMilestone: '1K paid users',
    lastContact: '2d ago',
    status: 'new',
    priority: 'medium',
    matchScore: 82,
    location: 'Seattle, WA',
    teamSize: 3,
    revenue: '$8K MRR',
    growth: '+220% YoY'
  }
];

export default function DealFlow() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [sortBy, setSortBy] = useState('matchScore');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'reviewing': return 'bg-yellow-500 text-white';
      case 'diligence': return 'bg-orange-500 text-white';
      case 'negotiating': return 'bg-green-500 text-white';
      case 'passed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.founder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || deal.stage === filterStage;
    const matchesSector = filterSector === 'all' || deal.sector === filterSector;
    
    return matchesSearch && matchesStage && matchesSector;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'matchScore': return b.matchScore - a.matchScore;
      case 'valuation': return parseInt(b.valuation.replace(/[^0-9]/g, '')) - parseInt(a.valuation.replace(/[^0-9]/g, ''));
      case 'recent': return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      default: return 0;
    }
  });

  const DealCard = ({ deal }: { deal: Deal }) => (
    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary"
          onClick={() => navigate(`/investor/startup/${deal.id}`)}>
      <div className="space-y-3">
        {/* Header - Simplified */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold truncate mb-1">{deal.company}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {deal.founder} • {deal.sector}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{deal.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-semibold text-primary">{deal.askAmount}</div>
            <div className="text-xs text-muted-foreground">{deal.stage}</div>
          </div>
        </div>

        {/* Status & Match - Simplified */}
        <div className="flex items-center gap-2">
          <Badge className={getMatchScoreColor(deal.matchScore)} variant="outline">
            {deal.matchScore}%
          </Badge>
          <Badge className={getStatusColor(deal.status)}>
            {deal.status}
          </Badge>
        </div>

        {/* Key Metrics - Simplified */}
        <div className="grid grid-cols-2 gap-3 text-sm bg-muted/30 p-3 rounded-lg">
          <div>
            <div className="text-muted-foreground text-xs">Revenue</div>
            <div className="font-medium">{deal.revenue}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Growth</div>
            <div className="font-medium text-success">{deal.growth}</div>
          </div>
        </div>

        {/* Actions - Simplified */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">{deal.lastContact}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              View Details
            </Button>
            <Button size="sm">
              Advance
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Deal Flow</h1>
            <p className="text-muted-foreground text-sm md:text-base">Source, review, and manage investment opportunities</p>
          </div>
          <Button onClick={() => navigate('/investor/discover')} className="shrink-0">
            <Building2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Enter Tank</span>
            <span className="sm:hidden">Tank</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search companies, founders, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                    <SelectItem value="Seed">Seed</SelectItem>
                    <SelectItem value="Series A">Series A</SelectItem>
                    <SelectItem value="Series B">Series B</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterSector} onValueChange={setFilterSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                    <SelectItem value="HealthTech">HealthTech</SelectItem>
                    <SelectItem value="CleanTech">CleanTech</SelectItem>
                    <SelectItem value="EdTech">EdTech</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matchScore">Match Score</SelectItem>
                    <SelectItem value="valuation">Valuation</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredDeals.length} deals found
          </div>
          <Button variant="outline" size="sm">
            <SortAsc className="w-4 h-4 mr-2" />
            Sort & Filter
          </Button>
        </div>

        {/* Deal Cards */}
        <div className="space-y-4">
          {filteredDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          
          {filteredDeals.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground mb-4">No deals match your current filters</div>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilterStage('all');
                setFilterSector('all');
              }}>
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
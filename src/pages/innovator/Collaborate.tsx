import { useState, useEffect } from "react";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/innovator/ui/card";
import { Button } from "@/components/innovator/ui/button";
import { Badge } from "@/components/innovator/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/innovator/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/innovator/ui/select";
import { Input } from "@/components/innovator/ui/input";
import { CreateOpportunityModal } from "@/components/innovator/modals/CreateOpportunityModal";
import { Storage, STORAGE_KEYS } from "@/lib/innovator/storage";
import { Briefcase, MapPin, Clock, DollarSign, Users, Plus, Eye, Edit, X, Filter, Search, BarChart3, TrendingUp, MessageSquare, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/innovator/ui/command";
import { toast } from "sonner";
import type { Opportunity } from "@/types";
export default function Collaborate() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sortBy2, setSortBy2] = useState<string>('relevance');
  const [minRate, setMinRate] = useState<string>('');
  const [maxRate, setMaxRate] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCompensation, setSelectedCompensation] = useState<string[]>([]);
  const [skillsExpansionLevel, setSkillsExpansionLevel] = useState(0); // 0=initial, 1=first expansion, 2=second expansion, 3=all with search
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    loadData();
  }, []);

  // Mock opportunities for dashboard demonstration
  const mockOpportunities: Opportunity[] = [{
    id: 'mock-1',
    ownerId: 'current-user',
    role: 'Frontend Developer',
    description: 'Looking for a talented React developer to help build our SaaS dashboard. We need someone who can create beautiful, responsive interfaces and has experience with modern React patterns including hooks and context.',
    deliverables: ['Dashboard UI components', 'Responsive layouts', 'User authentication flow'],
    commitment: {
      hoursPerWeek: 20,
      durationWeeks: 8,
      startDate: '2024-02-15'
    },
    compensation: {
      type: 'paid',
      range: '$50-70/hour'
    },
    location: 'remote',
    tags: ['React', 'JavaScript', 'CSS', 'UI/UX'],
    status: 'open',
    createdAt: '2024-01-15T10:00:00Z'
  }, {
    id: 'mock-2',
    ownerId: 'current-user',
    role: 'Marketing Specialist',
    description: 'Seeking a digital marketing expert to launch our fintech product. Need someone with experience in growth marketing, content strategy, and social media campaigns.',
    deliverables: ['Marketing strategy', 'Content calendar', 'Campaign execution'],
    commitment: {
      hoursPerWeek: 15,
      durationWeeks: 12,
      startDate: '2024-02-01'
    },
    compensation: {
      type: 'equity',
      range: '0.5-1.0% equity'
    },
    location: 'remote',
    tags: ['Marketing', 'Content', 'Social Media', 'Growth'],
    status: 'open',
    createdAt: '2024-01-20T14:30:00Z'
  }];
  const loadData = async () => {
    const storedOpps = (await Storage.getItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES)) || [];
    // Merge mock opportunities with stored ones, avoiding duplicates
    const existingIds = storedOpps.map(opp => opp.id);
    const newMockOpps = mockOpportunities.filter(opp => !existingIds.includes(opp.id));
    setOpportunities([...storedOpps, ...newMockOpps]);
  };
  const handleCreateSuccess = () => {
    loadData();
  };
  const handleCloseOpportunity = async (opportunityId: string) => {
    try {
      const updated = opportunities.map(opp => opp.id === opportunityId ? {
        ...opp,
        status: 'closed' as const
      } : opp);
      setOpportunities(updated);
      await Storage.setItem(STORAGE_KEYS.OPPORTUNITIES, updated);
      toast.success("Opportunity closed");
    } catch (error) {
      toast.error("Failed to close opportunity");
    }
  };
  const mockCreatorProfiles = [{
    id: '1',
    name: 'Emma Thompson',
    avatar: 'ET',
    skills: ['React', 'Node.js', 'UI/UX'],
    portfolio: ['Portfolio Link 1', 'Portfolio Link 2'],
    availability: 'Available',
    rates: '$45-65/hour',
    location: 'Toronto, ON'
  }, {
    id: '2',
    name: 'James Rodriguez',
    avatar: 'JR',
    skills: ['Marketing', 'Content', 'SEO'],
    portfolio: ['Marketing Case Study', 'Growth Report'],
    availability: 'Part-time',
    rates: '$35-50/hour',
    location: 'Vancouver, BC'
  }];

  // Mock metrics for opportunities
  const getMockMetrics = (oppId: string) => {
    const metrics = {
      'mock-1': {
        views: 24,
        applications: 8
      },
      'mock-2': {
        views: 18,
        applications: 5
      },
      'mock-3': {
        views: 42,
        applications: 12
      },
      'mock-4': {
        views: 31,
        applications: 9
      },
      'mock-5': {
        views: 15,
        applications: 3
      },
      'mock-6': {
        views: 28,
        applications: 7
      },
      'mock-7': {
        views: 35,
        applications: 15
      }
    };
    return metrics[oppId as keyof typeof metrics] || {
      views: 0,
      applications: 0
    };
  };
  const myOpportunities = opportunities.filter(opp => opp.ownerId === 'current-user');

  // Filter and sort opportunities
  const filteredOpportunities = myOpportunities.filter(opp => filterStatus === 'all' || opp.status === filterStatus);
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  // Dashboard metrics
  const metrics = {
    totalPosts: myOpportunities.length,
    activePosts: myOpportunities.filter(opp => opp.status === 'open').length,
    closedPosts: myOpportunities.filter(opp => opp.status === 'closed').length,
    totalApplications: myOpportunities.reduce((sum, opp) => sum + getMockMetrics(opp.id).applications, 0)
  };

  // All available skills and compensation types
  const allSkills = ['React', 'Node.js', 'UI/UX', 'Figma', 'Marketing', 'Content', 'SEO', 'Product Design', 'Design Systems', 'Flutter', 'React Native', 'Mobile Development', 'Growth Marketing', 'Analytics', 'A/B Testing', 'DevOps', 'AWS', 'Docker', 'Video Production', 'Motion Graphics', 'Branding', 'Python', 'Data Science', 'Machine Learning', 'Copywriting', 'Content Strategy', 'Translation', 'Business Strategy', 'Operations', 'Financial Modeling', 'iOS Development', 'Swift', 'SwiftUI', 'Full-Stack Development', 'GraphQL', 'PostgreSQL'];
  const compensationTypes = ['Hourly', 'Equity', 'Commission', 'Fixed'];

  // Filter creators based on search and filters
  const filteredCreators = mockCreatorProfiles.filter(creator => {
    // Text search
    const matchesSearch = !searchTerm || creator.name.toLowerCase().includes(searchTerm.toLowerCase()) || creator.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) || creator.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Skills filter
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some(skill => creator.skills.includes(skill));

    // Rate filter (simplified - just checking if creator has rates)
    const rateMatch = creator.rates.match(/\$(\d+)-(\d+)/);
    let matchesRate = true;
    if (rateMatch && (minRate || maxRate)) {
      const creatorMinRate = parseInt(rateMatch[1]);
      const creatorMaxRate = parseInt(rateMatch[2]);
      if (minRate && creatorMaxRate < parseInt(minRate)) matchesRate = false;
      if (maxRate && creatorMinRate > parseInt(maxRate)) matchesRate = false;
    }
    return matchesSearch && matchesSkills && matchesRate;
  });
  return <div className="min-h-screen bg-background">
      <FishtankHeader title="Collaborate" showLogo={false} onSearch={setSearchTerm} searchPlaceholder="Search creators, skills, opportunities..." />
      
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Find Talent for Your Innovation</h1>
          <p className="text-muted-foreground">Post opportunities to connect with skilled creators and grow your team</p>
        </div>

        {/* Post Opportunity Button */}
        <div className="flex justify-center mb-6">
          <Button onClick={() => setShowCreateModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Post New Gig Listing
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Listings</TabsTrigger>
            <TabsTrigger value="creators">Discover</TabsTrigger>
          </TabsList>

          {/* Enhanced search and filters - only visible on Discover Creators tab */}
          {activeTab === 'creators' && <div className="mt-4 mb-6 space-y-4">
              {/* Search bar with filter icon */}
              <div className="relative max-w-md mx-auto flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search creators or skills..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Filter controls - collapsible */}
              {showFilters && <div className="space-y-4">
                <div className="flex gap-4 justify-center">
                  {/* Sort dropdown */}
                  <Select value={sortBy2} onValueChange={setSortBy2}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rate-low">Rate: Low to High</SelectItem>
                      <SelectItem value="rate-high">Rate: High to Low</SelectItem>
                      <SelectItem value="availability">Availability</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Rate range */}
                  <div className="flex gap-2 items-center">
                    <Input placeholder="Min rate" value={minRate} onChange={e => setMinRate(e.target.value)} className="w-24" type="number" />
                    <span className="text-muted-foreground">-</span>
                    <Input placeholder="Max rate" value={maxRate} onChange={e => setMaxRate(e.target.value)} className="w-24" type="number" />
                  </div>
                </div>

                {/* Skills filter */}
                <div className="max-w-4xl mx-auto">
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  
                  {skillsExpansionLevel < 3 ? <div className="flex flex-wrap gap-2">
                      {(() => {
                  const getVisibleCount = () => {
                    if (skillsExpansionLevel === 0) return 2;
                    if (skillsExpansionLevel === 1) return 5;
                    if (skillsExpansionLevel === 2) return 8;
                    return allSkills.length;
                  };
                  const visibleSkills = allSkills.slice(0, getVisibleCount());
                  return <>
                          {visibleSkills.map(skill => <Badge key={skill} variant={selectedSkills.includes(skill) ? "default" : "outline"} className="cursor-pointer hover:bg-primary/20" onClick={() => {
                      setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
                    }}>
                              {skill}
                            </Badge>)}
                          
                          {skillsExpansionLevel < 2 && <Badge variant="outline" className="cursor-pointer hover:bg-muted text-muted-foreground" onClick={() => setSkillsExpansionLevel(prev => prev + 1)}>
                              See more <ChevronDown className="w-3 h-3 ml-1" />
                            </Badge>}
                          
                          {skillsExpansionLevel === 2 && <Badge variant="outline" className="cursor-pointer hover:bg-muted text-muted-foreground" onClick={() => {
                      setSkillsExpansionLevel(3);
                      setSkillSearchTerm('');
                    }}>
                              Search all <Search className="w-3 h-3 ml-1" />
                            </Badge>}
                        </>;
                })()}
                    </div> : <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Command className="max-w-sm">
                          <CommandInput placeholder="Search skills..." value={skillSearchTerm} onValueChange={setSkillSearchTerm} className="h-8" />
                        </Command>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted text-muted-foreground" onClick={() => {
                    setSkillsExpansionLevel(0);
                    setSkillSearchTerm('');
                  }}>
                          <ChevronUp className="w-3 h-3 mr-1" /> Show less
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {allSkills.filter(skill => !skillSearchTerm || skill.toLowerCase().includes(skillSearchTerm.toLowerCase())).map(skill => <Badge key={skill} variant={selectedSkills.includes(skill) ? "default" : "outline"} className="cursor-pointer hover:bg-primary/20" onClick={() => {
                    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
                  }}>
                              {skill}
                            </Badge>)}
                      </div>
                    </div>}
                </div>

                {/* Compensation filter */}
                <div className="max-w-4xl mx-auto">
                  <h4 className="text-sm font-medium mb-2">Compensation</h4>
                  <div className="flex flex-wrap gap-2">
                    {compensationTypes.map(type => <Badge key={type} variant={selectedCompensation.includes(type) ? "default" : "outline"} className="cursor-pointer hover:bg-primary/20" onClick={() => {
                  setSelectedCompensation(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
                }}>
                        {type}
                      </Badge>)}
                  </div>
                </div>
              </div>}

              {/* Results count */}
              <p className="text-center text-sm text-muted-foreground">
                {filteredCreators.length} creators found
              </p>
            </div>}

          <TabsContent value="dashboard" className="mt-6">
            {/* Dashboard Metrics */}
            

            {myOpportunities.length > 0 && <>
                {/* Filter and Sort Controls */}
                
              </>}

            {sortedOpportunities.length > 0 ? <div className="space-y-4">
                {sortedOpportunities.map(opp => <Card key={opp.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg">{opp.role}</CardTitle>
                            <Badge variant={opp.status === 'open' ? 'default' : 'secondary'} className={opp.status === 'open' ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                              {opp.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Posted {new Date(opp.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {getMockMetrics(opp.id).views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {getMockMetrics(opp.id).applications} applications
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm line-clamp-2">{opp.description}</p>
                      
                      {/* Progress Bar for Active Posts */}
                      {opp.status === 'open' && <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Application Progress</span>
                            <span>{getMockMetrics(opp.id).applications} / 15</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2 transition-all" style={{
                      width: `${getMockMetrics(opp.id).applications / 15 * 100}%`
                    }} />
                          </div>
                        </div>}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => toast.info("Viewing details for: " + opp.role)}>
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toast.info("Edit functionality coming soon for: " + opp.role)}>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit Post
                        </Button>
                        {opp.status === 'open' && <Button variant="outline" size="sm" onClick={() => handleCloseOpportunity(opp.id)}>
                            <X className="w-3 h-3 mr-1" />
                            Close
                          </Button>}
                      </div>
                    </CardContent>
                  </Card>)}
              </div> : myOpportunities.length === 0 ? <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Opportunities Posted</h3>
                <p className="text-muted-foreground mb-6">
                  Post opportunities for your innovation to connect with talented creators
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Opportunity
                </Button>
              </div> : <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-2">No posts match your filters</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your filter settings</p>
              </div>}
          </TabsContent>


          <TabsContent value="creators" className="mt-6">
            <div className="space-y-4">
              {filteredCreators.map(creator => <Card key={creator.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold">
                          {creator.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground">{creator.location}</p>
                        <div className="flex gap-1 mt-1">
                          {creator.skills.map(skill => <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Availability:</span>
                        <p className="text-muted-foreground">{creator.availability}</p>
                      </div>
                      <div>
                        <span className="font-medium">Rates:</span>
                        <p className="text-muted-foreground">{creator.rates}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">Contact</Button>
                      <Button size="sm" variant="outline">View Profile</Button>
                      <Button size="sm" variant="outline">Add to Team</Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateOpportunityModal open={showCreateModal} onOpenChange={setShowCreateModal} onSuccess={handleCreateSuccess} />
    </div>;
}
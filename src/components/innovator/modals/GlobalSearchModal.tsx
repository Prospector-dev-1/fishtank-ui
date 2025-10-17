import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Play, Users, Briefcase, MessageCircle } from "lucide-react";
interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const GlobalSearchModal = ({
  open,
  onOpenChange
}: GlobalSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pitches");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for search results
  const mockPitches = [{
    id: "1",
    title: "EcoTrack AI",
    category: "Climate Tech",
    stage: "Seed",
    location: "Toronto, ON",
    duration: "30s",
    views: 1200,
    tags: ["AI", "Climate", "B2B"]
  }, {
    id: "2",
    title: "MedFlow Assistant",
    category: "HealthTech",
    stage: "MVP",
    location: "Vancouver, BC",
    duration: "45s",
    views: 850,
    tags: ["Health", "AI", "SaaS"]
  }];
  const mockPeople = [{
    id: "1",
    name: "Sarah Kim",
    location: "Vancouver, BC",
    bio: "AI researcher turned entrepreneur",
    skills: ["AI/ML", "Product", "Fundraising"],
    openToCofounder: true
  }];
  const mockOpportunities = [{
    id: "1",
    role: "Senior React Developer",
    company: "EcoTrack AI",
    location: "Remote",
    compensation: "$80-120K + equity",
    tags: ["React", "TypeScript", "Climate"]
  }];
  const filterOptions = {
    categories: ["AI/ML", "Climate Tech", "FinTech", "HealthTech", "EdTech", "B2B SaaS"],
    stages: ["Idea", "MVP", "Seed", "Series A", "Series B"],
    locations: ["Toronto, ON", "Vancouver, BC", "Montreal, QC", "Remote"],
    durations: ["< 30s", "30s - 1min", "1-5min", "5-15min"]
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Fishtank</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pitches, people, opportunities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <div className="flex flex-wrap gap-1">
                    {filterOptions.categories.map(cat => <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {cat}
                      </Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Stage</h4>
                  <div className="flex flex-wrap gap-1">
                    {filterOptions.stages.map(stage => <Badge key={stage} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {stage}
                      </Badge>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          

          <div className="overflow-y-auto flex-1 mt-4">
            <TabsContent value="pitches" className="space-y-3">
              {mockPitches.map(pitch => <Card key={pitch.id} className="cursor-pointer hover:bg-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{pitch.title}</h3>
                          <Badge variant="secondary">{pitch.category}</Badge>
                          <Badge variant="outline">{pitch.stage}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{pitch.location}</p>
                        <div className="flex gap-1">
                          {pitch.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>)}
                        </div>
                      </div>
                      <div className="text-right">
                        <Button size="sm">
                          <Play className="w-3 h-3 mr-1" />
                          {pitch.duration}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">{pitch.views} views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </TabsContent>

            <TabsContent value="innovations" className="space-y-3">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No innovations found</p>
              </div>
            </TabsContent>

            <TabsContent value="people" className="space-y-3">
              {mockPeople.map(person => <Card key={person.id} className="cursor-pointer hover:bg-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold">
                            {person.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{person.name}</h3>
                          <p className="text-sm text-muted-foreground">{person.location}</p>
                          <p className="text-sm">{person.bio}</p>
                          <div className="flex gap-1 mt-1">
                            {person.skills.map(skill => <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm">Connect</Button>
                        {person.openToCofounder && <Badge variant="secondary" className="text-xs">Co-founder</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-3">
              {mockOpportunities.map(opp => <Card key={opp.id} className="cursor-pointer hover:bg-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{opp.role}</h3>
                        <p className="text-sm text-muted-foreground">{opp.company} • {opp.location}</p>
                        <p className="text-sm font-medium text-green-600">{opp.compensation}</p>
                        <div className="flex gap-1 mt-2">
                          {opp.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>)}
                        </div>
                      </div>
                      <Button size="sm">
                        <Briefcase className="w-3 h-3 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
            </TabsContent>

            <TabsContent value="teams" className="space-y-3">
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No teams found</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>;
};
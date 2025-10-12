import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CreatorCard } from "@/components/CreatorCard";
import { Community } from "@/components/Community";
import { creators as mockCreators } from "@/data/creators";
import { Creator } from "@/lib/creatorTypes";
import { IOSHeader } from "@/components/ui/ios-header";
import { IOSInput } from "@/components/ui/ios-input";
import { IOSChip } from "@/components/ui/ios-chip";
import { IOSButton } from "@/components/ui/ios-button";
import { IOSEmptyState } from "@/components/ui/ios-empty-state";
import { IOSSkeleton } from "@/components/ui/ios-skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

export default function Network() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"discover" | "community">("community");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [compensationFilter, setCompensationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [realCreators, setRealCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadRealCreators();
    }
  }, [user]);

  const loadRealCreators = async () => {
    try {
      setLoading(true);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '');

      if (profilesError) throw profilesError;

      const creatorsPromises = (profiles || []).map(async (profile) => {
        const [servicesRes, skillsRes] = await Promise.all([
          supabase.from('services').select('*').eq('creator_id', profile.id),
          supabase.from('creator_skills').select('skill_id, skills(name)').eq('creator_id', profile.id)
        ]);

        const services = (servicesRes.data || []).map(s => ({
          id: s.id,
          title: s.title,
          scope: s.description?.split('\n') || [],
          etaDays: s.delivery_days,
          type: 'fixed' as const,
          price: Number(s.price)
        }));

        const skills = (skillsRes.data || []).map((s: any) => s.skills?.name).filter(Boolean);
        const socialLinks = profile.social_links as any;

        return {
          id: profile.id,
          name: profile.full_name,
          headline: 'Creator',
          skills: skills,
          rating: 5.0,
          availability: 'open' as const,
          compensation: ['hourly', 'fixed'] as Array<'hourly' | 'equity' | 'commission' | 'fixed'>,
          hourlyRate: profile.hourly_rate ? Number(profile.hourly_rate) : undefined,
          timezone: 'UTC',
          responseTime: 'Usually responds within 24 hours',
          avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
          website: socialLinks?.website,
          bio: profile.bio || 'No bio available',
          services,
          endorsements: [],
          portfolio: [],
          reviews: []
        };
      });

      const loadedCreators = await Promise.all(creatorsPromises);
      setRealCreators(loadedCreators);
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const creators = realCreators.length > 0 ? realCreators : mockCreators;
  const allSkills = Array.from(new Set(creators.flatMap(creator => creator.skills)));

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         creator.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => creator.skills.includes(skill));
    const matchesAvailability = availabilityFilter === "all" || creator.availability === availabilityFilter;
    const matchesCompensation = compensationFilter === "all" || 
                               creator.compensation.includes(compensationFilter as any);
    return matchesSearch && matchesSkills && matchesAvailability && matchesCompensation;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price_asc":
        return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      case "price_desc":
        return (b.hourlyRate || 0) - (a.hourlyRate || 0);
      default:
        return 0;
    }
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleMessage = (creatorId: string) => {
    navigate('/inbox', { state: { selectedUserId: creatorId } });
  };

  const handleCollaborate = (creatorId: string) => {
    console.log('Collaborate with creator:', creatorId);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* iOS Header */}
      <IOSHeader 
        largeTitle="Network"
        rightAction={
          activeTab === "discover" ? (
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <button className="touch-target flex items-center justify-center text-primary active:opacity-60 transition-opacity duration-120">
                  <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
                <SheetHeader>
                  <SheetTitle className="text-title-2">Filters</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 mt-6 overflow-y-auto h-[calc(70vh-120px)]">
                  {/* Availability */}
                  <div className="space-y-3">
                    <label className="text-subhead font-semibold">Availability</label>
                    <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="open">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Compensation */}
                  <div className="space-y-3">
                    <label className="text-subhead font-semibold">Compensation</label>
                    <Select value={compensationFilter} onValueChange={setCompensationFilter}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="commission">Commission</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <label className="text-subhead font-semibold">Sort by</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                        <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    <label className="text-subhead font-semibold">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {(showAllSkills ? allSkills : allSkills.slice(0, 12)).map(skill => (
                        <IOSChip
                          key={skill}
                          label={skill}
                          selected={selectedSkills.includes(skill)}
                          onSelect={() => toggleSkill(skill)}
                        />
                      ))}
                      {allSkills.length > 12 && (
                        <IOSChip
                          label={showAllSkills ? 'Show less' : `+${allSkills.length - 12} more`}
                          onSelect={() => setShowAllSkills(!showAllSkills)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-bottom">
                  <IOSButton fullWidth onClick={() => setFilterOpen(false)}>
                    Apply Filters
                  </IOSButton>
                </div>
              </SheetContent>
            </Sheet>
          ) : undefined
        }
      />

      {/* Segmented Control (iOS-style tabs) */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          <button
            onClick={() => setActiveTab("community")}
            className={`flex-1 py-2 px-4 rounded-lg text-subhead font-semibold transition-all duration-180 ${
              activeTab === "community"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:opacity-60"
            }`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 py-2 px-4 rounded-lg text-subhead font-semibold transition-all duration-180 ${
              activeTab === "discover"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:opacity-60"
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      {activeTab === "discover" ? (
        <div className="px-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <IOSInput
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 rounded-full"
            />
          </div>

          {/* Active Skills */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map(skill => (
                <IOSChip
                  key={skill}
                  label={skill}
                  selected
                  onRemove={() => toggleSkill(skill)}
                />
              ))}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="ios-card p-4 space-y-3">
                  <IOSSkeleton className="h-16 w-16 rounded-full" />
                  <IOSSkeleton className="h-4 w-3/4" />
                  <IOSSkeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredCreators.length === 0 ? (
            <IOSEmptyState
              icon={<Search className="h-12 w-12" />}
              title="No creators found"
              description="Try adjusting your filters or search terms"
            />
          ) : (
            <div className="space-y-4">
              {filteredCreators.map(creator => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  onMessage={handleMessage}
                  onCollaborate={handleCollaborate}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4">
          <Community />
        </div>
      )}
    </div>
  );
}
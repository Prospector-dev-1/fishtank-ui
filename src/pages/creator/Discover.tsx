import { useState, useMemo } from "react";
import { SwipeDeck } from "@/components/creator/SwipeDeck";
import { mockStartups } from "@/data/startups";
import { useNavigate } from "react-router-dom";
import { IOSHeader } from "@/components/creator/ui/ios-header";
import { IOSInput } from "@/components/creator/ui/ios-input";
import { IOSChip } from "@/components/creator/ui/ios-chip";
import { IOSButton } from "@/components/creator/ui/ios-button";
import { IOSBadge } from "@/components/creator/ui/ios-badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Discover() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Get all unique positions/skills from startups
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    mockStartups.forEach(startup => {
      if (startup.openPositions) {
        startup.openPositions.forEach(position => skills.add(position));
      }
    });
    return Array.from(skills);
  }, []);

  // Filter startups based on search and selected skills
  const filteredStartups = useMemo(() => {
    let filtered = mockStartups.filter(startup => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = startup.name.toLowerCase().includes(query);
        const matchesBlurb = startup.blurb.toLowerCase().includes(query);
        const matchesCategory = startup.category.toLowerCase().includes(query);
        const matchesPositions = startup.openPositions.some(position => 
          position.toLowerCase().includes(query)
        );
        
        if (!matchesName && !matchesBlurb && !matchesCategory && !matchesPositions) {
          return false;
        }
      }

      // Skills filter
      if (selectedSkills.length > 0) {
        const hasMatchingPosition = selectedSkills.some(skill => 
          startup.openPositions.includes(skill)
        );
        if (!hasMatchingPosition) {
          return false;
        }
      }

      return true;
    });

    // Sort the filtered results
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "team-size-asc":
        filtered = [...filtered].sort((a, b) => 
          a.team.length - b.team.length
        );
        break;
      case "team-size-desc":
        filtered = [...filtered].sort((a, b) => 
          b.team.length - a.team.length
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedSkills, sortBy]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setSortBy("relevance");
  };

  const hasActiveFilters = searchQuery || selectedSkills.length > 0 || sortBy !== "relevance";

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* iOS Header */}
      <IOSHeader 
        largeTitle="Discover"
        rightAction={
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <button className="touch-target flex items-center justify-center text-primary active:opacity-60 transition-opacity duration-120">
                <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
                {hasActiveFilters && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-title-2">Filters</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 overflow-y-auto h-[calc(85vh-120px)] pb-6">
                {/* Sort By */}
                <div className="space-y-3">
                  <label className="text-subhead font-semibold">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="team-size-asc">Team Size (Small)</SelectItem>
                      <SelectItem value="team-size-desc">Team Size (Large)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Skills Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-subhead font-semibold">Open Positions</label>
                    {selectedSkills.length > 0 && (
                      <IOSBadge variant="primary">{selectedSkills.length} selected</IOSBadge>
                    )}
                  </div>
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

              {/* Footer Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-bottom">
                <div className="flex gap-3">
                  <IOSButton
                    variant="secondary"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="flex-1"
                  >
                    Clear All
                  </IOSButton>
                  <IOSButton
                    onClick={() => setFilterOpen(false)}
                    className="flex-1"
                  >
                    Apply Filters
                  </IOSButton>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <IOSInput
            placeholder="Search startups, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 rounded-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-120"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {selectedSkills.length > 0 && (
        <div className="px-4 mb-4">
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
        </div>
      )}

      {/* Results Count */}
      <div className="px-4 mb-4">
        <p className="text-subhead text-muted-foreground">
          {filteredStartups.length} {filteredStartups.length === 1 ? 'startup' : 'startups'} found
        </p>
      </div>

      {/* Swipe Deck */}
      <div className="px-4">
        <SwipeDeck startups={filteredStartups} />
      </div>
    </div>
  );
}
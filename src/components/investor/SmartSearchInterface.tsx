import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useSmartSearch } from '@/hooks/investor/useSmartSearch';
import { mockStartups } from "@/data/investor/mockData";
import { 
  Search, 
  Filter, 
  SortAsc, 
  X, 
  Save, 
  Star,
  TrendingUp,
  Users,
  MapPin,
  Tag,
  ChevronDown,
  Sparkles,
  History
} from 'lucide-react';
import { cn } from "@/lib/investor/utils";

interface SmartSearchInterfaceProps {
  onStartupSelect?: (startup: any) => void;
  className?: string;
}

export function SmartSearchInterface({ onStartupSelect, className }: SmartSearchInterfaceProps) {
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const {
    query,
    setQuery,
    filters,
    updateFilter,
    addToFilter,
    clearFilters,
    sortBy,
    setSortBy,
    isAdvanced,
    setIsAdvanced,
    searchResults,
    saveSearch,
    getSavedSearches
  } = useSmartSearch(mockStartups);

  const savedSearches = getSavedSearches();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Header */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles size={20} className="text-primary" />
              <span>Smart Search</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSavedSearches(!showSavedSearches)}
                className="min-h-[36px]"
              >
                <History size={16} className="mr-2" />
                Saved ({savedSearches.length})
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={saveSearch}
                disabled={!query.trim() && filters.sectors.length === 0}
                className="min-h-[36px]"
              >
                <Save size={16} className="mr-2" />
                Save Search
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main Search Input */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search startups (e.g., 'AI healthcare pre-seed')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-12 min-h-[48px] text-lg"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <X size={16} />
              </Button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {['AI', 'Fintech', 'HealthTech', 'SaaS', 'B2B'].map(tag => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => addToFilter('tags', tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <Collapsible open={isAdvanced} onOpenChange={setIsAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full min-h-[44px]">
                <Filter size={16} className="mr-2" />
                Advanced Filters
                <ChevronDown size={16} className={cn('ml-2 transition-transform', isAdvanced && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4 space-y-6 p-4 border rounded-lg bg-muted/20">
              {/* Sector Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sectors</label>
                <div className="flex flex-wrap gap-2">
                  {searchResults.facets.sectors.map(sector => (
                    <div key={sector.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sector-${sector.name}`}
                        checked={filters.sectors.includes(sector.name)}
                        onCheckedChange={() => addToFilter('sectors', sector.name)}
                      />
                      <label 
                        htmlFor={`sector-${sector.name}`}
                        className="text-sm cursor-pointer flex items-center space-x-1"
                      >
                        <span>{sector.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {sector.count}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Investment Stage</label>
                <div className="flex flex-wrap gap-2">
                  {searchResults.facets.stages.map(stage => (
                    <div key={stage.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`stage-${stage.name}`}
                        checked={filters.stages.includes(stage.name)}
                        onCheckedChange={() => addToFilter('stages', stage.name)}
                      />
                      <label 
                        htmlFor={`stage-${stage.name}`}
                        className="text-sm cursor-pointer flex items-center space-x-1"
                      >
                        <span>{stage.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {stage.count}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Size Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Team Size: {filters.teamSize[0]} - {filters.teamSize[1]} members
                </label>
                <Slider
                  value={filters.teamSize}
                  onValueChange={(value) => updateFilter('teamSize', value as [number, number])}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="flex flex-wrap gap-2">
                  {searchResults.facets.locations.map(location => (
                    <Badge
                      key={location.name}
                      variant={filters.location.includes(location.name) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => addToFilter('location', location.name)}
                    >
                      <MapPin size={12} className="mr-1" />
                      {location.name} ({location.count})
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full min-h-[44px]"
              >
                <X size={16} className="mr-2" />
                Clear All Filters
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SortAsc size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
            </div>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="stage">Investment Stage</SelectItem>
                <SelectItem value="team">Team Size</SelectItem>
                <SelectItem value="traction">Traction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {searchResults.totalCount} results found
              {query && ` for "${query}"`}
            </span>
            
            {(filters.sectors.length > 0 || filters.stages.length > 0 || filters.tags.length > 0) && (
              <div className="flex items-center space-x-1">
                <Filter size={14} />
                <span>Filtered</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saved Searches */}
      {showSavedSearches && savedSearches.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History size={20} />
              <span>Saved Searches</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedSearches.slice(-5).map((search: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setQuery(search.query);
                    updateFilter('sectors', search.filters.sectors);
                    updateFilter('stages', search.filters.stages);
                    setSortBy(search.sortBy);
                  }}
                >
                  <div>
                    <div className="font-medium">{search.query || 'Advanced Search'}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(search.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <Star size={16} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {searchResults.startups.map(startup => (
          <Card
            key={startup.id}
            className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onStartupSelect?.(startup)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{startup.name}</h3>
                    <Badge variant="outline">{startup.stage}</Badge>
                    <Badge variant="secondary">{startup.sector}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{startup.tagline}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{startup.team.length} team members</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <TrendingUp size={14} />
                      <span>{startup.metrics.views} views</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Tag size={14} />
                      <span>{startup.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {startup.tags.slice(0, 4).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {startup.traction.length > 0 ? startup.traction[0].value : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {startup.traction.length > 0 ? startup.traction[0].metric : 'Metric'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {searchResults.totalCount === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Search size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
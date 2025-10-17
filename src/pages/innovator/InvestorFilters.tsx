import { useState, useEffect } from "react";
import { ChevronLeft, Filter, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

interface FilterState {
  stages: string[];
  thesis: string[];
  geos: string[];
  minScore: number;
  requiresNDA?: boolean;
}

interface InvestorFiltersProps {
  currentFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClose: () => void;
}

const availableStages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth'];
const availableThesis = ['Fintech', 'AI/ML', 'B2B SaaS', 'Healthcare', 'E-commerce', 'Enterprise', 'Consumer', 'Blockchain', 'Climate', 'EdTech'];
const availableGeos = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'];

export default function InvestorFilters({ currentFilters, onApplyFilters, onClose }: InvestorFiltersProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(currentFilters);
    setHasChanges(filtersChanged);
  }, [filters, currentFilters]);

  const toggleArrayFilter = <T extends string>(
    filterKey: keyof FilterState,
    value: T,
    filterArray: T[]
  ) => {
    const currentArray = filters[filterKey] as T[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFilters({ ...filters, [filterKey]: newArray });
  };

  const clearAllFilters = () => {
    setFilters({
      stages: [],
      thesis: [],
      geos: [],
      minScore: 0,
      requiresNDA: undefined
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    return (
      filters.stages.length +
      filters.thesis.length +
      filters.geos.length +
      (filters.minScore > 0 ? 1 : 0) +
      (filters.requiresNDA !== undefined ? 1 : 0)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container-mobile px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold">Filter Investors</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              disabled={getActiveFiltersCount() === 0}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="container-mobile px-4 py-6 space-y-6">
        {/* Investment Stage */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Investment Stage</h3>
          <div className="flex flex-wrap gap-2">
            {availableStages.map((stage) => (
              <Badge
                key={stage}
                variant={filters.stages.includes(stage) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('stages', stage, availableStages)}
              >
                {filters.stages.includes(stage) && <Check className="w-3 h-3 mr-1" />}
                {stage}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Investment Thesis */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Investment Thesis</h3>
          <div className="flex flex-wrap gap-2">
            {availableThesis.map((thesis) => (
              <Badge
                key={thesis}
                variant={filters.thesis.includes(thesis) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('thesis', thesis, availableThesis)}
              >
                {filters.thesis.includes(thesis) && <Check className="w-3 h-3 mr-1" />}
                {thesis}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Geography */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Geography</h3>
          <div className="flex flex-wrap gap-2">
            {availableGeos.map((geo) => (
              <Badge
                key={geo}
                variant={filters.geos.includes(geo) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('geos', geo, availableGeos)}
              >
                {filters.geos.includes(geo) && <Check className="w-3 h-3 mr-1" />}
                {geo}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Match Score */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Minimum Match Score</Label>
              <span className="text-sm font-medium">{filters.minScore}%</span>
            </div>
            <Slider
              value={[filters.minScore]}
              onValueChange={(value) => setFilters({ ...filters, minScore: value[0] })}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </Card>

        {/* NDA Requirement */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">NDA Requirement</h3>
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg border cursor-pointer transition-fast ${
                filters.requiresNDA === undefined
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground"
              }`}
              onClick={() => setFilters({ ...filters, requiresNDA: undefined })}
            >
              <div className="flex items-center justify-between">
                <span>Any</span>
                {filters.requiresNDA === undefined && <Check className="w-4 h-4 text-primary" />}
              </div>
            </div>
            <div
              className={`p-3 rounded-lg border cursor-pointer transition-fast ${
                filters.requiresNDA === true
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground"
              }`}
              onClick={() => setFilters({ ...filters, requiresNDA: true })}
            >
              <div className="flex items-center justify-between">
                <span>Requires NDA</span>
                {filters.requiresNDA === true && <Check className="w-4 h-4 text-primary" />}
              </div>
            </div>
            <div
              className={`p-3 rounded-lg border cursor-pointer transition-fast ${
                filters.requiresNDA === false
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground"
              }`}
              onClick={() => setFilters({ ...filters, requiresNDA: false })}
            >
              <div className="flex items-center justify-between">
                <span>No NDA Required</span>
                {filters.requiresNDA === false && <Check className="w-4 h-4 text-primary" />}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="container-mobile flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={applyFilters}
            disabled={!hasChanges}
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
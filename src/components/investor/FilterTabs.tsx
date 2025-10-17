import { useState } from 'react';
import { cn } from '@/lib/utils';

export type FilterType = 'all' | 'messages' | 'teams' | 'system';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  className?: string;
}

const filters = [
  { id: 'all' as const, label: 'All' },
  { id: 'messages' as const, label: 'Messages' },
  { id: 'teams' as const, label: 'Teams' },
  { id: 'system' as const, label: 'System' },
];

export function FilterTabs({ activeFilter, onFilterChange, className }: FilterTabsProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "border border-transparent",
            activeFilter === filter.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
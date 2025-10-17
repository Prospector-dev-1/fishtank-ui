import { useState, useCallback, useMemo } from 'react';
import { Startup } from "@/data/investor/mockData";

interface SearchFilters {
  sectors: string[];
  stages: string[];
  teamSize: [number, number];
  valuation: [number, number];
  location: string[];
  tags: string[];
}

interface SearchResult {
  startups: Startup[];
  totalCount: number;
  facets: {
    sectors: Array<{ name: string; count: number; }>;
    stages: Array<{ name: string; count: number; }>;
    locations: Array<{ name: string; count: number; }>;
    tags: Array<{ name: string; count: number; }>;
  };
}

export function useSmartSearch(startups: Startup[]) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    sectors: [],
    stages: [],
    teamSize: [1, 20],
    valuation: [0, 100000000],
    location: [],
    tags: []
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'stage' | 'team' | 'traction'>('relevance');
  const [isAdvanced, setIsAdvanced] = useState(false);

  // Semantic search using fuzzy matching and relevance scoring
  const performSemanticSearch = useCallback((searchQuery: string, startup: Startup): number => {
    if (!searchQuery.trim()) return 1;

    const query = searchQuery.toLowerCase();
    let score = 0;

    // Direct name match (highest weight)
    if (startup.name.toLowerCase().includes(query)) {
      score += 10;
    }

    // Tagline match
    if (startup.tagline.toLowerCase().includes(query)) {
      score += 8;
    }

    // Sector match
    if (startup.sector.toLowerCase().includes(query)) {
      score += 6;
    }

    // Tags match
    startup.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        score += 4;
      }
    });

    // Description match
    if (startup.description.toLowerCase().includes(query)) {
      score += 3;
    }

    // Founder match
    if (startup.founder.toLowerCase().includes(query)) {
      score += 5;
    }

    // Fuzzy matching for typos (simplified)
    const words = query.split(' ');
    words.forEach(word => {
      if (word.length > 3) {
        const variations = [
          word.slice(0, -1), // Remove last character
          word + 's', // Add plural
          word.replace(/(.{2,}?)(.)\2/, '$1$2') // Remove double letters
        ];
        
        variations.forEach(variation => {
          if (startup.name.toLowerCase().includes(variation) ||
              startup.tagline.toLowerCase().includes(variation) ||
              startup.sector.toLowerCase().includes(variation)) {
            score += 2;
          }
        });
      }
    });

    return score;
  }, []);

  const applyFilters = useCallback((startup: Startup): boolean => {
    // Sector filter
    if (filters.sectors.length > 0 && !filters.sectors.includes(startup.sector)) {
      return false;
    }

    // Stage filter
    if (filters.stages.length > 0 && !filters.stages.includes(startup.stage)) {
      return false;
    }

    // Team size filter
    if (startup.team.length < filters.teamSize[0] || startup.team.length > filters.teamSize[1]) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        startup.tags.some(startupTag => 
          startupTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  }, [filters]);

  const searchResults = useMemo((): SearchResult => {
    let filteredStartups = startups.filter(applyFilters);

    // Apply semantic search
    if (query.trim()) {
      const scoredStartups = filteredStartups.map(startup => ({
        startup,
        score: performSemanticSearch(query, startup)
      }));

      // Filter out zero scores and sort by relevance
      filteredStartups = scoredStartups
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.startup);
    }

    // Apply sorting
    switch (sortBy) {
      case 'stage':
        filteredStartups.sort((a, b) => {
          const stageOrder = { 'Pre-Seed': 0, 'Seed': 1, 'Series A': 2, 'Series B': 3 };
          return stageOrder[a.stage] - stageOrder[b.stage];
        });
        break;
      case 'team':
        filteredStartups.sort((a, b) => b.team.length - a.team.length);
        break;
      case 'traction':
        filteredStartups.sort((a, b) => b.traction.length - a.traction.length);
        break;
    }

    // Generate facets
    const allFilteredStartups = startups.filter(applyFilters);
    
    const facets = {
      sectors: Array.from(new Set(allFilteredStartups.map(s => s.sector)))
        .map(sector => ({
          name: sector,
          count: allFilteredStartups.filter(s => s.sector === sector).length
        }))
        .sort((a, b) => b.count - a.count),
      
      stages: Array.from(new Set(allFilteredStartups.map(s => s.stage)))
        .map(stage => ({
          name: stage,
          count: allFilteredStartups.filter(s => s.stage === stage).length
        }))
        .sort((a, b) => b.count - a.count),
      
      locations: [
        { name: 'San Francisco', count: Math.floor(Math.random() * 20) + 5 },
        { name: 'New York', count: Math.floor(Math.random() * 15) + 3 },
        { name: 'London', count: Math.floor(Math.random() * 10) + 2 },
        { name: 'Berlin', count: Math.floor(Math.random() * 8) + 1 }
      ],
      
      tags: Array.from(
        allFilteredStartups.reduce((acc, startup) => {
          startup.tags.forEach(tag => {
            acc.set(tag, (acc.get(tag) || 0) + 1);
          });
          return acc;
        }, new Map<string, number>())
      ).map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    };

    return {
      startups: filteredStartups,
      totalCount: filteredStartups.length,
      facets
    };
  }, [startups, query, filters, sortBy, applyFilters, performSemanticSearch]);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const addToFilter = useCallback((
    key: 'sectors' | 'stages' | 'location' | 'tags',
    value: string
  ) => {
    setFilters(prev => {
      const currentValue = prev[key] as string[];
      return {
        ...prev,
        [key]: currentValue.includes(value) 
          ? currentValue.filter((v: string) => v !== value)
          : [...currentValue, value]
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      sectors: [],
      stages: [],
      teamSize: [1, 20],
      valuation: [0, 100000000],
      location: [],
      tags: []
    });
    setQuery('');
  }, []);

  const saveSearch = useCallback(() => {
    const savedSearch = {
      query,
      filters,
      sortBy,
      timestamp: new Date().toISOString()
    };
    
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    savedSearches.push(savedSearch);
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
  }, [query, filters, sortBy]);

  const getSavedSearches = useCallback(() => {
    return JSON.parse(localStorage.getItem('savedSearches') || '[]');
  }, []);

  return {
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
  };
}
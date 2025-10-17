import React, { useState } from 'react';
import { ExpandableStartupCard } from './ExpandableStartupCard';
import { toast } from 'sonner';

interface SwipeDeckProps {
  startups: any[];
}

export function SwipeDeck({ startups }: SwipeDeckProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const handleRequest = (payload?: any) => {
    if (payload) {
      console.log('Request payload:', payload);
    }
    toast.success("Requested to join");
  };


  return (
    <div className="space-y-6 pb-6">
      {startups.length > 0 ? (
        startups.map((startup) => (
          <div key={startup.id} className="w-full max-w-md mx-auto">
            <ExpandableStartupCard
              startup={startup}
              expanded={expandedId === startup.id}
              setExpanded={(expanded) => setExpandedId(expanded ? startup.id : null)}
              onRequest={handleRequest}
            />
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No startups match your filters</p>
        </div>
      )}
    </div>
  );
}
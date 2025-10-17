import React, { useState } from 'react';
import { ChevronDown, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Startup } from '@/data/startups';
import { ApplyModal } from './ApplyModal';
import { NDAModal } from './NDAModal';

interface ExpandableStartupCardProps {
  startup: Startup;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  onRequest: (payload?: any) => void;
}

export function ExpandableStartupCard({
  startup,
  expanded,
  setExpanded,
  onRequest
}: ExpandableStartupCardProps) {
  const [showNDA, setShowNDA] = useState(false);
  const [applyRole, setApplyRole] = useState<string | null>(null);

  const handleRequest = (payload?: any) => {
    if (startup.ndaRequired) {
      setShowNDA(true);
    } else {
      onRequest(payload);
    }
  };

  const handleNDAAgree = () => {
    setShowNDA(false);
    onRequest();
  };

  const handleApplySubmit = (payload: any) => {
    console.log('Apply payload:', payload);
    setApplyRole(null);
    handleRequest(payload);
  };

  return (
    <div className="pointer-events-auto w-full max-w-md rounded-3xl border border-neutral-700 bg-neutral-900/80 backdrop-blur">
      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
        {startup.bannerUrl ? (
          <img 
            className="h-full w-full object-cover" 
            src={startup.bannerUrl} 
            alt={startup.name}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-500">
            No Image
          </div>
        )}
        {startup.ndaRequired && (
          <div className="absolute left-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-xs font-medium text-white">
            NDA
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white">{startup.name}</h3>
        <p className="mt-1 text-sm text-neutral-300">"{startup.blurb}"</p>

        {/* Meta */}
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-neutral-400 sm:grid-cols-4">
          <div>
            <div className="text-neutral-500">Created</div>
            <div className="text-neutral-200 truncate">{startup.creatorName}</div>
            <div>{new Date(startup.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-neutral-500">Category</div>
            <div className="text-neutral-200">{startup.category}</div>
          </div>
          <div>
            <div className="text-neutral-500">Phase</div>
            <div className="text-neutral-200">{startup.phase}</div>
          </div>
          <div>
            <div className="text-neutral-500">Website</div>
            {startup.website ? (
              <a 
                className="text-violet-300 underline flex items-center gap-1" 
                href={startup.website} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Link <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-neutral-500">None</span>
            )}
          </div>
        </div>

        {/* Main CTA - Expand */}
        <div className="mt-4">
          <Button
            onClick={(e) => { 
              e.stopPropagation(); 
              setExpanded(!expanded); 
            }}
            className="w-full bg-white text-black hover:bg-neutral-200 font-medium"
            size="sm"
          >
            {expanded ? (
              <>
                Show Less <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
              </>
            ) : (
              <>
                View Details <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Expanded content */}
        {expanded && (
          <>
            {/* Project needs */}
            <div className="mt-4 rounded-2xl border border-neutral-700 p-3">
              <div className="mb-2 font-medium text-neutral-200">Project needs</div>
              <div className="flex flex-wrap gap-2">
                {startup.openPositions.map((role) => (
                  <button
                    key={role}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setApplyRole(role); 
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors"
                    title={`Request to join as ${role}`}
                  >
                    <Plus className="h-3 w-3" />
                    Request to join as <strong className="ml-1 font-semibold">{role}</strong>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3 bg-neutral-800">
                <TabsTrigger value="team" className="text-xs">Team Members</TabsTrigger>
                <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                <TabsTrigger value="comments" className="text-xs">FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="team" className="mt-3 space-y-2">
                {startup.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800/50">
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-200">{member.name}</div>
                      <div className="text-xs text-neutral-400">{member.role}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      Profile
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="details" className="mt-3 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-neutral-200 mb-2">Problem & Solution</h4>
                  <p className="text-sm text-neutral-300">{startup.details.problemSolution}</p>
                </div>
                {startup.details.founderNote && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200 mb-2">Founder Note</h4>
                    <p className="text-sm text-neutral-300">{startup.details.founderNote}</p>
                  </div>
                )}
                {startup.details.currentStatus && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200 mb-2">Current Status</h4>
                    <p className="text-sm text-neutral-300">{startup.details.currentStatus}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" className="mt-3">
                <div className="text-center py-8">
                  <p className="text-sm text-neutral-400">No FAQs yet</p>
                  <p className="text-xs text-neutral-500 mt-1">Check back later for frequently asked questions</p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Secondary CTA - Request to Join */}
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleRequest(); }}
            className="w-full border-neutral-700 text-neutral-200 hover:bg-neutral-800"
          >
            {startup.ndaRequired ? "Request to Join (NDA)" : "Request to Join"}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <NDAModal
        isOpen={showNDA}
        onClose={() => setShowNDA(false)}
        onAgree={handleNDAAgree}
        startupName={startup.name}
      />

      <ApplyModal
        isOpen={!!applyRole}
        onClose={() => setApplyRole(null)}
        onSubmit={handleApplySubmit}
        startup={startup}
        role={applyRole || ''}
      />
    </div>
  );
}
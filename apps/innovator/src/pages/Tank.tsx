import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FishtankHeader } from "@/components/layout/FishtankHeader";
import { InnovationSetupWizard } from "@/components/tank/InnovationSetupWizard";
import { TankDashboard } from "@/components/tank/TankDashboard";
import { innovationAPI } from "@/lib/tankApi";
import { supabase } from "@/integrations/supabase/client";
import type { Innovation } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Tank() {
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [selectedInnovation, setSelectedInnovation] = useState<Innovation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInnovations();
  }, []);

  const loadInnovations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get innovations where user is owner
      const { data: ownedInnovations, error: ownedError } = await supabase
        .from('innovations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ownedError) throw ownedError;

      // Get team memberships
      const { data: teamMemberships, error: teamError } = await supabase
        .from('team_members')
        .select('innovation_id')
        .eq('user_id', user.id);

      if (teamError) throw teamError;

      // Get innovations where user is a team member
      let teamInnovations: any[] = [];
      if (teamMemberships && teamMemberships.length > 0) {
        const innovationIds = teamMemberships.map(tm => tm.innovation_id);
        const { data: teamInnoData, error: teamInnoError } = await supabase
          .from('innovations')
          .select('*')
          .in('id', innovationIds)
          .order('created_at', { ascending: false });

        if (teamInnoError) throw teamInnoError;
        teamInnovations = teamInnoData || [];
      }

      // Combine and deduplicate
      const allInnovations = [...(ownedInnovations || []), ...teamInnovations];
      const uniqueInnovationsMap = new Map();
      allInnovations.forEach(innovation => {
        if (!uniqueInnovationsMap.has(innovation.id)) {
          uniqueInnovationsMap.set(innovation.id, innovation);
        }
      });
      
      const uniqueInnovations = Array.from(uniqueInnovationsMap.values());
      setInnovations(uniqueInnovations as Innovation[]);
      
      // Select first innovation by default
      if (uniqueInnovations.length > 0) {
        setSelectedInnovation(uniqueInnovations[0] as Innovation);
      }
    } catch (error) {
      console.error('Error loading innovations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // If no innovation exists, show setup wizard
  if (innovations.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <FishtankHeader title="Tank" showLogo={false} />
        <InnovationSetupWizard onComplete={loadInnovations} />
      </div>
    );
  }

  // If innovation exists, show dashboard
  return (
    <div className="min-h-screen bg-background">
      <FishtankHeader title="Tank" showLogo={false} />
      
      {/* Innovation Selector */}
      {innovations.length > 1 && (
        <div className="section-padding pt-4">
          <Select
            value={selectedInnovation?.id}
            onValueChange={(value) => {
              const innovation = innovations.find(i => i.id === value);
              if (innovation) setSelectedInnovation(innovation);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an innovation" />
            </SelectTrigger>
            <SelectContent>
              {innovations.map((innovation) => (
                <SelectItem key={innovation.id} value={innovation.id}>
                  {innovation.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedInnovation && (
        <TankDashboard 
          key={selectedInnovation.id} 
          innovation={selectedInnovation} 
        />
      )}
    </div>
  );
}
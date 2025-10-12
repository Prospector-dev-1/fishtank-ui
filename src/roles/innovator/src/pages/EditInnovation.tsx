import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FishtankHeader } from "@/components/layout/FishtankHeader";
import { InnovationSetupWizard } from "@/components/tank/InnovationSetupWizard";
import { innovationAPI } from "@/lib/tankApi";
import { useTeamPermissions } from "@/hooks/useTeamPermissions";
import { toast } from "sonner";
import type { Innovation } from "@/types";

export default function EditInnovation() {
  const navigate = useNavigate();
  const [innovation, setInnovation] = useState<Innovation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { canEditInnovation, isLoading: permissionsLoading } = useTeamPermissions(innovation?.id);

  useEffect(() => {
    loadInnovation();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && innovation && !canEditInnovation) {
      toast.error('You do not have permission to edit this innovation');
      navigate('/tank');
    }
  }, [canEditInnovation, permissionsLoading, innovation, navigate]);

  const loadInnovation = async () => {
    try {
      const primaryInnovation = await innovationAPI.getPrimaryInnovation();
      setInnovation(primaryInnovation);
    } catch (error) {
      console.error('Error loading innovation:', error);
      toast.error('Failed to load innovation');
      navigate('/tank');
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

  return (
    <div className="min-h-screen bg-background">
      <FishtankHeader title="Edit Profile" showLogo={false} />
      <InnovationSetupWizard existingInnovation={innovation} />
    </div>
  );
}

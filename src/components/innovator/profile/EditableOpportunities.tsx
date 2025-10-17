import { useState } from "react";
import { Badge } from "@/components/innovator/ui/badge";
import { Button } from "@/components/innovator/ui/button";
import { Switch } from "@/components/innovator/ui/switch";
import { Label } from "@/components/innovator/ui/label";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/innovator/utils";

interface OpportunityType {
  key: string;
  label: string;
  description: string;
}

const opportunityTypes: OpportunityType[] = [
  { key: 'investors', label: '💼 Investors', description: 'Looking for investment opportunities' },
  { key: 'cofounders', label: '🤝 Co-founders', description: 'Open to co-founder partnerships' },
  { key: 'creators', label: '💻 Creator Work', description: 'Available for creator collaborations' }
];

interface EditableOpportunitiesProps {
  cofounderOpen: boolean;
  onSave: (cofounderOpen: boolean) => Promise<void>;
  className?: string;
}

export function EditableOpportunities({ 
  cofounderOpen, 
  onSave, 
  className 
}: EditableOpportunitiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editCofounderOpen, setEditCofounderOpen] = useState(cofounderOpen);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (editCofounderOpen === cofounderOpen) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editCofounderOpen);
      setIsEditing(false);
    } catch (error) {
      setEditCofounderOpen(cofounderOpen);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditCofounderOpen(cofounderOpen);
    setIsEditing(false);
  };

  // For now, we'll show all opportunity types with only cofounders being toggleable
  const getOpportunityBadges = () => {
    return opportunityTypes.map(type => {
      const isActive = type.key === 'cofounders' ? cofounderOpen : true;
      return (
        <Badge 
          key={type.key} 
          variant="outline" 
          className={cn(
            "transition-opacity",
            !isActive && "opacity-50"
          )}
        >
          {type.label}
        </Badge>
      );
    });
  };

  const getEditingOpportunityToggles = () => {
    return opportunityTypes.map(type => (
      <div key={type.key} className="flex items-center justify-between p-3 border rounded-lg">
        <div>
          <Label className="font-medium">{type.label}</Label>
          <p className="text-sm text-muted-foreground">{type.description}</p>
        </div>
        <Switch
          checked={type.key === 'cofounders' ? editCofounderOpen : true}
          onCheckedChange={type.key === 'cofounders' ? setEditCofounderOpen : undefined}
          disabled={type.key !== 'cofounders' || isSaving}
        />
      </div>
    ));
  };

  if (isEditing) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="space-y-2">
          {getEditingOpportunityToggles()}
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={isSaving}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        className="flex flex-wrap gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors min-h-[2rem] items-center"
        onClick={() => setIsEditing(true)}
      >
        {getOpportunityBadges()}
      </div>
    </div>
  );
}
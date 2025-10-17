import { useState } from "react";
import { Badge } from "@/components/innovator/ui/badge";
import { Button } from "@/components/innovator/ui/button";
import { Input } from "@/components/innovator/ui/input";
import { Plus, X, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/innovator/utils";

interface EditableSkillsProps {
  skills: string[];
  onSave: (skills: string[]) => Promise<void>;
  className?: string;
}

export function EditableSkills({ skills, onSave, className }: EditableSkillsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSkills, setEditSkills] = useState(skills);
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill.trim() || editSkills.includes(newSkill.trim())) return;
    setEditSkills([...editSkills, newSkill.trim()]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    if (JSON.stringify(editSkills.sort()) === JSON.stringify(skills.sort())) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editSkills);
      setIsEditing(false);
    } catch (error) {
      setEditSkills(skills);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditSkills(skills);
    setNewSkill("");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            onKeyDown={handleKeyDown}
            disabled={isSaving}
          />
          <Button
            type="button"
            onClick={handleAddSkill}
            size="icon"
            variant="outline"
            disabled={isSaving || !newSkill.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {editSkills.map((skill) => (
            <Badge key={skill} variant="secondary" className="pr-1">
              {skill}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0.5 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveSkill(skill)}
                disabled={isSaving}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
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
        {skills.length > 0 ? (
          skills.map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))
        ) : (
          <span className="text-muted-foreground">Click to add skills...</span>
        )}
      </div>
    </div>
  );
}
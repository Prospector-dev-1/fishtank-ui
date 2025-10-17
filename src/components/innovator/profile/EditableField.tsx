import { useState, useEffect } from "react";
import { Input } from "@/components/innovator/ui/input";
import { Button } from "@/components/innovator/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/innovator/utils";

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  className?: string;
  displayClassName?: string;
  inputClassName?: string;
  type?: "text" | "email";
}

export function EditableField({
  value,
  onSave,
  placeholder = "Click to edit...",
  className = "",
  displayClassName = "",
  inputClassName = "",
  type = "text"
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      // Reset on error
      setEditValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn("flex-1", inputClassName)}
          placeholder={placeholder}
          autoFocus
          disabled={isSaving}
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !editValue.trim()}
          className="h-8 w-8 p-0"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors",
        displayClassName,
        className
      )}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
    </div>
  );
}
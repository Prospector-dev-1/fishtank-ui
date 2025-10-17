import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IOSChipProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function IOSChip({
  label,
  selected = false,
  onSelect,
  onRemove,
  icon,
  className,
}: IOSChipProps) {
  const isInteractive = !!onSelect;

  return (
    <button
      onClick={onSelect}
      disabled={!isInteractive && !onRemove}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5",
        "rounded-full text-subhead font-medium",
        "border transition-all duration-180",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-secondary text-secondary-foreground border-border",
        isInteractive && "active:scale-95 cursor-pointer",
        !isInteractive && !onRemove && "cursor-default",
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex-shrink-0 -mr-1 ml-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors duration-120"
        >
          <X className="h-3 w-3" strokeWidth={2.5} />
        </button>
      )}
    </button>
  );
}
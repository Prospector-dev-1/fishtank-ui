import * as React from "react";
import { cn } from "@/lib/creator/utils";
import { IOSButton } from "./ios-button";

interface IOSEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function IOSEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: IOSEmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-6",
      className
    )}>
      {icon && (
        <div className="mb-4 text-gray-400 dark:text-gray-600">
          {icon}
        </div>
      )}
      <h3 className="text-title-2 font-semibold text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-body text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <IOSButton onClick={action.onClick}>
          {action.label}
        </IOSButton>
      )}
    </div>
  );
}
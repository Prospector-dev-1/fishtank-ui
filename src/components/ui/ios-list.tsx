import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface IOSListProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}

export function IOSList({ children, className, inset = false }: IOSListProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl overflow-hidden shadow-sm border border-border/50",
      inset && "mx-4",
      className
    )}>
      {children}
    </div>
  );
}

interface IOSListItemProps {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  className?: string;
}

export function IOSListItem({
  title,
  subtitle,
  value,
  icon,
  trailing,
  chevron = false,
  onClick,
  className,
}: IOSListItemProps) {
  const isInteractive = !!onClick;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      className={cn(
        "w-full flex items-center gap-3 p-4 border-b border-border/50 last:border-b-0",
        "text-left transition-colors duration-150",
        isInteractive && "ios-list-cell active:bg-gray-50 dark:active:bg-gray-800 cursor-pointer",
        !isInteractive && "cursor-default",
        className
      )}
    >
      {/* Leading Icon */}
      {icon && (
        <div className="flex-shrink-0 text-gray-500 pointer-events-none">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-body font-normal text-foreground truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-subhead text-muted-foreground truncate mt-0.5">
            {subtitle}
          </div>
        )}
      </div>

      {/* Trailing Content */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {value && (
          <span className="text-body text-muted-foreground">
            {value}
          </span>
        )}
        {trailing}
        {chevron && (
          <ChevronRight className="h-5 w-5 text-gray-400" strokeWidth={2} />
        )}
      </div>
    </button>
  );
}

interface IOSListSectionProps {
  title?: string;
  footer?: string;
  children: React.ReactNode;
  className?: string;
}

export function IOSListSection({ title, footer, children, className }: IOSListSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <div className="px-4 text-footnote font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </div>
      )}
      {children}
      {footer && (
        <div className="px-4 text-footnote text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
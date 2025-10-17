import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iosBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
        info: "bg-info/10 text-info",
      },
      size: {
        default: "px-2.5 py-0.5 text-caption-1",
        sm: "px-2 py-0.5 text-caption-2",
        lg: "px-3 py-1 text-footnote",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IOSBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iosBadgeVariants> {}

function IOSBadge({ className, variant, size, ...props }: IOSBadgeProps) {
  return (
    <div className={cn(iosBadgeVariants({ variant, size }), className)} {...props} />
  );
}

export { IOSBadge, iosBadgeVariants };
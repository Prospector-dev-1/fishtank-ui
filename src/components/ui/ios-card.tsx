import * as React from "react";
import { cn } from "@/lib/utils";

const IOSCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ios-card",
      "bg-card rounded-xl shadow-md border border-border/50",
      "transition-shadow duration-220 hover:shadow-lg",
      className
    )}
    {...props}
  />
));
IOSCard.displayName = "IOSCard";

const IOSCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1 p-4", className)}
    {...props}
  />
));
IOSCardHeader.displayName = "IOSCardHeader";

const IOSCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-title-2 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
IOSCardTitle.displayName = "IOSCardTitle";

const IOSCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-subhead text-muted-foreground", className)}
    {...props}
  />
));
IOSCardDescription.displayName = "IOSCardDescription";

const IOSCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
IOSCardContent.displayName = "IOSCardContent";

const IOSCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
));
IOSCardFooter.displayName = "IOSCardFooter";

export { IOSCard, IOSCardHeader, IOSCardFooter, IOSCardTitle, IOSCardDescription, IOSCardContent };
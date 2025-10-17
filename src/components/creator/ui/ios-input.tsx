import * as React from "react";
import { cn } from "@/lib/creator/utils";

export interface IOSInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
}

const IOSInput = React.forwardRef<HTMLInputElement, IOSInputProps>(
  ({ className, type, icon, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex w-full h-11 px-4 py-3 rounded-xl",
              "bg-secondary border border-border",
              "text-body text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-all duration-200",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:ring-destructive",
              icon && "pl-11",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {helperText && (
          <p className={cn(
            "mt-1.5 px-4 text-footnote",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
IOSInput.displayName = "IOSInput";

export { IOSInput };
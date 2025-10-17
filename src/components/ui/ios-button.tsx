import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iosButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-180 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98] touch-target",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-pressed",
        secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-gray-100 dark:hover:bg-gray-800",
        tertiary: "text-primary hover:opacity-80 active:opacity-60",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/80",
        ghost: "text-foreground hover:bg-secondary/80 active:bg-secondary",
        outline: "border border-border bg-background hover:bg-secondary/80 text-foreground",
      },
      size: {
        default: "h-11 px-6 py-3 text-body rounded-xl",
        sm: "h-9 px-4 py-2 text-subhead rounded-lg",
        lg: "h-12 px-8 py-3 text-body rounded-xl",
        icon: "h-11 w-11 rounded-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface IOSButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iosButtonVariants> {
  asChild?: boolean;
}

const IOSButton = React.forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(iosButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
IOSButton.displayName = "IOSButton";

export { IOSButton, iosButtonVariants };
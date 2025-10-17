import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "@/lib/investor/utils";

const chipVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors duration-normal',
  {
    variants: {
      variant: {
        primary: 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20',
        secondary: 'bg-muted text-muted-foreground border border-border hover:bg-muted/80',
        success: 'bg-success-light text-success border border-success/20 hover:bg-success/20',
        warning: 'bg-warning-light text-warning border border-warning/20 hover:bg-warning/20',
        outline: 'border border-border hover:bg-accent hover:text-accent-foreground',
        stage: 'bg-gradient-primary text-white border-0 shadow-sm font-semibold',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  children: ReactNode;
}

export function Chip({ className, variant, size, children, ...props }: ChipProps) {
  return (
    <div className={cn(chipVariants({ variant, size, className }))} {...props}>
      {children}
    </div>
  );
}
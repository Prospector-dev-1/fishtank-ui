import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'subtle';
  interactive?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export function EnhancedCard({ 
  children, 
  className, 
  variant = 'default',
  interactive = false,
  animate = true,
  onClick
}: EnhancedCardProps) {
  const baseClasses = "rounded-xl border transition-all duration-300";
  
  const variantClasses = {
    default: "bg-gradient-card border-border shadow-md hover:shadow-platinum",
    glass: "glass-card hover:glass-intense",
    elevated: "bg-gradient-premium border-primary/20 shadow-premium hover:shadow-glow",
    subtle: "glass-subtle hover:glass-card"
  };
  
  const interactiveClasses = interactive 
    ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" 
    : "";
    
  const animateClasses = animate ? "animate-fade-in-up" : "";

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        interactiveClasses,
        animateClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
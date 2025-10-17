import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/investor/utils";

interface HapticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  hapticType?: 'light' | 'medium' | 'heavy';
  disabled?: boolean;
}

export function HapticButton({
  children,
  onClick,
  className,
  variant = 'default',
  size = 'default',
  hapticType = 'light',
  disabled = false
}: HapticButtonProps) {
  const handleClick = () => {
    // Haptic feedback
    if ('vibrate' in navigator && !disabled) {
      const patterns = {
        light: 25,
        medium: 50,
        heavy: 100
      };
      navigator.vibrate(patterns[hapticType]);
    }
    
    onClick?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-200 active:scale-95",
        "hover:shadow-lg hover:shadow-primary/25",
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
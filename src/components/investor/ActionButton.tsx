import { ReactNode } from 'react';
import { cn } from "@/lib/investor/utils";

interface ActionButtonProps {
  icon: ReactNode;
  isActive?: boolean;
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function ActionButton({ 
  icon, 
  isActive = false, 
  count, 
  onClick,
  className 
}: ActionButtonProps) {
  const handleClick = () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex flex-col items-center justify-center w-16 h-16 rounded-full',
        'bg-gradient-primary text-primary-foreground shadow-platinum',
        'hover:scale-110 active:scale-95 transition-all duration-300',
        'hover:shadow-glow',
        'min-h-[44px] min-w-[44px]',
        'relative group ring-0 focus:ring-2 focus:ring-primary/50',
        isActive && 'bg-gradient-accent shadow-glow',
        className
      )}
    >
      <div className={cn(
        'text-white transition-all duration-300 group-hover:scale-110',
        isActive && 'text-white'
      )}>
        {icon}
      </div>
      {count !== undefined && (
        <span className="text-xs text-white font-medium mt-1">
          {count > 999 ? `${Math.floor(count / 1000)}k` : count}
        </span>
      )}
      <span className="absolute -bottom-8 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
        Deep Dive
      </span>
    </button>
  );
}
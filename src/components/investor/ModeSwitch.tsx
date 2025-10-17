import { cn } from "@/lib/investor/utils";

interface ModeSwitchProps {
  mode: 'scroll' | 'swipe';
  onModeChange: (mode: 'scroll' | 'swipe') => void;
}

export function ModeSwitch({ mode, onModeChange }: ModeSwitchProps) {
  return (
    <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full p-1 flex items-center space-x-1 shadow-lg">
      <button
        onClick={() => onModeChange('scroll')}
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
          'min-h-[44px] min-w-[44px] flex items-center justify-center',
          mode === 'scroll'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
        )}
      >
        Scroll
      </button>
      <button
        onClick={() => onModeChange('swipe')}
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
          'min-h-[44px] min-w-[44px] flex items-center justify-center',
          mode === 'swipe'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
        )}
      >
        Swipe
      </button>
    </div>
  );
}
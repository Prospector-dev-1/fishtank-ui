import { useState } from 'react';
import { Plus, MessageCircle, Bookmark, TrendingUp, X } from 'lucide-react';
import { cn } from "@/lib/investor/utils";

interface FloatingActionMenuProps {
  onAction?: (action: string) => void;
}

export function FloatingActionMenu({ onAction }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: MessageCircle, label: 'Message', action: 'message', color: 'bg-blue-500' },
    { icon: Bookmark, label: 'Save', action: 'save', color: 'bg-green-500' },
    { icon: TrendingUp, label: 'Track', action: 'track', color: 'bg-purple-500' },
  ];

  const handleAction = (action: string) => {
    onAction?.(action);
    setIsOpen(false);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col space-y-3 mb-4 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <button
            key={action.action}
            onClick={() => handleAction(action.action)}
            className={cn(
              'w-12 h-12 rounded-full text-white shadow-lg',
              'hover:scale-110 active:scale-95 transition-all duration-200',
              'flex items-center justify-center',
              action.color
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <action.icon size={20} />
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full bg-gradient-primary text-white shadow-lg',
          'hover:scale-110 active:scale-95 transition-all duration-300',
          'flex items-center justify-center',
          'hover:shadow-xl hover:shadow-primary/40',
          isOpen && 'rotate-45'
        )}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
}
import { Home, TrendingUp, MessageCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: TrendingUp, label: 'Tank', path: '/discover' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 pb-safe">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center px-3 py-2 text-xs transition-all duration-300',
                'min-w-0 flex-1 rounded-lg mx-1',
                isActive
                  ? 'text-primary font-semibold bg-primary/10 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'p-1 rounded-lg transition-all duration-300',
                  isActive && 'bg-primary/20 shadow-sm'
                )}>
                  <Icon 
                    size={20} 
                    className={cn(
                      'transition-all duration-300',
                      isActive && 'scale-110 text-primary'
                    )} 
                  />
                </div>
                <span className={cn(
                  "mt-1 truncate transition-all duration-300",
                  isActive && "font-semibold"
                )}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
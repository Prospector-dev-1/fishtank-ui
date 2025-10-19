import { useState, useRef, useCallback, useEffect } from 'react';
import { AdvancedVideoPlayer } from "@/components/investor/AdvancedVideoPlayer";
import { Chip } from "@/components/investor/ui/chip";
import { X, Info, Heart, Clock, Star, Bookmark, Share2, TrendingUp, Users, Calendar } from 'lucide-react';
import { cn } from "@/lib/investor/utils";
import { useHapticFeedback } from "@/hooks/investor/useHapticFeedback";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Startup type - no longer from mockData
interface Startup {
  id: string;
  name: string;
  founder: string;
  stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B';
  sector: string;
  tagline: string;
  description: string;
  shortVideo: string;
  poster: string;
  tags: string[];
  metrics: { interest: number; views: number; };
  milestones: Array<{ label: string; date: string; }>;
  traction: Array<{ metric: string; value: string; date: string; }>;
  team: Array<{ id: string; name: string; role: string; }>;
  [key: string]: any;
}

type SwipeDirection = 'left' | 'right' | 'up' | 'down' | 'diagonal-up-left' | 'diagonal-up-right';

interface SwipeAction {
  direction: SwipeDirection;
  action: () => void;
  label: string;
  icon: React.ReactNode;
  color: string;
  threshold: number;
}

interface SmartSwipeCardProps {
  startup: Startup;
  onSwipeAction: (action: string, startup: Startup) => void;
  swipeActions?: SwipeAction[];
  enableAnalytics?: boolean;
  showMetrics?: boolean;
}

export function SmartSwipeCard({
  startup,
  onSwipeAction,
  swipeActions = [],
  enableAnalytics = true,
  showMetrics = true
}: SmartSwipeCardProps) {
  const [dragState, setDragState] = useState({
    x: 0,
    y: 0,
    isDragging: false,
    velocity: { x: 0, y: 0 },
    direction: null as SwipeDirection | null
  });
  
  const [cardMetrics, setCardMetrics] = useState({
    viewTime: 0,
    interactions: 0,
    swipeAttempts: 0
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0, time: 0 });
  const velocityTracker = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const { triggerHaptic } = useHapticFeedback();

  // Default swipe actions
  const defaultActions: SwipeAction[] = [
    {
      direction: 'left',
      action: () => onSwipeAction('pass', startup),
      label: 'Pass',
      icon: <X size={32} />,
      color: 'rgb(239, 68, 68)',
      threshold: 80
    },
    {
      direction: 'right',
      action: () => onSwipeAction('interested', startup),
      label: 'Interested',
      icon: <Heart size={32} />,
      color: 'rgb(34, 197, 94)',
      threshold: 80
    },
    {
      direction: 'up',
      action: () => onSwipeAction('deep-dive', startup),
      label: 'Deep Dive',
      icon: <Info size={32} />,
      color: 'rgb(59, 130, 246)',
      threshold: 100
    },
    {
      direction: 'down',
      action: () => onSwipeAction('save-later', startup),
      label: 'Save for Later',
      icon: <Clock size={32} />,
      color: 'rgb(168, 85, 247)',
      threshold: 80
    },
    {
      direction: 'diagonal-up-right',
      action: () => onSwipeAction('super-like', startup),
      label: 'Super Like',
      icon: <Star size={32} />,
      color: 'rgb(245, 158, 11)',
      threshold: 120
    },
    {
      direction: 'diagonal-up-left',
      action: () => onSwipeAction('bookmark', startup),
      label: 'Bookmark',
      icon: <Bookmark size={32} />,
      color: 'rgb(20, 184, 166)',
      threshold: 120
    }
  ];

  const actions = swipeActions.length > 0 ? swipeActions : defaultActions;

  const calculateDirection = useCallback((x: number, y: number): SwipeDirection | null => {
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const threshold = 40;

    if (absX < threshold && absY < threshold) return null;

    // Diagonal movements (require both significant X and Y movement)
    if (absX > threshold && absY > threshold) {
      if (x > 0 && y < 0) return 'diagonal-up-right';
      if (x < 0 && y < 0) return 'diagonal-up-left';
    }

    // Primary directions
    if (absX > absY) {
      return x > 0 ? 'right' : 'left';
    } else {
      return y > 0 ? 'down' : 'up';
    }
  }, []);

  const getActiveAction = useCallback((direction: SwipeDirection | null, distance: number) => {
    if (!direction) return null;
    const action = actions.find(a => a.direction === direction);
    return action && distance >= action.threshold ? action : null;
  }, [actions]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    setDragState(prev => ({
      ...prev,
      isDragging: true
    }));

    velocityTracker.current = [];
    triggerHaptic('selection');
  }, [triggerHaptic]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragState.isDragging) return;

    const touch = e.touches[0];
    const x = touch.clientX - startPos.current.x;
    const y = touch.clientY - startPos.current.y;
    const time = Date.now();

    // Track velocity
    velocityTracker.current.push({ x, y, time });
    if (velocityTracker.current.length > 3) {
      velocityTracker.current.shift();
    }

    const direction = calculateDirection(x, y);
    const distance = Math.sqrt(x * x + y * y);

    setDragState(prev => ({
      ...prev,
      x,
      y,
      direction
    }));

    // Haptic feedback for direction changes
    if (direction && direction !== dragState.direction) {
      const action = getActiveAction(direction, distance);
      if (action && distance >= action.threshold * 0.7) {
        triggerHaptic('medium');
      }
    }

    setCardMetrics(prev => ({
      ...prev,
      interactions: prev.interactions + 1
    }));
  }, [dragState.isDragging, dragState.direction, calculateDirection, getActiveAction, triggerHaptic]);

  const handleTouchEnd = useCallback(() => {
    if (!dragState.isDragging) return;

    const { x, y, direction } = dragState;
    const distance = Math.sqrt(x * x + y * y);
    
    // Calculate velocity
    let velocity = { x: 0, y: 0 };
    if (velocityTracker.current.length >= 2) {
      const recent = velocityTracker.current.slice(-2);
      const timeDiff = recent[1].time - recent[0].time;
      if (timeDiff > 0) {
        velocity = {
          x: (recent[1].x - recent[0].x) / timeDiff,
          y: (recent[1].y - recent[0].y) / timeDiff
        };
      }
    }

    setCardMetrics(prev => ({
      ...prev,
      swipeAttempts: prev.swipeAttempts + 1
    }));

    // Check if swipe meets threshold
    const activeAction = getActiveAction(direction, distance);
    const velocityBoost = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) > 0.5;
    
    if (activeAction && (distance >= activeAction.threshold || velocityBoost)) {
      triggerHaptic('success');
      activeAction.action();
    } else {
      triggerHaptic('light');
    }

    // Reset state
    setDragState({
      x: 0,
      y: 0,
      isDragging: false,
      velocity,
      direction: null
    });
  }, [dragState, getActiveAction, triggerHaptic]);

  // Analytics tracking
  useEffect(() => {
    if (!enableAnalytics) return;

    const interval = setInterval(() => {
      setCardMetrics(prev => ({
        ...prev,
        viewTime: prev.viewTime + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [enableAnalytics]);

  const rotation = dragState.x * 0.1;
  const scale = dragState.isDragging ? 1.05 : 1;
  const activeAction = getActiveAction(dragState.direction, Math.sqrt(dragState.x * dragState.x + dragState.y * dragState.y));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background">
      <div
        ref={cardRef}
        className={cn(
          'relative w-full max-w-sm h-[650px] rounded-3xl overflow-hidden',
          'shadow-2xl transform transition-all duration-200',
          'bg-gradient-to-br from-card to-card/95 border border-border/50'
        )}
        style={{
          transform: `translate(${dragState.x}px, ${dragState.y}px) rotate(${rotation}deg) scale(${scale})`,
          boxShadow: activeAction 
            ? `0 0 40px ${activeAction.color}40` 
            : '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced Video Player */}
        <AdvancedVideoPlayer
          primarySrc={startup.shortVideo}
          poster={startup.poster}
          autoplay={false}
          muted={true}
          className="w-full h-full object-cover"
          enableAnalytics={enableAnalytics}
          onTimeUpdate={(currentTime, duration) => {
            // Track video engagement
          }}
        />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="space-y-3">
            {/* Status and Metrics Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Chip 
                  variant={startup.stage === 'Pre-Seed' ? 'warning' : 
                          startup.stage === 'Seed' ? 'primary' : 
                          startup.stage === 'Series A' ? 'success' : 'stage'} 
                  size="sm"
                >
                  {startup.stage}
                </Chip>
                <Chip variant="outline" size="sm" className="text-white border-white/30">
                  {startup.sector}
                </Chip>
              </div>

              {showMetrics && (
                <div className="flex items-center space-x-3 text-white/80 text-xs">
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={12} />
                    <span>{startup.metrics.interest}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={12} />
                    <span>{startup.metrics.views}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                {startup.name}
              </h3>
              
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <span>Founded by {startup.founder}</span>
                {startup.milestones.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{startup.milestones[0].label}</span>
                    </div>
                  </>
                )}
              </div>
              
              <p className="text-white text-base font-medium leading-relaxed">
                {startup.tagline}
              </p>
            </div>

            {/* Traction Metrics */}
            {startup.traction.length > 0 && (
              <div className="flex items-center space-x-4 pt-2">
                {startup.traction.slice(0, 3).map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-white font-bold text-lg">{metric.value}</div>
                    <div className="text-white/70 text-xs">{metric.metric}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {startup.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-white border-white/30 bg-white/10">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Active Swipe Indicator */}
        {activeAction && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="bg-black/30 backdrop-blur-md rounded-2xl p-6 animate-scale-in"
              style={{ color: activeAction.color }}
            >
              <div className="flex flex-col items-center space-y-2">
                {activeAction.icon}
                <span className="text-lg font-bold text-white">
                  {activeAction.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Swipe Hints */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <div className="text-white/60 text-xs bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            ← Pass
          </div>
          <div className="text-white/60 text-xs bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            ↑ Deep Dive
          </div>
          <div className="text-white/60 text-xs bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            → Interested
          </div>
        </div>
      </div>

      {/* Action Summary */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 px-4">
        {actions.slice(0, 4).map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => {
              triggerHaptic('medium');
              action.action();
            }}
            className="min-h-[44px] px-4"
          >
            <span className="mr-2" style={{ color: action.color }}>
              {action.icon}
            </span>
            {action.label}
          </Button>
        ))}
      </div>

      {/* Analytics Display (Development only) */}
      {enableAnalytics && false && (
        <div className="mt-4 bg-muted p-3 rounded-lg text-xs">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-bold">{cardMetrics.viewTime}s</div>
              <div className="text-muted-foreground">View Time</div>
            </div>
            <div>
              <div className="font-bold">{cardMetrics.interactions}</div>
              <div className="text-muted-foreground">Interactions</div>
            </div>
            <div>
              <div className="font-bold">{cardMetrics.swipeAttempts}</div>
              <div className="text-muted-foreground">Swipes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
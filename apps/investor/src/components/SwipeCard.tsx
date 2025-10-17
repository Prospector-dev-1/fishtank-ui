import { useState, useRef } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Chip } from '@/components/ui/chip';
import { X, Info, Heart, Clock } from 'lucide-react';
import { Startup } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { TimeReminderModal } from '@/components/TimeReminderModal';
interface SwipeCardProps {
  startup: Startup;
  onPass: () => void;
  onInterested: () => void;
  onDeepDive: () => void;
  isInterested: boolean;
  onSaveForLater?: () => void;
}
export function SwipeCard({
  startup,
  onPass,
  onInterested,
  onDeepDive,
  isInterested,
  onSaveForLater
}: SwipeCardProps) {
  const [dragOffset, setDragOffset] = useState({
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({
    x: 0,
    y: 0
  });
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    setDragOffset({
      x: currentX - startPos.current.x,
      y: currentY - startPos.current.y
    });
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 80;
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        onInterested();
      } else {
        onPass();
      }
    }
    setDragOffset({
      x: 0,
      y: 0
    });
  };
  const rotation = dragOffset.x * 0.1;
  const isPassingLeft = dragOffset.x < -40;
  const isPassingRight = dragOffset.x > 40;
  return <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background">
      <div ref={cardRef} className={cn('relative w-full max-w-sm h-[600px] rounded-3xl overflow-hidden', 'shadow-xl transform transition-all duration-200', isDragging ? 'scale-105' : 'scale-100')} style={{
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
      boxShadow: isPassingLeft ? '0 0 30px rgba(239, 68, 68, 0.4)' : isPassingRight ? '0 0 30px rgba(34, 197, 94, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.2)'
    }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {/* Video/Image */}
        <VideoPlayer primarySrc={startup.shortVideo} poster={startup.poster} autoplay={false} muted={true} className="w-full h-full object-cover" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Chip variant="stage" size="sm">
                {startup.stage}
              </Chip>
            </div>
            
            <h3 className="text-xl font-bold text-white drop-shadow-lg">
              {startup.name}
            </h3>
            
            <p className="text-sm text-white/80">
              Founded by {startup.founder}
            </p>
            
            <p className="text-white text-sm font-medium">
              {startup.tagline}
            </p>
          </div>
        </div>
        
        {/* Swipe Indicators */}
        {isPassingLeft && <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500/20 rounded-full p-4 backdrop-blur-md">
              <X size={32} className="text-red-500" />
            </div>
          </div>}
        
        {isPassingRight && <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500/20 rounded-full p-4 backdrop-blur-md">
              <Heart size={32} className="text-green-500" />
            </div>
          </div>}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col items-center space-y-4 mt-8">
        {/* Main CTA Button */}
        <button onClick={onDeepDive} className={cn('flex items-center justify-center px-8 py-4 rounded-full', 'bg-primary text-primary-foreground shadow-xl', 'hover:scale-105 active:scale-95 transition-all duration-200', 'text-lg font-semibold min-h-[56px]', 'border-2 border-primary/20')}>
          <Info size={24} className="mr-2" />
          View More
        </button>
        
        {/* Secondary Action Buttons */}
        <div className="flex items-center justify-center space-x-8 pb-24">
          <button onClick={onPass} className={cn('flex items-center justify-center w-14 h-14 rounded-full', 'bg-destructive text-destructive-foreground shadow-lg', 'hover:scale-110 active:scale-95 transition-transform duration-200', 'min-h-[44px] min-w-[44px]')}>
            <X size={20} />
          </button>
          
          <button onClick={() => setShowTimeModal(true)} className={cn('flex flex-col items-center justify-center w-16 h-16 rounded-full', 'bg-success text-white shadow-lg', 'hover:scale-110 active:scale-95 transition-transform duration-200', 'min-h-[44px] min-w-[44px]', 'relative group')}>
            <Clock size={20} />
            <span className="absolute -bottom-8 text-xs font-medium text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Save For Later
            </span>
          </button>
          
          
        </div>
      </div>
      
      <TimeReminderModal isOpen={showTimeModal} onClose={() => setShowTimeModal(false)} startupName={startup.name} />
    </div>;
}
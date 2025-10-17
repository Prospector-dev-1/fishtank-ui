import { useState, useEffect, useRef, useCallback } from 'react';
import { VideoPlayer, VideoPlayerRef } from "@/components/investor/VideoPlayer";
import { ActionButton } from "@/components/investor/ActionButton";
import { SwipeCard } from "@/components/investor/SwipeCard";
import { ModeSwitch } from "@/components/investor/ModeSwitch";
import { BottomModal } from "@/components/investor/BottomModal";
import { TimeReminderModal } from "@/components/investor/TimeReminderModal";
import { Chip } from "@/components/investor/ui/chip";
import { Heart, Bookmark, FileText, MoreHorizontal, Share, Flag, RotateCcw, Info, Clock } from 'lucide-react';
import { mockStartups } from "@/data/investor/mockData";
import { useToast } from "@/components/investor/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/investor/utils";
export default function Discover() {
  const [mode, setMode] = useState<'scroll' | 'swipe'>('scroll');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredStartups, setFilteredStartups] = useState(mockStartups);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState<string | null>(null);

  // TikTok-style scroll mode states
  const [interestedIds, setInterestedIds] = useState(new Set<string>());
  const [savedIds, setSavedIds] = useState(new Set<string>());
  const [lastTap, setLastTap] = useState(0);
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullOffset, setPullOffset] = useState(0);
  const [horizontalSwipe, setHorizontalSwipe] = useState<{
    startX: number;
    currentX: number;
    startupId: string;
    startY: number;
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const videoRefs = useRef<Map<string, VideoPlayerRef>>(new Map());
  const preloadRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const currentStartup = filteredStartups[currentIndex];

  // Intersection Observer for video management
  useEffect(() => {
    if (mode !== 'scroll') return;
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const videoId = entry.target.getAttribute('data-video-id');
        const videoRef = videoRefs.current.get(videoId || '');
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          videoRef?.play();
        } else {
          videoRef?.pause();
        }
      });
    }, {
      threshold: 0.6
    });
    const containers = document.querySelectorAll('[data-video-id]');
    containers.forEach(container => {
      observerRef.current?.observe(container);
    });
    return () => {
      observerRef.current?.disconnect();
    };
  }, [mode, filteredStartups]);

  // Preload next video
  useEffect(() => {
    if (mode !== 'scroll') return;
    const nextStartup = filteredStartups[currentIndex + 1];
    if (nextStartup && preloadRef.current) {
      preloadRef.current.src = nextStartup.shortVideo;
    }
  }, [currentIndex, filteredStartups, mode]);

  // TikTok-style interaction handlers
  const handleDoubleTap = useCallback((startupId: string, e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double tap detected
      setInterestedIds(prev => new Set([...prev, startupId]));
      setLikeAnimation(startupId);

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      // Clear animation
      setTimeout(() => setLikeAnimation(null), 1000);
      toast({
        title: "Interested!",
        description: "Added to your interested list"
      });
    }
    setLastTap(now);
  }, [lastTap, toast]);
  const handlePullRefresh = useCallback((deltaY: number, scrollTop: number) => {
    if (deltaY > 0 && scrollTop === 0) {
      const offset = Math.min(deltaY - 60, 120);
      setPullOffset(offset);
      if (offset >= 60) {
        setIsRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
          setIsRefreshing(false);
          setPullOffset(0);
          toast({
            title: "Refreshed",
            description: "Content updated"
          });
        }, 2000);
      }
    }
  }, [toast]);
  const handleHorizontalSwipeStart = useCallback((e: React.TouchEvent, startupId: string) => {
    setHorizontalSwipe({
      startX: e.touches[0].clientX,
      currentX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startupId
    });
  }, []);
  const handleHorizontalSwipeMove = useCallback((e: React.TouchEvent) => {
    if (!horizontalSwipe) return;
    const deltaY = e.touches[0].clientY - horizontalSwipe.startY;
    const deltaX = e.touches[0].clientX - horizontalSwipe.startX;

    // Only process horizontal swipes (prevent interference with scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      setHorizontalSwipe(prev => prev ? {
        ...prev,
        currentX: e.touches[0].clientX
      } : null);
    }

    // Handle pull to refresh
    const scrollContainer = document.querySelector('.scroll-snap-container');
    if (scrollContainer) {
      handlePullRefresh(deltaY, scrollContainer.scrollTop);
    }
  }, [horizontalSwipe, handlePullRefresh]);
  const handleHorizontalSwipeEnd = useCallback(() => {
    if (!horizontalSwipe) return;
    const deltaX = horizontalSwipe.currentX - horizontalSwipe.startX;
    if (Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        // Right swipe - interested
        setInterestedIds(prev => new Set([...prev, horizontalSwipe.startupId]));
        toast({
          title: "Interested!",
          description: "Added to interested list"
        });
      } else {
        // Left swipe - save
        setSavedIds(prev => new Set([...prev, horizontalSwipe.startupId]));
        toast({
          title: "Saved!",
          description: "Added to saved list"
        });
      }
    }
    setHorizontalSwipe(null);
    setPullOffset(0);
  }, [horizontalSwipe, toast]);
  const handleInterested = () => {
    toast({
      title: "Added to interested",
      description: `${currentStartup.name} added to your interested list.`
    });
  };
  const handleSaved = () => {
    toast({
      title: "Saved",
      description: `${currentStartup.name} added to your saved list.`
    });
  };
  const handleDeepDive = () => {
    navigate(`/investor/startup/${currentStartup.id}/nda`);
  };
  const handlePass = () => {
    if (currentIndex < filteredStartups.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  const handleShare = () => {
    navigator.share?.({
      title: `Check out ${currentStartup.name}`,
      text: currentStartup.tagline,
      url: window.location.href
    }).catch(() => {
      // Fallback for browsers without native share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Startup link copied to clipboard"
      });
    });
  };
  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for helping us maintain quality content."
    });
    setShowMoreModal(false);
  };
  if (!currentStartup) return null;

  // Render swipe mode
  if (mode === 'swipe') {
    return <div className="relative h-screen bg-background">
        {/* Mode Switch */}
        <div className="absolute top-4 right-4 z-10">
          <ModeSwitch mode={mode} onModeChange={setMode} />
        </div>
        
        <SwipeCard startup={currentStartup} onPass={handlePass} onInterested={handleInterested} onDeepDive={handleDeepDive} isInterested={false} />
      </div>;
  }

  // Render scroll mode (TikTok-style)
  return <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Mode Switch */}
      <div className="fixed top-4 right-4 z-50">
        <ModeSwitch mode={mode} onModeChange={setMode} />
      </div>
      
      {/* Pull to Refresh Indicator */}
      {pullOffset > 0 && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-40 backdrop-blur-md bg-white/20 rounded-full p-3" style={{
      transform: `translateX(-50%) translateY(${pullOffset - 60}px)`
    }}>
          <RotateCcw size={20} className={cn("text-white", isRefreshing && "animate-spin")} />
        </div>}
      
      {/* Preload next video */}
      <video ref={preloadRef} preload="metadata" className="hidden" muted />
      
      {/* Scroll Container */}
      <div className="scroll-snap-container">
        {filteredStartups.map((startup, index) => {
        const swipeProgress = horizontalSwipe?.startupId === startup.id ? horizontalSwipe.currentX - horizontalSwipe.startX : 0;
        return <div key={startup.id} className="scroll-snap-item relative" data-video-id={startup.id} onTouchStart={e => {
          handleHorizontalSwipeStart(e, startup.id);
          handleDoubleTap(startup.id, e);
        }} onTouchMove={handleHorizontalSwipeMove} onTouchEnd={handleHorizontalSwipeEnd}>
              <div className="relative h-full w-full transition-smooth" style={{
            transform: `translateX(${swipeProgress * 0.3}px)`
          }}>
                {/* Video Player */}
                <VideoPlayer ref={ref => {
              if (ref) videoRefs.current.set(startup.id, ref);
            }} primarySrc={startup.shortVideo} poster={startup.poster} autoplay={false} muted={true} controls={false} className="h-full w-full object-cover" preloadNext={index < filteredStartups.length - 1 ? filteredStartups[index + 1].shortVideo : undefined} />
                
                {/* Right Swipe Feedback Overlay */}
                {swipeProgress > 80 && <div className="absolute inset-0 bg-success/20 flex items-center justify-center animate-scale-in">
                    <div className="flex items-center space-x-2 text-white">
                      <Heart size={32} className="fill-current" />
                      <span className="text-xl font-bold">Interested!</span>
                    </div>
                  </div>}
                
                {/* Left Swipe Feedback Overlay */}
                {swipeProgress < -80 && <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-scale-in">
                    <div className="flex items-center space-x-2 text-white">
                      <Info size={32} className="fill-current" />
                      <span className="text-xl font-bold">Saved!</span>
                    </div>
                  </div>}
                
                {/* Double-tap Like Animation */}
                {likeAnimation === startup.id && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Heart size={64} className="text-success fill-current animate-bounce-in animate-heart-beat" />
                  </div>}
                
                {/* Right Side Actions */}
                <div className="absolute right-3 bottom-[220px] flex flex-col space-y-4 z-10">
                  <button onClick={() => {
                setShowTimeModal(startup.id);
                if ('vibrate' in navigator) navigator.vibrate(30);
              }} className={cn('flex flex-col items-center justify-center w-14 h-14 rounded-full', 'bg-gradient-to-br from-success to-success/80 text-white shadow-lg shadow-success/30', 'active:scale-95 transition-all duration-200', 'min-h-[44px] min-w-[44px]')}>
                    <Clock size={18} />
                  </button>
                  
                  <button onClick={() => {
                handleReport();
                if ('vibrate' in navigator) navigator.vibrate(50);
              }} className={cn('flex flex-col items-center justify-center w-14 h-14 rounded-full', 'bg-gradient-to-br from-destructive to-destructive/80 text-white shadow-lg shadow-destructive/30', 'active:scale-95 transition-all duration-200', 'min-h-[44px] min-w-[44px]')}>
                    <Flag size={18} />
                  </button>
                  
                  <button onClick={() => navigate(`/investor/startup/${startup.id}/nda`)} className={cn('flex flex-col items-center justify-center w-14 h-14 rounded-full', 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30', 'active:scale-95 transition-all duration-200', 'min-h-[44px] min-w-[44px]')}>
                    <FileText size={18} />
                  </button>
                </div>
                
                {/* Bottom Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 pt-8 pb-20 px-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <div className="space-y-2">
                    {/* Stage and Sector Chips */}
                    <div className="flex items-center space-x-2">
                      <Chip variant={startup.stage === 'Pre-Seed' ? 'warning' : startup.stage === 'Seed' ? 'primary' : startup.stage === 'Series A' ? 'success' : 'stage'} size="sm">
                        {startup.stage}
                      </Chip>
                      <Chip variant="outline" size="sm" className="text-white border-white/30 glass-effect">
                        {startup.sector}
                      </Chip>
                    </div>

                    {/* Startup Info */}
                    <div className="space-y-1">
                      <h2 className="text-2xl text-white font-bold drop-shadow-lg">
                        {startup.name}
                      </h2>
                      <p className="text-sm text-white/80">
                        Founded by {startup.founder}
                      </p>
                      <p className="text-sm text-white font-medium">
                        {startup.tagline}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {startup.tags.map((tag, tagIndex) => <Chip key={tagIndex} variant="outline" size="sm" className="text-white border-white/30 glass-effect hover:bg-white/10">
                          #{tag}
                        </Chip>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>;
      })}
      </div>

      {/* More Options Modal */}
      <BottomModal isOpen={showMoreModal} onClose={() => setShowMoreModal(false)} title="More Options">
        <div className="space-y-4">
          <button onClick={handleShare} className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-muted transition-colors min-h-[44px]">
            <Share size={20} />
            <span>Share Startup</span>
          </button>
          
          <button onClick={handleReport} className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-muted transition-colors text-destructive min-h-[44px]">
            <Flag size={20} />
            <span>Report Content</span>
          </button>
        </div>
      </BottomModal>

      {/* Time Reminder Modal */}
      <TimeReminderModal isOpen={showTimeModal !== null} onClose={() => setShowTimeModal(null)} startupName={showTimeModal ? filteredStartups.find(s => s.id === showTimeModal)?.name || '' : ''} />
    </div>;
}
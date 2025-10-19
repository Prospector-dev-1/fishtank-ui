import { VideoCard } from "./VideoCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/innovator/ui/carousel";
import { PullToRefresh } from "@/components/innovator/ui/pull-to-refresh";
import { EmblaOptionsType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/innovator/use-mobile";
interface VideoFeedProps {
  posts: Array<{
    id: string;
    user: {
      name: string;
      location: string;
      avatar: string;
      company?: string;
      stage?: string;
    };
    content: {
      title?: string;
      description?: string;
      category: 'motivation' | 'day-in-life' | 'challenge' | 'insight' | 'community';
      videoUrl?: string;
      thumbnail?: string;
    };
    tags: string[];
    isConnected: boolean;
    hasPromptTag: boolean;
    postedTime: string;
    engagement: {
      likes: number;
      comments: number;
      shares?: number;
      saves?: number;
      isLiked: boolean;
    };
    comments?: Array<{
      id: string;
      user: string;
      text: string;
      likes: number;
      time: string;
    }>;
  }>;
  onRefresh?: () => Promise<void>;
}
export function VideoFeed({
  posts,
  onRefresh
}: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();
  const options: EmblaOptionsType = {
    axis: 'y',
    loop: false,
    skipSnaps: false,
    dragFree: false,
    startIndex: 0
  };
  const handleRefresh = useCallback(async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast.success("New videos loaded!");
      } catch (error) {
        toast.error("Failed to refresh feed");
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onRefresh, isRefreshing]);

  // Enhanced carousel API for touch/wheel scrolling
  useEffect(() => {
    if (!isMobile) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const carousel = document.querySelector('[data-carousel]');
      if (carousel) {
        if (event.deltaY > 0) {
          // Scroll down - next video
          setCurrentIndex(prev => Math.min(prev + 1, posts.length - 1));
        } else {
          // Scroll up - previous video
          setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
      }
    };
    const handleTouchStart = (event: TouchEvent) => {
      const startY = event.touches[0].clientY;
      document.addEventListener('touchend', function handleTouchEnd(endEvent: TouchEvent) {
        const endY = endEvent.changedTouches[0].clientY;
        const diff = startY - endY;
        if (Math.abs(diff) > 50) {
          // Minimum swipe distance
          if (diff > 0) {
            // Swipe up - next video
            setCurrentIndex(prev => Math.min(prev + 1, posts.length - 1));
          } else {
            // Swipe down - previous video
            setCurrentIndex(prev => Math.max(prev - 1, 0));
          }
        }
        document.removeEventListener('touchend', handleTouchEnd);
      });
    };
    const carousel = document.querySelector('[data-carousel]');
    if (carousel) {
      carousel.addEventListener('wheel', handleWheel as EventListener, {
        passive: false
      });
      carousel.addEventListener('touchstart', handleTouchStart as EventListener, {
        passive: true
      });
      return () => {
        carousel.removeEventListener('wheel', handleWheel as EventListener);
        carousel.removeEventListener('touchstart', handleTouchStart as EventListener);
      };
    }
  }, [posts.length, isMobile]);

  // Smart video management - pause other videos when scrolling
  useEffect(() => {
    if (!isMobile) return;
    const timeout = setTimeout(() => {
      const videos = document.querySelectorAll('video');
      videos.forEach((video, index) => {
        if (index !== currentIndex) {
          video.pause();
          video.currentTime = 0; // Reset video to start
        }
      });
    }, 100);
    return () => clearTimeout(timeout);
  }, [currentIndex, isMobile]);

  // Intersection Observer for better performance
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (video) {
          if (entry.isIntersecting) {
            // Video is visible, can be played
            video.muted = true;
          } else {
            // Video is not visible, pause it
            video.pause();
          }
        }
      });
    }, {
      threshold: 0.8
    });
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => observer.observe(container));
    return () => observer.disconnect();
  }, [posts]);
  return <PullToRefresh onRefresh={handleRefresh} className="relative h-screen w-full overflow-hidden">
      <div className="relative h-screen w-full">
        <Carousel opts={options} orientation="vertical" className="h-screen w-full overflow-hidden" data-carousel>
          <CarouselContent className="h-screen -mt-0">
            {posts.map((post, index) => <CarouselItem key={post.id} className="h-screen pt-0 basis-full" onFocus={() => setCurrentIndex(index)}>
                <VideoCard post={post} />
              </CarouselItem>)}
          </CarouselContent>
        </Carousel>

        {/* Loading indicator */}
        {isRefreshing && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white text-sm">Loading new videos...</span>
            </div>
          </div>}

        {/* Video counter */}
        <div className="absolute top-4 right-4 z-50 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
          
        </div>
      </div>
    </PullToRefresh>;
}
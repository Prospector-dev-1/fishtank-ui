import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Bookmark, Share2, SkipBack, SkipForward } from 'lucide-react';
import { cn } from "@/lib/investor/utils";
import { useHapticFeedback } from "@/hooks/investor/useHapticFeedback";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface AdvancedVideoPlayerRef {
  play: () => Promise<void>;
  pause: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleFullscreen: () => void;
  addBookmark: (time: number, label?: string) => void;
}

interface VideoBookmark {
  id: string;
  time: number;
  label: string;
  thumbnail?: string;
}

interface VideoHotspot {
  id: string;
  time: number;
  x: number;
  y: number;
  content: string;
  action?: () => void;
}

interface AdvancedVideoPlayerProps {
  primarySrc: string;
  fallbackSrc?: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  preloadNext?: string;
  bookmarks?: VideoBookmark[];
  hotspots?: VideoHotspot[];
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onBookmarkAdd?: (bookmark: VideoBookmark) => void;
  onShare?: () => void;
  enableAnalytics?: boolean;
  chapters?: Array<{ time: number; title: string; }>;
}

export const AdvancedVideoPlayer = forwardRef<AdvancedVideoPlayerRef, AdvancedVideoPlayerProps>(({
  primarySrc,
  fallbackSrc,
  poster,
  autoplay = false,
  muted = true,
  loop = false,
  className,
  preloadNext,
  bookmarks = [],
  hotspots = [],
  onTimeUpdate,
  onBookmarkAdd,
  onShare,
  enableAnalytics = true,
  chapters = []
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { triggerHaptic } = useHapticFeedback();

  // Analytics tracking
  const analyticsRef = useRef({
    startTime: 0,
    watchSessions: 0,
    totalWatchTime: 0,
    seekCount: 0,
    pauseCount: 0,
    replayCount: 0
  });

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          triggerHaptic('light');
        } catch (error) {
          console.error('Play failed:', error);
        }
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        triggerHaptic('light');
      }
    },
    getCurrentTime: () => currentTime,
    getDuration: () => duration,
    seekTo: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
        analyticsRef.current.seekCount++;
        triggerHaptic('selection');
      }
    },
    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
      }
    },
    toggleFullscreen: () => {
      toggleFullscreen();
    },
    addBookmark: (time: number, label?: string) => {
      const bookmark: VideoBookmark = {
        id: `bookmark_${Date.now()}`,
        time,
        label: label || `Bookmark at ${formatTime(time)}`
      };
      onBookmarkAdd?.(bookmark);
      triggerHaptic('success');
    }
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setCurrentTime(currentTime);
      setDuration(duration);
      onTimeUpdate?.(currentTime, duration);

      // Analytics tracking
      if (enableAnalytics && isPlaying) {
        setWatchTime(prev => prev + 0.1);
        const progress = currentTime / duration;
        setEngagementScore(prev => Math.min(100, prev + (progress * 0.1)));
      }
    }
  }, [isPlaying, onTimeUpdate, enableAnalytics]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
        analyticsRef.current.pauseCount++;
        triggerHaptic('light');
      } else {
        await video.play();
        setIsPlaying(true);
        if (analyticsRef.current.startTime === 0) {
          analyticsRef.current.startTime = Date.now();
          analyticsRef.current.watchSessions++;
        }
        triggerHaptic('light');
      }
    } catch (error) {
      console.error('Toggle play failed:', error);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      triggerHaptic('selection');
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const handleSeek = (newTime: number[]) => {
    const time = newTime[0];
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      analyticsRef.current.seekCount++;
      triggerHaptic('selection');
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      triggerHaptic('medium');
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const addBookmarkAtCurrentTime = () => {
    const bookmark: VideoBookmark = {
      id: `bookmark_${Date.now()}`,
      time: currentTime,
      label: `Bookmark at ${formatTime(currentTime)}`
    };
    onBookmarkAdd?.(bookmark);
    triggerHaptic('success');
  };

  const getCurrentHotspots = () => {
    return hotspots.filter(hotspot => 
      Math.abs(hotspot.time - currentTime) < 1
    );
  };

  const handleVideoError = () => {
    if (fallbackSrc && currentSrc === primarySrc) {
      console.log('Primary video failed, switching to fallback');
      setCurrentSrc(fallbackSrc);
    } else {
      console.error('Video failed to load');
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (preloadNext) {
      const preloadVideo = document.createElement('video');
      preloadVideo.src = preloadNext;
      preloadVideo.preload = 'metadata';
    }
  }, [preloadNext]);

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden bg-black group', className)}
      onMouseMove={showControlsTemporarily}
      onClick={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        muted={isMuted}
        loop={loop}
        autoPlay={autoplay}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onError={handleVideoError}
      />

      {/* Video Hotspots */}
      {getCurrentHotspots().map(hotspot => (
        <div
          key={hotspot.id}
          className="absolute animate-pulse cursor-pointer z-20"
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          onClick={() => {
            hotspot.action?.();
            triggerHaptic('impact');
          }}
        >
          <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50 hover:scale-125 transition-transform">
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {hotspot.content}
          </div>
        </div>
      ))}

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Video Controls */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 z-20',
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
      )}>
        {/* Progress Bar with Bookmarks */}
        <div className="relative mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
          />
          
          {/* Bookmark Indicators */}
          {bookmarks.map(bookmark => (
            <button
              key={bookmark.id}
              className="absolute top-0 w-2 h-2 bg-warning rounded-full transform -translate-x-1/2 hover:scale-150 transition-transform"
              style={{ left: `${(bookmark.time / duration) * 100}%` }}
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = bookmark.time;
                  triggerHaptic('selection');
                }
              }}
              title={bookmark.label}
            />
          ))}
          
          {/* Chapter Markers */}
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className="absolute top-0 w-0.5 h-4 bg-primary/50"
              style={{ left: `${(chapter.time / duration) * 100}%` }}
              title={chapter.title}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(-10)}
              className="text-white hover:bg-white/20"
            >
              <SkipBack size={20} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(10)}
              className="text-white hover:bg-white/20"
            >
              <SkipForward size={20} />
            </Button>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>

            <span className="text-white text-sm ml-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={addBookmarkAtCurrentTime}
              className="text-white hover:bg-white/20"
            >
              <Bookmark size={20} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              className="text-white hover:bg-white/20"
            >
              <Share2 size={20} />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Settings size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Playback Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        if (videoRef.current) videoRef.current.playbackRate = rate;
                      }}
                      className={cn(
                        'block w-full text-left px-2 py-1 text-sm rounded hover:bg-muted',
                        playbackRate === rate && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Overlay (Development) */}
      {enableAnalytics && false && (
        <div className="absolute top-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-30">
          <div>Watch Time: {formatTime(watchTime)}</div>
          <div>Engagement: {engagementScore.toFixed(1)}%</div>
          <div>Seeks: {analyticsRef.current.seekCount}</div>
          <div>Sessions: {analyticsRef.current.watchSessions}</div>
        </div>
      )}
    </div>
  );
});
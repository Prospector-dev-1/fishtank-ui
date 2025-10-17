import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoPlayerRef {
  play: () => Promise<void>;
  pause: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

interface VideoPlayerProps {
  primarySrc: string;
  fallbackSrc?: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  className?: string;
  preloadNext?: string;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  primarySrc,
  fallbackSrc,
  poster,
  autoplay = false,
  muted = true,
  controls = false,
  loop = true,
  className,
  preloadNext,
  onVisibilityChange
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(!autoplay);
  const [currentSrc, setCurrentSrc] = useState(primarySrc);

  // Expose video controls through ref
  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Play failed:', error);
        }
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
    getCurrentTime: () => videoRef.current?.currentTime || 0,
    getDuration: () => videoRef.current?.duration || 0,
  }));

  // Preload next video
  useEffect(() => {
    if (preloadNext && preloadRef.current) {
      preloadRef.current.src = preloadNext;
    }
  }, [preloadNext]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Toggle play failed:', error);
    }
  };

  const handleVideoClick = () => {
    if (!controls) {
      togglePlay();
    }
  };

  const handleVideoError = () => {
    if (fallbackSrc && currentSrc === primarySrc) {
      console.log('Primary video failed, switching to fallback');
      setCurrentSrc(fallbackSrc);
    } else {
      console.error('Video failed to load');
    }
  };

  return (
    <div className={cn('relative overflow-hidden bg-black', className)}>
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        muted={muted}
        controls={controls}
        loop={loop}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover cursor-pointer"
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleVideoError}
      />
      
      {/* Hidden preload video */}
      {preloadNext && (
        <video
          ref={preloadRef}
          className="hidden"
          muted
          preload="metadata"
        />
      )}
      
      {/* Play/Pause Overlay */}
      {showControls && !controls && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200"
        >
          <div className="bg-black/50 rounded-full p-3">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>
      )}
    </div>
  );
});
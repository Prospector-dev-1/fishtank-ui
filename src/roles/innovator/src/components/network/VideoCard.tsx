import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Pause, Heart, MessageCircle, Share, UserPlus, Send, MapPin, Award, Briefcase, Volume2, VolumeX, Search } from "lucide-react";
import { toast } from "sonner";
interface VideoCardProps {
  post: {
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
  };
}
const categoryLabels = {
  motivation: "💪 Motivation",
  'day-in-life': "🌅 Day in Life",
  challenge: "⚡ Challenge",
  insight: "💡 Insight",
  community: "🤝 Community"
};
const categoryColors = {
  motivation: "bg-green-100 text-green-800 border-green-200",
  'day-in-life': "bg-blue-100 text-blue-800 border-blue-200",
  challenge: "bg-red-100 text-red-800 border-red-200",
  insight: "bg-yellow-100 text-yellow-800 border-yellow-200",
  community: "bg-purple-100 text-purple-800 border-purple-200"
};
export function VideoCard({
  post
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(post.engagement.isLiked);
  const [likesCount, setLikesCount] = useState(post.engagement.likes);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Video event handlers
  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);
  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, []);
  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    toast.success(isLiked ? "Removed like" : "Video liked!");
  }, [isLiked, likesCount]);
  const handleConnect = useCallback(() => {
    if (!post.isConnected) {
      toast.success(`Connection request sent to ${post.user.name}!`);
    }
  }, [post.isConnected, post.user.name]);
  const handleMessage = useCallback(() => {
    setShowComments(!showComments);
  }, [showComments]);
  const handleShare = useCallback(() => {
    toast.success("Video link copied to clipboard!");
  }, []);
  const handleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  }, [isMuted]);

  // Double-tap to like gesture
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      handleLike();
      // Heart animation effect
      const heartElement = document.createElement('div');
      heartElement.innerHTML = '❤️';
      heartElement.className = 'absolute inset-0 flex items-center justify-center text-6xl animate-scale-in pointer-events-none z-30';
      document.querySelector('.video-container')?.appendChild(heartElement);
      setTimeout(() => heartElement.remove(), 1000);
    } else {
      handlePlayPause();
    }
    setLastTap(now);
  }, [lastTap, handleLike, handlePlayPause]);
  return <div className="video-container relative w-full h-[calc(100vh-140px)] flex flex-col bg-black overflow-hidden">
      {/* Video Content Area */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        {/* Actual Video Element */}
        {post.content.videoUrl ? <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" src={post.content.videoUrl} poster={post.content.thumbnail} controls={false} muted={isMuted} loop playsInline onClick={handleDoubleTap} onPlay={handleVideoPlay} onPause={handleVideoPause} onEnded={handleVideoEnded} onLoadedData={() => {
        if (videoRef.current && isPlaying) {
          videoRef.current.play().catch(console.error);
        }
      }} /> : <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30" onClick={handleDoubleTap}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {!isPlaying && <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Button size="lg" className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20" onClick={handlePlayPause}>
                      <Play className="w-8 h-8 text-white ml-1" />
                    </Button>
                  </div>}
                <div className="w-64 h-64 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                  <span className="text-white/60 text-sm text-center px-4">
                    {post.content.title || `${post.user.name}'s ${categoryLabels[post.content.category]} video`}
                  </span>
                </div>
              </div>
            </div>
          </div>}

        {/* Play/Pause Button Overlay for real videos */}
        {post.content.videoUrl && !isPlaying && <div className="absolute inset-0 flex items-center justify-center z-10 px-0">
            <Button size="lg" className="w-16 h-16 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border-white/20" onClick={handlePlayPause}>
              <Play className="w-8 h-8 text-white ml-1" />
            </Button>
          </div>}
      </div>

      {/* Top Content Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent py-0 px-[10px] mx-0 my-[4px]">
        <div className="flex items-start gap-3 my-[7px]">
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback className="bg-primary text-black text-base">
              {post.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-lg">{post.user.name}</h3>
              {post.hasPromptTag && <Badge className="bg-blue-600 text-white">
                  #prompt
                </Badge>}
            </div>
            
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {post.user.location}
              </div>
              {post.user.company && <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {post.user.company}
                </div>}
              {post.user.stage && <Badge variant="outline" className="border-white/30 text-white text-xs">
                  {post.user.stage}
                </Badge>}
            </div>

            <div className="flex gap-2 mt-2">
              {post.tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                  {tag}
                </Badge>)}
            </div>
          </div>

          <Badge className={`${categoryColors[post.content.category]} text-xs`}>
            {categoryLabels[post.content.category]}
          </Badge>
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        
        
        <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border-white/20" onClick={handleMute}>
          {isMuted ? <VolumeX className="w-4 h-4 text-white px-0 mx-0 py-[2px] my-[7px]" /> : <Volume2 className="w-4 h-4 text-white" />}
        </Button>
      </div>

      {/* Right Side Action Buttons */}
      <div className="absolute right-4 bottom-20 z-20 flex flex-col gap-4 py-[2px] px-0 mx-0 my-0">
        <Button size="lg" variant="ghost" className={`w-14 h-14 rounded-full ${isLiked ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'} backdrop-blur-sm border-white/20 flex flex-col gap-1 transition-all duration-200`} onClick={handleLike}>
          <Heart className={`w-6 h-6 ${isLiked ? 'text-white fill-current' : 'text-white'}`} />
          <span className="text-white text-xs">{likesCount}</span>
        </Button>

        <Button size="lg" variant="ghost" className={`w-14 h-14 rounded-full ${showComments ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 hover:bg-white/20'} backdrop-blur-sm border-white/20 flex flex-col gap-1`} onClick={handleMessage}>
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="text-white text-xs">{post.engagement.comments}</span>
        </Button>

        {!post.isConnected && <Button size="lg" variant="ghost" className="w-14 h-14 rounded-full bg-primary/80 hover:bg-primary backdrop-blur-sm border-white/20 flex flex-col gap-1" onClick={handleConnect}>
            <UserPlus className="w-6 h-6 text-white" />
            <span className="text-white text-xs">Connect</span>
          </Button>}

        
      </div>

      {/* Comments Drawer */}
      {showComments && post.comments && <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-sm border-t border-white/10 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Comments</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowComments(false)} className="text-white/60 hover:text-white">
                ×
              </Button>
            </div>
            <div className="space-y-3">
              {post.comments.map(comment => <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {comment.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-white/10 rounded-lg p-2">
                      <p className="text-white font-medium text-sm">{comment.user}</p>
                      <p className="text-white/90 text-sm">{comment.text}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-white/60">
                      <span>{comment.time}</span>
                      <button className="hover:text-white">❤️ {comment.likes}</button>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}

      {/* Bottom Content Description */}
      {post.content.description && <div className="absolute bottom-4 left-4 right-20 z-20">
          <div className="text-white text-sm leading-relaxed backdrop-blur-sm rounded-lg p-3 border border-white/10 bg-gray-500 py-[10px] my-[45px] mx-[10px] px-[6px]">
            {isDescriptionExpanded ? <p onClick={() => setIsDescriptionExpanded(false)} className="cursor-pointer">
                {post.content.description}
              </p> : <p onClick={() => setIsDescriptionExpanded(true)} className="cursor-pointer">
                {post.content.description.length > 50 ? `${post.content.description.substring(0, 50)}...` : post.content.description}
              </p>}
          </div>
        </div>}
    </div>;
}
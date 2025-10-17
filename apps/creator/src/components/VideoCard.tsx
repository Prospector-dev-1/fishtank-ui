import { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Brief } from "@/lib/types";

interface VideoCardProps {
  item: Brief;
  type: "innovation" | "gig";
  onSeeMore: (item: Brief) => void;
  onOfferHelp: (item: Brief) => void;
}

export function VideoCard({ item, type, onSeeMore, onOfferHelp }: VideoCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share logic here
  };

  const isInnovation = type === "innovation";
  const brief = item as Brief;

  return (
    <Card 
      className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group bg-gradient-card border-0 shadow-sm"
      onClick={() => onSeeMore(item)}
    >
      {/* Background Image/Video */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${item.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Top Overlay - Username/Creator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        {isInnovation && brief.innovator && (
          <>
            <img 
              src={brief.innovator.avatar}
              alt={brief.innovator.name}
              className="w-8 h-8 rounded-full border-2 border-white/80"
            />
            <span className="text-white font-medium text-sm drop-shadow-lg">
              @{brief.innovator.name.toLowerCase().replace(' ', '')}
            </span>
          </>
        )}
        {item.ndaRequired && (
          <Badge variant="secondary" className="bg-warning/90 text-warning-foreground text-xs">
            <Lock className="h-3 w-3 mr-1" />
            NDA
          </Badge>
        )}
      </div>

      {/* Category Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="secondary" className="bg-black/50 text-white border-0">
          {item.category}
        </Badge>
      </div>

      {/* Side Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-4 z-10">
        <Button
          size="icon" 
          variant="ghost"
          className="rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm h-12 w-12"
          onClick={handleLike}
        >
          <Heart className={cn("h-6 w-6", isLiked && "fill-red-500 text-red-500")} />
        </Button>
        
        <Button
          size="icon"
          variant="ghost" 
          className="rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm h-12 w-12"
          onClick={(e) => {
            e.stopPropagation();
            onOfferHelp(item);
          }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm h-12 w-12"
          onClick={handleShare}
        >
          <Share className="h-6 w-6" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm h-12 w-12"
        >
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-20 z-10">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 drop-shadow-lg">
          {item.title}
        </h3>
        
        <p className="text-white/90 text-sm mb-3 line-clamp-2 drop-shadow-md">
          {item.summary || item.description}
        </p>
        
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <span className="font-semibold">${item.budget.toLocaleString()}</span>
          <span>{item.timeline}</span>
          <span>{item.postedAt}</span>
        </div>

        <div className="flex gap-2 mt-2">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
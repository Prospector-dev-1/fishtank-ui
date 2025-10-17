import { useState } from "react";
import { Card, CardContent } from "@/components/innovator/ui/card";
import { Button } from "@/components/innovator/ui/button";
import { Avatar, AvatarFallback } from "@/components/innovator/ui/avatar";
import { Heart, MessageCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThoughtComments } from "./ThoughtComments";
import { useNavigate } from "react-router-dom";

interface ThoughtCardProps {
  thought: {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    profiles?: {
      full_name: string | null;
      avatar_url: string | null;
    };
  };
  currentUserId?: string;
  isLiked?: boolean;
  onDelete?: () => void;
  onLikeToggle?: () => void;
}

export function ThoughtCard({ thought, currentUserId, isLiked, onDelete, onLikeToggle }: ThoughtCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(thought.comments_count || 0);

  const handleDelete = async () => {
    if (!currentUserId || thought.user_id !== currentUserId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('thoughts')
        .delete()
        .eq('id', thought.id);

      if (error) throw error;
      
      toast.success("Thought deleted");
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete thought");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/profile/${thought.user_id}`)}
            className="hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {getInitials(thought.profiles?.full_name || null)}
              </AvatarFallback>
            </Avatar>
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <button 
                onClick={() => navigate(`/profile/${thought.user_id}`)}
                className="hover:opacity-80 transition-opacity text-left"
              >
                <p className="font-medium text-sm">
                  {thought.profiles?.full_name || "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(thought.created_at), { addSuffix: true })}
                </p>
              </button>
              
              {currentUserId === thought.user_id && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words mb-3">
              {thought.content}
            </p>
            
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 gap-2 px-2 ${isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
                onClick={onLikeToggle}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{thought.likes_count}</span>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-2 px-2 text-muted-foreground"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{commentCount}</span>
                {showComments ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <ThoughtComments
            thoughtId={thought.id}
            currentUserId={currentUserId}
            onCommentCountChange={setCommentCount}
          />
        )}
      </CardContent>
    </Card>
  );
}

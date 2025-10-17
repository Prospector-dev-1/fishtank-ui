import { useState, useEffect } from "react";
import { Button } from "@/components/innovator/ui/button";
import { Textarea } from "@/components/innovator/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/innovator/ui/avatar";
import { Trash2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Comment {
  id: string;
  thought_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface ThoughtCommentsProps {
  thoughtId: string;
  currentUserId?: string;
  onCommentCountChange?: (count: number) => void;
}

export function ThoughtComments({ thoughtId, currentUserId, onCommentCountChange }: ThoughtCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [thoughtId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('thought_comments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('thought_id', thoughtId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
      onCommentCountChange?.(data?.length || 0);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!currentUserId) {
      toast.error("Please log in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    if (newComment.length > 500) {
      toast.error("Comment is too long (max 500 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('thought_comments')
        .insert({
          thought_id: thoughtId,
          user_id: currentUserId,
          content: newComment.trim()
        });

      if (error) throw error;

      // Update comment count on the thought
      const { error: updateError } = await supabase
        .from('thoughts')
        .update({ comments_count: comments.length + 1 })
        .eq('id', thoughtId);

      if (updateError) console.error('Error updating comment count:', updateError);

      setNewComment("");
      toast.success("Comment added!");
      await loadComments();
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('thought_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Update comment count on the thought
      const { error: updateError } = await supabase
        .from('thoughts')
        .update({ comments_count: Math.max(0, comments.length - 1) })
        .eq('id', thoughtId);

      if (updateError) console.error('Error updating comment count:', updateError);

      toast.success("Comment deleted");
      await loadComments();
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error(error);
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
    <div className="space-y-4 pt-3 border-t">
      {/* Comments List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-2">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(comment.profiles?.full_name || null)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-xs">
                        {comment.profiles?.full_name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm mt-1 break-words">{comment.content}</p>
                  </div>
                  
                  {currentUserId === comment.user_id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[60px] resize-none text-sm"
          maxLength={500}
          disabled={!currentUserId}
        />
        <Button
          onClick={handleSubmitComment}
          disabled={isSubmitting || !newComment.trim() || !currentUserId}
          size="sm"
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-right">
        {newComment.length}/500
      </p>
    </div>
  );
}

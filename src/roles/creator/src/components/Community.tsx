import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Thought {
  id: string;
  content: string;
  created_at: string;
  creator_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
  likes: { user_id: string }[];
  comments: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
      full_name: string;
      avatar_url: string | null;
    };
  }[];
}

export function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newThought, setNewThought] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadThoughts();
  }, []);

  const loadThoughts = async () => {
    try {
      setLoading(true);
      const { data: thoughtsData, error } = await supabase
        .from("thoughts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Load related data for each thought
      const thoughtsWithData = await Promise.all(
        (thoughtsData || []).map(async (thought) => {
          const [profileRes, likesRes, commentsRes] = await Promise.all([
            supabase.from("profiles").select("full_name, avatar_url").eq("id", thought.creator_id).single(),
            supabase.from("thought_likes").select("user_id").eq("thought_id", thought.id),
            supabase.from("thought_comments").select("id, content, created_at, user_id").eq("thought_id", thought.id).order("created_at", { ascending: true })
          ]);

          // Load profiles for comments
          const commentsWithProfiles = await Promise.all(
            (commentsRes.data || []).map(async (comment) => {
              const { data: commentProfile } = await supabase
                .from("profiles")
                .select("full_name, avatar_url")
                .eq("id", comment.user_id)
                .single();

              return {
                ...comment,
                profiles: commentProfile || { full_name: "Unknown", avatar_url: null }
              };
            })
          );

          return {
            ...thought,
            profiles: profileRes.data || { full_name: "Unknown", avatar_url: null },
            likes: likesRes.data || [],
            comments: commentsWithProfiles
          };
        })
      );

      setThoughts(thoughtsWithData);
    } catch (error) {
      console.error("Error loading thoughts:", error);
      toast({ title: "Failed to load community feed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePostThought = async () => {
    if (!newThought.trim() || !user) return;

    setPosting(true);
    try {
      const { error } = await supabase.from("thoughts").insert({
        content: newThought,
        creator_id: user.id,
      });

      if (error) throw error;

      setNewThought("");
      toast({ title: "Thought posted!" });
      loadThoughts();
    } catch (error) {
      console.error("Error posting thought:", error);
      toast({ title: "Failed to post thought", variant: "destructive" });
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (thoughtId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from("thought_likes")
          .delete()
          .eq("thought_id", thoughtId)
          .eq("user_id", user.id);
      } else {
        await supabase.from("thought_likes").insert({
          thought_id: thoughtId,
          user_id: user.id,
        });
      }
      loadThoughts();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComment = async (thoughtId: string) => {
    const content = commentInputs[thoughtId]?.trim();
    if (!content || !user) return;

    try {
      const { error } = await supabase.from("thought_comments").insert({
        thought_id: thoughtId,
        user_id: user.id,
        content,
      });

      if (error) throw error;

      setCommentInputs({ ...commentInputs, [thoughtId]: "" });
      loadThoughts();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({ title: "Failed to post comment", variant: "destructive" });
    }
  };

  const handleDeleteThought = async (thoughtId: string) => {
    if (!confirm("Delete this thought?")) return;

    try {
      const { error } = await supabase
        .from("thoughts")
        .delete()
        .eq("id", thoughtId);

      if (error) throw error;
      toast({ title: "Thought deleted" });
      loadThoughts();
    } catch (error) {
      console.error("Error deleting thought:", error);
      toast({ title: "Failed to delete thought", variant: "destructive" });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const { error } = await supabase
        .from("thought_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
      loadThoughts();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Filter thoughts based on search term
  const filteredThoughts = thoughts.filter((thought) =>
    thought.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading community feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Section */}
      <div className="relative animate-slide-up">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search creators by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-base shadow-card border-border/50 focus:shadow-elegant transition-shadow duration-200"
        />
      </div>
      {/* Post new thought */}
      <Card className="p-4 shadow-card border-border/50">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.user_metadata?.full_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share your thoughts with the community..."
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button onClick={handlePostThought} disabled={posting || !newThought.trim()}>
                {posting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {filteredThoughts.map((thought) => {
          const isLiked = thought.likes.some((like) => like.user_id === user?.id);
          const likesCount = thought.likes.length;
          const commentsCount = thought.comments.length;
          const isOwner = thought.creator_id === user?.id;

          return (
            <Card key={thought.id} className="p-4 shadow-card border-border/50 hover:shadow-elegant transition-shadow">
              <div className="flex gap-3">
                <Avatar
                  className="cursor-pointer"
                  onClick={() => navigate(`/creators/${thought.creator_id}`)}
                >
                  <AvatarImage src={thought.profiles.avatar_url || undefined} />
                  <AvatarFallback>{thought.profiles.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p
                        className="font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate(`/creators/${thought.creator_id}`)}
                      >
                        {thought.profiles.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(thought.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteThought(thought.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p className="text-foreground whitespace-pre-wrap mb-3">{thought.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleLike(thought.id, isLiked)}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{likesCount}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        setShowComments({ ...showComments, [thought.id]: !showComments[thought.id] })
                      }
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{commentsCount}</span>
                    </Button>
                  </div>

                  {/* Comments section */}
                  {showComments[thought.id] && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      {thought.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.profiles.avatar_url || undefined} />
                            <AvatarFallback>{comment.profiles.full_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted/50 rounded-lg p-2">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium">{comment.profiles.full_name}</p>
                              {comment.user_id === user?.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-foreground">{comment.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Add comment */}
                      <div className="flex gap-2 mt-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.user_metadata?.avatar_url} />
                          <AvatarFallback>{user?.user_metadata?.full_name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            placeholder="Write a comment..."
                            value={commentInputs[thought.id] || ""}
                            onChange={(e) =>
                              setCommentInputs({ ...commentInputs, [thought.id]: e.target.value })
                            }
                            className="min-h-[60px] resize-none text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleComment(thought.id)}
                            disabled={!commentInputs[thought.id]?.trim()}
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {filteredThoughts.length === 0 && thoughts.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No creators found matching "{searchTerm}"</p>
          </div>
        )}
        
        {thoughts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No thoughts yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}

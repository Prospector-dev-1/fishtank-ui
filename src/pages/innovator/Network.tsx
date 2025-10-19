import { useState, useEffect } from "react";
import { Input } from "@/components/innovator/ui/input";
import { EmptyState } from "@/components/innovator/ui/empty-state";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { Search, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreateThought } from "@/components/innovator/network/CreateThought";
import { ThoughtCard } from "@/components/innovator/network/ThoughtCard";

export default function Network() {
  const [searchQuery, setSearchQuery] = useState('');
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [likedThoughts, setLikedThoughts] = useState<Set<string>>(new Set());
  const [isLoadingThoughts, setIsLoadingThoughts] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadThoughts();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data) setUserProfile(data);
        
        // Load liked thoughts
        const { data: likes } = await supabase
          .from('thought_likes')
          .select('thought_id')
          .eq('user_id', user.id);
        
        if (likes) {
          setLikedThoughts(new Set(likes.map(l => l.thought_id)));
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadThoughts = async () => {
    setIsLoadingThoughts(true);
    try {
      const { data, error } = await supabase
        .from('thoughts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThoughts(data || []);
    } catch (error) {
      console.error('Error loading thoughts:', error);
      toast.error("Failed to load thoughts");
    } finally {
      setIsLoadingThoughts(false);
    }
  };

  const handleLikeToggle = async (thoughtId: string) => {
    if (!currentUserId) {
      toast.error("Please log in to like thoughts");
      return;
    }

    const isCurrentlyLiked = likedThoughts.has(thoughtId);
    const thought = thoughts.find(t => t.id === thoughtId);
    if (!thought) return;
    
    try {
      if (isCurrentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from('thought_likes')
          .delete()
          .eq('thought_id', thoughtId)
          .eq('user_id', currentUserId);

        if (error) throw error;

        // Update local state
        const newLiked = new Set(likedThoughts);
        newLiked.delete(thoughtId);
        setLikedThoughts(newLiked);

        // Update count
        await supabase
          .from('thoughts')
          .update({ likes_count: Math.max(0, thought.likes_count - 1) })
          .eq('id', thoughtId);
      } else {
        // Like
        const { error } = await supabase
          .from('thought_likes')
          .insert({
            thought_id: thoughtId,
            user_id: currentUserId
          });

        if (error) throw error;

        // Update local state
        const newLiked = new Set(likedThoughts);
        newLiked.add(thoughtId);
        setLikedThoughts(newLiked);

        // Update count
        await supabase
          .from('thoughts')
          .update({ likes_count: thought.likes_count + 1 })
          .eq('id', thoughtId);
      }

      // Reload thoughts to get updated counts
      await loadThoughts();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Failed to update like");
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <FishtankHeader 
        title="Network" 
        showLogo={false} 
        showProfile={true}
      />
      
      {/* Search Bar */}
      <div className="sticky top-14 z-30 bg-background border-b border-border px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for innovators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/30 border-none"
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="min-h-screen p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          <CreateThought 
            userProfile={userProfile}
            onThoughtCreated={loadThoughts}
          />
          
          {isLoadingThoughts ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading thoughts...</p>
            </div>
          ) : thoughts.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title="No thoughts yet"
              description="Be the first to share your thoughts with the community!"
            />
          ) : (
            <div className="space-y-3">
              {thoughts.map((thought) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  currentUserId={currentUserId}
                  isLiked={likedThoughts.has(thought.id)}
                  onDelete={loadThoughts}
                  onLikeToggle={() => handleLikeToggle(thought.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

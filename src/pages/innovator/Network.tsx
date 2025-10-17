import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoFeed } from "@/components/network/VideoFeed";
import { FishtankHeader } from "@/components/layout/FishtankHeader";
import { connectionsAPI } from "@/lib/fishtankApiExtended";
import { Users, Video, Heart, MessageCircle, Plus, Filter, Search, Award, MapPin, Calendar, TrendingUp, Zap, Compass, UserPlus, Sparkles, Play, Globe, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreateThought } from "@/components/network/CreateThought";
import { ThoughtCard } from "@/components/network/ThoughtCard";

export default function Network() {
  const [activeTab, setActiveTab] = useState('discover');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    stage: '',
    location: '',
    availability: '',
    sort: 'new'
  });
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

  const handleNetworkSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Mock data for network feed with video content
  const mockPosts = [{
    id: '1',
    user: {
      name: 'Sarah Kim',
      location: 'Vancouver, BC',
      avatar: 'SK',
      company: 'NeuralSync AI',
      stage: 'Seed',
      followers: 1200,
      verified: true
    },
    content: {
      title: 'Why I left Google to build an AI startup',
      description: 'Three months ago, I walked away from my dream job at Google to start NeuralSync. Here\'s the real story behind that decision and what I\'ve learned about taking the leap into entrepreneurship. 💡 Sometimes the biggest risk is not taking one at all!',
      category: 'motivation' as const,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      duration: '2:15'
    },
    tags: ['AI', 'B2B SaaS', 'Seed', 'Google', 'Career'],
    isConnected: false,
    hasPromptTag: false,
    postedTime: '2h ago',
    engagement: {
      likes: 847,
      comments: 126,
      shares: 45,
      saves: 89,
      isLiked: false
    },
    comments: [{
      id: '1',
      user: 'Mike Chen',
      text: 'Inspiring story! Going through the same decision right now',
      likes: 12,
      time: '1h ago'
    }, {
      id: '2',
      user: 'Lisa Park',
      text: 'The part about imposter syndrome really hit home 💪',
      likes: 8,
      time: '45m ago'
    }, {
      id: '3',
      user: 'Alex Rivera',
      text: 'Would love to hear more about your first customers!',
      likes: 5,
      time: '30m ago'
    }]
  }, {
    id: '2',
    user: {
      name: 'Michael Chen',
      location: 'Toronto, ON',
      avatar: 'MC',
      company: 'EcoFlow Systems',
      stage: 'MVP',
      followers: 890,
      verified: false
    },
    content: {
      title: 'Weekly Prompt: Our biggest market assumption fail',
      description: 'This week\'s prompt hit close to home! We thought businesses wanted cheaper energy solutions. Turns out, they just want RELIABLE ones. Here\'s how this insight completely changed our product roadmap and saved us 6 months of development. 🔄',
      category: 'community' as const,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      duration: '1:45'
    },
    tags: ['Climate Tech', 'Hardware', 'MVP', 'Pivot'],
    isConnected: false,
    hasPromptTag: true,
    postedTime: '4h ago',
    engagement: {
      likes: 234,
      comments: 89,
      shares: 23,
      saves: 34,
      isLiked: true
    },
    comments: [{
      id: '1',
      user: 'David Kim',
      text: 'Same mistake here! Reliability > Cost every time',
      likes: 18,
      time: '3h ago'
    }, {
      id: '2',
      user: 'Emma Wilson',
      text: 'How did you discover this? Customer interviews?',
      likes: 9,
      time: '2h ago'
    }, {
      id: '3',
      user: 'James Liu',
      text: 'Great response to the prompt! Super valuable insight 🙌',
      likes: 15,
      time: '1h ago'
    }]
  }, {
    id: '3',
    user: {
      name: 'Alex Thompson',
      location: 'Montreal, QC',
      avatar: 'AT',
      company: 'FinFlow',
      stage: 'Series A',
      followers: 2340,
      verified: true
    },
    content: {
      title: 'Day 1 to 100K users: The real story',
      description: 'Everyone shows the highlights, but here\'s what really happened during our scaling journey. The 3am server crashes, angry customer calls, and somehow pulling through our biggest week ever. This is what building in public actually looks like. 📈',
      category: 'day-in-life' as const,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
      duration: '3:20'
    },
    tags: ['FinTech', 'AI', 'Series A', 'Scaling', 'Building in Public'],
    isConnected: true,
    hasPromptTag: false,
    postedTime: '1d ago',
    engagement: {
      likes: 1567,
      comments: 203,
      shares: 89,
      saves: 156,
      isLiked: false
    },
    comments: [{
      id: '1',
      user: 'Sophie Chen',
      text: 'This is so real! Been there with the 3am calls 😅',
      likes: 45,
      time: '20h ago'
    }, {
      id: '2',
      user: 'Ryan Park',
      text: 'Love the transparency. How did you handle the server load?',
      likes: 23,
      time: '18h ago'
    }, {
      id: '3',
      user: 'Maria Santos',
      text: 'Inspiring to see the real behind-the-scenes. Keep going! 🚀',
      likes: 31,
      time: '12h ago'
    }]
  }];

  // Mock data for co-founders
  const mockCoFounders = [{
    id: '1',
    name: 'Jessica Kumar',
    location: 'Toronto, ON',
    avatar: 'JK',
    openToCofounder: true,
    preferredRoles: ['CTO', 'Product'],
    skills: ['React', 'AI/ML', 'Product Strategy'],
    equityOpen: true,
    commitment: 'Full-time'
  }, {
    id: '2',
    name: 'David Park',
    location: 'Vancouver, BC',
    avatar: 'DP',
    openToCofounder: true,
    preferredRoles: ['BizDev', 'Growth'],
    skills: ['Sales', 'Marketing', 'Partnerships'],
    equityOpen: true,
    commitment: 'Part-time'
  }];

  const mockEvents = [{
    id: '1',
    title: 'Toronto AI Founders Roundtable',
    date: '2024-02-15',
    type: 'meetup',
    rsvpCount: 24,
    hasRSVPed: false
  }, {
    id: '2',
    title: 'Pitch Practice Session',
    date: '2024-02-20',
    type: 'workshop',
    rsvpCount: 18,
    hasRSVPed: true
  }];

  const handleConnect = async (userId: string, userName: string) => {
    try {
      await connectionsAPI.sendConnect(userId);
      toast.success(`Connection request sent to ${userName}!`);
    } catch (error) {
      toast.error("Failed to send connection request");
    }
  };

  const handleRecordResponse = () => {
    toast.success("Opening pitch recorder with prompt tag...");
  };

  const handleRSVP = async (eventId: string, eventTitle: string) => {
    try {
      toast.success(`RSVP confirmed for ${eventTitle}!`);
    } catch (error) {
      toast.error("Failed to RSVP");
    }
  };

  const filteredPosts = mockPosts.filter(post => {
    if (searchQuery && !post.user.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.location && !post.user.location.includes(filters.location)) {
      return false;
    }
    if (filters.category && !post.tags.some(tag => tag.toLowerCase().includes(filters.category.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const coFounderPosts = activeTab === 'cofounder' ? mockCoFounders.filter(cf => cf.openToCofounder) : [];

  return (
    <div className="min-h-screen bg-background">
      <FishtankHeader 
        title="Network" 
        showLogo={false} 
        onSearch={handleNetworkSearch}
        searchPlaceholder="Search network..."
      />
      
      {/* Clean Tab Navigation */}
      <div className="border-b bg-background">
        <div className="px-4 py-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-12 bg-muted/30">
              <TabsTrigger value="discover" className="flex items-center gap-2 text-sm font-medium">
                <Compass className="w-4 h-4" />
                Discover
              </TabsTrigger>
              <TabsTrigger value="thoughts" className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="w-4 h-4" />
                Thoughts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="min-h-screen">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="discover" className="mt-0 p-4">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      {/* Image/Video Thumbnail */}
                      <div className="relative h-40 overflow-hidden">
                        <img src={post.content.thumbnail} alt={post.content.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">{post.content.title}</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium text-xs">{post.user.avatar}</span>
                            </div>
                            <span className="text-white text-xs">{post.user.name}</span>
                            <span className="text-white/70 text-xs">•</span>
                            <span className="text-white/70 text-xs">{post.postedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.content.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.engagement.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.engagement.comments}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant={post.isConnected ? "secondary" : "default"}
                            onClick={() => !post.isConnected && handleConnect(post.id, post.user.name)}
                            disabled={post.isConnected}
                          >
                            {post.isConnected ? "Connected" : "Connect"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="thoughts" className="mt-0 p-4 pb-24">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

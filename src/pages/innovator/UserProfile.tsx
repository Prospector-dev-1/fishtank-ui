import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { User, Mail, MapPin, Briefcase, MessageCircle, UserCheck, UserPlus, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  role: string;
  location: string;
  company: string;
  website: string;
}

interface ConnectionStatus {
  status: 'none' | 'pending_sent' | 'pending_received' | 'accepted';
  connectionId?: string;
}

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: 'none' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      if (!userId) return;

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Check connection status
      if (user?.id && user.id !== userId) {
        const { data: connectionData } = await supabase
          .from('connections')
          .select('id, status, user_id, connected_user_id')
          .or(`and(user_id.eq.${user.id},connected_user_id.eq.${userId}),and(user_id.eq.${userId},connected_user_id.eq.${user.id})`)
          .single();

        if (connectionData) {
          if (connectionData.status === 'accepted') {
            setConnectionStatus({ status: 'accepted', connectionId: connectionData.id });
          } else if (connectionData.user_id === user.id) {
            setConnectionStatus({ status: 'pending_sent', connectionId: connectionData.id });
          } else {
            setConnectionStatus({ status: 'pending_received', connectionId: connectionData.id });
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !userId) return;

      const { error } = await supabase
        .from('connections')
        .insert({
          user_id: user.id,
          connected_user_id: userId,
          status: 'pending'
        });

      if (error) throw error;

      // Create notification
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'friend_request',
        title: 'New Friend Request',
        message: `${profile?.full_name || 'Someone'} sent you a friend request`
      });

      setConnectionStatus({ status: 'pending_sent' });
      toast({
        title: "Request Sent",
        description: "Friend request sent successfully"
      });
      
      loadProfile();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive"
      });
    }
  };

  const acceptFriendRequest = async () => {
    try {
      if (!connectionStatus.connectionId) return;

      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionStatus.connectionId);

      if (error) throw error;

      setConnectionStatus({ status: 'accepted', connectionId: connectionStatus.connectionId });
      toast({
        title: "Request Accepted",
        description: "You are now connected!"
      });
      
      loadProfile();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive"
      });
    }
  };

  const startConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !userId) return;

      // Check if thread exists between these two users
      const { data: userThreads } = await supabase
        .from('thread_participants')
        .select('thread_id')
        .eq('user_id', user.id);

      if (userThreads && userThreads.length > 0) {
        // Check each thread to see if the target user is also a participant
        for (const thread of userThreads) {
          const { data: otherParticipant } = await supabase
            .from('thread_participants')
            .select('user_id')
            .eq('thread_id', thread.thread_id)
            .eq('user_id', userId)
            .single();
          
          if (otherParticipant) {
            // Found existing thread with this user
            navigate(`/messaging?thread=${thread.thread_id}`);
            return;
          }
        }
      }

      // Create new thread using database function
      const { data: threadId, error: threadError } = await supabase.rpc(
        'create_direct_message_thread',
        { 
          participant_ids: [user.id, userId]
        }
      );

      if (threadError) throw threadError;

      navigate(`/messaging?thread=${threadId}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <FishtankHeader title="Profile" showLogo={false} />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Profile not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="min-h-screen bg-background pb-16">
      <FishtankHeader title={isOwnProfile ? "My Profile" : "Profile"} showLogo={false} showProfile={false} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.full_name || 'Anonymous User'}</CardTitle>
                  <CardDescription>{profile.role || 'User'}</CardDescription>
                </div>
              </div>
              
              {!isOwnProfile && (
                <div className="flex gap-2">
                  {connectionStatus.status === 'none' && (
                    <Button onClick={sendFriendRequest} size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Friend
                    </Button>
                  )}
                  {connectionStatus.status === 'pending_sent' && (
                    <Button disabled size="sm" variant="secondary">
                      <Clock className="h-4 w-4 mr-2" />
                      Request Sent
                    </Button>
                  )}
                  {connectionStatus.status === 'pending_received' && (
                    <Button onClick={acceptFriendRequest} size="sm">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Accept Request
                    </Button>
                  )}
                  {connectionStatus.status === 'accepted' && (
                    <Button onClick={startConversation} size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  )}
                </div>
              )}
              
              {isOwnProfile && (
                <Button onClick={() => navigate('/profile')} size="sm" variant="outline">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                {profile.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.company && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{profile.company}</span>
                  </div>
                )}
              </div>

              {profile.bio && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

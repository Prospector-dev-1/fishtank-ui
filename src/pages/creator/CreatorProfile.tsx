import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MessageCircle, Handshake, ExternalLink, MoreVertical, Users, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/creator/ui/button';
import { Badge } from '@/components/creator/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/creator/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/creator/ui/dropdown-menu';
import { Separator } from '@/components/creator/ui/separator';
import { creators } from "@/data/creators";
import { CollaborateInviteModal } from "@/components/creator/CollaborateInviteModal";
import { ReferralModal } from "@/components/creator/ReferralModal";
import { supabase } from '@/integrations/supabase/client';
import { Creator } from "@/lib/creator/creatorTypes";

export function CreatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'friends'>('none');

  useEffect(() => {
    loadCreatorData();
    loadCurrentUser();
  }, [id]);

  useEffect(() => {
    if (currentUserId && id) {
      checkFriendshipStatus();
    }
  }, [currentUserId, id]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const checkFriendshipStatus = async () => {
    if (!currentUserId || !id || currentUserId === id) return;

    const { data, error } = await supabase
      .from('friend_requests')
      .select('status')
      .or(`and(from_user_id.eq.${currentUserId},to_user_id.eq.${id}),and(from_user_id.eq.${id},to_user_id.eq.${currentUserId})`)
      .maybeSingle();

    if (error) {
      console.error('Error checking friendship:', error);
      return;
    }

    if (!data) {
      setFriendshipStatus('none');
    } else if (data.status === 'accepted') {
      setFriendshipStatus('friends');
    } else if (data.status === 'pending') {
      setFriendshipStatus('pending');
    }
  };

  const loadCreatorData = async () => {
    try {
      setLoading(true);
      
      // First check mock data
      const mockCreator = creators.find(c => c.id === id);
      if (mockCreator) {
        setCreator(mockCreator);
        setLoading(false);
        return;
      }

      // If not in mock data, fetch from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      if (!profile) {
        setCreator(null);
        setLoading(false);
        return;
      }

      // Fetch services and skills for this creator
      const [servicesRes, skillsRes] = await Promise.all([
        supabase.from('services').select('*').eq('creator_id', profile.id),
        supabase.from('creator_skills').select('skill_id, skills(name)').eq('creator_id', profile.id)
      ]);

      const services = (servicesRes.data || []).map(s => ({
        id: s.id,
        title: s.title,
        scope: s.description?.split('\n') || [],
        etaDays: s.delivery_days,
        type: 'fixed' as const,
        price: Number(s.price)
      }));

      const skills = (skillsRes.data || []).map((s: any) => s.skills?.name).filter(Boolean);

      const socialLinks = profile.social_links as any;

      const creatorData: Creator = {
        id: profile.id,
        name: profile.full_name,
        headline: 'Creator',
        skills: skills,
        rating: 5.0,
        availability: 'open' as const,
        compensation: ['hourly', 'fixed'] as Array<'hourly' | 'equity' | 'commission' | 'fixed'>,
        hourlyRate: profile.hourly_rate ? Number(profile.hourly_rate) : undefined,
        timezone: 'UTC',
        responseTime: 'Usually responds within 24 hours',
        avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
        website: socialLinks?.website,
        bio: profile.bio || 'No bio available',
        email: profile.email,
        services,
        portfolio: [],
        reviews: [],
        endorsements: []
      };

      setCreator(creatorData);
    } catch (error) {
      console.error('Error loading creator:', error);
      setCreator(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-400">Loading creator profile...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Creator Not Found</h1>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleMessage = () => {
    navigate('/creator/inbox');
  };

  const handleAddFriend = async () => {
    if (!currentUserId || !id) return;

    const { error } = await supabase
      .from('friend_requests')
      .insert({
        from_user_id: currentUserId,
        to_user_id: id,
        status: 'pending'
      });

    if (error) {
      console.error('Error sending friend request:', error);
    } else {
      setFriendshipStatus('pending');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-neutral-950/80 backdrop-blur border-b border-neutral-800 z-40">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">{creator.name}</h1>
            <p className="text-sm text-neutral-400">{creator.headline}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowReferralModal(true)}>
                <Users className="h-4 w-4 mr-2" />
                Refer Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <Card className="bg-neutral-900/80 border-neutral-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white mb-2">{creator.name}</h2>
                <p className="text-neutral-300 mb-3">{creator.headline}</p>
                {creator.email && (
                  <p className="text-sm text-neutral-400 mb-3">{creator.email}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{creator.rating} ({creator.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{creator.responseTime}</span>
                  </div>
                  <Badge 
                    variant={creator.availability === 'open' ? 'default' : 'secondary'}
                    className={creator.availability === 'open' ? 'bg-green-600' : 'bg-red-600'}
                  >
                    {creator.availability === 'open' ? 'Available' : 'Busy'}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {creator.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-neutral-600 text-neutral-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {friendshipStatus === 'friends' ? (
                <Button
                  onClick={handleMessage}
                  variant="outline"
                  className="flex-1 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              ) : (
                <Button
                  onClick={handleAddFriend}
                  variant="outline"
                  className="flex-1 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                  disabled={friendshipStatus === 'pending'}
                >
                  {friendshipStatus === 'pending' ? 'Request Sent' : 'Add Friend'}
                </Button>
              )}
              <Button
                onClick={() => setShowCollabModal(true)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Handshake className="h-4 w-4 mr-2" />
                Collaborate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Services</h3>
          <div className="space-y-4">
            {creator.services.map((service) => (
              <Card key={service.id} className="bg-neutral-900/80 border-neutral-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white">{service.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-neutral-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{service.etaDays} days</span>
                        </div>
                        <div className="font-medium text-primary">
                          {service.type === 'fixed' 
                            ? `$${service.price?.toLocaleString()}` 
                            : `$${service.hourlyRate}/hr`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.scope.map((item, index) => (
                      <li key={index} className="text-sm text-neutral-300 flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {service.offers && service.offers.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {service.offers.map(offer => (
                        <Badge key={offer} variant="outline" className="border-accent/30 text-accent">
                          also accepts {offer}-based pay
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
          <div className="grid grid-cols-2 gap-4">
            {creator.portfolio.map((item) => (
              <Card key={item.id} className="bg-neutral-900/80 border-neutral-800 overflow-hidden">
                <div className="aspect-video bg-neutral-800 relative">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.mediaType === 'link' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <ExternalLink className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h4 className="font-medium text-white mb-2">{item.title}</h4>
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs border-neutral-600 text-neutral-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          <div className="space-y-4">
            {creator.reviews.map((review) => (
              <Card key={review.id} className="bg-neutral-900/80 border-neutral-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{review.from}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-neutral-300">{review.text}</p>
                      <span className="text-xs text-neutral-500 mt-2 block">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Endorsements */}
        {creator.endorsements.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Peer Endorsements</h3>
            <div className="space-y-3">
              {creator.endorsements.map((endorsement) => (
                <Card key={endorsement.id} className="bg-neutral-900/80 border-neutral-800">
                  <CardContent className="p-4">
                    <p className="text-sm text-neutral-300 italic mb-3">
                      "{endorsement.text}"
                    </p>
                    <div className="text-xs text-neutral-400">
                      — {endorsement.fromName}, {endorsement.fromRole}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* About & Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About</h3>
          <Card className="bg-neutral-900/80 border-neutral-800">
            <CardContent className="p-4">
              <p className="text-neutral-300 mb-4">{creator.bio}</p>
              <Separator className="my-4 bg-neutral-700" />
              <div className="space-y-2">
                {creator.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-neutral-400" />
                    <a 
                      href={creator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {creator.website}
                    </a>
                  </div>
                )}
                {creator.timezone && (
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Clock className="h-4 w-4" />
                    <span>Timezone: {creator.timezone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CollaborateInviteModal
        isOpen={showCollabModal}
        onClose={() => setShowCollabModal(false)}
        creator={creator}
      />

      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        currentCreatorId={creator.id}
      />
    </div>
  );
}
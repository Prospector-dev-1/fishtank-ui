import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { Button } from "@/components/innovator/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/innovator/ui/card";
import { Badge } from "@/components/innovator/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/innovator/ui/radio-group";
import { Label } from "@/components/innovator/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Pitch } from "@/types";
import { Zap, TrendingUp, Target, Rocket, ChevronLeft, Check, Sparkles, Users, Eye } from "lucide-react";

const BOOST_TYPES = [
  {
    id: 'starter',
    name: 'Starter Boost',
    icon: Zap,
    price: 49,
    duration: '7 days',
    features: [
      'Featured in investor feed for 7 days',
      '+50% visibility boost',
      'Priority in search results',
      'Basic analytics dashboard',
      'Email notification to 100 targeted investors'
    ],
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/20',
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional Boost',
    icon: Target,
    price: 149,
    duration: '14 days',
    features: [
      'Featured in investor feed for 14 days',
      '+150% visibility boost',
      'Top priority in all search results',
      'Advanced analytics dashboard',
      'Email notification to 500 targeted investors',
      'Featured in weekly investor newsletter',
      'Dedicated boost badge on your pitch',
      'Access to investor engagement metrics'
    ],
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/20',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Boost',
    icon: Rocket,
    price: 399,
    duration: '30 days',
    features: [
      'Featured in investor feed for 30 days',
      '+300% visibility boost',
      'Guaranteed top position in all results',
      'Premium analytics with AI insights',
      'Email notification to 2,000+ targeted investors',
      'Featured in all newsletters & social media',
      'Premium boost badge with custom branding',
      'Direct line to platform investor relations team',
      'Pitch optimization consultation (1 hour)',
      'Priority customer support'
    ],
    color: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-500/20',
    popular: false
  }
];

export default function BoostPitch() {
  const navigate = useNavigate();
  const { pitchId } = useParams<{ pitchId: string }>();
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBoost, setSelectedBoost] = useState<string>('professional');
  const [isBoosting, setIsBoosting] = useState(false);

  useEffect(() => {
    loadPitch();
  }, [pitchId]);

  const loadPitch = async () => {
    try {
      if (!pitchId) {
        toast.error('No pitch ID provided');
        navigate('/innovator/tank');
        return;
      }

      // Check if this is a mock pitch
      const isMockPitch = pitchId.startsWith('pitch_');

      if (isMockPitch) {
        // Mock pitch data - matching TankDashboard mock pitches
        const mockPitches: Record<string, Pitch> = {
          'pitch_aquasense_1': {
            id: 'pitch_aquasense_1',
            innovation_id: 'innovation_aquasense',
            user_id: 'mock_user',
            title: 'AquaSense - Smart Water Management Demo',
            description: 'Demonstrating our IoT sensor technology for precision agriculture',
            caption: '💧 Saving water, one farm at a time. Our IoT sensors help farmers reduce water waste by 40%! #AgriTech #IoT #Sustainability',
            hashtags: ['AgriTech', 'IoT', 'Sustainability', 'WaterConservation', 'SmartFarming'],
            video_url: 'https://example.com/video.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
            deck_url: null,
            status: 'published',
            visibility: 'public',
            funding_goal: 500000,
            funding_raised: 125000,
            views_count: 234,
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          'pitch_aquasense_2': {
            id: 'pitch_aquasense_2',
            innovation_id: 'innovation_aquasense',
            user_id: 'mock_user',
            title: 'AquaSense Traction Update',
            description: 'Quick update on our growth and beta farm results',
            caption: '🚀 25 beta farms, 32% water reduction, $1,200 annual savings per farm. The numbers speak for themselves! #GrowthUpdate #StartupTraction',
            hashtags: ['GrowthUpdate', 'StartupTraction', 'AgriTech', 'ROI'],
            video_url: 'https://example.com/video2.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
            deck_url: null,
            status: 'published',
            visibility: 'public',
            funding_goal: 500000,
            funding_raised: 125000,
            views_count: 156,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          'pitch_healthbridge_1': {
            id: 'pitch_healthbridge_1',
            innovation_id: 'innovation_healthbridge',
            user_id: 'mock_user',
            title: 'HealthBridge - Breaking Mental Health Barriers',
            description: 'AI-powered instant therapist matching',
            caption: '🧠 Mental health support shouldn\'t take 3 months. HealthBridge connects you with therapists instantly using AI. #MentalHealth #HealthTech #AI',
            hashtags: ['MentalHealth', 'HealthTech', 'AI', 'Telemedicine', 'WellnessTech'],
            video_url: 'https://example.com/video3.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
            deck_url: null,
            status: 'draft',
            visibility: 'private',
            funding_goal: 500000,
            funding_raised: 0,
            views_count: 42,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        };

        const mockPitch = mockPitches[pitchId];
        if (!mockPitch) {
          console.error('Mock pitch not found:', pitchId);
          toast.error('Pitch not found');
          navigate('/innovator/tank');
          return;
        }

        setPitch(mockPitch);
        setIsLoading(false);
        return;
      }

      // Load from database
      const { data, error } = await supabase
        .from('pitches')
        .select('*')
        .eq('id', pitchId)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error('Pitch not found');
        navigate('/innovator/tank');
        return;
      }

      setPitch(data as unknown as Pitch);
    } catch (error) {
      console.error('Error loading pitch:', error);
      toast.error('Failed to load pitch');
      navigate('/innovator/tank');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoost = async () => {
    if (!pitch || !selectedBoost) return;

    const boostType = BOOST_TYPES.find(b => b.id === selectedBoost);
    if (!boostType) return;

    setIsBoosting(true);
    try {
      // In a real implementation, this would process payment and activate the boost
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      toast.success(
        `${boostType.name} activated! Your pitch will be featured for ${boostType.duration}.`,
        {
          duration: 5000,
          description: 'Investors will start seeing your boosted pitch within the next hour.'
        }
      );

      // Navigate back to tank
      setTimeout(() => {
        navigate('/innovator/tank');
      }, 2000);
    } catch (error) {
      console.error('Error boosting pitch:', error);
      toast.error('Failed to activate boost. Please try again.');
    } finally {
      setIsBoosting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pitch) {
    return null;
  }

  const selectedBoostType = BOOST_TYPES.find(b => b.id === selectedBoost);

  return (
    <div className="min-h-screen bg-background">
      <FishtankHeader title="Boost Your Pitch" showLogo={false} />

      <div className="max-w-4xl mx-auto px-4 pt-4 pb-24 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/innovator/tank')}
          className="mb-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Tank
        </Button>

        {/* Pitch Preview */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0">
                {pitch.thumbnail_url ? (
                  <img src={pitch.thumbnail_url} alt={pitch.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{pitch.caption || pitch.title}</h2>
                <p className="text-sm text-muted-foreground mb-2">{pitch.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {pitch.views_count || 0} views
                  </span>
                  <Badge variant={pitch.status === 'published' ? 'default' : 'secondary'}>
                    {pitch.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boost Types */}
        <div>
          <h3 className="text-xl font-bold mb-2">Choose Your Boost Plan</h3>
          <p className="text-muted-foreground mb-6">
            Increase your pitch visibility and reach more investors
          </p>

          <RadioGroup value={selectedBoost} onValueChange={setSelectedBoost}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BOOST_TYPES.map((boost) => {
                const Icon = boost.icon;
                const isSelected = selectedBoost === boost.id;

                return (
                  <div key={boost.id} className="relative">
                    {boost.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <Card 
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? `ring-2 ring-primary shadow-lg ${boost.borderColor}` 
                          : 'hover:shadow-md'
                      } ${boost.popular ? 'border-purple-500/30' : ''}`}
                      onClick={() => setSelectedBoost(boost.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${boost.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <RadioGroupItem value={boost.id} id={boost.id} />
                        </div>
                        <CardTitle className="text-lg">{boost.name}</CardTitle>
                        <CardDescription>
                          <span className="text-3xl font-bold text-foreground">${boost.price}</span>
                          <span className="text-muted-foreground ml-2">/ {boost.duration}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {boost.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Summary and Action */}
        {selectedBoostType && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Boost Summary</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Plan: <span className="font-semibold text-foreground">{selectedBoostType.name}</span></p>
                    <p>Duration: <span className="font-semibold text-foreground">{selectedBoostType.duration}</span></p>
                    <p>Estimated reach: <span className="font-semibold text-foreground">
                      {selectedBoostType.id === 'starter' ? '100+ investors' : 
                       selectedBoostType.id === 'professional' ? '500+ investors' : 
                       '2,000+ investors'}
                    </span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total</p>
                  <p className="text-3xl font-bold">${selectedBoostType.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={handleBoost}
                  disabled={isBoosting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isBoosting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Activating Boost...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Activate {selectedBoostType.name}
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/innovator/tank')}
                  disabled={isBoosting}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                💳 Secure payment processing • 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        )}

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Why Boost Your Pitch?
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Increased Visibility</h4>
              <p className="text-sm text-muted-foreground">
                Get featured at the top of investor feeds and search results
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Targeted Reach</h4>
              <p className="text-sm text-muted-foreground">
                Direct email notifications to investors interested in your industry
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Stand Out</h4>
              <p className="text-sm text-muted-foreground">
                Premium badges and priority placement make your pitch unmissable
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


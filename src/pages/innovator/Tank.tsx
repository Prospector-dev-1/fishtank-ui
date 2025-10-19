import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { InnovationSetupWizard } from "@/components/innovator/tank/InnovationSetupWizard";
import { TankDashboard } from "@/components/innovator/tank/TankDashboard";
import { innovationAPI } from "@/lib/innovator/tankApi";
import { supabase } from "@/integrations/supabase/client";
import type { Innovation } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/innovator/ui/select";

// Mock innovations for demo purposes
const MOCK_INNOVATIONS: Innovation[] = [
  {
    id: 'innovation_aquasense',
    user_id: 'mock_user',
    company_name: 'AquaSense',
    title: 'Smart Water Management for Agriculture',
    tagline: 'Smart water monitoring for sustainable agriculture using IoT sensors',
    full_description: 'AquaSense provides real-time soil moisture monitoring through wireless IoT sensors, delivering precise irrigation timing recommendations, weather-integrated forecasting, mobile dashboard for farm management, and water usage analytics.',
    category: 'IoT',
    stage: 'MVP',
    problem_statement: 'Farmers waste 40% of irrigation water due to lack of real-time soil moisture data.',
    solution: 'IoT sensors provide real-time soil moisture and weather data with automated irrigation recommendations.',
    market_size: '$15B precision agriculture market growing 12% annually',
    business_model: 'Hardware + SaaS subscription model: $299 sensor kit + $29/month per sensor',
    competitive_advantage: '32% average water reduction with proven ROI',
    team_description: 'Experienced team with backgrounds in IoT and agriculture',
    traction: '25 beta farms across 3 states, $1,200 annual savings per farm',
    current_funding: 50000,
    funding_goal: 500000,
    video_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    pitch_deck_url: null,
    is_published: true,
    status: 'published',
    tags: ['iot', 'agriculture', 'sustainability', 'sensors'],
    faqs: [],
    metrics: { views: 156, likes: 23, shares: 8 },
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'innovation_healthbridge',
    user_id: 'mock_user',
    company_name: 'HealthBridge',
    title: 'AI-Powered Mental Health Platform',
    tagline: 'AI-powered mental health support connecting users with therapists instantly',
    full_description: 'HealthBridge uses AI to match users with licensed therapists based on specialty, availability, and compatibility, offering instant video sessions and 24/7 text support.',
    category: 'HealthTech',
    stage: 'Idea',
    problem_statement: '60% of people seeking mental health support wait over 3 months for their first appointment, leading to worsening conditions.',
    solution: 'HealthBridge uses AI to match users with therapists based on specialty, availability, and compatibility, offering instant video sessions.',
    market_size: '$240B global mental health market, growing 9.5% annually with telehealth adoption accelerating',
    business_model: 'Subscription: $49/month unlimited messaging + $89 per video session. B2B partnerships with employers at $15/employee/month',
    competitive_advantage: 'AI-powered matching and instant availability',
    team_description: 'Healthcare and technology experts',
    traction: 'Partnership discussions with 2 Fortune 500 companies, 50 therapists signed up for beta',
    current_funding: 0,
    funding_goal: 500000,
    video_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    pitch_deck_url: null,
    is_published: false,
    status: 'draft',
    tags: ['healthtech', 'mental-health', 'ai', 'telemedicine', 'b2b'],
    faqs: [],
    metrics: { views: 42, likes: 7, shares: 2 },
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function Tank() {
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [selectedInnovation, setSelectedInnovation] = useState<Innovation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInnovations();
  }, []);

  const loadInnovations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // If not authenticated, use mock data
      if (!user) {
        console.log('Not authenticated, using mock innovations');
        setInnovations(MOCK_INNOVATIONS);
        setSelectedInnovation(MOCK_INNOVATIONS[0]);
        setIsLoading(false);
        return;
      }
      
      // Update mock innovations with current user's ID
      const mockInnovationsWithUserId = MOCK_INNOVATIONS.map(innovation => ({
        ...innovation,
        user_id: user.id
      }));

      // Get innovations where user is owner
      const { data: ownedInnovations, error: ownedError } = await supabase
        .from('innovations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ownedError) throw ownedError;

      // Get team memberships
      const { data: teamMemberships, error: teamError } = await supabase
        .from('team_members')
        .select('innovation_id')
        .eq('user_id', user.id);

      if (teamError) throw teamError;

      // Get innovations where user is a team member
      let teamInnovations: any[] = [];
      if (teamMemberships && teamMemberships.length > 0) {
        const innovationIds = teamMemberships.map((tm: any) => tm.innovation_id);
        const { data: teamInnoData, error: teamInnoError } = await supabase
          .from('innovations')
          .select('*')
          .in('id', innovationIds)
          .order('created_at', { ascending: false });

        if (teamInnoError) throw teamInnoError;
        teamInnovations = teamInnoData || [];
      }

      // Combine and deduplicate
      const allInnovations = [...(ownedInnovations || []), ...teamInnovations];
      const uniqueInnovationsMap = new Map();
      allInnovations.forEach(innovation => {
        if (!uniqueInnovationsMap.has(innovation.id)) {
          uniqueInnovationsMap.set(innovation.id, innovation);
        }
      });
      
      const uniqueInnovations = Array.from(uniqueInnovationsMap.values());
      
      // If no innovations in database, use mock data for demo
      if (uniqueInnovations.length === 0) {
        console.log('No innovations in database, using mock data');
        setInnovations(mockInnovationsWithUserId);
        setSelectedInnovation(mockInnovationsWithUserId[0]);
      } else {
        setInnovations(uniqueInnovations as Innovation[]);
        setSelectedInnovation(uniqueInnovations[0] as Innovation);
      }
    } catch (error) {
      console.error('Error loading innovations:', error);
      // On error, fall back to mock data
      // Try to get user ID for mock data
      const { data: { user } } = await supabase.auth.getUser();
      const mockData = user 
        ? MOCK_INNOVATIONS.map(i => ({ ...i, user_id: user.id }))
        : MOCK_INNOVATIONS;
      setInnovations(mockData);
      setSelectedInnovation(mockData[0]);
    } finally {
      setIsLoading(false);
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

  // No need to check for empty innovations anymore since we have mock data fallback
  // The setup wizard will be accessible from within the dashboard if needed

  // If innovation exists, show dashboard
  return (
    <div className="min-h-screen bg-background">
      <FishtankHeader title="Tank" showLogo={false} />
      
      {/* Innovation Selector */}
      {innovations.length > 1 && (
        <div className="section-padding pt-4">
          <Select
            value={selectedInnovation?.id}
            onValueChange={(value) => {
              const innovation = innovations.find(i => i.id === value);
              if (innovation) setSelectedInnovation(innovation);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an innovation" />
            </SelectTrigger>
            <SelectContent>
              {innovations.map((innovation) => (
                <SelectItem key={innovation.id} value={innovation.id}>
                  {innovation.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedInnovation && (
        <TankDashboard 
          key={selectedInnovation.id} 
          innovation={selectedInnovation} 
        />
      )}
    </div>
  );
}
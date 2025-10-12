// Tank Storage - Frontend-only localStorage implementation
export const TANK_STORAGE_KEYS = {
  USER_PRIMARY_INNOVATION: 'fishtank.v1.user.primaryInnovationId',
  INNOVATIONS: 'fishtank.v1.innovations',
  PITCHES: 'fishtank.v1.pitches',
  VIEWS: 'fishtank.v1.views',
  SEEDED: 'fishtank.v1.seeded'
} as const;

// Storage utilities
export const load = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error('Storage load error:', error);
    return fallback;
  }
};

export const save = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage save error:', error);
  }
};

// Generate ID utility
export const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Current timestamp utility
export const now = (): string => new Date().toISOString();

// Seed demo data
export const seedTankData = (): void => {
  const isSeeded = load(TANK_STORAGE_KEYS.SEEDED, false);
  if (isSeeded) return;

  const demoInnovation = {
    id: 'innovation_aquasense',
    title: 'AquaSense',
    oneLiner: 'Smart water monitoring for sustainable agriculture using IoT sensors',
    category: 'IoT',
    stage: 'MVP' as const,
    problem: 'Farmers waste 40% of irrigation water due to lack of real-time soil moisture data.',
    solution: 'IoT sensors provide real-time soil moisture and weather data with automated irrigation recommendations.',
    market: '$15B precision agriculture market growing 12% annually',
    businessModel: 'Hardware + SaaS subscription model: $299 sensor kit + $29/month per sensor',
    needs: ['Investors', 'Agricultural partnerships', 'Hardware engineers'],
    tags: ['iot', 'agriculture', 'sustainability', 'sensors'],
    websiteUrl: 'https://aquasense.io',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDk2RkYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeD0iOCIgeT0iOCI+CjxwYXRoIGQ9Ik0xMiAyTDEzLjA5IDguMjZMMjAgOUwxMyA5TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+',
    isPrimary: true,
    viewCount: 156,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()  // 2 days ago
  };

  const demoPitches = [
    {
      id: 'pitch_draft',
      innovationId: 'innovation_aquasense',
      authorId: 'user_demo',
      pitchType: 'Quick' as const,
      title: 'Pilot Pitch - Draft',
      content: 'Initial pitch concept focusing on water conservation benefits for small-scale farmers.',
      status: 'Draft' as const,
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      attachments: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pitch_published',
      innovationId: 'innovation_aquasense',
      authorId: 'user_demo',
      pitchType: 'Deep' as const,
      title: 'Investor Pitch - Published',
      content: `# AquaSense: Smart Water Management for Agriculture

## The Problem
Agricultural water waste costs farmers billions annually while contributing to water scarcity. Traditional irrigation relies on guesswork and schedules, leading to 40% water waste.

## Our Solution  
AquaSense provides real-time soil moisture monitoring through wireless IoT sensors, delivering:
- Precise irrigation timing recommendations
- Weather-integrated forecasting
- Mobile dashboard for farm management
- Water usage analytics and cost savings tracking

## Market Opportunity
The precision agriculture market is valued at $15B and growing 12% annually, with water management being the #1 concern for 78% of farmers.

## Business Model
- Hardware: $299 sensor starter kit
- SaaS: $29/month per sensor for data analytics
- Target: 50,000 sensors deployed by Year 3

## Traction
- 25 beta farms across 3 states
- 32% average water reduction
- $1,200 annual savings per farm
- LOIs from 3 agricultural cooperatives`,
      status: 'Published' as const,
      viewCount: 89,
      likeCount: 12,
      shareCount: 5,
      attachments: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Create synthetic view data for sparkline (last 30 days)
  const views = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const baseViews = Math.floor(Math.random() * 5) + 1; // 1-5 views per day
    
    // Add innovation views
    for (let j = 0; j < baseViews; j++) {
      views.push({
        entityType: 'innovation' as const,
        entityId: 'innovation_aquasense',
        createdAt: new Date(date.getTime() + j * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Add some pitch views
    if (i < 20) { // Pitch was published 5 days ago, views started 4 days ago
      const pitchViews = Math.floor(Math.random() * 3);
      for (let j = 0; j < pitchViews; j++) {
        views.push({
          entityType: 'pitch' as const,
          entityId: 'pitch_published',
          createdAt: new Date(date.getTime() + (j + 10) * 60 * 60 * 1000).toISOString()
        });
      }
    }
  }

  // Save all data
  save(TANK_STORAGE_KEYS.USER_PRIMARY_INNOVATION, 'innovation_aquasense');
  save(TANK_STORAGE_KEYS.INNOVATIONS, [demoInnovation]);
  save(TANK_STORAGE_KEYS.PITCHES, demoPitches);
  save(TANK_STORAGE_KEYS.VIEWS, views);
  save(TANK_STORAGE_KEYS.SEEDED, true);

  console.log('Tank demo data seeded successfully');
};
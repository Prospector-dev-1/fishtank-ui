import { Creator } from '@/lib/creatorTypes';

export const creators: Creator[] = [
  {
    id: 'creator-1',
    name: 'Ava Stone',
    headline: 'Brand Designer & Pitch Deck Specialist',
    skills: ['Figma', 'Webflow', 'Motion Graphics', 'Brand Strategy', 'UI/UX'],
    rating: 4.8,
    availability: 'open',
    compensation: ['hourly', 'fixed'],
    hourlyRate: 70,
    timezone: 'PST',
    responseTime: 'Usually responds within 2 hours',
    avatarUrl: 'https://i.pravatar.cc/300?img=1',
    website: 'https://avastone.design',
    bio: 'Brand designer with 6+ years creating compelling visual narratives for startups. Specialized in pitch decks that have raised over $50M in funding.',
    services: [
      {
        id: 'service-1',
        title: 'Pitch Deck Pro',
        scope: [
          'Complete 12-15 slide pitch deck design',
          'Custom illustrations and icons',
          'Investor-ready formatting',
          '3 rounds of revisions',
          'Source files included'
        ],
        etaDays: 7,
        type: 'fixed',
        price: 2500,
        offers: ['equity']
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
        title: 'FinTech Startup Pitch Deck',
        tags: ['Pitch Deck', 'FinTech', 'Series A']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        from: 'Marcus Chen (Founder, TechFlow)',
        rating: 5,
        text: 'Ava transformed our messy slides into a stunning pitch deck. We raised our seed round within 2 months!',
        createdAt: '2025-09-20'
      }
    ],
    endorsements: []
  },
  {
    id: 'creator-2',
    name: 'Marco Lee',
    headline: 'Full-Stack Developer & Technical Co-Founder',
    skills: ['React', 'Node.js', 'Supabase', 'TypeScript', 'Next.js'],
    rating: 4.9,
    availability: 'open',
    compensation: ['hourly', 'equity', 'fixed'],
    hourlyRate: 85,
    timezone: 'EST',
    responseTime: 'Usually responds within 1 hour',
    avatarUrl: 'https://i.pravatar.cc/300?img=2',
    website: 'https://marcolee.dev',
    bio: 'Senior full-stack developer with startup experience. Built and scaled applications from MVP to Series B.',
    services: [
      {
        id: 'service-3',
        title: 'MVP Development',
        scope: [
          'Full-stack web application',
          'User authentication & authorization',
          'Database design and setup'
        ],
        etaDays: 21,
        type: 'fixed',
        price: 8500,
        offers: ['equity']
      }
    ],
    portfolio: [
      {
        id: 'port-4',
        mediaType: 'link',
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500',
        title: 'SaaS Analytics Platform',
        tags: ['React', 'TypeScript', 'SaaS']
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        from: 'Emily Watson (Founder, HealthTrack)',
        rating: 5,
        text: 'Marco built our entire platform from scratch. His technical expertise and startup mindset were invaluable.',
        createdAt: '2025-09-22'
      }
    ],
    endorsements: []
  },
  {
    id: 'creator-3',
    name: 'Noor Khan',
    headline: 'Performance Marketer & Growth Specialist',
    skills: ['Meta Ads', 'Google Ads', 'UGC', 'Analytics', 'Conversion Optimization'],
    rating: 4.7,
    availability: 'busy',
    compensation: ['commission', 'hourly'],
    hourlyRate: 65,
    timezone: 'GMT',
    responseTime: 'Usually responds within 4 hours',
    avatarUrl: 'https://i.pravatar.cc/300?img=3',
    website: 'https://noorkhan.marketing',
    bio: 'Performance marketing specialist with 5+ years driving growth for DTC and SaaS companies.',
    services: [
      {
        id: 'service-5',
        title: 'Paid Ads Management',
        scope: [
          'Meta & Google Ads setup and optimization',
          'Creative strategy and A/B testing',
          'Landing page conversion optimization'
        ],
        etaDays: 30,
        type: 'hourly',
        hourlyRate: 65,
        offers: ['commission']
      }
    ],
    portfolio: [
      {
        id: 'port-7',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
        title: 'E-commerce Scale Campaign',
        tags: ['Meta Ads', 'E-commerce', '6x ROAS']
      }
    ],
    reviews: [
      {
        id: 'rev-7',
        from: 'Alex Johnson (Founder, StyleBox)',
        rating: 5,
        text: 'Noor scaled our ad spend from $1K to $50K/month while maintaining profitability. Incredible results!',
        createdAt: '2025-09-25'
      }
    ],
    endorsements: []
  },
  {
    id: 'creator-4',
    name: 'Jessica Rodriguez',
    headline: 'Content Creator & Social Media Strategist',
    skills: ['Content Strategy', 'TikTok', 'Instagram', 'Video Production', 'Copywriting'],
    rating: 4.6,
    availability: 'open',
    compensation: ['hourly', 'commission'],
    hourlyRate: 45,
    timezone: 'EST',
    responseTime: 'Usually responds within 30 minutes',
    avatarUrl: 'https://i.pravatar.cc/300?img=4',
    website: 'https://jessicarodriguez.co',
    bio: 'Content creator with 500K+ followers across platforms. Specialized in viral content creation.',
    services: [
      {
        id: 'service-7',
        title: 'Content Package',
        scope: [
          '20 social media posts',
          '4 short-form videos',
          'Content calendar planning'
        ],
        etaDays: 14,
        type: 'fixed',
        price: 1200,
        offers: ['commission']
      }
    ],
    portfolio: [
      {
        id: 'port-10',
        mediaType: 'video',
        url: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=500',
        title: 'Viral TikTok Campaign',
        tags: ['TikTok', 'Viral', '2M+ Views']
      }
    ],
    reviews: [
      {
        id: 'rev-10',
        from: 'Mike Chen (Founder, AppLaunch)',
        rating: 5,
        text: 'Jessica created amazing content that went viral and brought us thousands of users organically!',
        createdAt: '2025-09-24'
      }
    ],
    endorsements: []
  },
  {
    id: 'creator-5',
    name: 'David Thompson',
    headline: 'Sales Strategist & Business Development',
    skills: ['Sales Strategy', 'Lead Generation', 'CRM', 'Cold Outreach', 'B2B Sales'],
    rating: 4.8,
    availability: 'open',
    compensation: ['commission', 'fixed'],
    timezone: 'CST',
    responseTime: 'Usually responds within 2 hours',
    avatarUrl: 'https://i.pravatar.cc/300?img=5',
    website: 'https://davidthompson.sales',
    bio: 'B2B sales expert with 8+ years closing enterprise deals.',
    services: [
      {
        id: 'service-8',
        title: 'Sales Process Setup',
        scope: [
          'Sales funnel design',
          'CRM implementation',
          'Lead qualification framework'
        ],
        etaDays: 10,
        type: 'fixed',
        price: 3500,
        offers: ['commission']
      }
    ],
    portfolio: [
      {
        id: 'port-11',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        title: 'Enterprise Sales Dashboard',
        tags: ['Sales', 'CRM', 'Enterprise']
      }
    ],
    reviews: [
      {
        id: 'rev-11',
        from: 'Anna Lee (CEO, CloudTech)',
        rating: 5,
        text: 'David built our entire sales machine from scratch. Revenue increased by 300% in 6 months.',
        createdAt: '2025-09-21'
      }
    ],
    endorsements: []
  }
];

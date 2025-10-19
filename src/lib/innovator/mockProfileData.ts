// Mock profile data for innovator profile
export interface MockProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  website: string;
  skills: string[];
  interests: string[];
  seeking: string[];
  created_at: string;
  updated_at: string;
}

export interface MockInnovation {
  id: string;
  user_id: string;
  title: string;
  tagline: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  views: number;
  likes: number;
}

export interface MockPitch {
  id: string;
  user_id: string;
  innovation_id: string;
  title: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  views: number;
  created_at: string;
  status: 'draft' | 'published' | 'archived';
}

export const mockProfile: MockProfile = {
  id: 'mock-user-123',
  full_name: 'Alex Martinez',
  email: 'alex.martinez@innovator.com',
  role: 'Founder & CEO',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  bio: 'Serial entrepreneur with 10+ years of experience building scalable tech startups. Passionate about AI, sustainability, and creating solutions that make a real impact. Previously founded two companies in the fintech and healthtech spaces, with a successful exit in 2020. Currently building the next generation of intelligent automation tools.',
  location: 'San Francisco, CA',
  company: 'InnovateAI Inc.',
  website: 'https://innovateai.example.com',
  skills: [
    'Product Strategy',
    'AI/ML',
    'Business Development',
    'Fundraising',
    'Team Leadership',
    'SaaS',
    'Python',
    'React',
    'Cloud Architecture',
    'Go-to-Market Strategy'
  ],
  interests: [
    'Artificial Intelligence',
    'Sustainable Technology',
    'FinTech',
    'Developer Tools',
    'Blockchain',
    'Climate Tech',
    'EdTech',
    'Healthcare Innovation'
  ],
  seeking: [
    'Seed Funding ($500K-$2M)',
    'Technical Co-founder',
    'AI/ML Engineers',
    'Strategic Advisors',
    'Early Customers',
    'Beta Testers'
  ],
  created_at: '2023-06-15T10:30:00Z',
  updated_at: '2024-01-15T14:45:00Z'
};

export const mockInnovations: MockInnovation[] = [
  {
    id: 'innovation-1',
    user_id: 'mock-user-123',
    title: 'AI-Powered Code Review Assistant',
    tagline: 'Intelligent code review automation that learns from your team',
    description: 'An AI-powered tool that analyzes pull requests, suggests improvements, catches bugs, and enforces best practices automatically. Uses machine learning to adapt to your team\'s coding style and preferences.',
    status: 'published',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-15T16:20:00Z',
    views: 1247,
    likes: 89
  },
  {
    id: 'innovation-2',
    user_id: 'mock-user-123',
    title: 'Smart Contract Auditing Platform',
    tagline: 'Automated security analysis for blockchain smart contracts',
    description: 'A comprehensive platform for auditing and testing smart contracts across multiple blockchain networks. Identifies vulnerabilities, gas optimization opportunities, and provides detailed security reports.',
    status: 'published',
    created_at: '2023-12-05T11:30:00Z',
    updated_at: '2024-01-12T10:15:00Z',
    views: 856,
    likes: 64
  },
  {
    id: 'innovation-3',
    user_id: 'mock-user-123',
    title: 'Climate Impact Analytics Dashboard',
    tagline: 'Real-time carbon footprint tracking for businesses',
    description: 'A data analytics platform that helps companies track, analyze, and reduce their carbon footprint. Integrates with existing systems to provide actionable insights and sustainability recommendations.',
    status: 'published',
    created_at: '2023-11-20T14:00:00Z',
    updated_at: '2024-01-08T09:45:00Z',
    views: 2134,
    likes: 156
  },
  {
    id: 'innovation-4',
    user_id: 'mock-user-123',
    title: 'Developer Productivity Suite',
    tagline: 'All-in-one toolkit for modern software development',
    description: 'A comprehensive suite of developer tools including code generation, testing automation, documentation generation, and performance monitoring. Designed to boost productivity by 40%.',
    status: 'draft',
    created_at: '2024-01-12T08:30:00Z',
    updated_at: '2024-01-15T15:00:00Z',
    views: 234,
    likes: 12
  },
  {
    id: 'innovation-5',
    user_id: 'mock-user-123',
    title: 'EdTech Learning Personalization Engine',
    tagline: 'Adaptive learning paths powered by AI',
    description: 'An AI-driven platform that creates personalized learning experiences for students. Analyzes learning patterns, adapts content difficulty, and provides real-time feedback to optimize educational outcomes.',
    status: 'published',
    created_at: '2023-10-15T13:20:00Z',
    updated_at: '2024-01-05T11:30:00Z',
    views: 1678,
    likes: 123
  }
];

export const mockPitches: MockPitch[] = [
  {
    id: 'pitch-1',
    user_id: 'mock-user-123',
    innovation_id: 'innovation-1',
    title: 'AI-Powered Code Review Assistant - Series A Pitch',
    video_url: 'https://example.com/pitch-video-1.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop',
    duration: 180, // 3 minutes
    views: 523,
    created_at: '2024-01-11T10:00:00Z',
    status: 'published'
  },
  {
    id: 'pitch-2',
    user_id: 'mock-user-123',
    innovation_id: 'innovation-2',
    title: 'Smart Contract Auditing - Investor Demo',
    video_url: 'https://example.com/pitch-video-2.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop',
    duration: 240, // 4 minutes
    views: 412,
    created_at: '2023-12-08T14:30:00Z',
    status: 'published'
  },
  {
    id: 'pitch-3',
    user_id: 'mock-user-123',
    innovation_id: 'innovation-3',
    title: 'Climate Impact Analytics - Product Vision',
    video_url: 'https://example.com/pitch-video-3.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=450&fit=crop',
    duration: 300, // 5 minutes
    views: 891,
    created_at: '2023-11-22T09:15:00Z',
    status: 'published'
  },
  {
    id: 'pitch-4',
    user_id: 'mock-user-123',
    innovation_id: 'innovation-5',
    title: 'EdTech Personalization Engine - Seed Round',
    video_url: 'https://example.com/pitch-video-4.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop',
    duration: 210, // 3.5 minutes
    views: 678,
    created_at: '2023-10-18T11:45:00Z',
    status: 'published'
  }
];

export const mockStats = {
  innovations: mockInnovations.length,
  pitches: mockPitches.length,
  connections: 47, // Mock connections count
  teams: 3 // Mock teams count
};

export const mockConnections = [
  {
    id: 'conn-1',
    user_id: 'mock-user-123',
    connected_user_id: 'user-456',
    connected_user_name: 'Sarah Chen',
    connected_user_role: 'Senior Product Manager',
    connected_user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c3c9?w=100&h=100&fit=crop&crop=face',
    status: 'accepted',
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: 'conn-2',
    user_id: 'mock-user-123',
    connected_user_id: 'user-789',
    connected_user_name: 'Michael Rodriguez',
    connected_user_role: 'Full Stack Developer',
    connected_user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'accepted',
    created_at: '2024-01-08T14:30:00Z'
  },
  {
    id: 'conn-3',
    user_id: 'mock-user-123',
    connected_user_id: 'user-321',
    connected_user_name: 'Emily Watson',
    connected_user_role: 'Data Scientist',
    connected_user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'accepted',
    created_at: '2024-01-05T09:15:00Z'
  }
];

export const mockTeams = [
  {
    id: 'team-1',
    name: 'InnovateAI Core Team',
    description: 'Core engineering and product team',
    member_count: 8,
    role: 'owner',
    created_at: '2023-06-15T10:30:00Z'
  },
  {
    id: 'team-2',
    name: 'AI Research Lab',
    description: 'Research and development team for AI/ML initiatives',
    member_count: 5,
    role: 'admin',
    created_at: '2023-08-20T14:00:00Z'
  },
  {
    id: 'team-3',
    name: 'Climate Tech Initiative',
    description: 'Cross-functional team working on sustainability projects',
    member_count: 12,
    role: 'member',
    created_at: '2023-11-10T11:30:00Z'
  }
];

// Helper function to get mock data for profile
export function getMockProfileData() {
  return {
    profile: mockProfile,
    stats: mockStats,
    innovations: mockInnovations,
    pitches: mockPitches,
    connections: mockConnections,
    teams: mockTeams
  };
}

// Helper to enable/disable mock mode
export const USE_MOCK_PROFILE = true; // Set to false when backend is ready


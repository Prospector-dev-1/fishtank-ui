// Mock Profile Data for Innovator
// This file contains sample data to visualize the profile page before backend integration

export const mockProfile = {
  id: "user-123",
  email: "alex.rivera@example.com",
  full_name: "Alex Rivera",
  role: "Serial Innovator & Tech Entrepreneur",
  avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  location: "San Francisco, CA",
  company: "TechVentures Inc.",
  bio: "Passionate innovator with 8+ years of experience in building and scaling tech startups. Previously founded two successful companies in the AI/ML space. Currently working on revolutionary solutions in healthcare technology. Always looking to connect with fellow innovators, investors, and potential co-founders who share the vision of creating meaningful impact through technology.",
  website: "https://alexrivera.tech",
  skills: [
    "Product Strategy",
    "AI/ML Development",
    "Team Building",
    "Fundraising",
    "Go-to-Market Strategy",
    "Agile Development",
    "UX Design",
    "Data Analytics"
  ],
  interests: [
    "Healthcare Technology",
    "Artificial Intelligence",
    "Sustainable Innovation",
    "EdTech",
    "Blockchain",
    "Climate Tech"
  ],
  seeking: [
    "Seed Funding ($500K-$2M)",
    "Technical Co-founder",
    "Strategic Advisors",
    "Early Customers",
    "Healthcare Domain Experts"
  ],
  created_at: "2023-06-15T10:00:00Z",
  updated_at: "2024-01-15T14:30:00Z"
};

export const mockInnovations = [
  {
    id: "innovation-1",
    user_id: "user-123",
    title: "HealthAI Diagnostics",
    tagline: "AI-powered early disease detection platform using computer vision and machine learning",
    description: "Revolutionary healthcare platform that uses advanced AI algorithms to detect early signs of diseases from medical imaging with 95% accuracy. Currently in pilot with 3 major hospitals.",
    status: "published",
    category: "Healthcare",
    stage: "MVP",
    funding_goal: 1500000,
    team_size: 5,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    views: 1247,
    likes: 89,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
  },
  {
    id: "innovation-2",
    user_id: "user-123",
    title: "EduConnect",
    tagline: "Connecting students with personalized learning paths through adaptive AI",
    description: "An adaptive learning platform that creates personalized education journeys for students based on their learning style, pace, and interests. Used by over 10,000 students across 50 schools.",
    status: "published",
    category: "Education",
    stage: "Growth",
    funding_goal: 2000000,
    team_size: 8,
    created_at: "2023-09-15T10:00:00Z",
    updated_at: "2024-01-10T09:15:00Z",
    views: 2341,
    likes: 156,
    image_url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop"
  },
  {
    id: "innovation-3",
    user_id: "user-123",
    title: "GreenChain",
    tagline: "Blockchain-based carbon credit marketplace for sustainable businesses",
    description: "A transparent marketplace enabling businesses to trade verified carbon credits using blockchain technology. Helping companies achieve their net-zero goals while supporting climate initiatives.",
    status: "draft",
    category: "Climate Tech",
    stage: "Concept",
    funding_goal: 3000000,
    team_size: 3,
    created_at: "2023-12-01T10:00:00Z",
    updated_at: "2023-12-20T16:45:00Z",
    views: 456,
    likes: 34,
    image_url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=600&fit=crop"
  }
];

export const mockPitches = [
  {
    id: "pitch-1",
    user_id: "user-123",
    innovation_id: "innovation-1",
    title: "HealthAI Series A Pitch",
    description: "Comprehensive pitch deck for Series A funding round",
    video_url: "https://example.com/pitch-video-1.mp4",
    deck_url: "https://example.com/pitch-deck-1.pdf",
    status: "published",
    views: 847,
    investor_views: 23,
    nda_requests: 8,
    meetings_scheduled: 3,
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z"
  },
  {
    id: "pitch-2",
    user_id: "user-123",
    innovation_id: "innovation-2",
    title: "EduConnect Growth Strategy",
    description: "Pitch presentation for scaling to 100,000 students",
    video_url: "https://example.com/pitch-video-2.mp4",
    deck_url: "https://example.com/pitch-deck-2.pdf",
    status: "published",
    views: 1234,
    investor_views: 45,
    nda_requests: 12,
    meetings_scheduled: 7,
    created_at: "2023-11-20T10:00:00Z",
    updated_at: "2024-01-08T11:20:00Z"
  }
];

export const mockConnections = [
  {
    id: "conn-1",
    user_id: "user-123",
    connected_user_id: "user-456",
    connected_user_name: "Sarah Chen",
    connected_user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3c9?w=100&h=100&fit=crop&crop=face",
    connected_user_role: "Venture Capitalist",
    status: "accepted",
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "conn-2",
    user_id: "user-123",
    connected_user_id: "user-789",
    connected_user_name: "Marcus Johnson",
    connected_user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    connected_user_role: "AI/ML Engineer",
    status: "accepted",
    created_at: "2024-01-08T14:30:00Z"
  },
  {
    id: "conn-3",
    user_id: "user-123",
    connected_user_id: "user-101",
    connected_user_name: "Emily Watson",
    connected_user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    connected_user_role: "Product Designer",
    status: "accepted",
    created_at: "2024-01-05T09:15:00Z"
  },
  {
    id: "conn-4",
    user_id: "user-123",
    connected_user_id: "user-202",
    connected_user_name: "David Kim",
    connected_user_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    connected_user_role: "Healthcare Consultant",
    status: "accepted",
    created_at: "2023-12-28T16:45:00Z"
  },
  {
    id: "conn-5",
    user_id: "user-123",
    connected_user_id: "user-303",
    connected_user_name: "Lisa Thompson",
    connected_user_avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    connected_user_role: "Serial Entrepreneur",
    status: "accepted",
    created_at: "2023-12-15T11:30:00Z"
  }
];

export const mockTeams = [
  {
    id: "team-1",
    team_id: "team-alpha",
    user_id: "user-123",
    role: "owner",
    teams: {
      id: "team-alpha",
      name: "HealthAI Core Team",
      description: "Main development team for HealthAI Diagnostics platform",
      member_count: 5,
      created_at: "2024-01-01T10:00:00Z"
    }
  },
  {
    id: "team-2",
    team_id: "team-beta",
    user_id: "user-123",
    role: "owner",
    teams: {
      id: "team-beta",
      name: "EduConnect Product Team",
      description: "Product development and strategy team for EduConnect",
      member_count: 8,
      created_at: "2023-09-15T10:00:00Z"
    }
  }
];

export const mockStats = {
  innovations: mockInnovations.length,
  pitches: mockPitches.length,
  connections: mockConnections.length,
  teams: mockTeams.length
};

// Helper function to get all mock profile data
export function getMockProfileData() {
  return {
    profile: mockProfile,
    innovations: mockInnovations,
    pitches: mockPitches,
    connections: mockConnections,
    teams: mockTeams,
    stats: mockStats
  };
}

// Alternative profiles for variety
export const alternativeProfiles = [
  {
    ...mockProfile,
    id: "user-124",
    full_name: "Jamie Chen",
    email: "jamie.chen@example.com",
    role: "Climate Tech Innovator",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b332c3c9?w=400&h=400&fit=crop&crop=face",
    location: "Austin, TX",
    company: "GreenFuture Labs",
    bio: "Dedicated to building sustainable solutions for climate change. Former environmental scientist turned entrepreneur. Currently developing carbon capture technologies and renewable energy solutions.",
    skills: ["Climate Science", "Renewable Energy", "Carbon Markets", "Policy Advocacy", "Team Leadership", "Systems Thinking"],
    interests: ["Climate Tech", "Renewable Energy", "Sustainable Agriculture", "Clean Water", "Carbon Capture"],
    seeking: ["Series A Funding ($2M-$5M)", "Climate Tech Advisors", "Regulatory Experts", "Manufacturing Partners"]
  },
  {
    ...mockProfile,
    id: "user-125",
    full_name: "Marcus Williams",
    email: "marcus.w@example.com",
    role: "FinTech Builder",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    location: "New York, NY",
    company: "PayFlow Solutions",
    bio: "Building the future of financial services. 10+ years in banking and payments. Creating accessible financial tools for underserved communities and small businesses.",
    skills: ["Financial Services", "Blockchain", "Payments", "Regulatory Compliance", "Risk Management", "API Development"],
    interests: ["FinTech", "DeFi", "Financial Inclusion", "Banking Infrastructure", "Payment Systems"],
    seeking: ["Seed to Series A Funding", "Banking Partners", "Compliance Advisors", "Growth Marketers"]
  }
];


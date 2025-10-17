// Import generated images
import creatorAvatar from '@/assets/creator-avatar.jpg';
import innovatorSarah from '@/assets/innovator-sarah.jpg';
import innovatorMarcus from '@/assets/innovator-marcus.jpg';
import fintechProject from '@/assets/fintech-project.jpg';
import fashionProject from '@/assets/fashion-project.jpg';
import portfolioPitchDecks from '@/assets/portfolio-pitchdecks.jpg';
import portfolioBranding from '@/assets/portfolio-branding.jpg';

export interface Creator {
  id: string;
  username: string;
  name: string;
  avatar: string;
  verified: boolean;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  completedProjects: number;
  earnings: number;
  services: Service[];
  portfolio: PortfolioItem[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  timeline: string;
  category: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl?: string;
  category: string;
  duration?: string;
}

export interface Innovation {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  timeline: string;
  ndaRequired: boolean;
  tags: string[];
  innovator: {
    name: string;
    avatar: string;
  };
  thumbnail: string;
  postedAt: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  timeline: string;
  ndaRequired: boolean;
  skills: string[];
  thumbnail: string;
  postedAt: string;
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  projectTitle: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  amount: number;
  dueDate: string;
}

// Mock data
export const currentCreator: Creator = {
  id: "1",
  username: "alexdesigner",
  name: "Alex Rivera",
  avatar: creatorAvatar,
  verified: true,
  bio: "UI/UX Designer & Video Creator specializing in startup branding and pitch decks",
  skills: ["Design", "Video", "Pitch Decks", "Branding"],
  rating: 4.9,
  reviewCount: 127,
  completedProjects: 89,
  earnings: 45230,
  services: [
    {
      id: "s1",
      title: "Startup Pitch Deck",
      description: "Complete investor-ready pitch deck with custom design",
      price: 899,
      timeline: "5-7 days",
      category: "Pitch Decks"
    },
    {
      id: "s2", 
      title: "Brand Identity Package",
      description: "Logo, colors, fonts, and brand guidelines",
      price: 1299,
      timeline: "7-10 days",
      category: "Design"
    }
  ],
  portfolio: [
    {
      id: "p1",
      title: "FinTech Pitch Deck",
      thumbnail: portfolioPitchDecks,
      category: "Pitch Decks",
    },
    {
      id: "p2",
      title: "AI Startup Branding",
      thumbnail: portfolioBranding, 
      category: "Design",
    },
    {
      id: "p3",
      title: "Product Demo Video",
      thumbnail: fintechProject,
      videoUrl: "/api/placeholder/video",
      category: "Video",
      duration: "45s"
    }
  ]
};

export const innovations: Innovation[] = [
  {
    id: "i1",
    title: "AI-Powered Investment Platform",
    description: "Revolutionary platform that uses machine learning to optimize investment portfolios for retail investors",
    category: "FinTech",
    budget: 5000,
    timeline: "4 weeks",
    ndaRequired: true,
    tags: ["AI", "Finance", "MVP"],
    innovator: {
      name: "Sarah Chen",
      avatar: innovatorSarah
    },
    thumbnail: fintechProject,
    postedAt: "2 hours ago"
  },
  {
    id: "i2", 
    title: "Sustainable Fashion Marketplace",
    description: "Connect eco-conscious consumers with verified sustainable fashion brands",
    category: "E-commerce",
    budget: 3500,
    timeline: "3 weeks", 
    ndaRequired: false,
    tags: ["Sustainability", "Fashion", "Marketplace"],
    innovator: {
      name: "Marcus Green",
      avatar: innovatorMarcus
    },
    thumbnail: fashionProject,
    postedAt: "5 hours ago"
  }
];

export const gigs: Gig[] = [
  {
    id: "g1",
    title: "Animated Explainer Video",
    description: "Need a 60-second animated video explaining our SaaS platform features",
    category: "Video",
    budget: 1200,
    timeline: "1 week",
    ndaRequired: false,
    skills: ["Video", "Animation", "Copywriting"],
    thumbnail: portfolioBranding,
    postedAt: "1 hour ago"
  },
  {
    id: "g2",
    title: "Landing Page Design",
    description: "High-converting landing page for B2B software launch",
    category: "Design",
    budget: 800,
    timeline: "3 days",
    ndaRequired: true,
    skills: ["Design", "Landing Pages", "Conversion"],
    thumbnail: fashionProject, 
    postedAt: "3 hours ago"
  }
];

export const chatThreads: ChatThread[] = [
  {
    id: "t1",
    participantName: "Sarah Chen",
    participantAvatar: innovatorSarah,
    lastMessage: "Great work on the pitch deck! Ready for milestone 2?",
    lastMessageTime: "10 min ago",
    unreadCount: 2,
    projectTitle: "AI Investment Platform Deck",
    milestones: [
      {
        id: "m1",
        title: "Initial Design Concepts",
        status: 'completed',
        amount: 300,
        dueDate: "2024-01-15"
      },
      {
        id: "m2", 
        title: "Full Pitch Deck",
        status: 'in-progress',
        amount: 600,
        dueDate: "2024-01-22"
      }
    ]
  },
  {
    id: "t2",
    participantName: "Marcus Green", 
    participantAvatar: innovatorMarcus,
    lastMessage: "Can we schedule a call to discuss the brand direction?",
    lastMessageTime: "2 hours ago",
    unreadCount: 0,
    projectTitle: "Sustainable Fashion Branding"
  }
];

export const categories = [
  "Design", "Video", "Pitch Decks", "Copywriting", "Landing Pages", "Prototyping", "Growth"
];
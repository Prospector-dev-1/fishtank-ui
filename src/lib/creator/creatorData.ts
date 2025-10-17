// Enhanced mock data for Creator platform
import type {
  Creator, ServicePackage, PortfolioItem, Brief, NDARecord, Proposal, 
  Contract, ChatThread, Message, Payout, Review, Dispute, Invitation, SavedItem
} from './types';
import creatorAvatar from "@/assets/creator-avatar.jpg";
import innovatorSarah from "@/assets/innovator-sarah.jpg";
import innovatorMarcus from "@/assets/innovator-marcus.jpg";
import fintechProject from '@/assets/fintech-project.jpg';
import fashionProject from '@/assets/fashion-project.jpg';
import portfolioPitchDecks from '@/assets/portfolio-pitchdecks.jpg';
import portfolioBranding from '@/assets/portfolio-branding.jpg';

export const currentCreator: Creator = {
  id: "creator-1",
  username: "alexdesigner",
  name: "Alex Rivera",
  headline: "UI/UX Designer & Video Creator specializing in startup pitch decks",
  avatar: creatorAvatar,
  verified: true,
  bio: "I help startups tell their story through compelling design and video content. 5+ years experience working with YC companies.",
  skills: ["Design", "Video", "Pitch Decks", "Branding", "Animation", "Copywriting"],
  rating: 4.9,
  reviewCount: 127,
  completedProjects: 89,
  earnings: 45230,
  availability: 'open',
  defaultNDA: true,
  pricingMode: 'both',
  hourlyRate: 85,
  responseTime: "Usually responds in 2 hours"
};

export const servicePackages: ServicePackage[] = [
  {
    id: "s1",
    title: "Startup Pitch Deck",
    description: "Complete investor-ready pitch deck with custom design and storytelling",
    scope: [
      "Problem & Solution slides",
      "Market analysis visualization", 
      "Business model diagram",
      "Financial projections charts",
      "Custom branded design",
      "2 rounds of revisions"
    ],
    price: 899,
    etaDays: 7,
    type: 'fixed',
    category: "Pitch Decks"
  },
  {
    id: "s2",
    title: "Brand Identity Package", 
    description: "Complete brand identity including logo, colors, fonts, and guidelines",
    scope: [
      "Logo design (3 concepts)",
      "Color palette development",
      "Typography selection",
      "Brand guidelines document",
      "Business card design",
      "Social media templates"
    ],
    price: 1299,
    etaDays: 10,
    type: 'fixed',
    category: "Design"
  },
  {
    id: "s3",
    title: "Product Demo Video",
    description: "Professional product demo video with motion graphics",
    scope: [
      "Script writing",
      "Storyboard creation", 
      "Screen recordings",
      "Motion graphics",
      "Professional voiceover",
      "Music & sound effects"
    ],
    price: 1499,
    etaDays: 14,
    type: 'fixed',
    category: "Video"
  }
];

export const portfolio: PortfolioItem[] = [
  {
    id: "p1",
    title: "FinTech Pitch Deck",
    mediaType: 'image',
    url: portfolioPitchDecks,
    thumbnail: portfolioPitchDecks,
    category: "Pitch Decks",
    tags: ["FinTech", "Series A", "Investment"],
    role: "Lead Designer",
    duration: undefined
  },
  {
    id: "p2", 
    title: "AI Startup Branding",
    mediaType: 'image',
    url: portfolioBranding,
    thumbnail: portfolioBranding,
    category: "Design",
    tags: ["AI", "Branding", "Logo"],
    role: "Brand Designer"
  },
  {
    id: "p3",
    title: "Product Demo Video",
    mediaType: 'video',
    url: "/api/placeholder/video",
    thumbnail: fintechProject,
    category: "Video", 
    tags: ["Demo", "SaaS", "Animation"],
    role: "Video Producer",
    duration: "45s"
  },
  {
    id: "p4",
    title: "E-commerce Landing Page",
    mediaType: 'image',
    url: fashionProject,
    thumbnail: fashionProject,
    category: "Design",
    tags: ["E-commerce", "Fashion", "Landing Page"],
    role: "UI Designer"
  },
  {
    id: "p5",
    title: "Startup Explainer Video",
    mediaType: 'video', 
    url: "/api/placeholder/video",
    thumbnail: portfolioBranding,
    category: "Video",
    tags: ["Explainer", "Animation", "Startup"],
    role: "Motion Designer",
    duration: "60s"
  },
  {
    id: "p6",
    title: "Mobile App Design",
    mediaType: 'image',
    url: fintechProject,
    thumbnail: fintechProject,
    category: "Design",
    tags: ["Mobile", "App", "FinTech"],
    role: "Product Designer"
  }
];

export const briefs: Brief[] = [
  {
    id: "b1",
    title: "AI-Powered Investment Platform Pitch Deck",
    description: "We need a compelling investor pitch deck for our AI investment platform. Looking for someone who understands FinTech and can visualize complex data flows.",
    summary: "Seed round pitch deck for AI investment platform targeting retail investors",
    category: "Pitch Decks",
    budget: 1200,
    timeline: '1m',
    ndaRequired: true,
    tags: ["AI", "FinTech", "Pitch Deck", "Series A"],
    innovator: {
      name: "Sarah Chen",
      avatar: innovatorSarah
    },
    thumbnail: fintechProject,
    postedAt: "2 hours ago"
  },
  {
    id: "b2",
    title: "Sustainable Fashion Marketplace Branding",
    description: "Building an eco-conscious fashion marketplace. Need complete brand identity that resonates with Gen Z sustainability values.",
    summary: "Brand identity for sustainable fashion marketplace targeting Gen Z",
    category: "Design",
    budget: 800,
    timeline: '<2w',
    ndaRequired: false,
    tags: ["Branding", "Fashion", "Sustainability", "Gen Z"],
    innovator: {
      name: "Marcus Green", 
      avatar: innovatorMarcus
    },
    thumbnail: fashionProject,
    postedAt: "5 hours ago"
  },
  {
    id: "b3",
    title: "SaaS Product Demo Video",
    description: "Need a 60-second animated explainer video for our B2B SaaS platform launch. Should highlight key features and benefits clearly.",
    summary: "Animated explainer video for B2B SaaS platform launch",
    category: "Video",
    budget: 1500,
    timeline: '<2w',
    ndaRequired: false,
    tags: ["Video", "SaaS", "B2B", "Animation"],
    innovator: {
      name: "Sarah Chen",
      avatar: innovatorSarah  
    },
    thumbnail: portfolioBranding,
    postedAt: "1 day ago"
  }
];

export const ndaRecords: NDARecord[] = [
  {
    id: "nda1",
    briefId: "b1", 
    title: "AI-Powered Investment Platform",
    acceptedAt: "2024-01-15T10:30:00Z",
    status: 'accepted'
  }
];

export const proposals: Proposal[] = [
  {
    id: "prop1",
    briefId: "b1",
    creatorId: "creator-1",
    title: "AI Investment Platform Pitch Deck",
    summary: "I'll create a compelling 12-slide investor pitch deck highlighting your AI technology and market opportunity.",
    milestones: [
      {
        id: "m1",
        title: "Research & Initial Concepts",
        description: "Market research and initial design concepts",
        due: "2024-01-22",
        price: 300,
        status: 'released',
        deliverables: [
          { name: "Research_Report.pdf", url: "/files/research.pdf", uploadedAt: "2024-01-20T14:00:00Z" },
          { name: "Initial_Concepts.fig", url: "/files/concepts.fig", uploadedAt: "2024-01-21T16:00:00Z" }
        ]
      },
      {
        id: "m2", 
        title: "Complete Pitch Deck Design",
        description: "Full 12-slide pitch deck with custom illustrations",
        due: "2024-01-29",
        price: 600,
        status: 'in_review',
        deliverables: [
          { name: "PitchDeck_Final.pdf", url: "/files/pitch-deck.pdf", uploadedAt: "2024-01-28T18:00:00Z" },
          { name: "PitchDeck_Editable.pptx", url: "/files/pitch-deck.pptx", uploadedAt: "2024-01-28T18:00:00Z" }
        ]
      },
      {
        id: "m3",
        title: "Revisions & Final Delivery", 
        description: "Final revisions based on feedback",
        due: "2024-02-05",
        price: 300,
        status: 'held',
        deliverables: []
      }
    ],
    totalAmount: 1200,
    timeline: "2 weeks",
    notes: "I have experience with 15+ FinTech pitch decks and understand the key metrics investors look for.",
    status: 'accepted',
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z"
  }
];

export const contracts: Contract[] = [
  {
    id: "contract1",
    briefId: "b1",
    proposalId: "prop1", 
    title: "AI Investment Platform Pitch Deck",
    milestones: proposals[0].milestones,
    status: 'active',
    createdAt: "2024-01-16T10:00:00Z"
  }
];

export const chatThreads: ChatThread[] = [
  {
    id: "thread1",
    type: 'message',
    briefId: "b1",
    contractId: "contract1",
    participantName: "Sarah Chen",
    participantAvatar: innovatorSarah,
    projectTitle: "AI Investment Platform Pitch Deck",
    lastMessage: "Great work on milestone 2! The design looks fantastic. I've approved the deliverables.",
    lastMessageTime: "10 min ago",
    unreadCount: 2,
    status: 'active',
    messages: [
      {
        id: "msg1",
        threadId: "thread1",
        author: 'system',
        text: "Contract started. Milestone 1 funding has been held in escrow.",
        systemType: 'milestone',
        timestamp: "2024-01-16T10:00:00Z"
      },
      {
        id: "msg2", 
        threadId: "thread1",
        author: 'innovator',
        text: "Hi Alex! Excited to work with you on this pitch deck. I've uploaded our current business plan for reference.",
        attachments: [{ name: "Business_Plan_v2.pdf", url: "/files/business-plan.pdf", type: "pdf" }],
        timestamp: "2024-01-16T14:30:00Z"
      },
      {
        id: "msg3",
        threadId: "thread1", 
        author: 'creator',
        text: "Thanks Sarah! I've reviewed the business plan. The AI technology is impressive. I'll focus the pitch on the market opportunity and competitive advantages.",
        timestamp: "2024-01-16T16:00:00Z"
      }
    ],
    milestones: proposals[0].milestones
  },
  {
    id: "thread2",
    type: 'message',
    participantName: "Marcus Rodriguez",
    participantAvatar: innovatorMarcus, 
    projectTitle: "SaaS Dashboard UI/UX",
    lastMessage: "Can we schedule a call to discuss the user flow?",
    lastMessageTime: "1d ago",
    unreadCount: 0,
    status: 'active',
    messages: [],
    milestones: [
      {
        id: "m4",
        title: "User Research & Analysis",
        description: "Comprehensive user research and flow analysis",
        due: "2024-02-01",
        price: 3000,
        status: 'held',
        deliverables: []
      }
    ]
  },
  {
    id: "thread3",
    type: 'system',
    participantName: "System Notification",
    participantAvatar: creatorAvatar,
    projectTitle: "Milestone Payment Released",
    lastMessage: "Payment of $300 has been released for 'Research & Initial Concepts'",
    lastMessageTime: "3h ago",
    unreadCount: 1,
    status: 'completed',
    messages: []
  },
  {
    id: "thread4",
    type: 'team',
    participantName: "Alex (Team)",
    participantAvatar: creatorAvatar,
    projectTitle: "Team Collaboration Request",
    lastMessage: "Hey, I could use your help on the mobile app wireframes. Are you available?",
    lastMessageTime: "5h ago",
    unreadCount: 0,
    status: 'active',
    messages: []
  },
  {
    id: "thread5",
    type: 'system',
    participantName: "Platform Update",
    participantAvatar: creatorAvatar,
    projectTitle: "New Features Available",
    lastMessage: "New milestone tracking features are now available in your dashboard",
    lastMessageTime: "1d ago",
    unreadCount: 0,
    status: 'active',
    messages: []
  },
  {
    id: "thread6",
    type: 'message',
    participantName: "Jessica Park",
    participantAvatar: innovatorSarah,
    projectTitle: "Brand Identity Package",
    lastMessage: "The logo concepts are fantastic! Can we explore color variations?",
    lastMessageTime: "2d ago",
    unreadCount: 0,
    status: 'active',
    messages: [],
    milestones: [
      {
        id: "m5",
        title: "Logo Design",
        description: "Custom logo design with 3 concept variations",
        due: "2024-01-20",
        price: 1800,
        status: 'in_review',
        deliverables: []
      }
    ]
  }
];

export const payouts: Payout[] = [
  {
    id: "payout1",
    amount: 300,
    status: 'paid',
    description: "Milestone 1: Research & Initial Concepts - AI Investment Platform",
    createdAt: "2024-01-22T10:00:00Z",
    processedAt: "2024-01-23T14:00:00Z"
  },
  {
    id: "payout2", 
    amount: 600,
    status: 'pending',
    description: "Milestone 2: Complete Pitch Deck - AI Investment Platform",
    createdAt: "2024-01-28T18:00:00Z"
  },
  {
    id: "payout3",
    amount: 300,
    status: 'held', 
    description: "Milestone 3: Revisions & Final Delivery - AI Investment Platform",
    createdAt: "2024-01-16T10:00:00Z"
  }
];

export const reviews: Review[] = [
  {
    id: "review1",
    from: 'innovator',
    to: "creator-1",
    projectTitle: "E-commerce Brand Identity",
    rating: 5,
    text: "Alex delivered exceptional work on our brand identity. The logo perfectly captures our sustainable fashion vision and the brand guidelines are comprehensive.",
    createdAt: "2024-01-10T15:00:00Z"
  },
  {
    id: "review2",
    from: 'innovator', 
    to: "creator-1",
    projectTitle: "FinTech Product Demo",
    rating: 5,
    text: "Outstanding video production! The demo clearly explains our complex product features and the animation quality is top-notch.",
    createdAt: "2024-01-05T12:00:00Z"
  }
];

export const disputes: Dispute[] = [];

export const invitations: Invitation[] = [
  {
    id: "inv1",
    briefId: "b2", 
    title: "Sustainable Fashion Marketplace Branding",
    budget: 800,
    timeline: "2 weeks",
    message: "Hi Alex! I've seen your work on sustainable brands and would love to have you design our marketplace identity. Are you available?",
    from: "Marcus Green",
    avatar: innovatorMarcus,
    status: 'pending',
    createdAt: "1 hour ago"
  }
];

export const savedItems: SavedItem[] = [
  {
    id: "saved1",
    briefId: "b3",
    title: "SaaS Product Demo Video", 
    category: "Video",
    budget: 1500,
    timeline: "2 weeks",
    thumbnail: portfolioBranding,
    savedAt: "2024-01-15T16:00:00Z"
  }
];

export const categories = [
  "Design", "Video", "Pitch Decks", "Copywriting", "Landing Pages", "Prototyping", "Growth",
  "Branding", "Animation", "UI/UX", "Web Development", "Mobile Development", "3D Modeling",
  "Illustration", "Photography", "Social Media", "Content Strategy", "SEO", "Marketing",
  "Data Analysis", "Product Management", "Voice Over", "Sound Design", "Music Production",
  "Consulting", "Business Strategy", "Financial Modeling"
];
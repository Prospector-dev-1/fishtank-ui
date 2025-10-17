export interface TeamMemberProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  achievements: string[];
}

export interface Startup {
  id: string;
  name: string;
  founder: string;
  stage: "Pre-Seed" | "Seed" | "Series A" | "Series B";
  sector: string;
  tagline: string;
  tags: string[];
  shortVideo: string;
  longVideo: string;
  poster: string;
  metrics: {
    views: number;
    avgWatchSec: number;
    interest: number;
  };
  team: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  milestones: Array<{
    label: string;
    date: string;
  }>;
  faq: Array<{
    q: string;
    a: string;
  }>;
  description: string;
  traction: Array<{
    metric: string;
    value: string;
    date: string;
  }>;
  pitchDeck?: string[];
}

export interface Playlist {
  title: string;
  ids: string[];
}

export interface Portfolio {
  saved: string[];
  interested: string[];
  contacted: string[];
}

export const mockStartups: Startup[] = [
  {
    id: "s_001",
    name: "QuantPay",
    founder: "Sofia Duarte",
    stage: "Pre-Seed",
    sector: "Fintech",
    tagline: "Treasury yield for SMB cash.",
    tags: ["Fintech", "B2B", "Payments"],
    shortVideo: "https://www.youtube.com/embed/m1w3QKotcV8",
    longVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=400&h=600&fit=crop",
    metrics: { views: 1234, avgWatchSec: 23, interest: 220 },
    team: [
      { id: "tm_001", name: "Sofia Duarte", role: "CEO", avatar: "/api/placeholder/64/64" },
      { id: "tm_002", name: "Max Chen", role: "CTO", avatar: "/api/placeholder/64/64" },
    ],
    milestones: [
      { label: "MVP launch", date: "2024-06" },
      { label: "10 pilot SMBs", date: "2024-09" },
    ],
    faq: [
      { q: "What's the pricing?", a: "2.2% monthly on AUM." },
      { q: "How does treasury yield work?", a: "We pool SMB cash and invest in short-term government securities." },
    ],
    description:
      "QuantPay revolutionizes cash management for small and medium businesses by providing institutional-grade treasury yield solutions. Our platform automatically invests idle business cash into high-yield, low-risk government securities.",
    traction: [
      { metric: "Monthly Revenue", value: "$12K", date: "2024-09" },
      { metric: "Active SMBs", value: "25", date: "2024-09" },
      { metric: "AUM", value: "$2.1M", date: "2024-09" },
    ],
  },
  {
    id: "s_002",
    name: "VitalAI",
    founder: "Dr. Rachel Kim",
    stage: "Seed",
    sector: "HealthTech",
    tagline: "AI-powered preventive care for remote patients.",
    tags: ["HealthTech", "AI", "Remote Care"],
    shortVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    longVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=600&fit=crop",
    metrics: { views: 2156, avgWatchSec: 31, interest: 342 },
    team: [
      { id: "tm_003", name: "Dr. Rachel Kim", role: "CEO", avatar: "/api/placeholder/64/64" },
      { id: "tm_004", name: "James Liu", role: "CTO", avatar: "/api/placeholder/64/64" },
      { id: "tm_005", name: "Dr. Michael Ross", role: "CMO", avatar: "/api/placeholder/64/64" },
    ],
    milestones: [
      { label: "FDA approval", date: "2024-03" },
      { label: "Hospital partnerships", date: "2024-07" },
      { label: "Series A prep", date: "2024-12" },
    ],
    faq: [
      { q: "How accurate is the AI?", a: "95% accuracy in predicting health deterioration 24h in advance." },
      { q: "What's the business model?", a: "SaaS licensing to hospitals and insurance companies." },
    ],
    description:
      "VitalAI uses advanced machine learning to analyze patient vitals and predict health complications before they occur. Our platform enables healthcare providers to deliver proactive care to remote patients.",
    traction: [
      { metric: "Hospital Partners", value: "8", date: "2024-09" },
      { metric: "Patients Monitored", value: "1,200", date: "2024-09" },
      { metric: "ARR", value: "$480K", date: "2024-09" },
    ],
  },
  {
    id: "s_003",
    name: "GreenMile",
    founder: "Alex Thompson",
    stage: "Series A",
    sector: "CleanTech",
    tagline: "Carbon-neutral last-mile delivery network.",
    tags: ["CleanTech", "Logistics", "Sustainability"],
    shortVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    longVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
    metrics: { views: 3421, avgWatchSec: 28, interest: 567 },
    team: [
      { id: "tm_006", name: "Alex Thompson", role: "CEO", avatar: "/api/placeholder/64/64" },
      { id: "tm_007", name: "Sarah Martinez", role: "COO", avatar: "/api/placeholder/64/64" },
      { id: "tm_008", name: "David Park", role: "CTO", avatar: "/api/placeholder/64/64" },
    ],
    milestones: [
      { label: "Series A funding", date: "2024-01" },
      { label: "100 cities launched", date: "2024-06" },
      { label: "1M deliveries", date: "2024-08" },
    ],
    faq: [
      {
        q: "How do you ensure carbon neutrality?",
        a: "100% electric fleet + carbon offset programs for every delivery.",
      },
      { q: "What's your delivery time?", a: "Same-day delivery in 95% of our markets." },
    ],
    description:
      "GreenMile is building the world's first carbon-neutral last-mile delivery network. We use 100% electric vehicles and advanced route optimization to deliver packages faster while protecting the environment.",
    traction: [
      { metric: "Monthly Deliveries", value: "150K", date: "2024-09" },
      { metric: "Cities Served", value: "100", date: "2024-09" },
      { metric: "ARR", value: "$2.1M", date: "2024-09" },
    ],
  },
  {
    id: "s_004",
    name: "CodeMentor",
    founder: "Priya Patel",
    stage: "Pre-Seed",
    sector: "EdTech",
    tagline: "Personalized coding education with AI tutors.",
    tags: ["EdTech", "AI", "Programming"],
    shortVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    longVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    poster: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop",
    metrics: { views: 987, avgWatchSec: 35, interest: 156 },
    team: [
      { id: "tm_009", name: "Priya Patel", role: "CEO", avatar: "/api/placeholder/64/64" },
      { id: "tm_010", name: "Kevin Zhang", role: "CTO", avatar: "/api/placeholder/64/64" },
    ],
    milestones: [
      { label: "Beta launch", date: "2024-04" },
      { label: "1K students", date: "2024-08" },
      { label: "Seed funding", date: "2024-11" },
    ],
    faq: [
      {
        q: "How is this different from other coding platforms?",
        a: "Our AI adapts to each student's learning pace and style in real-time.",
      },
      {
        q: "What programming languages do you support?",
        a: "Python, JavaScript, Java, C++, and Go with more coming soon.",
      },
    ],
    description:
      "CodeMentor provides personalized coding education through AI-powered tutors that adapt to each student's learning style. Our platform makes programming accessible to everyone, regardless of background.",
    traction: [
      { metric: "Active Students", value: "1,200", date: "2024-09" },
      { metric: "Course Completion", value: "89%", date: "2024-09" },
      { metric: "MRR", value: "$15K", date: "2024-09" },
    ],
  },
];

export const mockPlaylists: Playlist[] = [
  { title: "AI Startups", ids: ["s_002", "s_004"] },
  { title: "HealthTech Rising", ids: ["s_002"] },
  { title: "Pre-Seed Spotlight", ids: ["s_001", "s_004"] },
  { title: "Fintech Innovation", ids: ["s_001"] },
];

export const mockPortfolio: Portfolio = {
  saved: ["s_001", "s_003"],
  interested: ["s_002"],
  contacted: ["s_003"],
};

export const mockMessages = [
  {
    id: "m_001",
    startup: "QuantPay",
    founder: "Sofia Duarte",
    lastMessage: "Thanks for your interest! Happy to discuss our Series A plans.",
    timestamp: "2024-09-20T14:30:00Z",
    unread: true,
    avatar: "/api/placeholder/48/48",
    type: "direct" as const,
  },
  {
    id: "m_002",
    startup: "GreenMile Team",
    founder: "Alex Thompson, Sarah Martinez, David Park",
    lastMessage: "Sarah: Our Q3 numbers look great. Let's schedule a call.",
    timestamp: "2024-09-19T09:15:00Z",
    unread: false,
    avatar: "/api/placeholder/48/48",
    isGroupChat: true,
    type: "team" as const,
  },
  {
    id: "m_003",
    startup: "VitalAI Team",
    founder: "Dr. Rachel Kim, James Liu, Dr. Michael Ross",
    lastMessage: "Dr. Ross: I'd love to show you our latest FDA approval documents.",
    timestamp: "2024-09-18T16:45:00Z",
    unread: true,
    avatar: "/api/placeholder/48/48",
    isGroupChat: true,
    type: "team" as const,
  },
  {
    id: "m_004",
    startup: "CodeMentor",
    founder: "Priya Patel",
    lastMessage: "We've hit 1.5K students this month! 🚀",
    timestamp: "2024-09-17T11:20:00Z",
    unread: false,
    avatar: "/api/placeholder/48/48",
    type: "direct" as const,
  },
  {
    id: "m_005",
    startup: "TechFlow Team",
    founder: "Marcus Johnson, Lisa Chen, Robert Davis",
    lastMessage: "Lisa: Thanks for connecting us with your portfolio companies.",
    timestamp: "2024-09-16T13:15:00Z",
    unread: false,
    avatar: "/api/placeholder/48/48",
    isGroupChat: true,
    type: "team" as const,
  },
  {
    id: "m_006",
    startup: "CloudSync",
    founder: "Elena Rodriguez",
    lastMessage: "The demo went perfectly! When can we discuss terms?",
    timestamp: "2024-09-15T09:30:00Z",
    unread: true,
    avatar: "/api/placeholder/48/48",
    type: "direct" as const,
  },
  {
    id: "m_007",
    startup: "EcoLogistics Team",
    founder: "James Wilson, Michelle Kim, Tom Anderson",
    lastMessage: "James: Our pilot with Amazon just got approved!",
    timestamp: "2024-09-14T14:20:00Z",
    unread: false,
    avatar: "/api/placeholder/48/48",
    isGroupChat: true,
    type: "team" as const,
  },
  {
    id: "m_008",
    startup: "DataVault",
    founder: "Lisa Zhang",
    lastMessage: "Here's the updated pitch deck with the financial projections.",
    timestamp: "2024-09-13T10:45:00Z",
    unread: false,
    avatar: "/api/placeholder/48/48",
    type: "direct" as const,
  },
  // System notifications
  {
    id: "s_001",
    startup: "Portfolio Alert",
    founder: "System",
    lastMessage: "VitalAI just raised $5M Series A - portfolio company update",
    timestamp: "2024-09-20T10:00:00Z",
    unread: true,
    avatar: "/api/placeholder/48/48",
    type: "system" as const,
    isSystem: true,
  },
  {
    id: "s_002",
    startup: "Investment Opportunity",
    founder: "System",
    lastMessage: "New deal in your preferred sector: AI-powered logistics startup",
    timestamp: "2024-09-19T16:30:00Z",
    unread: false,
    avatar: "/api/placeholder/48/48",
    type: "system" as const,
    isSystem: true,
  },
  {
    id: "s_003",
    startup: "Reminder",
    founder: "System",
    lastMessage: "Follow up with 3 startups from your 'Interested' list",
    timestamp: "2024-09-18T09:00:00Z",
    unread: false,
    avatar: "/api/placeholder/48/48",
    type: "system" as const,
    isSystem: true,
  },
  {
    id: "s_004",
    startup: "Platform Update",
    founder: "System",
    lastMessage: "New feature: Enhanced due diligence tools now available",
    timestamp: "2024-09-17T12:00:00Z",
    unread: false,
    avatar: "/api/placeholder/48/48",
    type: "system" as const,
    isSystem: true,
  },
];

export const mockConversations = {
  m_001: [
    {
      id: "1",
      sender: "Sofia Duarte",
      content: "Thanks for your interest in QuantPay!",
      timestamp: "2:30 PM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Me",
      content: "I loved your pitch. The treasury yield concept is brilliant.",
      timestamp: "2:32 PM",
      isMe: true,
    },
    {
      id: "3",
      sender: "Sofia Duarte",
      content: "Happy to discuss our Series A plans in detail.",
      timestamp: "2:35 PM",
      isMe: false,
    },
    { id: "4", sender: "Me", content: "When would be a good time for a call?", timestamp: "2:36 PM", isMe: true },
    { id: "5", sender: "Sofia Duarte", content: "How about Thursday at 3 PM PST?", timestamp: "2:40 PM", isMe: false },
  ],
  m_002: [
    {
      id: "1",
      sender: "Alex Thompson",
      content: "Hope you had a chance to review our latest metrics!",
      timestamp: "9:15 AM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Sarah Martinez",
      content: "The operational side has been smooth. 100 cities is just the beginning!",
      timestamp: "9:16 AM",
      isMe: false,
    },
    {
      id: "3",
      sender: "Me",
      content: "Very impressive growth numbers. The 100 cities milestone is huge.",
      timestamp: "9:20 AM",
      isMe: true,
    },
    {
      id: "4",
      sender: "David Park",
      content: "Our tech infrastructure is scaling beautifully. Zero downtime in Q3.",
      timestamp: "9:21 AM",
      isMe: false,
    },
    {
      id: "5",
      sender: "Sarah Martinez",
      content: "Our Q3 numbers look great. Let's schedule a call.",
      timestamp: "9:22 AM",
      isMe: false,
    },
    {
      id: "6",
      sender: "Me",
      content: "Absolutely. I'm particularly interested in your carbon offset program.",
      timestamp: "9:25 AM",
      isMe: true,
    },
    {
      id: "7",
      sender: "Alex Thompson",
      content: "Sarah can walk you through the sustainability metrics in detail.",
      timestamp: "9:26 AM",
      isMe: false,
    },
  ],
  m_003: [
    {
      id: "1",
      sender: "Dr. Rachel Kim",
      content: "Hi! Thanks for taking the time to meet last week.",
      timestamp: "4:45 PM",
      isMe: false,
    },
    {
      id: "2",
      sender: "James Liu",
      content: "The technical demo went really well on our end too.",
      timestamp: "4:47 PM",
      isMe: false,
    },
    {
      id: "3",
      sender: "Me",
      content: "The VitalAI platform demo was incredible. 95% accuracy is impressive.",
      timestamp: "4:50 PM",
      isMe: true,
    },
    {
      id: "4",
      sender: "Dr. Michael Ross",
      content: "From a clinical perspective, we're seeing remarkable results in our trials.",
      timestamp: "4:51 PM",
      isMe: false,
    },
    {
      id: "5",
      sender: "Dr. Michael Ross",
      content: "I'd love to show you our latest FDA approval documents.",
      timestamp: "4:52 PM",
      isMe: false,
    },
    {
      id: "6",
      sender: "Me",
      content: "That would be great. FDA approval is a huge competitive advantage.",
      timestamp: "4:55 PM",
      isMe: true,
    },
    {
      id: "7",
      sender: "Dr. Rachel Kim",
      content: "Michael has been leading our regulatory strategy. He can share more insights.",
      timestamp: "4:56 PM",
      isMe: false,
    },
  ],
  m_004: [
    {
      id: "1",
      sender: "Priya Patel",
      content: "Great to connect after your visit to our office!",
      timestamp: "11:20 AM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Me",
      content: "Your AI tutoring system is really innovative. The personalization is key.",
      timestamp: "11:25 AM",
      isMe: true,
    },
    {
      id: "3",
      sender: "Priya Patel",
      content: "We've hit 1.5K students this month! 🚀",
      timestamp: "11:30 AM",
      isMe: false,
    },
    {
      id: "4",
      sender: "Me",
      content: "That's fantastic growth. When are you planning your seed round?",
      timestamp: "11:35 AM",
      isMe: true,
    },
  ],
  m_005: [
    {
      id: "1",
      sender: "Marcus Johnson",
      content: "The introductions you made were perfect!",
      timestamp: "1:15 PM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Lisa Chen",
      content: "Our marketing team is excited about the potential partnerships.",
      timestamp: "1:17 PM",
      isMe: false,
    },
    {
      id: "3",
      sender: "Me",
      content: "Happy to help. How did the meetings with our portfolio companies go?",
      timestamp: "1:20 PM",
      isMe: true,
    },
    {
      id: "4",
      sender: "Robert Davis",
      content: "From a product perspective, the synergies are looking great.",
      timestamp: "1:22 PM",
      isMe: false,
    },
    {
      id: "5",
      sender: "Lisa Chen",
      content: "Thanks for connecting us with your portfolio companies.",
      timestamp: "1:25 PM",
      isMe: false,
    },
    {
      id: "6",
      sender: "Marcus Johnson",
      content: "We'd love to set up follow-up meetings with 2-3 of them.",
      timestamp: "1:27 PM",
      isMe: false,
    },
  ],
  m_006: [
    {
      id: "1",
      sender: "Elena Rodriguez",
      content: "The investor demo yesterday was amazing!",
      timestamp: "9:30 AM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Me",
      content: "Your team handled the technical questions brilliantly.",
      timestamp: "9:35 AM",
      isMe: true,
    },
    {
      id: "3",
      sender: "Elena Rodriguez",
      content: "The demo went perfectly! When can we discuss terms?",
      timestamp: "9:40 AM",
      isMe: false,
    },
  ],
  m_007: [
    {
      id: "1",
      sender: "James Wilson",
      content: "Big news from the EcoLogistics team!",
      timestamp: "2:20 PM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Michelle Kim",
      content: "We can barely contain our excitement here! 🎉",
      timestamp: "2:22 PM",
      isMe: false,
    },
    {
      id: "3",
      sender: "Me",
      content: "What's the update? You sounded excited on the call.",
      timestamp: "2:25 PM",
      isMe: true,
    },
    {
      id: "4",
      sender: "Tom Anderson",
      content: "Our operations team has been preparing for months for this moment.",
      timestamp: "2:28 PM",
      isMe: false,
    },
    {
      id: "5",
      sender: "James Wilson",
      content: "Our pilot with Amazon just got approved!",
      timestamp: "2:30 PM",
      isMe: false,
    },
    {
      id: "6",
      sender: "Me",
      content: "This is huge! Amazon partnership will validate your entire business model.",
      timestamp: "2:35 PM",
      isMe: true,
    },
    {
      id: "7",
      sender: "Michelle Kim",
      content: "We start with 5 warehouses next month. Tom has all the logistics mapped out.",
      timestamp: "2:37 PM",
      isMe: false,
    },
    {
      id: "8",
      sender: "Tom Anderson",
      content: "The scale potential here is incredible. We're ready to execute.",
      timestamp: "2:38 PM",
      isMe: false,
    },
  ],
  m_008: [
    {
      id: "1",
      sender: "Lisa Zhang",
      content: "Following up on our discussion about DataVault's financials.",
      timestamp: "10:45 AM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Me",
      content: "Yes, I'd love to see the updated projections we discussed.",
      timestamp: "10:50 AM",
      isMe: true,
    },
    {
      id: "3",
      sender: "Lisa Zhang",
      content: "Here's the updated pitch deck with the financial projections.",
      timestamp: "10:55 AM",
      isMe: false,
    },
  ],
};

export const mockTeamProfiles: TeamMemberProfile[] = [
  {
    id: "tm_001",
    name: "Sofia Duarte",
    role: "CEO & Founder",
    avatar: "/api/placeholder/128/128",
    bio: "Sofia is a serial entrepreneur with 8+ years in fintech. Previously founded two successful startups, including a B2B payments platform that was acquired by JPMorgan Chase. She holds an MBA from Wharton and is passionate about democratizing financial services for small businesses.",
    education: [
      { institution: "Wharton School", degree: "MBA", year: "2018" },
      { institution: "MIT", degree: "BS Computer Science", year: "2014" },
    ],
    experience: [
      {
        company: "PayFlow (Acquired by JPMorgan)",
        position: "CEO & Founder",
        duration: "2019-2022",
        description: "Built and scaled B2B payments platform to $10M ARR, serving 500+ SMBs",
      },
      {
        company: "Goldman Sachs",
        position: "VP Technology",
        duration: "2016-2019",
        description: "Led digital transformation initiatives in treasury management",
      },
      {
        company: "Google",
        position: "Software Engineer",
        duration: "2014-2016",
        description: "Developed fintech APIs and payment processing systems",
      },
    ],
    skills: ["Fintech", "Product Strategy", "Team Leadership", "Fundraising", "B2B Sales"],
    social: {
      linkedin: "https://linkedin.com/in/sofiaduarte",
      twitter: "https://twitter.com/sofiaduarte",
      email: "sofia@quantpay.com",
    },
    achievements: [
      "Forbes 30 Under 30 in Finance (2020)",
      "Raised $15M+ in venture funding across 2 startups",
      "Built team of 25+ engineers and scaled to $10M ARR",
    ],
  },
  {
    id: "tm_002",
    name: "Max Chen",
    role: "CTO & Co-founder",
    avatar: "/api/placeholder/128/128",
    bio: "Max is a technical leader with deep expertise in financial systems and blockchain technology. Former principal engineer at Stripe where he built core payment infrastructure. Stanford CS graduate with a passion for building scalable, secure financial platforms.",
    education: [
      { institution: "Stanford University", degree: "MS Computer Science", year: "2017" },
      { institution: "UC Berkeley", degree: "BS EECS", year: "2015" },
    ],
    experience: [
      {
        company: "Stripe",
        position: "Principal Engineer",
        duration: "2018-2023",
        description: "Led development of treasury and banking infrastructure serving billions in transactions",
      },
      {
        company: "Coinbase",
        position: "Senior Software Engineer",
        duration: "2017-2018",
        description: "Built secure cryptocurrency trading and custody systems",
      },
      {
        company: "Facebook",
        position: "Software Engineer",
        duration: "2015-2017",
        description: "Developed large-scale distributed systems for payments platform",
      },
    ],
    skills: ["Distributed Systems", "Blockchain", "Security", "Python", "Go", "Kubernetes"],
    social: {
      linkedin: "https://linkedin.com/in/maxchen-tech",
      twitter: "https://twitter.com/maxchen_dev",
      email: "max@quantpay.com",
    },
    achievements: [
      "Built payment systems processing $100B+ annually at Stripe",
      "15+ patents in financial technology",
      "Architected security systems with 99.99% uptime",
    ],
  },
  {
    id: "tm_003",
    name: "Dr. Rachel Kim",
    role: "CEO & Founder",
    avatar: "/api/placeholder/128/128",
    bio: "Dr. Rachel Kim is a physician-entrepreneur combining medical expertise with AI innovation. Board-certified in Emergency Medicine with 10+ years of clinical experience. PhD in Biomedical Informatics from Stanford, specializing in predictive health analytics.",
    education: [
      { institution: "Stanford University", degree: "PhD Biomedical Informatics", year: "2019" },
      { institution: "Harvard Medical School", degree: "MD", year: "2012" },
      { institution: "Yale University", degree: "BS Biology", year: "2008" },
    ],
    experience: [
      {
        company: "Stanford Hospital",
        position: "Emergency Medicine Physician",
        duration: "2015-2023",
        description: "Treated 5000+ patients, specialized in critical care and remote patient monitoring",
      },
      {
        company: "Google Health",
        position: "Medical AI Consultant",
        duration: "2020-2022",
        description: "Advised on development of AI diagnostic tools and clinical decision support systems",
      },
      {
        company: "Mass General Brigham",
        position: "Emergency Medicine Resident",
        duration: "2012-2015",
        description: "Completed residency training in emergency medicine",
      },
    ],
    skills: ["Emergency Medicine", "AI/ML", "Clinical Research", "Product Development", "Regulatory Affairs"],
    social: {
      linkedin: "https://linkedin.com/in/drrachelkim",
      twitter: "https://twitter.com/drrachelkim",
      email: "rachel@vitalai.com",
    },
    achievements: [
      "Published 20+ peer-reviewed papers in medical AI",
      "FDA breakthrough device designation for VitalAI platform",
      "American Medical Association Innovation Award (2023)",
    ],
  },
];

export const mockUser = {
  name: "Jordan Smith",
  title: "Principal @ Venture Capital",
  email: "jordan@vc.com",
  avatar: "/api/placeholder/80/80",
  preferences: {
    darkMode: false,
    sectors: ["Fintech", "HealthTech", "AI"],
    stages: ["Pre-Seed", "Seed", "Series A"],
  },
};

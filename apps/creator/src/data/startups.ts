export type TeamMember = { 
  id: string; 
  name: string; 
  role: string; 
  avatarUrl: string; 
};

export type Startup = {
  id: string;
  name: string;
  blurb: string;
  category: string;
  phase: 'Idea' | 'MVP' | 'Growth' | 'Launched';
  website?: string;
  bannerUrl?: string;
  creatorName: string;
  createdAt: string; // ISO
  ndaRequired?: boolean;
  openPositions: string[]; // "Project needs" roles
  team: TeamMember[];
  details: {
    problemSolution: string;
    founderNote?: string;
    currentStatus?: string;
  };
};

export const mockStartups: Startup[] = [
  {
    id: "xenova-tech",
    name: "Xenova Tech",
    blurb: "AI-powered analytics platform for enterprise decision making",
    category: "AI",
    phase: "Growth",
    website: "https://xenova.tech",
    bannerUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop&crop=center",
    creatorName: "Sarah Chen",
    createdAt: "2024-01-15T10:30:00Z",
    ndaRequired: true,
    openPositions: ["Commission-based Sales", "Frontend Developer", "Performance Marketer (Ads)"],
    team: [
      { id: "1", name: "Sarah Chen", role: "CEO & Founder", avatarUrl: "https://i.pravatar.cc/150?img=1" },
      { id: "2", name: "Marcus Kim", role: "CTO", avatarUrl: "https://i.pravatar.cc/150?img=2" },
      { id: "3", name: "Elena Rodriguez", role: "Head of Product", avatarUrl: "https://i.pravatar.cc/150?img=3" }
    ],
    details: {
      problemSolution: "Traditional analytics tools require weeks of setup and technical expertise. Xenova provides instant AI-powered insights from your existing data sources with zero configuration.",
      founderNote: "We're looking for passionate individuals who want to reshape how businesses make data-driven decisions.",
      currentStatus: "Serving 150+ enterprise customers, growing 40% MoM"
    }
  },
  {
    id: "ecocart",
    name: "EcoCart",
    blurb: "Carbon-neutral shopping made effortless for consumers",
    category: "Climate",
    phase: "MVP",
    website: "https://ecocart.io",
    bannerUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=240&fit=crop&crop=center",
    creatorName: "Alex Thompson",
    createdAt: "2024-02-20T14:45:00Z",
    ndaRequired: false,
    openPositions: ["Frontend Engineer", "Growth", "Video Editor"],
    team: [
      { id: "4", name: "Alex Thompson", role: "Founder", avatarUrl: "https://i.pravatar.cc/150?img=4" },
      { id: "5", name: "Maya Patel", role: "Sustainability Lead", avatarUrl: "https://i.pravatar.cc/150?img=5" }
    ],
    details: {
      problemSolution: "Online shopping contributes to 2.5% of global emissions, but consumers lack easy ways to offset their carbon footprint. EcoCart integrates directly into checkout flows.",
      currentStatus: "Beta testing with 20 e-commerce partners, 5000+ transactions offset"
    }
  },
  {
    id: "pitchlens",
    name: "PitchLens",
    blurb: "AI-powered feedback platform for startup pitches",
    category: "SaaS",
    phase: "Idea",
    bannerUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=240&fit=crop&crop=center",
    creatorName: "David Park",
    createdAt: "2024-03-01T09:15:00Z",
    ndaRequired: true,
    openPositions: ["Full-stack", "Brand Design", "Community"],
    team: [
      { id: "6", name: "David Park", role: "Founder", avatarUrl: "https://i.pravatar.cc/150?img=6" }
    ],
    details: {
      problemSolution: "Founders spend months perfecting their pitch but lack objective feedback. PitchLens uses AI to analyze presentation effectiveness and provides actionable insights.",
      founderNote: "Having pitched to 100+ investors myself, I know the pain of not knowing what resonates. Let's build the tool I wish I had.",
      currentStatus: "Validating concept with 50+ founders, building MVP"
    }
  },
  {
    id: "medflow",
    name: "MedFlow",
    blurb: "Streamlining patient care with intelligent workflow automation",
    category: "HealthTech",
    phase: "Launched",
    website: "https://medflow.health",
    bannerUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=240&fit=crop&crop=center",
    creatorName: "Dr. Lisa Wang",
    createdAt: "2023-11-10T16:20:00Z",
    ndaRequired: false,
    openPositions: ["Backend Engineer", "UX Designer", "Healthcare Compliance Specialist"],
    team: [
      { id: "7", name: "Dr. Lisa Wang", role: "CEO & Founder", avatarUrl: "https://i.pravatar.cc/150?img=7" },
      { id: "8", name: "James Miller", role: "VP Engineering", avatarUrl: "https://i.pravatar.cc/150?img=8" },
      { id: "9", name: "Priya Sharma", role: "Head of Design", avatarUrl: "https://i.pravatar.cc/150?img=9" },
      { id: "10", name: "Robert Chen", role: "Clinical Advisor", avatarUrl: "https://i.pravatar.cc/150?img=10" }
    ],
    details: {
      problemSolution: "Healthcare providers waste 2+ hours daily on administrative tasks. MedFlow automates patient scheduling, documentation, and follow-ups, letting doctors focus on patient care.",
      founderNote: "As a practicing physician, I've lived this problem daily. We're building the solution healthcare desperately needs.",
      currentStatus: "Live in 25+ clinics, processing 10K+ patient interactions monthly"
    }
  },
  {
    id: "cryptosafe",
    name: "CryptoSafe",
    blurb: "Institutional-grade custody for DeFi protocols",
    category: "FinTech",
    phase: "Growth",
    bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop&crop=center",
    creatorName: "Jordan Lee",
    createdAt: "2024-01-05T11:30:00Z",
    ndaRequired: true,
    openPositions: ["Smart Contract Developer", "Security Engineer", "Business Development"],
    team: [
      { id: "11", name: "Jordan Lee", role: "Founder & CTO", avatarUrl: "https://i.pravatar.cc/150?img=11" },
      { id: "12", name: "Amanda Foster", role: "COO", avatarUrl: "https://i.pravatar.cc/150?img=12" },
      { id: "13", name: "Kevin Zhang", role: "Lead Developer", avatarUrl: "https://i.pravatar.cc/150?img=13" }
    ],
    details: {
      problemSolution: "DeFi protocols need enterprise-grade custody solutions but existing options are either too centralized or lack institutional features. CryptoSafe bridges this gap.",
      founderNote: "We're building the infrastructure that will onboard the next trillion dollars into DeFi.",
      currentStatus: "$50M+ in assets under custody, partnered with 15+ protocols"
    }
  },
  {
    id: "learnai",
    name: "LearnAI",
    blurb: "Personalized AI tutoring for K-12 students",
    category: "EdTech",
    phase: "MVP",
    website: "https://learnai.education",
    bannerUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=240&fit=crop&crop=center",
    creatorName: "Maria Gonzalez",
    createdAt: "2024-02-14T13:45:00Z",
    ndaRequired: false,
    openPositions: ["ML Engineer", "Education Specialist", "Mobile Developer"],
    team: [
      { id: "14", name: "Maria Gonzalez", role: "Founder & CEO", avatarUrl: "https://i.pravatar.cc/150?img=14" },
      { id: "15", name: "Tony Kim", role: "AI Lead", avatarUrl: "https://i.pravatar.cc/150?img=15" }
    ],
    details: {
      problemSolution: "Every student learns differently, but traditional education uses a one-size-fits-all approach. LearnAI adapts to each student's pace and learning style in real-time.",
      founderNote: "As a former teacher, I've seen how personalized attention transforms learning outcomes. We're scaling that 1-on-1 magic.",
      currentStatus: "Pilot program in 5 schools, 500+ students using the platform"
    }
  },
  {
    id: "urbanroots",
    name: "Urban Roots",
    blurb: "Vertical farming solutions for urban food deserts",
    category: "AgTech",
    phase: "Idea",
    bannerUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=240&fit=crop&crop=center",
    creatorName: "Carlos Rivera",
    createdAt: "2024-03-15T08:30:00Z",
    ndaRequired: false,
    openPositions: ["Agricultural Engineer", "Hardware Designer", "Sales Lead"],
    team: [
      { id: "16", name: "Carlos Rivera", role: "Founder", avatarUrl: "https://i.pravatar.cc/150?img=16" },
      { id: "17", name: "Dr. Emma Johnson", role: "Agricultural Advisor", avatarUrl: "https://i.pravatar.cc/150?img=17" }
    ],
    details: {
      problemSolution: "23 million Americans live in food deserts with limited access to fresh produce. Urban Roots brings farming directly into communities with automated vertical growing systems.",
      founderNote: "Growing up in a food desert, I know the impact of not having access to fresh, healthy food. Let's change that.",
      currentStatus: "Prototype testing, partnerships with 3 community centers in development"
    }
  },
  {
    id: "socketlabs",
    name: "SocketLabs",
    blurb: "Real-time collaboration tools for remote development teams",
    category: "DevTools",
    phase: "Growth",
    website: "https://socketlabs.dev",
    bannerUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop&crop=center",
    creatorName: "Nina Patel",
    createdAt: "2023-12-01T12:00:00Z",
    ndaRequired: false,
    openPositions: ["DevRel Engineer", "Product Manager", "Growth Marketing"],
    team: [
      { id: "18", name: "Nina Patel", role: "CEO & Founder", avatarUrl: "https://i.pravatar.cc/150?img=18" },
      { id: "19", name: "Sam Wilson", role: "CTO", avatarUrl: "https://i.pravatar.cc/150?img=19" },
      { id: "20", name: "Lisa Chen", role: "Head of Product", avatarUrl: "https://i.pravatar.cc/150?img=20" },
      { id: "21", name: "Mike O'Connor", role: "Lead Frontend", avatarUrl: "https://i.pravatar.cc/150?img=21" }
    ],
    details: {
      problemSolution: "Remote teams struggle with context switching between code, communication, and collaboration tools. SocketLabs integrates everything into one seamless workflow.",
      founderNote: "We've built distributed teams for years and know the pain points. It's time for dev tools that actually understand modern workflows.",
      currentStatus: "5K+ active developers, integrations with all major IDEs"
    }
  },
  {
    id: "mindbridge",
    name: "MindBridge",
    blurb: "Mental health support through AI-powered peer matching",
    category: "HealthTech",
    phase: "MVP",
    bannerUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=240&fit=crop&crop=center",
    creatorName: "Dr. Rachel Kim",
    createdAt: "2024-02-28T15:30:00Z",
    ndaRequired: true,
    openPositions: ["Clinical Psychologist", "iOS Developer", "Community Manager"],
    team: [
      { id: "22", name: "Dr. Rachel Kim", role: "Founder & Chief Clinical Officer", avatarUrl: "https://i.pravatar.cc/150?img=22" },
      { id: "23", name: "Alex Chen", role: "Co-founder & CTO", avatarUrl: "https://i.pravatar.cc/150?img=23" }
    ],
    details: {
      problemSolution: "Traditional therapy has 3+ month wait times and costs $200/session. MindBridge connects people with trained peer supporters matched by AI for immediate, affordable support.",
      founderNote: "Mental health shouldn't be a luxury. We're democratizing access to support when people need it most.",
      currentStatus: "400+ peer supporters trained, 1200+ successful matches made"
    }
  },
  {
    id: "quantumlogistics",
    name: "Quantum Logistics",
    blurb: "Supply chain optimization using quantum computing algorithms",
    category: "Logistics",
    phase: "Launched",
    website: "https://quantumlogistics.com",
    bannerUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=240&fit=crop&crop=center",
    creatorName: "Dr. Ahmed Hassan",
    createdAt: "2023-09-20T09:45:00Z",
    ndaRequired: true,
    openPositions: ["Quantum Algorithm Developer", "Enterprise Sales", "Operations Research Analyst"],
    team: [
      { id: "24", name: "Dr. Ahmed Hassan", role: "CEO & Founder", avatarUrl: "https://i.pravatar.cc/150?img=24" },
      { id: "25", name: "Sophie Laurent", role: "VP of Engineering", avatarUrl: "https://i.pravatar.cc/150?img=25" },
      { id: "26", name: "David Park", role: "Head of Sales", avatarUrl: "https://i.pravatar.cc/150?img=26" },
      { id: "27", name: "Anna Rodriguez", role: "Quantum Researcher", avatarUrl: "https://i.pravatar.cc/150?img=27" },
      { id: "28", name: "Chris Zhang", role: "Lead Developer", avatarUrl: "https://i.pravatar.cc/150?img=28" }
    ],
    details: {
      problemSolution: "Global supply chains lose $1.1T annually due to inefficient routing and inventory management. Our quantum algorithms reduce costs by 15-30% while improving delivery times.",
      founderNote: "Quantum computing is finally ready for real-world applications. We're starting with the $12T logistics industry.",
      currentStatus: "Deployed at 8 Fortune 500 companies, $2.3B in supply chain value optimized"
    }
  },
  {
    id: "echospace",
    name: "EchoSpace",
    blurb: "Immersive audio experiences for virtual meetings",
    category: "SaaS",
    phase: "Idea",
    bannerUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=240&fit=crop&crop=center",
    creatorName: "Jamie Torres",
    createdAt: "2024-03-20T14:15:00Z",
    ndaRequired: false,
    openPositions: ["Audio Engineer", "WebRTC Developer", "UX Researcher"],
    team: [
      { id: "29", name: "Jamie Torres", role: "Founder & CEO", avatarUrl: "https://i.pravatar.cc/150?img=29" }
    ],
    details: {
      problemSolution: "Video calls are exhausting because they lack spatial audio cues we rely on in person. EchoSpace recreates natural conversation dynamics in virtual environments.",
      founderNote: "After 3 years of remote work, I'm convinced the problem isn't video fatigue - it's audio design. Let's fix it.",
      currentStatus: "Prototype built, conducting user research with 50+ remote teams"
    }
  }
];
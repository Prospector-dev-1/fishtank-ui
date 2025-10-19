/**
 * Mock Supabase Client - Backend removed
 * Comprehensive no-op client that supports all Supabase method chaining
 */

const mockUser = { id: "demo-user-1", email: "demo@fishtank.app", name: "Demo User" };
const mockSession = { access_token: "mock-token", user: mockUser };

// Mock Innovation Data
const mockInnovation = {
  id: "innovation-eco-brew-2024",
  user_id: "demo-user-1",
  company_name: "EcoBrew",
  title: "EcoBrew",
  tagline: "Sustainable coffee pods that dissolve in water - zero waste brewing",
  full_description: `EcoBrew is revolutionizing the single-serve coffee industry with the world's first fully biodegradable, water-soluble coffee pods. Our innovative technology allows coffee lovers to enjoy the convenience of pod-based brewing without contributing to landfill waste.

Our pods are made from plant-based materials that completely dissolve in hot water, leaving behind nothing but rich, aromatic coffee. Compatible with all major pod coffee makers, EcoBrew delivers the same quality and convenience consumers expect, while eliminating the 10 billion plastic pods that end up in landfills each year.

We've partnered with sustainable coffee farms across South America and Africa, ensuring fair trade practices and premium quality beans. Each pod is nitrogen-sealed for freshness and comes in 12 signature blends ranging from light breakfast roasts to bold espresso.`,
  category: "Sustainability",
  stage: "Growth",
  problem_statement:
    'Single-serve coffee pods generate over 10 billion units of plastic waste annually. Current "recyclable" pods require manual disassembly and are rarely actually recycled. Conscious consumers want convenience without environmental guilt.',
  solution:
    "Water-soluble pods made from patented plant-based polymers that completely dissolve in hot water. No plastic, no waste, no compromise on taste or convenience. Works with existing pod machines - no new hardware needed.",
  market_size:
    "$18.2B global single-serve coffee market, growing at 7.2% CAGR. 42% of US households own a pod coffee maker. 67% of millennials willing to pay premium for sustainable alternatives.",
  business_model:
    "Direct-to-consumer subscription model with retail partnerships. $24.99/month for 60 pods (15% cheaper than leading brands). Revenue streams: subscriptions (60%), retail (30%), B2B office programs (10%). Target: $12M ARR by Year 2.",
  competitive_advantage:
    "Exclusive patent on dissolution technology (12 years remaining). First-mover advantage in soluble pods. Existing partnerships with 3 major retailers. 94% customer retention rate. Carbon-neutral certified supply chain.",
  team_description:
    "CEO Sarah Chen (ex-Nespresso VP of Innovation, 15 years CPG experience). CTO Dr. Michael Torres (PhD Materials Science, 3 patents in biopolymers). CMO Jennifer Liu (formerly scaled DTC brand from 0 to $50M). 8-person team with expertise in food science, supply chain, and sustainable packaging.",
  traction:
    '2,400 active subscribers (32% MoM growth). $180K MRR. Sold 250K pods in last 6 months. Featured in NYT, Forbes, TechCrunch. Partnership signed with Whole Foods (launching Q2). 4.8/5 rating from 1,200+ reviews. Won "Best Sustainable Product 2024" at GreenTech Awards.',
  current_funding: 750000,
  funding_goal: 2500000,
  video_url: null,
  thumbnail_url: null,
  pitch_deck_url: null,
  is_published: true,
  status: "active",
  tags: ["sustainability", "consumer-products", "direct-to-consumer", "food-tech", "climate-tech", "subscription"],
  faqs: [
    {
      question: "How do the pods dissolve without affecting coffee taste?",
      answer:
        "Our proprietary plant-based polymer dissolves only in hot water (>85°C) and is completely tasteless and odorless. The coffee grounds remain sealed until brewing begins, ensuring zero flavor contamination.",
    },
    {
      question: "Are the pods compatible with my coffee maker?",
      answer:
        "Yes! EcoBrew pods work with all major brands including Keurig, Nespresso, and Tassimo machines. No modifications or adapters needed.",
    },
    {
      question: "What happens to the dissolved pod material?",
      answer:
        "The dissolved polymer breaks down into organic compounds (similar to plant matter) that are safe to wash down the drain. Third-party certified as 100% biodegradable and ocean-safe.",
    },
    {
      question: "How does your pricing compare to traditional pods?",
      answer:
        "We're actually 15% cheaper than leading brands. Our subscription is $24.99/month for 60 pods (41¢ per cup) vs Nespresso at 49¢ per pod or Keurig K-Cups at 52¢ per pod.",
    },
    {
      question: "What coffee varieties do you offer?",
      answer:
        "We offer 12 blends including light, medium, and dark roasts, plus flavored options (vanilla, hazelnut, caramel). All organic, fair-trade certified beans. Custom blend recommendations based on taste quiz.",
    },
  ],
  metrics: {
    views: 1847,
    profile_visits: 423,
    deck_downloads: 89,
    messages: 34,
    investor_interest: 12,
  },
  created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
  updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
};

// Mock Pitch Data
const mockPitches = [
  {
    id: "pitch-eco-brew-investor-1",
    innovation_id: "innovation-eco-brew-2024",
    user_id: "demo-user-1",
    title: "EcoBrew Investor Pitch - Q4 2024",
    description: "Comprehensive pitch deck showcasing our product, traction, and funding ask for Series A round.",
    caption:
      "🌱 Revolutionizing coffee, one dissolved pod at a time. Join us in eliminating 10B plastic pods from landfills. #SustainableTech #EcoBrew",
    hashtags: ["sustainability", "coffee", "ecofriendly", "startup", "investment", "climate"],
    video_url: null,
    thumbnail_url: null,
    deck_url: null,
    status: "published",
    visibility: "public",
    funding_goal: 2500000,
    funding_raised: 750000,
    views_count: 1247,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pitch-eco-brew-quick-2",
    innovation_id: "innovation-eco-brew-2024",
    user_id: "demo-user-1",
    title: "EcoBrew 60-Second Pitch",
    description: "Quick overview for social media and initial investor outreach.",
    caption:
      "What if your coffee pod just... disappeared? ☕️✨ No waste, no guilt, just great coffee. #EcoBrew #Innovation",
    hashtags: ["coffee", "innovation", "ecofriendly", "startup"],
    video_url: null,
    thumbnail_url: null,
    deck_url: null,
    status: "published",
    visibility: "public",
    funding_goal: null,
    funding_raised: null,
    views_count: 856,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pitch-eco-brew-draft-3",
    innovation_id: "innovation-eco-brew-2024",
    user_id: "demo-user-1",
    title: "Product Demo Video - Draft",
    description: "Working on a detailed product demonstration showing dissolution process.",
    caption: "Behind the scenes: Testing our latest pod formulation. Can't wait to share the results! 🧪",
    hashtags: ["productdevelopment", "innovation", "startup"],
    video_url: null,
    thumbnail_url: null,
    deck_url: null,
    status: "draft",
    visibility: "private",
    funding_goal: null,
    funding_raised: null,
    views_count: 0,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockAuth = {
  async signIn(email: string, password: string) {
    return { user: mockUser, session: mockSession, error: null };
  },
  async signInWithPassword(credentials: any) {
    return { data: { user: mockUser, session: mockSession }, error: null };
  },
  async signUp(data: any, options?: any) {
    return { data: { user: mockUser, session: mockSession }, error: null };
  },
  async signOut() {
    return { error: null };
  },
  async getSession() {
    return { data: { session: mockSession }, error: null };
  },
  async getUser() {
    return { data: { user: mockUser }, error: null };
  },
  onAuthStateChange(callback: any) {
    // Immediately call with signed-in state
    setTimeout(() => callback("SIGNED_IN", mockSession), 0);
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
};

// Create chainable query builder
function createChainableQuery(tableName: string) {
  let filters: any = {};
  let queryType = "select";

  const chain: any = {
    select: (columns?: string) => {
      queryType = "select";
      return chain;
    },
    insert: (data: any) => {
      queryType = "insert";
      return chain;
    },
    update: (data: any) => {
      queryType = "update";
      return chain;
    },
    upsert: (data: any) => {
      queryType = "upsert";
      return chain;
    },
    delete: () => {
      queryType = "delete";
      return chain;
    },
    eq: (column: string, value: any) => {
      filters[column] = value;
      return chain;
    },
    neq: (column: string, value: any) => chain,
    gt: (column: string, value: any) => chain,
    lt: (column: string, value: any) => chain,
    gte: (column: string, value: any) => chain,
    lte: (column: string, value: any) => chain,
    like: (column: string, value: any) => chain,
    ilike: (column: string, value: any) => chain,
    is: (column: string, value: any) => chain,
    in: (column: string, values: any[]) => chain,
    contains: (column: string, value: any) => chain,
    containedBy: (column: string, value: any) => chain,
    range: (from: number, to: number) => chain,
    order: (column: string, options?: any) => chain,
    limit: (count: number) => chain,
    or: (query: string) => chain,
    and: (query: string) => chain,
    not: (column: string, operator: string, value: any) => chain,
    filter: (column: string, operator: string, value: any) => chain,
    match: (query: object) => chain,
    single: async () => {
      if (tableName === "innovations") {
        // Check if the query matches our mock innovation
        if (filters.id === mockInnovation.id || filters.user_id === mockUser.id || Object.keys(filters).length === 0) {
          return { data: mockInnovation, error: null };
        }
      }
      return { data: null, error: null };
    },
    maybeSingle: async () => {
      if (tableName === "innovations") {
        if (filters.id === mockInnovation.id || filters.user_id === mockUser.id || Object.keys(filters).length === 0) {
          return { data: mockInnovation, error: null };
        }
      }
      return { data: null, error: null };
    },
    then: async (resolve: any) => {
      // Handle queries that return arrays
      if (tableName === "innovations" && queryType === "select") {
        if (filters.user_id === mockUser.id || Object.keys(filters).length === 0) {
          return resolve({ data: [mockInnovation], error: null });
        }
      }
      if (tableName === "pitches" && queryType === "select") {
        // Filter pitches by innovation_id if specified
        if (filters.innovation_id) {
          const filtered = mockPitches.filter((p) => p.innovation_id === filters.innovation_id);
          return resolve({ data: filtered, error: null });
        }
        return resolve({ data: mockPitches, error: null });
      }
      if (tableName === "team_members") {
        // No team memberships for demo
        return resolve({ data: [], error: null });
      }
      return resolve({ data: [], error: null });
    },
  };
  return chain;
}

// Create chainable channel
function createChannel() {
  const channel: any = {
    on: (event: string, filter?: any, callback?: any) => channel,
    subscribe: (callback?: any) => ({ unsubscribe: () => {} }),
    unsubscribe: () => ({}),
  };
  return channel;
}

export const supabase = {
  auth: mockAuth,
  from: (table: string) => createChainableQuery(table),
  channel: (name: string) => createChannel(),
  storage: {
    from: (bucket: string) => ({
      upload: async () => ({ data: { path: "mock-path" }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: "/placeholder.svg" } }),
      download: async (path: string) => ({ data: null, error: null }),
      remove: async (paths: string[]) => ({ data: null, error: null }),
    }),
  },
};

export type ID = string;
export type ISODate = string;

// Fishtank Data Models
export interface User {
  id: ID;
  name: string;
  city: string;
  photo?: string;
  bio?: string;
  skills: string[];
  cofounderOpen: boolean;
  cofounderRoles: string[];
  availability?: string;
  links?: string[];
}

export interface Innovation {
  id: string;
  user_id: string;
  company_name: string;
  title: string;
  tagline: string | null;
  full_description: string | null;
  category: string | null;
  stage: string | null;
  problem_statement: string | null;
  solution: string | null;
  market_size: string | null;
  business_model?: string | null;
  competitive_advantage: string | null;
  team_description: string | null;
  traction: string | null;
  current_funding: number | null;
  funding_goal: number | null;
  video_url: string | null;
  thumbnail_url: string | null;
  pitch_deck_url: string | null;
  is_published: boolean | null;
  status: string | null;
  tags: string[] | null;
  faqs?: Array<{question: string, answer: string}> | null;
  metrics?: any;
  created_at: string;
  updated_at: string;
}

export interface Pitch {
  id: string;
  innovation_id: string;
  user_id: string;
  title: string;
  description: string | null;
  caption: string | null;
  hashtags: string[] | null;
  video_url: string | null;
  thumbnail_url: string | null;
  deck_url: string | null;
  status: string | null;
  visibility: string | null;
  funding_goal: number | null;
  funding_raised: number | null;
  views_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PitchDetails {
  innovationId: ID;
  problem: string;
  solution: string;
  marketSize: string;
  tractionMetrics: string;
  fundingAsk: string;
  equityOffer: string;
}

export interface Analytics {
  views: number[];
  messages: number[];
  ctr: number[];
  ndaRequests: number[];
  approvals: number[];
  connects: number[];
  rangeLabels: string[];
}

export interface Traffic {
  feed: number;
  direct: number;
  profile: number;
  shares: number;
}

export interface Opportunity {
  id: ID;
  ownerId: ID;
  innovationId?: string;
  role: string;
  description: string;
  deliverables: string[];
  commitment: {
    hoursPerWeek: number;
    durationWeeks: number;
    startDate: string;
  };
  compensation: {
    type: 'paid' | 'equity' | 'stipend' | 'volunteer';
    range?: string;
  };
  location: 'remote' | 'local';
  tags: string[];
  status: 'open' | 'closed';
  attachments?: string[];
  createdAt: ISODate;
}

export interface Application {
  id: ID;
  opportunityId: ID;
  creatorId: ID;
  message: string;
  portfolio: string[];
  status: 'new' | 'shortlisted' | 'declined';
  createdAt: ISODate;
}

export interface Profile {
  id: ID;
  name: string;
  photo?: string;
  bio?: string;
  skills: string[];
  portfolio: string[];
  introVideo?: string;
  rates?: string;
  availability?: string;
  location?: string;
  badges: string[];
  openTo: {
    investor?: boolean;
    cofounder?: boolean;
    creatorWork?: boolean;
  };
}

export interface Connection {
  id: ID;
  fromId: ID;
  toId: ID;
  type: 'connect' | 'nda' | 'collab';
  status: 'requested' | 'accepted' | 'declined';
  createdAt: ISODate;
}

export interface Team {
  id: ID;
  innovationId: ID;
  name: string;
  members: string[];
  roles: { [userId: string]: 'owner' | 'admin' | 'member' | 'guest' };
  pinned: string[];
  files: { name: string; url: string }[];
  milestones: { id: string; title: string; done: boolean }[];
  welcomeMessage?: string;
  createdAt: ISODate;
}

export interface Message {
  id: ID;
  threadId: ID;
  fromId: ID;
  toId?: string;
  teamId?: string;
  text?: string;
  attachments?: {
    type: 'image' | 'video' | 'pdf' | 'link';
    url: string;
  }[];
  createdAt: ISODate;
}

export interface MessageThread {
  id: ID;
  type: 'dm' | 'team';
  participantIds: string[];
  teamId?: string;
  lastMessageAt: ISODate;
}

export interface Notification {
  id: ID;
  type: 'investor' | 'network' | 'creator' | 'teams' | 'system';
  title: string;
  body: string;
  read: boolean;
  createdAt: ISODate;
}

export interface Event {
  id: ID;
  type: 'meetup';
  title: string;
  description: string;
  startISO: ISODate;
  rsvpIds: string[];
}

export interface Prompt {
  id: ID;
  text: string;
  weekISO: string;
}

export interface Badge {
  userId: ID;
  badge: 'Top Innovator' | 'Community Builder' | 'Mentor';
  awardedAt: ISODate;
}

// UI State Interfaces
export interface UploadDraft {
  step: number;
  formData: Partial<Innovation & Pitch & PitchDetails>;
  lastSaved: ISODate;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
  color: string;
}

export interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  quickActions?: QuickAction[];
  notifications: {
    investor: boolean;
    network: boolean;
    creator: boolean;
    teams: boolean;
    system: boolean;
  };
}
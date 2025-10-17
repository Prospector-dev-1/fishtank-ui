// Enhanced type definitions for Creator platform
import creatorAvatar from "@/assets/creator-avatar.jpg";
import innovatorSarah from "@/assets/innovator-sarah.jpg";
import innovatorMarcus from "@/assets/innovator-marcus.jpg";
import fintechProject from '@/assets/fintech-project.jpg';
import fashionProject from '@/assets/fashion-project.jpg';
import portfolioPitchDecks from '@/assets/portfolio-pitchdecks.jpg';
import portfolioBranding from '@/assets/portfolio-branding.jpg';

export interface Creator {
  id: string;
  username: string;
  name: string;
  headline: string;
  avatar: string;
  verified: boolean;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  completedProjects: number;
  earnings: number;
  availability: 'open' | 'busy';
  defaultNDA: boolean;
  pricingMode: 'packages' | 'hourly' | 'both';
  hourlyRate?: number;
  responseTime: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  scope: string[];
  price: number;
  etaDays: number;
  type: 'fixed' | 'hourly';
  hourlyRate?: number;
  category: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  mediaType: 'video' | 'image' | 'link';
  url: string;
  thumbnail: string;
  category: string;
  tags: string[];
  role: string;
  duration?: string;
}

export interface Brief {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: string;
  budget: number;
  timeline: '<2w' | '1m' | '>1m';
  ndaRequired: boolean;
  tags: string[];
  innovator: {
    name: string;
    avatar: string;
  };
  thumbnail: string;
  postedAt: string;
  equityOffered?: number;
  revShareOffered?: number;
}

export interface NDARecord {
  id: string;
  briefId: string;
  title: string;
  acceptedAt: string;
  status: 'accepted' | 'declined' | 'pending';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  due: string;
  price: number;
  status: 'not_funded' | 'held' | 'in_review' | 'released' | 'disputed';
  deliverables: { name: string; url?: string; uploadedAt?: string }[];
  notes?: string;
}

export interface Proposal {
  id: string;
  briefId: string;
  creatorId: string;
  title: string;
  summary: string;
  milestones: Milestone[];
  totalAmount: number;
  timeline: string;
  notes: string;
  status: 'draft' | 'sent' | 'countered' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  briefId: string;
  proposalId: string;
  title: string;
  milestones: Milestone[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  author: 'creator' | 'innovator' | 'system';
  text?: string;
  attachments?: { name: string; url: string; type: string }[];
  systemType?: 'nda' | 'proposal' | 'milestone' | 'release' | 'dispute';
  timestamp: string;
}

export interface ChatThread {
  id: string;
  type: 'message' | 'system' | 'team';
  briefId?: string;
  contractId?: string;
  participantName: string;
  participantAvatar: string;
  projectTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'completed' | 'disputed';
  messages: Message[];
  milestones?: Milestone[];
}

export interface Payout {
  id: string;
  amount: number;
  status: 'held' | 'pending' | 'paid';
  description: string;
  createdAt: string;
  processedAt?: string;
}

export interface Review {
  id: string;
  from: 'innovator' | 'creator';
  to: string;
  projectTitle: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  contractId: string;
  milestoneId: string;
  title: string;
  description: string;
  evidence: { name: string; url: string }[];
  status: 'open' | 'in_review' | 'resolved';
  resolution?: string;
  createdAt: string;
  deadline: string;
}

export interface Invitation {
  id: string;
  briefId: string;
  title: string;
  budget: number;
  timeline: string;
  message: string;
  from: string;
  avatar: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface SavedItem {
  id: string;
  briefId: string;
  title: string;
  category: string;
  budget: number;
  timeline: string;
  thumbnail: string;
  savedAt: string;
}

// Export existing types for compatibility
export type { Innovation, Gig } from './mockData';
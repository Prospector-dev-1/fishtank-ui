export type Creator = {
  id: string;
  name: string;
  headline: string;
  skills: string[];
  rating: number;
  availability: 'open' | 'busy';
  compensation: Array<'hourly' | 'equity' | 'commission' | 'fixed'>;
  hourlyRate?: number;
  timezone?: string;
  avatarUrl: string;
  website?: string;
  bio?: string;
  email?: string;
  responseTime: string;
  services: ServicePackage[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  endorsements: Endorsement[];
};

export type ServicePackage = {
  id: string;
  title: string;
  scope: string[];
  etaDays: number;
  type: 'fixed' | 'hourly';
  price?: number;
  hourlyRate?: number;
  offers?: Array<'equity' | 'commission'>;
};

export type PortfolioItem = {
  id: string;
  mediaType: 'image' | 'video' | 'link';
  url: string;
  title: string;
  tags: string[];
};

export type Review = {
  id: string;
  from: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type Endorsement = {
  id: string;
  fromCreatorId: string;
  fromName: string;
  fromRole: string;
  text: string;
  createdAt: string;
};

export type Invite = {
  id: string;
  toCreatorId: string;
  role: string;
  note?: string;
  ndaRequired?: boolean;
  milestones: Milestone[];
  splitPct?: number;
  status: 'pending' | 'accepted' | 'declined';
};

export type Milestone = {
  id: string;
  title: string;
  due: string;
  deliverables: string;
  compensation:
    | { type: 'hourly'; hourlyRate: number; estHours: number }
    | { type: 'equity'; equityPct: number }
    | { type: 'commission'; commissionPct: number }
    | { type: 'fixed'; amount: number };
};

export type Referral = {
  id: string;
  toCreatorId: string;
  percent: number;
  note?: string;
  status: 'pending' | 'tracked';
};
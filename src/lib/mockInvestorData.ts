// Mock data for investor interactions
export const mockInvestorInteractions = [
  {
    id: '1',
    investorName: 'Sarah Chen',
    investorFirm: 'Andreessen Horowitz',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c3c9?w=100&h=100&fit=crop&crop=face',
    stage: 'funding_committed' as const,
    viewCount: 8,
    lastViewed: '2024-01-15T10:30:00Z',
    ndaSignedAt: '2024-01-10T14:20:00Z',
    meetingScheduledAt: '2024-01-12T16:00:00Z',
    fundingAmount: 500000,
    investorType: 'VC' as const,
    interestLevel: 'High' as const,
    notes: 'Very interested in AI/ML applications. Looking for Series A round.'
  },
  {
    id: '2',
    investorName: 'Michael Rodriguez',
    investorFirm: 'Sequoia Capital',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    stage: 'meeting_scheduled' as const,
    viewCount: 12,
    lastViewed: '2024-01-14T15:45:00Z',
    ndaSignedAt: '2024-01-08T09:15:00Z',
    meetingScheduledAt: '2024-01-16T11:00:00Z',
    investorType: 'VC' as const,
    interestLevel: 'High' as const,
    notes: 'Impressed with traction metrics. Wants to discuss growth strategy.'
  },
  {
    id: '3',
    investorName: 'Emily Watson',
    investorFirm: 'Kleiner Perkins',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    stage: 'nda_signed' as const,
    viewCount: 6,
    lastViewed: '2024-01-13T12:20:00Z',
    ndaSignedAt: '2024-01-11T13:30:00Z',
    investorType: 'VC' as const,
    interestLevel: 'Medium' as const,
    notes: 'Reviewing due diligence materials. Interested in market size.'
  },
  {
    id: '4',
    investorName: 'David Kim',
    investorFirm: 'First Round Capital',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    stage: 'nda_requested' as const,
    viewCount: 4,
    lastViewed: '2024-01-12T14:10:00Z',
    investorType: 'VC' as const,
    interestLevel: 'Medium' as const,
    notes: 'Wants to see financial projections before proceeding.'
  },
  {
    id: '5',
    investorName: 'Lisa Thompson',
    investorFirm: 'Bessemer Venture Partners',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
    stage: 'viewed' as const,
    viewCount: 2,
    lastViewed: '2024-01-11T16:45:00Z',
    investorType: 'VC' as const,
    interestLevel: 'Low' as const
  },
  {
    id: '6',
    investorName: 'James Wilson',
    investorFirm: 'Angel Individual',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    stage: 'funding_committed' as const,
    viewCount: 15,
    lastViewed: '2024-01-14T09:30:00Z',
    ndaSignedAt: '2024-01-09T10:00:00Z',
    meetingScheduledAt: '2024-01-11T14:30:00Z',
    fundingAmount: 100000,
    investorType: 'Angel' as const,
    interestLevel: 'High' as const,
    notes: 'Serial entrepreneur with domain expertise. Quick decision maker.'
  },
  {
    id: '7',
    investorName: 'Rachel Green',
    investorFirm: 'Greylock Partners',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    stage: 'nda_signed' as const,
    viewCount: 7,
    lastViewed: '2024-01-13T11:15:00Z',
    ndaSignedAt: '2024-01-10T16:45:00Z',
    investorType: 'VC' as const,
    interestLevel: 'High' as const,
    notes: 'Evaluating competitive landscape. Positive on team background.'
  },
  {
    id: '8',
    investorName: 'Alex Morgan',
    investorFirm: 'Benchmark',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    stage: 'viewed' as const,
    viewCount: 3,
    lastViewed: '2024-01-10T13:20:00Z',
    investorType: 'VC' as const,
    interestLevel: 'Medium' as const
  }
];

export const mockPitchData = [
  {
    id: 'pitch-1',
    title: 'AI-Powered Analytics Platform',
    pitchType: 'Video' as const,
    publishedAt: '2024-01-05T10:00:00Z',
    interactions: mockInvestorInteractions.slice(0, 6)
  },
  {
    id: 'pitch-2', 
    title: 'Series A Funding Deck',
    pitchType: 'Deck' as const,
    publishedAt: '2024-01-08T14:30:00Z',
    interactions: mockInvestorInteractions.slice(2, 8)
  },
  {
    id: 'pitch-3',
    title: 'Product Demo & Market Analysis',
    pitchType: 'Document' as const,
    publishedAt: '2024-01-12T09:15:00Z',
    interactions: mockInvestorInteractions.slice(4, 7)
  }
];

export function getMockInvestorStats() {
  const allInteractions = mockInvestorInteractions;
  
  return {
    totalViews: allInteractions.reduce((sum, i) => sum + i.viewCount, 0),
    ndaSignatures: allInteractions.filter(i => 
      ['nda_signed', 'meeting_scheduled', 'funding_committed'].includes(i.stage)
    ).length,
    meetingsScheduled: allInteractions.filter(i => 
      ['meeting_scheduled', 'funding_committed'].includes(i.stage)
    ).length,
    fundingCommitments: allInteractions.filter(i => i.stage === 'funding_committed').length,
    totalFunding: allInteractions
      .filter(i => i.stage === 'funding_committed')
      .reduce((sum, i) => sum + (i.fundingAmount || 0), 0),
    interestedInvestors: allInteractions.filter(i => i.interestLevel === 'High').length,
    pendingNDAs: allInteractions.filter(i => i.stage === 'nda_requested').length,
    activeDeals: allInteractions.filter(i => 
      ['meeting_scheduled', 'funding_committed'].includes(i.stage)
    ).length
  };
}
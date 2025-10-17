import { useState, useEffect, useCallback } from 'react';
import { Startup } from "@/data/investor/mockData";

interface UserProfile {
  sectors: string[];
  stages: string[];
  investmentRange: [number, number];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  previousInvestments: string[];
  preferences: {
    teamSize: number;
    geographicFocus: string[];
    businessModel: string[];
  };
}

interface RecommendationScore {
  startupId: string;
  score: number;
  reasoning: string[];
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface AIInsight {
  type: 'market_trend' | 'sector_analysis' | 'risk_assessment' | 'opportunity';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  dataPoints: string[];
}

export function useAIRecommendations(userProfile: UserProfile, startups: Startup[]) {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  const calculateSectorCompatibility = useCallback((startup: Startup, profile: UserProfile): number => {
    const sectorMatch = profile.sectors.includes(startup.sector) ? 1 : 0;
    const stageMatch = profile.stages.includes(startup.stage) ? 1 : 0;
    return (sectorMatch * 0.6) + (stageMatch * 0.4);
  }, []);

  const analyzeTraction = useCallback((startup: Startup): number => {
    let score = 0;
    const metrics = startup.traction;
    
    // Analyze revenue growth
    const revenueMetrics = metrics.filter(m => m.metric.toLowerCase().includes('revenue'));
    if (revenueMetrics.length > 0) {
      score += 0.3;
    }

    // Analyze user growth
    const userMetrics = metrics.filter(m => 
      m.metric.toLowerCase().includes('user') || 
      m.metric.toLowerCase().includes('customer')
    );
    if (userMetrics.length > 0) {
      score += 0.2;
    }

    // Team size and quality
    if (startup.team.length >= 2) {
      score += 0.2;
    }

    // Milestone achievement
    if (startup.milestones.length > 0) {
      score += 0.3;
    }

    return Math.min(score, 1);
  }, []);

  const assessRisk = useCallback((startup: Startup): 'low' | 'medium' | 'high' => {
    let riskScore = 0;

    // Stage-based risk
    const stageRisk = {
      'Pre-Seed': 0.8,
      'Seed': 0.6,
      'Series A': 0.4,
      'Series B': 0.2
    };
    riskScore += stageRisk[startup.stage];

    // Traction-based risk (inverse relationship)
    const tractionScore = analyzeTraction(startup);
    riskScore += (1 - tractionScore) * 0.5;

    // Market size and competition (simplified)
    const competitiveMarkets = ['Fintech', 'AI', 'E-commerce'];
    if (competitiveMarkets.includes(startup.sector)) {
      riskScore += 0.3;
    }

    if (riskScore > 0.7) return 'high';
    if (riskScore > 0.4) return 'medium';
    return 'low';
  }, [analyzeTraction]);

  const generateRecommendationReasoning = useCallback((
    startup: Startup, 
    compatibilityScore: number, 
    tractionScore: number, 
    riskLevel: string
  ): string[] => {
    const reasons: string[] = [];

    if (compatibilityScore > 0.7) {
      reasons.push('Strong alignment with your investment preferences');
    }

    if (tractionScore > 0.8) {
      reasons.push('Exceptional traction metrics and growth indicators');
    } else if (tractionScore > 0.5) {
      reasons.push('Solid traction with room for growth');
    }

    if (riskLevel === 'low') {
      reasons.push('Lower risk profile suitable for conservative investors');
    } else if (riskLevel === 'high') {
      reasons.push('High growth potential with appropriate risk management');
    }

    if (startup.team.length >= 3) {
      reasons.push('Strong founding team with diverse expertise');
    }

    if (startup.milestones.length > 2) {
      reasons.push('Consistent milestone achievement demonstrates execution ability');
    }

    return reasons;
  }, []);

  const generateMarketInsights = useCallback((startups: Startup[]): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    // Sector trends
    const sectorCounts = startups.reduce((acc, startup) => {
      acc[startup.sector] = (acc[startup.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const trendingSector = Object.entries(sectorCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    if (trendingSector) {
      insights.push({
        type: 'market_trend',
        title: `${trendingSector} Sector Momentum`,
        description: `${trendingSector} represents the highest concentration of deal flow, indicating strong investor interest and market validation.`,
        impact: 'positive',
        confidence: 0.85,
        dataPoints: [`${sectorCounts[trendingSector]} active startups`, 'Above-average investor engagement']
      });
    }

    // Stage distribution analysis
    const stageCounts = startups.reduce((acc, startup) => {
      acc[startup.stage] = (acc[startup.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const earlyStageCount = (stageCounts['Pre-Seed'] || 0) + (stageCounts['Seed'] || 0);
    if (earlyStageCount > startups.length * 0.6) {
      insights.push({
        type: 'opportunity',
        title: 'Early-Stage Investment Opportunity',
        description: 'High concentration of early-stage startups presents opportunity for higher returns with appropriate risk management.',
        impact: 'positive',
        confidence: 0.75,
        dataPoints: [`${earlyStageCount} early-stage companies`, 'Potential for higher returns']
      });
    }

    return insights;
  }, []);

  const analyzeStartups = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const scores: RecommendationScore[] = startups.map(startup => {
      const compatibilityScore = calculateSectorCompatibility(startup, userProfile);
      const tractionScore = analyzeTraction(startup);
      const riskLevel = assessRisk(startup);
      
      // Complex scoring algorithm
      let finalScore = 0;
      finalScore += compatibilityScore * 0.3;
      finalScore += tractionScore * 0.4;
      finalScore += (riskLevel === 'low' ? 0.8 : riskLevel === 'medium' ? 0.6 : 0.4) * 0.2;
      
      // Add randomness for market dynamics
      finalScore += (Math.random() - 0.5) * 0.1;
      finalScore = Math.max(0, Math.min(1, finalScore));

      const reasoning = generateRecommendationReasoning(startup, compatibilityScore, tractionScore, riskLevel);
      
      return {
        startupId: startup.id,
        score: finalScore,
        reasoning,
        confidence: 0.7 + (tractionScore * 0.3),
        riskLevel
      };
    });

    // Sort by score and take top recommendations
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    setRecommendations(sortedScores);

    // Generate market insights
    const marketInsights = generateMarketInsights(startups);
    setInsights(marketInsights);
    
    setLastAnalysis(new Date());
    setIsAnalyzing(false);
  }, [startups, userProfile, calculateSectorCompatibility, analyzeTraction, assessRisk, generateRecommendationReasoning, generateMarketInsights]);

  const getRecommendationsForStartup = useCallback((startupId: string) => {
    return recommendations.find(rec => rec.startupId === startupId);
  }, [recommendations]);

  const getTopRecommendations = useCallback((limit: number = 5) => {
    return recommendations.slice(0, limit);
  }, [recommendations]);

  const refreshAnalysis = useCallback(() => {
    analyzeStartups();
  }, [analyzeStartups]);

  // Auto-analyze when dependencies change
  useEffect(() => {
    if (startups.length > 0) {
      analyzeStartups();
    }
  }, [startups, userProfile]);

  return {
    recommendations,
    insights,
    isAnalyzing,
    lastAnalysis,
    getRecommendationsForStartup,
    getTopRecommendations,
    refreshAnalysis
  };
}
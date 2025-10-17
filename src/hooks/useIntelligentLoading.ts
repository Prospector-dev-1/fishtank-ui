import { useState, useEffect, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  progress: number;
  phase: 'initializing' | 'processing' | 'finalizing' | 'complete';
  estimatedTime?: number;
  message?: string;
}

interface LoadingPhase {
  name: string;
  duration: number;
  message: string;
}

const defaultPhases: LoadingPhase[] = [
  { name: 'initializing', duration: 500, message: 'Initializing...' },
  { name: 'processing', duration: 1500, message: 'Processing data...' },
  { name: 'finalizing', duration: 300, message: 'Finalizing...' }
];

export function useIntelligentLoading(phases: LoadingPhase[] = defaultPhases) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    phase: 'initializing'
  });

  const startLoading = useCallback(() => {
    setLoadingState({
      isLoading: true,
      progress: 0,
      phase: 'initializing',
      estimatedTime: phases.reduce((sum, phase) => sum + phase.duration, 0),
      message: phases[0]?.message
    });

    let currentPhaseIndex = 0;
    let phaseStartTime = Date.now();
    let totalProgress = 0;

    const updateProgress = () => {
      if (currentPhaseIndex >= phases.length) {
        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          progress: 100,
          phase: 'complete',
          message: 'Complete!'
        }));
        return;
      }

      const currentPhase = phases[currentPhaseIndex];
      const elapsed = Date.now() - phaseStartTime;
      const phaseProgress = Math.min(elapsed / currentPhase.duration, 1);
      
      const phaseTotalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
      const previousPhasesWeight = phases.slice(0, currentPhaseIndex)
        .reduce((sum, phase) => sum + phase.duration, 0) / phaseTotalDuration;
      const currentPhaseWeight = currentPhase.duration / phaseTotalDuration;
      
      const overallProgress = (previousPhasesWeight + (currentPhaseWeight * phaseProgress)) * 100;

      setLoadingState(prev => ({
        ...prev,
        progress: Math.min(overallProgress, 100),
        phase: currentPhase.name as LoadingState['phase'],
        message: currentPhase.message,
        estimatedTime: Math.max(0, phaseTotalDuration - elapsed - totalProgress)
      }));

      if (phaseProgress >= 1) {
        currentPhaseIndex++;
        phaseStartTime = Date.now();
        totalProgress += currentPhase.duration;
      }

      if (currentPhaseIndex < phases.length) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [phases]);

  const stopLoading = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      progress: 100,
      phase: 'complete'
    }));
  }, []);

  return {
    loadingState,
    startLoading,
    stopLoading
  };
}
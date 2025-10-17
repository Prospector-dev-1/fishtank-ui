import { useCallback } from 'react';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection' | 'impact' | 'notification' | 'double' | 'triple';

interface HapticConfig {
  intensity: number;
  duration: number;
  pattern?: number[];
}

const hapticPatterns: Record<HapticPattern, HapticConfig> = {
  light: { intensity: 25, duration: 25 },
  medium: { intensity: 50, duration: 50 },
  heavy: { intensity: 100, duration: 100 },
  success: { intensity: 50, duration: 25, pattern: [25, 25, 50] },
  warning: { intensity: 75, duration: 50, pattern: [50, 25, 50] },
  error: { intensity: 100, duration: 75, pattern: [100, 50, 100] },
  selection: { intensity: 30, duration: 15 },
  impact: { intensity: 80, duration: 35, pattern: [80] },
  notification: { intensity: 40, duration: 30, pattern: [30, 15, 30] },
  double: { intensity: 50, duration: 25, pattern: [25, 50, 25, 50] },
  triple: { intensity: 50, duration: 20, pattern: [20, 30, 20, 30, 20, 30] }
};

export function useHapticFeedback() {
  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    if (!('vibrate' in navigator)) return;
    
    const config = hapticPatterns[pattern];
    
    try {
      if (config.pattern) {
        navigator.vibrate(config.pattern);
      } else {
        navigator.vibrate(config.duration);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, []);

  const triggerCustomHaptic = useCallback((duration: number | number[]) => {
    if (!('vibrate' in navigator)) return;
    
    try {
      navigator.vibrate(duration);
    } catch (error) {
      console.warn('Custom haptic feedback failed:', error);
    }
  }, []);

  return {
    triggerHaptic,
    triggerCustomHaptic,
    isSupported: 'vibrate' in navigator
  };
}
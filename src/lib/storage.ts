// Web storage implementation (localStorage) simulating AsyncStorage
export class Storage {
  private static prefix = 'ft:';

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }
}

// Fishtank Storage Keys
export const STORAGE_KEYS = {
  USER: 'ft_user',
  INNOVATIONS: 'ft_innovations',
  PITCHES: 'ft_pitches',
  PITCH_DETAILS: 'ft_pitchDetails',
  ANALYTICS: 'ft_analytics',
  TRAFFIC: 'ft_traffic',
  OPPORTUNITIES: 'ft_opportunities',
  APPLICATIONS: 'ft_applications',
  PROFILES: 'ft_profiles',
  CONNECTIONS: 'ft_connections',
  TEAMS: 'ft_teams',
  MESSAGES: 'ft_messages',
  THREADS: 'ft_threads',
  NOTIFICATIONS: 'ft_notifications',
  EVENTS: 'ft_events',
  PROMPTS: 'ft_prompts',
  BADGES: 'ft_badges',
  UPLOAD_DRAFT: 'ft_upload_draft',
  PREFERENCES: 'ft_preferences',
  SESSION: 'ft_session'
} as const;

// Utility functions for easier localStorage access
export const lsGet = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error('lsGet error:', error);
    return fallback;
  }
};

export const lsSet = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('lsSet error:', error);
  }
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
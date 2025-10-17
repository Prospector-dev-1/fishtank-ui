import { create } from 'zustand';

// Minimal store for Tank page - legacy removed
interface FishtankState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  loadInitialData: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFishtankStore = create<FishtankState>((set) => ({
  isLoading: false,
  error: null,
  isAuthenticated: true,

  loadInitialData: async () => {
    // No-op for now - data loaded directly in components
    set({ isLoading: false, error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },
}));

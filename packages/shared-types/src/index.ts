// Shared TypeScript types across all apps

export type Role = "creator" | "innovator" | "investor";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

// Add more shared types here as needed


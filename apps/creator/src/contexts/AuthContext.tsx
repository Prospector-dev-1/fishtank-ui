import { createContext, useContext, ReactNode } from "react";

// Mock types - backend removed
type User = { id: string; email: string; name?: string };
type Session = { access_token: string; user: User };

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Mock user - always authenticated
const mockUser: User = { id: 'demo-user-1', email: 'demo@fishtank.app', name: 'Demo User' };
const mockSession: Session = { access_token: 'mock-token', user: mockUser };

const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  session: mockSession,
  loading: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always return mock authenticated user - no backend
  return (
    <AuthContext.Provider value={{ user: mockUser, session: mockSession, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

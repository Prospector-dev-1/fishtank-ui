/**
 * Protected Route - Backend removed
 * Now allows all access since we have no real authentication
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // No auth check - backend removed, always allow access
  return <>{children}</>;
}

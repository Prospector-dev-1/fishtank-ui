import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import { useFishtankStore } from "@/store/fishtankStore";
import { useEffect } from "react";

import Home from "@/pages/Home";
import Tank from "@/pages/Tank";
import EditInnovation from "@/pages/EditInnovation";
import InnovationSettings from "@/pages/InnovationSettings";
import CreatePitch from "@/pages/CreatePitch";
import PitchView from "@/pages/PitchView";
import PitchAnalytics from "@/pages/PitchAnalytics";
import Network from "@/pages/Network";
import Collaborate from "@/pages/Collaborate";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import Settings from "@/pages/Settings";
import UserProfile from "@/pages/UserProfile";
import Auth from "@/pages/Auth";
import Search from "@/pages/Search";
import Analytics from "@/pages/Analytics";
import NDARequest from "@/pages/NDARequest";
import ProjectDetail from "@/pages/ProjectDetail";
import Scheduling from "@/pages/Scheduling";
import TeamManagement from "@/pages/TeamManagement";
import MessagingNew from "@/pages/MessagingNew";
import NotFound from "@/pages/NotFound";
import { FishtankNavigation } from "@/components/layout/FishtankNavigation";

const queryClient = new QueryClient();

/**
 * Protected Route - Backend removed
 * Now allows all access since we have no real authentication
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // No auth check - backend removed, always allow access
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const mainPages = ['/', '/tank', '/network', '/collaborate', '/messaging'];
  const showNavigation = mainPages.includes(location.pathname);
  
  return (
    <div className={`min-h-screen bg-background ${showNavigation ? 'pb-16' : ''}`}>
      <Toaster />
      <Sonner />
      
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/tank" element={<ProtectedRoute><Tank /></ProtectedRoute>} />
        <Route path="/tank/innovation/edit" element={<ProtectedRoute><EditInnovation /></ProtectedRoute>} />
        <Route path="/tank/innovation/settings" element={<ProtectedRoute><InnovationSettings /></ProtectedRoute>} />
        <Route path="/tank/pitch/new" element={<ProtectedRoute><CreatePitch /></ProtectedRoute>} />
        <Route path="/tank/pitch/:pitchId/analytics" element={<ProtectedRoute><PitchAnalytics /></ProtectedRoute>} />
        <Route path="/pitch/:pitchId" element={<ProtectedRoute><PitchView /></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
        <Route path="/collaborate" element={<ProtectedRoute><Collaborate /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/user/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/nda-request" element={<ProtectedRoute><NDARequest /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/scheduling" element={<ProtectedRoute><Scheduling /></ProtectedRoute>} />
        <Route path="/team-management" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
        <Route path="/messaging" element={<ProtectedRoute><MessagingNew /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {showNavigation && <FishtankNavigation />}
    </div>
  );
}

function App() {
  const { loadInitialData } = useFishtankStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

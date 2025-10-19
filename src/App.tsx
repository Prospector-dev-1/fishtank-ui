import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useFishtankStore } from "@/store/fishtankStore";
import { useEffect } from "react";

// Onboarding
import Onboarding from "@/pages/onboarding/Onboarding";

// Creator Pages & Components
import { Layout as CreatorLayout } from "@/components/creator/Layout";
import { NavigationProvider as CreatorNavigationProvider } from "@/contexts/NavigationContext";
import { AuthProvider as CreatorAuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute as CreatorProtectedRoute } from "@/components/creator/ProtectedRoute";
import CreatorAuth from "@/pages/creator/Auth";
import CreatorHome from "@/pages/creator/Home";
import CreatorDiscover from "@/pages/creator/Discover";
import CreatorInbox from "@/pages/creator/Inbox";
import CreatorProfile from "@/pages/creator/Profile";
import CreatorEditProfile from "@/pages/creator/EditProfile";
import CreatorNotFound from "@/pages/creator/NotFound";
import CreatorOnboarding from "@/pages/creator/Onboarding";
import CreatorNetwork from "@/pages/creator/Network";
import { CreatorProfile as CreatorProfileDetail } from "@/pages/creator/CreatorProfile";
import CreatorTeamInfo from "@/pages/creator/TeamInfo";
import CreatorEarnings from "@/pages/creator/Earnings";
import CreatorProposals from "@/pages/creator/Proposals";
import CreatorSaved from "@/pages/creator/Saved";
import CreatorDisputes from "@/pages/creator/Disputes";
import CreatorSettings from "@/pages/creator/Settings";

// Innovator Pages & Components
import InnovatorHome from "@/pages/innovator/Home";
import InnovatorTank from "@/pages/innovator/Tank";
import InnovatorEditInnovation from "@/pages/innovator/EditInnovation";
import InnovatorInnovationSettings from "@/pages/innovator/InnovationSettings";
import InnovatorNDASettings from "@/pages/innovator/NDASettings";
import InnovatorCreatePitch from "@/pages/innovator/CreatePitch";
import InnovatorPitchView from "@/pages/innovator/PitchView";
import InnovatorPitchAnalytics from "@/pages/innovator/PitchAnalytics";
import InnovatorBoostPitch from "@/pages/innovator/BoostPitch";
import InnovatorNetwork from "@/pages/innovator/Network";
import InnovatorCollaborate from "@/pages/innovator/Collaborate";
import InnovatorProfile from "@/pages/innovator/Profile";
import InnovatorEditProfile from "@/pages/innovator/EditProfile";
import InnovatorUserProfile from "@/pages/innovator/UserProfile";
import InnovatorAuth from "@/pages/innovator/Auth";
import InnovatorSearch from "@/pages/innovator/Search";
import InnovatorAnalytics from "@/pages/innovator/Analytics";
import InnovatorNDARequest from "@/pages/innovator/NDARequest";
import InnovatorProjectDetail from "@/pages/innovator/ProjectDetail";
import InnovatorScheduling from "@/pages/innovator/Scheduling";
import InnovatorTeamManagement from "@/pages/innovator/TeamManagement";
import InnovatorMessagingNew from "@/pages/innovator/MessagingNew";
import InnovatorNotFound from "@/pages/innovator/NotFound";
import { FishtankNavigation } from "@/components/innovator/layout/FishtankNavigation";

// Investor Pages & Components
import { BottomNav as InvestorBottomNav } from "@/components/investor/BottomNav";
import InvestorDashboard from "@/pages/investor/Dashboard";
import InvestorDealFlow from "@/pages/investor/DealFlow";
import InvestorMarketIntel from "@/pages/investor/MarketIntel";
import InvestorDiscover from "@/pages/investor/Discover";
import InvestorStartupDetail from "@/pages/investor/StartupDetail";
import InvestorNDAgreement from "@/pages/investor/NDAgreement";
import InvestorTeamMemberProfile from "@/pages/investor/TeamMemberProfile";
import InvestorMessages from "@/pages/investor/Messages";
import InvestorProfile from "@/pages/investor/Profile";
import InvestorNotFound from "@/pages/investor/NotFound";

const queryClient = new QueryClient();

// Protected Route for Innovator (backend removed)
function InnovatorProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Wrapper component to conditionally show Innovator navigation
function InnovatorAppContent() {
  const mainPages = [
    "/innovator",
    "/innovator/tank",
    "/innovator/network",
    "/innovator/collaborate",
    "/innovator/messaging",
    "/innovator/profile",
  ];
  const pathname = window.location.pathname;
  const showNavigation = mainPages.includes(pathname);

  return (
    <div className={`min-h-screen bg-background ${showNavigation ? "pb-16" : ""}`}>
      <Routes>
        <Route path="auth" element={<InnovatorAuth />} />
        <Route
          path="/"
          element={
            <InnovatorProtectedRoute>
              <InnovatorHome />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="tank"
          element={
            <InnovatorProtectedRoute>
              <InnovatorTank />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="tank/innovation/edit"
          element={
            <InnovatorProtectedRoute>
              <InnovatorEditInnovation />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="tank/innovation/settings"
          element={
            <InnovatorProtectedRoute>
              <InnovatorInnovationSettings />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="tank/innovation/nda-settings"
          element={
            <InnovatorProtectedRoute>
              <InnovatorNDASettings />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="tank/pitch/new"
          element={
            <InnovatorProtectedRoute>
              <InnovatorCreatePitch />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="tank/pitch/:pitchId/analytics"
          element={
            <InnovatorProtectedRoute>
              <InnovatorPitchAnalytics />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="tank/boost/:pitchId"
          element={
            <InnovatorProtectedRoute>
              <InnovatorBoostPitch />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="pitch/:pitchId"
          element={
            <InnovatorProtectedRoute>
              <InnovatorPitchView />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="network"
          element={
            <InnovatorProtectedRoute>
              <InnovatorNetwork />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="collaborate"
          element={
            <InnovatorProtectedRoute>
              <InnovatorCollaborate />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <InnovatorProtectedRoute>
              <InnovatorProfile />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="profile/edit"
          element={
            <InnovatorProtectedRoute>
              <InnovatorEditProfile />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="profile/:userId"
          element={
            <InnovatorProtectedRoute>
              <InnovatorUserProfile />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="user/:userId"
          element={
            <InnovatorProtectedRoute>
              <InnovatorUserProfile />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="search"
          element={
            <InnovatorProtectedRoute>
              <InnovatorSearch />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <InnovatorProtectedRoute>
              <InnovatorAnalytics />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="nda-request"
          element={
            <InnovatorProtectedRoute>
              <InnovatorNDARequest />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="project/:id"
          element={
            <InnovatorProtectedRoute>
              <InnovatorProjectDetail />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="scheduling"
          element={
            <InnovatorProtectedRoute>
              <InnovatorScheduling />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="team-management"
          element={
            <InnovatorProtectedRoute>
              <InnovatorTeamManagement />
            </InnovatorProtectedRoute>
          }
        />
        <Route
          path="messaging"
          element={
            <InnovatorProtectedRoute>
              <InnovatorMessagingNew />
            </InnovatorProtectedRoute>
          }
        />
        <Route path="*" element={<InnovatorNotFound />} />
      </Routes>

      {showNavigation && <FishtankNavigation />}
    </div>
  );
}

// Main App with Global Routing
function AppContent() {
  const { loadInitialData } = useFishtankStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Onboarding Route */}
        <Route path="/" element={<Onboarding />} />

        {/* Creator Routes */}
        <Route
          path="/creator/*"
          element={
            <CreatorAuthProvider>
              <CreatorNavigationProvider>
                <Routes>
                  <Route path="auth" element={<CreatorAuth />} />
                  <Route
                    path="onboarding"
                    element={
                      <CreatorProtectedRoute>
                        <CreatorOnboarding />
                      </CreatorProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <CreatorProtectedRoute>
                        <CreatorLayout />
                      </CreatorProtectedRoute>
                    }
                  >
                    <Route index element={<CreatorHome />} />
                    <Route path="discover" element={<CreatorDiscover />} />
                    <Route path="network" element={<CreatorNetwork />} />
                    <Route path="inbox" element={<CreatorInbox />} />
                    <Route path="profile" element={<CreatorProfile />} />
                    <Route path="edit-profile" element={<CreatorEditProfile />} />
                    <Route path="creators/:id" element={<CreatorProfileDetail />} />
                    <Route path="team/:teamId" element={<CreatorTeamInfo />} />
                    <Route path="earnings" element={<CreatorEarnings />} />
                    <Route path="proposals" element={<CreatorProposals />} />
                    <Route path="saved" element={<CreatorSaved />} />
                    <Route path="disputes" element={<CreatorDisputes />} />
                    <Route path="settings" element={<CreatorSettings />} />
                  </Route>
                  <Route path="*" element={<CreatorNotFound />} />
                </Routes>
              </CreatorNavigationProvider>
            </CreatorAuthProvider>
          }
        />

        {/* Innovator Routes */}
        <Route path="/innovator/*" element={<InnovatorAppContent />} />

        {/* Investor Routes */}
        <Route
          path="/investor/*"
          element={
            <div className="relative">
              <Routes>
                <Route path="/" element={<InvestorDashboard />} />
                <Route path="dashboard" element={<InvestorDashboard />} />
                <Route path="deal-flow" element={<InvestorDealFlow />} />
                <Route path="market-intel" element={<InvestorMarketIntel />} />
                <Route path="discover" element={<InvestorDiscover />} />
                <Route path="startup/:id/nda" element={<InvestorNDAgreement />} />
                <Route path="startup/:id" element={<InvestorStartupDetail />} />
                <Route path="startup/:id/team/:memberId" element={<InvestorTeamMemberProfile />} />
                <Route path="messages" element={<InvestorMessages />} />
                <Route path="profile" element={<InvestorProfile />} />
                <Route path="*" element={<InvestorNotFound />} />
              </Routes>
              <InvestorBottomNav />
            </div>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

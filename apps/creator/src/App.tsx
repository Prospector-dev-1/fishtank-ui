import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Layout } from "@/components/Layout";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Network from "./pages/Network";
import { CreatorProfile } from "./pages/CreatorProfile";
import TeamInfo from "./pages/TeamInfo";

import Earnings from "./pages/Earnings";
import Proposals from "./pages/Proposals";
import Saved from "./pages/Saved";
import Disputes from "./pages/Disputes";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <NavigationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Home />} />
                  <Route path="discover" element={<Discover />} />
                  <Route path="network" element={<Network />} />
                  <Route path="inbox" element={<Inbox />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="edit-profile" element={<EditProfile />} />
                  <Route path="creators/:id" element={<CreatorProfile />} />
                  <Route path="team/:teamId" element={<TeamInfo />} />
                  
                  <Route path="earnings" element={<Earnings />} />
                  <Route path="proposals" element={<Proposals />} />
                  <Route path="saved" element={<Saved />} />
                  <Route path="disputes" element={<Disputes />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NavigationProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

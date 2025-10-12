import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import Dashboard from "./pages/Dashboard";
import DealFlow from "./pages/DealFlow";
import MarketIntel from "./pages/MarketIntel";
import Discover from "./pages/Discover";
import StartupDetail from "./pages/StartupDetail";
import NDAgreement from "./pages/NDAgreement";
import TeamMemberProfile from "./pages/TeamMemberProfile";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deal-flow" element={<DealFlow />} />
            <Route path="/market-intel" element={<MarketIntel />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/startup/:id/nda" element={<NDAgreement />} />
            <Route path="/startup/:id" element={<StartupDetail />} />
            <Route path="/startup/:id/team/:memberId" element={<TeamMemberProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

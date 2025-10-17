import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "@/pages/Onboarding";

// Import Role App Wrappers
import CreatorAppWrapper from "@/components/roles/CreatorAppWrapper";
import InnovatorAppWrapper from "@/components/roles/InnovatorAppWrapper";
import InvestorAppWrapper from "@/components/roles/InvestorAppWrapper";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Creator routes - all creator pages nested under /creator */}
      <Route path="/creator/*" element={<CreatorAppWrapper />} />
      
      {/* Innovator routes - all innovator pages nested under /innovator */}
      <Route path="/innovator/*" element={<InnovatorAppWrapper />} />
      
      {/* Investor routes - all investor pages nested under /investor */}
      <Route path="/investor/*" element={<InvestorAppWrapper />} />
      
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
}

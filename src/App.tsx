import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import billing from "./components/Billing";
import CompanyDashboard from "./pages/CompanyDashboard";
import NotFound from "./pages/NotFound";
import Billing from "./components/Billing";
import Notification from "./components/Notification";
import HelpSupportPage from "./components/HelpSupportPage";

const queryClient = new QueryClient();

const App = () => (
  <div style={{ fontFamily: "'Inter', sans-serif" }}> {/* Add your font here */}
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<HelpSupportPage />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/company-dashboard" element={<CompanyDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </div>
);

export default App;
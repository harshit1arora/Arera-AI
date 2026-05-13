import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import KycEngine from "./pages/KycEngine.tsx";
import CreditScoring from "./pages/CreditScoring.tsx";
import RulesEngine from "./pages/RulesEngine.tsx";
import ApiDocs from "./pages/ApiDocs.tsx";
import ApiReference from "./pages/ApiReference.tsx";
import About from "./pages/About.tsx";
import Careers from "./pages/Careers.tsx";
import Blog from "./pages/Blog.tsx";
import Contact from "./pages/Contact.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import Security from "./pages/Security.tsx";
import Sandbox from "./pages/Sandbox.tsx";

import Dashboard from "./pages/Dashboard.tsx";
import Console from "./pages/Console.tsx";
import Playground from "./pages/Playground.tsx";
import Apply from "./pages/Apply.tsx";
import ContactSales from "./pages/ContactSales.tsx";
import StartFreeTrial from "./pages/StartFreeTrial.tsx";
import BorrowerPortal from "./pages/BorrowerPortal.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />

              <Route path="/apply" element={<Apply />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/console" element={<ProtectedRoute><Console /></ProtectedRoute>} />
              <Route path="/playground" element={<ProtectedRoute><Playground /></ProtectedRoute>} />
              <Route path="/borrower" element={<BorrowerPortal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/contact-sales" element={<ContactSales />} />
            <Route path="/start-free-trial" element={<StartFreeTrial />} />
            <Route path="/kyc-engine" element={<KycEngine />} />
            <Route path="/credit-scoring" element={<CreditScoring />} />
            <Route path="/rules-engine" element={<RulesEngine />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/api-reference" element={<ApiReference />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/security" element={<Security />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

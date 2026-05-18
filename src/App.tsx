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
import BlogPost from "./pages/BlogPost.tsx";
import { HelmetProvider } from "react-helmet-async";

import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Console = lazy(() => import("./pages/Console.tsx"));
const Playground = lazy(() => import("./pages/Playground.tsx"));
const UsageAndBilling = lazy(() => import("./pages/UsageAndBilling.tsx"));
const MetricsAndROI = lazy(() => import("./pages/MetricsAndROI.tsx"));
const EnhancedBorrowerPortal = lazy(() => import("./pages/EnhancedBorrowerPortal.tsx"));
const QuickSetupWizard = lazy(() => import("./pages/QuickSetupWizard.tsx"));
const SalesPipelineDashboard = lazy(() => import("./pages/SalesPipelineDashboard.tsx"));
const ModelComparison = lazy(() => import("./pages/ModelComparison.tsx"));
import Apply from "./pages/Apply.tsx";
import ContactSales from "./pages/ContactSales.tsx";
import StartFreeTrial from "./pages/StartFreeTrial.tsx";
import BorrowerPortal from "./pages/BorrowerPortal.tsx";
import CollectionsDashboard from "./pages/CollectionsDashboard.tsx";
import LoanOrigination from "./pages/LoanOrigination.tsx";
import ComplianceReports from "./pages/ComplianceReports.tsx";
import AgentCommission from "./pages/AgentCommission.tsx";
import PortfolioOverview from "./pages/PortfolioOverview.tsx";
import BorrowerPayment from "./pages/BorrowerPayment.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <Routes>
              <Route path="/" element={<Index />} />

              <Route path="/apply" element={<Apply />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/console" element={<ProtectedRoute><Console /></ProtectedRoute>} />
              <Route path="/playground" element={<ProtectedRoute><Playground /></ProtectedRoute>} />
              <Route path="/setup-wizard" element={<ProtectedRoute><QuickSetupWizard /></ProtectedRoute>} />
              <Route path="/usage-billing" element={<ProtectedRoute><UsageAndBilling /></ProtectedRoute>} />
              <Route path="/metrics-roi" element={<ProtectedRoute><MetricsAndROI /></ProtectedRoute>} />
              <Route path="/sales-pipeline" element={<ProtectedRoute><SalesPipelineDashboard /></ProtectedRoute>} />
              <Route path="/model-comparison" element={<ModelComparison />} />
              <Route path="/borrower/:loanId" element={<EnhancedBorrowerPortal />} />
              <Route path="/borrower" element={<BorrowerPortal />} />
              <Route path="/collections" element={<ProtectedRoute><CollectionsDashboard /></ProtectedRoute>} />
              <Route path="/loan-origination" element={<ProtectedRoute><LoanOrigination /></ProtectedRoute>} />
              <Route path="/compliance" element={<ProtectedRoute><ComplianceReports /></ProtectedRoute>} />
              <Route path="/agents" element={<ProtectedRoute><AgentCommission /></ProtectedRoute>} />
              <Route path="/portfolio" element={<ProtectedRoute><PortfolioOverview /></ProtectedRoute>} />
              <Route path="/pay" element={<BorrowerPayment />} />
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
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/security" element={<Security />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
        </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;

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
import UploadPage from "./pages/Upload.tsx";
import AnalyzingPage from "./pages/Analyzing.tsx";
import ReportPage from "./pages/Report.tsx";
const UsageAndBilling = lazy(() => import("./pages/UsageAndBilling.tsx"));
const MetricsAndROI = lazy(() => import("./pages/MetricsAndROI.tsx"));
const EnhancedBorrowerPortal = lazy(() => import("./pages/EnhancedBorrowerPortal.tsx"));
const QuickSetupWizard = lazy(() => import("./pages/QuickSetupWizard.tsx"));
const SalesPipelineDashboard = lazy(() => import("./pages/SalesPipelineDashboard.tsx"));
const ModelComparison = lazy(() => import("./pages/ModelComparison.tsx"));
const ComparePage = lazy(() => import("./pages/Compare.tsx"));
const DashboardPage = lazy(() => import("./pages/UserDashboard.tsx"));
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
import LoanApprovalPredictor from "./pages/LoanApprovalPredictor.tsx";
import ToolsDirectory from "./pages/ToolsDirectory.tsx";
import ProgrammaticSEOPage from "./pages/ProgrammaticSEOPage.tsx";
import EmiCalculator from "./pages/tools/EmiCalculator.tsx";
import SalaryEligibility from "./pages/tools/SalaryEligibility.tsx";
import CreditUtilization from "./pages/tools/CreditUtilization.tsx";
import HomeLoanAffordability from "./pages/tools/HomeLoanAffordability.tsx";
import DtiCalculator from "./pages/tools/DtiCalculator.tsx";
import CarLoanEmiCalculator from "./pages/tools/CarLoanEmiCalculator.tsx";
import CreditScoreSimulator from "./pages/tools/CreditScoreSimulator.tsx";
import LoanAffordabilityCalculator from "./pages/tools/LoanAffordabilityCalculator.tsx";
import EmergencyFundCalculator from "./pages/tools/EmergencyFundCalculator.tsx";
import InterestRateComparison from "./pages/tools/InterestRateComparison.tsx";
import LoanTenureOptimizer from "./pages/tools/LoanTenureOptimizer.tsx";
import PrepaymentImpactCalculator from "./pages/tools/PrepaymentImpactCalculator.tsx";
import BusinessLoanEligibility from "./pages/tools/BusinessLoanEligibility.tsx";
import EducationLoanCalculator from "./pages/tools/EducationLoanCalculator.tsx";
import CreditCardDebtPayoff from "./pages/tools/CreditCardDebtPayoff.tsx";
import SalaryLoanMapping from "./pages/tools/SalaryLoanMapping.tsx";
import NbfcVsBankComparison from "./pages/tools/NbfcVsBankComparison.tsx";
import MonthlyBudgetPlanner from "./pages/tools/MonthlyBudgetPlanner.tsx";
import FinancialHealthCheck from "./pages/tools/FinancialHealthCheck.tsx";

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

              {/* B2C Routes - Consumer Fintech Platform */}
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/analyzing" element={<AnalyzingPage />} />
              <Route path="/report/:id" element={<ReportPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />

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
              <Route path="/loan-approval-predictor" element={<LoanApprovalPredictor />} />
              <Route path="/loan-approval-predictor/:slug" element={<LoanApprovalPredictor />} />
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
            
            {/* New B2C Engine Routes */}
            <Route path="/tools" element={<ToolsDirectory />} />
            <Route path="/tools/emi-calculator" element={<EmiCalculator />} />
            <Route path="/tools/salary-loan-eligibility" element={<SalaryEligibility />} />
            <Route path="/tools/credit-utilization" element={<CreditUtilization />} />
            <Route path="/tools/home-loan-affordability" element={<HomeLoanAffordability />} />
            <Route path="/tools/dti-calculator" element={<DtiCalculator />} />
            <Route path="/tools/car-loan-emi-calculator" element={<CarLoanEmiCalculator />} />
            <Route path="/tools/credit-score-simulator" element={<CreditScoreSimulator />} />
            <Route path="/tools/loan-affordability-calculator" element={<LoanAffordabilityCalculator />} />
            <Route path="/tools/emergency-fund-calculator" element={<EmergencyFundCalculator />} />
            <Route path="/tools/interest-rate-comparison" element={<InterestRateComparison />} />
            <Route path="/tools/loan-tenure-optimizer" element={<LoanTenureOptimizer />} />
            <Route path="/tools/prepayment-impact-calculator" element={<PrepaymentImpactCalculator />} />
            <Route path="/tools/business-loan-eligibility" element={<BusinessLoanEligibility />} />
            <Route path="/tools/education-loan-calculator" element={<EducationLoanCalculator />} />
            <Route path="/tools/credit-card-debt-payoff" element={<CreditCardDebtPayoff />} />
            <Route path="/tools/salary-loan-mapping" element={<SalaryLoanMapping />} />
            <Route path="/tools/nbfc-vs-bank-comparison" element={<NbfcVsBankComparison />} />
            <Route path="/tools/monthly-budget-planner" element={<MonthlyBudgetPlanner />} />
            <Route path="/tools/financial-health-check" element={<FinancialHealthCheck />} />
            <Route path="/tools/:slug" element={<ProgrammaticSEOPage />} />
            
            {/* SEO Catch-all (must be right before 404) */}
            <Route path="/:slug" element={<ProgrammaticSEOPage />} />
            
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

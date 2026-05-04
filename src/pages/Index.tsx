import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MetricsSection from "@/components/MetricsSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DashboardSection from "@/components/DashboardSection";
import ComparisonSection from "@/components/ComparisonSection";
import DeveloperSection from "@/components/DeveloperSection";
import PricingSection from "@/components/PricingSection";
import ValidationSection from "@/components/WhyAreraSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-[#0A0A0F]">
    <Navbar />
    <HeroSection />
    <MetricsSection />
    <ProblemSection />
    <SolutionSection />
    <HowItWorksSection />
    <DashboardSection />
    <ComparisonSection />
    <DeveloperSection />
    <PricingSection />
    <ValidationSection />
    <FAQSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;

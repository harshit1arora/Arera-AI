import { Link } from "react-router-dom";
import { LogoStatic } from "./LogoStatic";

const Footer = () => {
  const links = {
    Product: [
      { name: "Arera", path: "/" },
      { name: "Loan Predictor (B2C)", path: "/loan-approval-predictor" },
      { name: "KYC Engine", path: "/kyc-engine" },
      { name: "Credit Scoring", path: "/credit-scoring" },
      { name: "Rules Engine", path: "/rules-engine" },
      { name: "API Docs", path: "/api-docs" },
    ],
    Tools: [
      { name: "All Tools (20+)", path: "/tools" },
      { name: "EMI Calculator", path: "/tools/emi-calculator" },
      { name: "Salary Eligibility", path: "/tools/salary-loan-eligibility" },
      { name: "DTI Calculator", path: "/tools/dti-calculator" },
      { name: "Credit Score Simulator", path: "/tools/credit-score-simulator" },
      { name: "Home Loan Affordability", path: "/tools/home-loan-affordability" },
    ],
    Guides: [
      { name: "Loan on ₹50K Salary", path: "/loan-eligibility-50k-salary" },
      { name: "Personal Loan in Mumbai", path: "/personal-loan-in-mumbai" },
      { name: "HDFC Loan Eligibility", path: "/hdfc-personal-loan-eligibility" },
      { name: "Low CIBIL Score Guide", path: "/poor-cibil-score" },
      { name: "Loan Rejected? Fix It", path: "/loan-rejected" },
      { name: "Self-Employed Loans", path: "/self-employed-loan" },
    ],
    Company: [
      { name: "About", path: "/about" },
      { name: "Careers", path: "/careers" },
      { name: "Blog", path: "/blog" },
      { name: "Contact", path: "/contact" },
    ],
    Legal: [
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Terms of Service", path: "/terms-of-service" },
      { name: "Security", path: "/security" },
    ],
  };

  return (
    <footer className="bg-surface border-t border-border py-[56px] pb-[32px]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <LogoStatic />
            </div>
            
            <p className="font-['DM_Sans'] font-normal text-[14px] leading-relaxed text-muted-foreground mb-6">
              Deterministic underwriting infrastructure for India's lending ecosystem.
            </p>

            <div className="flex flex-wrap gap-2">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 font-['JetBrains_Mono'] text-[11px] px-[10px] py-[4px] rounded-[4px] whitespace-nowrap">
                RBI/2022-23/111
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-['JetBrains_Mono'] text-[11px] px-[10px] py-[4px] rounded-[4px] whitespace-nowrap">
                Deterministic Engine
              </div>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-['DM_Sans'] font-semibold text-[12px] text-foreground uppercase tracking-wider mb-6">{category}</h4>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="font-['DM_Sans'] text-[14px] text-muted-foreground hover:text-primary transition-colors duration-150">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-border mt-[40px]"></div>

        <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-['DM_Sans'] font-normal text-[12px] text-muted-foreground">
            © 2026 Arera AI. All rights reserved.
          </div>
          <div className="font-['DM_Sans'] font-normal text-[12px] text-muted-foreground">
            The decision layer for India's lending infrastructure.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

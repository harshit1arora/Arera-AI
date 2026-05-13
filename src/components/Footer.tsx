import { Link } from "react-router-dom";
import { LogoStatic } from "./LogoStatic";

const Footer = () => {
  const links = {
    Product: [
      { name: "Arera", path: "/" },
      { name: "KYC Engine", path: "/kyc-engine" },
      { name: "Credit Scoring", path: "/credit-scoring" },
      { name: "Rules Engine", path: "/rules-engine" },
      { name: "API Docs", path: "/api-docs" },
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Wider (~30%) */}
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

          {/* Column 2: Product */}
          <div>
            <h4 className="font-['DM_Sans'] font-semibold text-[12px] text-foreground uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-3">
              {links.Product.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="font-['DM_Sans'] text-[14px] text-muted-foreground hover:text-primary transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-['DM_Sans'] font-semibold text-[12px] text-foreground uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-3">
              {links.Company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="font-['DM_Sans'] text-[14px] text-muted-foreground hover:text-primary transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-['DM_Sans'] font-semibold text-[12px] text-foreground uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-3">
              {links.Legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="font-['DM_Sans'] text-[14px] text-muted-foreground hover:text-primary transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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

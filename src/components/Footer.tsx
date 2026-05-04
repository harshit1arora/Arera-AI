import { Link } from "react-router-dom";

const Footer = () => {
  const links = {
    Product: [
      { name: "Arera", path: "/" },
      { name: "KYC Engine", path: "#" },
      { name: "Credit Scoring", path: "#" },
      { name: "Rules Engine", path: "#" },
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
    <footer className="bg-[#111118] border-t border-[rgba(255,255,255,0.08)] py-[56px] pb-[32px]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Wider (~30%) */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#F97316] flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                <span className="font-['DM_Sans'] font-semibold text-[15px] tracking-[0.1em] text-[#F0F0F0]">ARERA</span>
              </Link>
              <span className="bg-[rgba(249,115,22,0.12)] border border-[rgba(249,115,22,0.25)] text-[#F97316] font-['JetBrains_Mono'] text-[10px] px-[6px] py-[2px] rounded-[4px]">BETA</span>
            </div>
            
            <p className="font-['DM_Sans'] font-normal text-[14px] leading-relaxed text-[#888899] mb-6">
              Deterministic underwriting infrastructure for India's lending ecosystem.
            </p>

            <div className="flex flex-wrap gap-2">
              <div className="bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] text-[#F59E0B] font-['JetBrains_Mono'] text-[11px] px-[10px] py-[4px] rounded-[4px] whitespace-nowrap">
                RBI/2022-23/111
              </div>
              <div className="bg-[rgba(0,255,148,0.06)] border border-[rgba(0,255,148,0.15)] text-[#00FF94] font-['JetBrains_Mono'] text-[11px] px-[10px] py-[4px] rounded-[4px] whitespace-nowrap">
                Deterministic Engine
              </div>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-['DM_Sans'] font-semibold text-[12px] text-[#444455] uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-3">
              {links.Product.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="font-['DM_Sans'] text-[14px] text-[#888899] hover:text-[#F0F0F0] transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-['DM_Sans'] font-semibold text-[12px] text-[#444455] uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-3">
              {links.Company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="font-['DM_Sans'] text-[14px] text-[#888899] hover:text-[#F0F0F0] transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-['DM_Sans'] font-semibold text-[12px] text-[#444455] uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-3">
              {links.Legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="font-['DM_Sans'] text-[14px] text-[#888899] hover:text-[#F0F0F0] transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-[1px] bg-[rgba(255,255,255,0.08)] mt-[40px]"></div>

        <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-['DM_Sans'] font-normal text-[12px] text-[#444455]">
            © 2026 Arera AI. All rights reserved.
          </div>
          <div className="font-['DM_Sans'] font-normal text-[12px] text-[#444455]">
            The decision layer for India's lending infrastructure.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

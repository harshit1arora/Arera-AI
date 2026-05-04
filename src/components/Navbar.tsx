import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-[56px] z-[50] bg-[#0A0A0F]/85 backdrop-blur-[16px] border-bottom border-[rgba(255,255,255,0.08)] flex items-center justify-between px-6 border-b border-border">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-5 h-5 bg-[#F97316] flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <span className="font-['DM_Sans'] font-semibold text-[15px] tracking-[0.1em] text-[#F0F0F0]">ARERA</span>
        </Link>
        <span className="bg-[rgba(249,115,22,0.12)] border border-[rgba(249,115,22,0.25)] text-[#F97316] font-['JetBrains_Mono'] text-[10px] px-[6px] py-[2px] rounded-[4px]">BETA</span>
      </div>

      {/* CENTER: Nav Links */}
      <div className="hidden md:flex items-center gap-[32px]">
        {["Products", "Infra", "Pricing", "API Docs"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(' ', '-')}`}
            className="font-['DM_Sans'] text-[13px] text-[#888899] hover:text-[#F0F0F0] transition-colors duration-150"
          >
            {item}
          </a>
        ))}
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        <a
          href="https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12382"
          target="_blank"
          rel="noopener noreferrer"
          className="font-['DM_Sans'] text-[12px] text-[#F59E0B] hover:brightness-110"
        >
          ⚖ RBI Compliant
        </a>
        
        <div className="h-4 border-l border-[rgba(255,255,255,0.08)]"></div>
        
        <Link
          to="/playground"
          className="bg-[#F97316] text-white font-['DM_Sans'] font-semibold text-[13px] px-[18px] py-[8px] rounded-[6px] hover:brightness-[1.08] transition-all duration-150"
        >
          Try Sandbox →
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

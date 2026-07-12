import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequestDemoDialog } from "./RequestDemoDialog";

const lenderItems = [
  { name: "KYC Engine", path: "/kyc-engine" },
  { name: "Credit Scoring", path: "/credit-scoring" },
  { name: "Rules Engine", path: "/rules-engine" },
  { name: "SaaS Pricing", path: "/pricing" },
  { name: "Developer API Docs", path: "/api-docs" },
];

const borrowerItems = [
  { name: "Loan Predictor", path: "/loan-approval-predictor" },
  { name: "Financial Tools", path: "/tools" },
  { name: "All Guides & Resources", path: "/all-guides" },
];

const Navbar = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl h-[64px] z-[50] bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-black/5 dark:shadow-white/5 transition-all duration-300 hover:shadow-xl hover:bg-background/90">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* CENTER: Nav Links */}
        <div className="hidden md:flex items-center gap-[32px]">
          {/* Lenders Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-['DM_Sans'] text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-200 outline-none">
              For Lenders <ChevronDown className="w-3.5 h-3.5 mt-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-[180px]">
              {lenderItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    to={item.path}
                    className="font-['DM_Sans'] text-[13px] cursor-pointer"
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Borrowers Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-['DM_Sans'] text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-200 outline-none">
              For Borrowers <ChevronDown className="w-3.5 h-3.5 mt-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-[180px]">
              {borrowerItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    to={item.path}
                    className="font-['DM_Sans'] text-[13px] cursor-pointer"
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Infra — scrolls to section */}
          <a
            href="#infra"
            className="font-['DM_Sans'] text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Infra
          </a>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12382"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block font-['DM_Sans'] text-[12px] text-amber-500 hover:brightness-110 transition-all"
          >
            ⚖ RBI Compliant
          </a>

          <div className="hidden lg:block h-4 border-l border-border" />

          <ThemeToggle />

          {/* Request a Demo — opens dialog */}
          <button
            onClick={() => setDemoOpen(true)}
            className="hidden md:block font-['DM_Sans'] text-[13px] text-muted-foreground hover:text-foreground transition-all px-3 py-2"
          >
            Request a Demo
          </button>

          <Link
            to="/playground"
            className="bg-primary text-primary-foreground font-['DM_Sans'] font-semibold text-[13px] px-[18px] py-[8px] rounded-[6px] hover:brightness-[1.08] hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-primary/20"
          >
            Try Sandbox →
          </Link>
        </div>
      </nav>

      <RequestDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
};

export default Navbar;

import { useNavigate } from "react-router-dom";
import { FadeUp } from "./arera/FadeUp";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen pt-[56px] pb-20 bg-[#0A0A0F] flex items-center overflow-hidden">
      {/* Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(249,115,22,0.05) 0%, transparent 70%)'
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          
          {/* LEFT COLUMN (55%) */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center">
            <FadeUp>
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.2)] rounded-[20px] px-[14px] py-[6px] w-fit mb-8">
                <span className="text-[12px]">⚖️</span>
                <span className="font-['DM_Sans'] font-normal text-[12px] text-[#F97316]">Built for RBI Digital Lending Guidelines 2022</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-['DM_Sans'] font-bold text-[48px] md:text-[68px] leading-[1.08] text-[#F0F0F0] mb-6">
                Underwriting Infrastructure<br />
                for Indian NBFCs.
              </h1>

              {/* Sub-headline */}
              <p className="font-['DM_Sans'] font-normal text-[18px] leading-[1.6] text-[#888899] max-w-[500px] mb-9">
                One API call. Bank statement in. Loan decision out. 
                Deterministic, explainable, and audit-ready 
                in under 2 seconds.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-[14px] mb-12">
                <button 
                  onClick={() => navigate('/playground')}
                  className="bg-[#F97316] text-white font-['DM_Sans'] font-semibold text-[15px] px-[28px] py-[14px] rounded-[6px] hover:brightness-[1.08] transition-all"
                >
                  Try Sandbox — No Signup →
                </button>
                <button 
                  onClick={() => navigate('/api-reference')}
                  className="bg-transparent border border-[rgba(255,255,255,0.18)] text-[#888899] font-['DM_Sans'] font-normal text-[15px] px-[28px] py-[14px] rounded-[6px] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F0F0F0] transition-all"
                >
                  View API Docs
                </button>
              </div>

              {/* Trust signals row */}
              <div className="flex flex-col sm:flex-row gap-6">
                {[
                  "24 deterministic rules per request",
                  "Immutable audit trail per decision",
                  "RBI/2022-23/111 compliant"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[#00FF94] text-[13px]">✓</span>
                    <span className="font-['DM_Sans'] font-normal text-[13px] text-[#444455] whitespace-nowrap">{text}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* RIGHT COLUMN (45%) — TERMINAL WINDOW */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <FadeUp delay={0.2}>
            <div className="w-full max-w-[520px] bg-[#0D0D14] border border-[rgba(255,255,255,0.1)] rounded-[10px] overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.08),0_24px_48px_rgba(0,0,0,0.4)]">
              {/* Terminal top bar */}
              <div className="h-[36px] bg-[#0A0A10] border-b border-[rgba(255,255,255,0.06)] flex items-center px-4 gap-2">
                <div className="flex gap-[6px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]"></div>
                  <div className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-[10px] h-[10px] rounded-full bg-[#28C840]"></div>
                </div>
                <div className="ml-4 font-['JetBrains_Mono'] text-[11px] text-[#444455]">
                  POST /v1/underwriting/analyze
                </div>
              </div>

              {/* Code content */}
              <div className="p-[20px] md:p-[24px] font-['JetBrains_Mono'] text-[12.5px] leading-[1.75] overflow-x-auto">
                <div className="text-[#444455] mb-2">// Request</div>
                <div>
                  <span className="text-[#444455]">{`{`}</span><br />
                  <span className="ml-4 text-[#888899]">"applicant"</span><span className="text-[#444455]">: {`{`} </span><span className="text-[#888899]">"pan"</span><span className="text-[#444455]">: </span><span className="text-[#00FF94]">"ABCPK1234D"</span><span className="text-[#444455]"> {`},`}</span><br />
                  <span className="ml-4 text-[#888899]">"bank_statement"</span><span className="text-[#444455]">: {`{`}</span><br />
                  <span className="ml-8 text-[#888899]">"period"</span><span className="text-[#444455]">: </span><span className="text-[#00FF94]">"6 months"</span><span className="text-[#444455]">,</span><br />
                  <span className="ml-8 text-[#888899]">"transactions"</span><span className="text-[#444455]">: [...]</span><br />
                  <span className="ml-4 text-[#444455]">{`},`}</span><br />
                  <span className="ml-4 text-[#888899]">"loan_request"</span><span className="text-[#444455]">: {`{`}</span><br />
                  <span className="ml-8 text-[#888899]">"amount"</span><span className="text-[#444455]">: </span><span className="text-[#F97316]">200000</span><span className="text-[#444455]">,</span><br />
                  <span className="ml-8 text-[#888899]">"tenure_months"</span><span className="text-[#444455]">: </span><span className="text-[#F97316]">24</span><br />
                  <span className="ml-4 text-[#444455]">{`}`}</span><br />
                  <span className="text-[#444455]">{`}`}</span>
                </div>

                <div className="text-[#444455] mt-6 mb-2">// Response — 1.24s</div>
                <div>
                  <span className="text-[#444455]">{`{`}</span><br />
                  <span className="ml-4 text-[#F0F0F0]">"decision"</span><span className="text-[#444455]">: </span><span className="text-[#00FF94]">"APPROVE"</span><span className="text-[#444455]">,</span><br />
                  <span className="ml-4 text-[#888899]">"credit_limit"</span><span className="text-[#444455]">: </span><span className="text-[#F97316]">240000</span><span className="text-[#444455]">,</span><br />
                  <span className="ml-4 text-[#888899]">"risk_score"</span><span className="text-[#444455]">: </span><span className="text-[#F97316]">72</span><span className="text-[#444455]">,</span><br />
                  <span className="ml-4 text-[#888899]">"audit_id"</span><span className="text-[#444455]">: </span><span className="text-[#00FF94]">"arera_20240103_abc123"</span><span className="text-[#444455]">,</span><br />
                  <span className="ml-4 text-[#888899]">"reasons"</span><span className="text-[#444455]">: [</span><br />
                  <span className="ml-8 text-[#444455]">{`{`}</span><br />
                  <span className="ml-12 text-[#888899]">"code"</span><span className="text-[#444455]">: </span><span className="text-[#00FF94]">"STABLE_INCOME"</span><span className="text-[#444455]">,</span><br />
                  <span className="ml-12 text-[#888899]">"weight"</span><span className="text-[#444455]">: </span><span className="text-[#F97316]">0.35</span><br />
                  <span className="ml-8 text-[#444455]">{`},`}</span><br />
                  <span className="ml-8 text-[#444455]">{`{`}</span><br />
                  <span className="ml-12 text-[#888899]">"code"</span><span className="text-[#444455]">: </span><span className="text-[#00FF94]">"LOW_EMI_RATIO"</span><span className="text-[#444455]">,</span><br />
                  <span className="ml-12 text-[#888899]">"weight"</span><span className="text-[#444455]">: </span><span className="text-[#F97316]">0.28</span><br />
                  <span className="ml-8 text-[#444455]">{`}`}</span><br />
                  <span className="ml-4 text-[#444455]">]</span><br />
                  <span className="text-[#444455]">{`}`}</span>
                  <span className="inline-block w-[1px] h-[15px] bg-[#00FF94] ml-1 animate-[blink_1.2s_step-end_infinite]"></span>
                </div>
              </div>
            </div>
          </FadeUp>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

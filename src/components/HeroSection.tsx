import React from "react";
import { useNavigate } from "react-router-dom";
import { FadeUp } from "./arera/FadeUp";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen pt-[120px] pb-20 bg-background flex items-center overflow-hidden">
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
              <div className="inline-flex items-center gap-2 bg-[rgba(249,115,22,0.08)] border border-border rounded-[20px] px-[14px] py-[6px] w-fit mb-8">
                <span className="text-[12px]">⚖️</span>
                <span className="font-['DM_Sans'] font-normal text-[12px] text-foreground">Built for RBI Digital Lending Guidelines 2022</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-['DM_Sans'] font-bold text-[48px] md:text-[68px] leading-[1.08] text-foreground mb-6">
                Underwriting Infrastructure for NBFCs
              </h1>

              {/* Sub-headline */}
              <p className="font-['DM_Sans'] font-normal text-[18px] leading-[1.6] text-muted-foreground max-w-[500px] mb-9">
                One API call. Bank statement in. Loan decision out.
                Deterministic, explainable, and audit-ready
                in under 2 seconds.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-[14px] mb-12">
                <button
                  onClick={() => navigate('/playground')}
                  className="bg-[#F97316] text-foreground font-['DM_Sans'] font-semibold text-[15px] px-[28px] py-[14px] rounded-[6px] hover:brightness-[1.08] transition-all"
                >
                  Try Sandbox — No Signup →
                </button>
                <button
                  onClick={() => navigate('/api-reference')}
                  className="bg-transparent border border-border text-muted-foreground font-['DM_Sans'] font-normal text-[15px] px-[28px] py-[14px] rounded-[6px] hover:bg-foreground/5 hover:text-foreground transition-all"
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
                    <span className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground whitespace-nowrap">{text}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* RIGHT COLUMN (45%) — TERMINAL WINDOW */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <FadeUp delay={0.2}>
              <div className="w-full max-w-[520px] bg-background border border-border rounded-[10px] overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.08),0_24px_48px_rgba(0,0,0,0.4)]">
                {/* Terminal top bar */}
                <div className="h-[36px] bg-background border-b border-border flex items-center px-4 gap-2">
                  <div className="flex gap-[6px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]"></div>
                    <div className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-[10px] h-[10px] rounded-full bg-background"></div>
                  </div>
                  <div className="ml-4 font-['JetBrains_Mono'] text-[11px] text-muted-foreground">
                    POST /v1/underwriting/analyze
                  </div>
                </div>

                {/* Code content */}
                <div className="p-[20px] md:p-[24px] font-['JetBrains_Mono'] text-[12.5px] leading-[1.75] overflow-x-auto">
                  <div className="text-muted-foreground mb-2">// Request</div>
                  <div>
                    <span className="text-muted-foreground">{`{`}</span><br />
                    <span className="ml-4 text-muted-foreground">"applicant"</span><span className="text-muted-foreground">: {`{`} </span><span className="text-muted-foreground">"pan"</span><span className="text-muted-foreground">: </span><span className="text-[#00FF94]">"ABCPK1234D"</span><span className="text-muted-foreground"> {`},`}</span><br />
                    <span className="ml-4 text-muted-foreground">"bank_statement"</span><span className="text-muted-foreground">: {`{`}</span><br />
                    <span className="ml-8 text-muted-foreground">"period"</span><span className="text-muted-foreground">: </span><span className="text-[#00FF94]">"6 months"</span><span className="text-muted-foreground">,</span><br />
                    <span className="ml-8 text-muted-foreground">"transactions"</span><span className="text-muted-foreground">: [...]</span><br />
                    <span className="ml-4 text-muted-foreground">{`},`}</span><br />
                    <span className="ml-4 text-muted-foreground">"loan_request"</span><span className="text-muted-foreground">: {`{`}</span><br />
                    <span className="ml-8 text-muted-foreground">"amount"</span><span className="text-muted-foreground">: </span><span className="text-foreground">200000</span><span className="text-muted-foreground">,</span><br />
                    <span className="ml-8 text-muted-foreground">"tenure_months"</span><span className="text-muted-foreground">: </span><span className="text-foreground">24</span><br />
                    <span className="ml-4 text-muted-foreground">{`}`}</span><br />
                    <span className="text-muted-foreground">{`}`}</span>
                  </div>

                  <div className="text-muted-foreground mt-6 mb-2">// Response — 1.24s</div>
                  <div>
                    <span className="text-muted-foreground">{`{`}</span><br />
                    <span className="ml-4 text-foreground">"decision"</span><span className="text-muted-foreground">: </span><span className="text-[#00FF94]">"APPROVE"</span><span className="text-muted-foreground">,</span><br />
                    <span className="ml-4 text-muted-foreground">"credit_limit"</span><span className="text-muted-foreground">: </span><span className="text-foreground">240000</span><span className="text-muted-foreground">,</span><br />
                    <span className="ml-4 text-muted-foreground">"risk_score"</span><span className="text-muted-foreground">: </span><span className="text-foreground">72</span><span className="text-muted-foreground">,</span><br />
                    <span className="ml-4 text-muted-foreground">"audit_id"</span><span className="text-muted-foreground">: </span><span className="text-[#00FF94]">"arera_20240103_abc123"</span><span className="text-muted-foreground">,</span><br />
                    <span className="ml-4 text-muted-foreground">"reasons"</span><span className="text-muted-foreground">: [</span><br />
                    <span className="ml-8 text-muted-foreground">{`{`}</span><br />
                    <span className="ml-12 text-muted-foreground">"code"</span><span className="text-muted-foreground">: </span><span className="text-[#00FF94]">"STABLE_INCOME"</span><span className="text-muted-foreground">,</span><br />
                    <span className="ml-12 text-muted-foreground">"weight"</span><span className="text-muted-foreground">: </span><span className="text-foreground">0.35</span><br />
                    <span className="ml-8 text-muted-foreground">{`},`}</span><br />
                    <span className="ml-8 text-muted-foreground">{`{`}</span><br />
                    <span className="ml-12 text-muted-foreground">"code"</span><span className="text-muted-foreground">: </span><span className="text-[#00FF94]">"LOW_EMI_RATIO"</span><span className="text-muted-foreground">,</span><br />
                    <span className="ml-12 text-muted-foreground">"weight"</span><span className="text-muted-foreground">: </span><span className="text-foreground">0.28</span><br />
                    <span className="ml-8 text-muted-foreground">{`}`}</span><br />
                    <span className="ml-4 text-muted-foreground">]</span><br />
                    <span className="text-muted-foreground">{`}`}</span>
                    <span className="inline-block w-[1px] h-[15px] bg-background ml-1 animate-[blink_1.2s_step-end_infinite]"></span>
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

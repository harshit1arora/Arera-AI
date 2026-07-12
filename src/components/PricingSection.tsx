import { Check } from "lucide-react";
import { FadeUp } from "./arera/FadeUp";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      target: "For early-stage fintechs and NBFCs.",
      price: "7.50",
      priceNote: "Gemini Flash",
      altPrice: "9.50",
      altNote: "Claude Haiku",
      volume: "Up to 500 decisions / month",
      features: [
        "Core underwriting API",
        "JSON + PDF input support",
        "Explainable output with reasons",
        "Audit log access",
        "Email support",
        "Model selection (Gemini or Claude)",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Growth",
      target: "For scaling NBFCs with production lending operations.",
      price: "8.50",
      priceNote: "Gemini Flash",
      altPrice: "10.50",
      altNote: "Claude Haiku",
      volume: "500–5,000 decisions / month",
      features: [
        "Everything in Starter",
        "Webhook delivery",
        "Batch processing (up to 100/request)",
        "Priority support (Email + Slack)",
        "Custom rule additions",
        "Real-time analytics dashboard",
        "Model switching on the fly",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      target: "For large NBFCs needing full customization.",
      price: "Custom",
      priceNote: "Hybrid pricing",
      volume: "5,000+ decisions / month",
      features: [
        "Everything in Growth",
        "Custom underwriting rule engine",
        "SLA guarantee (99.9%)",
        "Dedicated account manager",
        "Multi-model orchestration",
        "On-premise deployment option",
        "24/7 Phone + Slack support",
        "Advanced compliance reporting",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="bg-background py-[100px]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-[52px]">
          <FadeUp>
            <div className="font-['DM_Sans'] font-semibold text-[11px] tracking-[0.15em] text-foreground uppercase mb-3">
              PRICING
            </div>
            <h2 className="font-['DM_Sans'] font-bold text-[46px] text-foreground mb-4">
              Pay per decision. Nothing else.
            </h2>
            <p className="font-['DM_Sans'] font-normal text-[17px] leading-[1.6] text-muted-foreground max-w-[520px] mx-auto">
              No setup fees. No annual contracts. Scale with volume.
            </p>
          </FadeUp>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {plans.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.1}>
              <div 
                className={`relative h-full flex flex-col bg-surface border rounded-[10px] p-[36px_32px] transition-all duration-150 ${
                  plan.highlighted 
                    ? 'border-[#F97316] ring-1 ring-[#F97316]/50' 
                    : 'border-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-[-13px] left-50% left-1/2 -translate-x-1/2 bg-[#F97316] text-foreground font-['DM_Sans'] font-semibold text-[11px] tracking-[0.05em] px-[14px] py-[4px] rounded-[20px] whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-auto">
                  <div className="font-['DM_Sans'] font-bold text-[18px] text-foreground mb-1">{plan.name}</div>
                  <div className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground mb-5">{plan.target}</div>

                  {plan.price !== "Custom" ? (
                    <div className="mt-5 space-y-3">
                      {/* Gemini Option */}
                      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-3 border border-blue-500/20">
                        <div className="flex items-baseline gap-1">
                          <span className="font-['DM_Sans'] font-normal text-[14px] text-muted-foreground">₹</span>
                          <span className="font-['JetBrains_Mono'] font-bold text-[36px] text-blue-400 leading-none">{plan.price}</span>
                          <span className="font-['DM_Sans'] font-normal text-[12px] text-muted-foreground">/ decision</span>
                        </div>
                        <p className="font-['DM_Sans'] text-[11px] text-muted-foreground mt-1">{plan.priceNote}</p>
                      </div>

                      {/* Claude Option */}
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
                        <div className="flex items-baseline gap-1">
                          <span className="font-['DM_Sans'] font-normal text-[14px] text-muted-foreground">₹</span>
                          <span className="font-['JetBrains_Mono'] font-bold text-[36px] text-purple-400 leading-none">{plan.altPrice}</span>
                          <span className="font-['DM_Sans'] font-normal text-[12px] text-muted-foreground">/ decision</span>
                        </div>
                        <p className="font-['DM_Sans'] text-[11px] text-muted-foreground mt-1">{plan.altNote}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 mt-5">
                      <span className={`font-['JetBrains_Mono'] font-bold text-[52px] text-foreground leading-none`}>{plan.price}</span>
                    </div>
                  )}
                  
                  <div className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground mt-3">{plan.volume}</div>

                  <div className="h-[1px] bg-border my-[24px]"></div>

                  <ul className="space-y-[12px]">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex gap-[10px] items-start">
                        <Check size={16} className="text-[#00FF94] shrink-0 mt-0.5" />
                        <span className="font-['DM_Sans'] font-normal text-[14px] text-muted-foreground leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.cta === "Contact Sales" ? "/contact-sales" : "/start-free-trial"}
                  className={`w-full mt-8 py-[13px] rounded-[6px] font-['DM_Sans'] text-[14px] transition-all block text-center ${
                    plan.highlighted
                      ? 'bg-[#F97316] text-foreground font-bold hover:brightness-[1.08]'
                      : 'bg-transparent border border-border text-foreground font-semibold hover:bg-foreground/5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.4}>
          <div className="mt-12 bg-gradient-to-r from-primary/5 to-orange-500/5 border border-primary/20 rounded-lg p-8 max-w-[900px] mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <h3 className="font-['DM_Sans'] font-bold text-[14px] text-foreground">Gemini Flash</h3>
                </div>
                <p className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground mb-3">
                  ✓ Fast inference (sub-second)<br/>
                  ✓ Cost-optimized<br/>
                  ✓ Great for high-volume underwriting
                </p>
                <p className="font-['DM_Sans'] font-normal text-[12px] text-muted-foreground">
                  Perfect for NBFC looking to maximize throughput
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <h3 className="font-['DM_Sans'] font-bold text-[14px] text-foreground">Claude Haiku</h3>
                </div>
                <p className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground mb-3">
                  ✓ Superior reasoning<br/>
                  ✓ Better edge-case handling<br/>
                  ✓ Enhanced explainability
                </p>
                <p className="font-['DM_Sans'] font-normal text-[12px] text-muted-foreground">
                  For complex lending scenarios & premium accuracy
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-primary/20">
              <p className="font-['DM_Sans'] font-semibold text-[13px] text-foreground mb-2">💡 Pricing Models & Engine Cost:</p>
              <p className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground leading-relaxed">
                Our homepage displays B2B Developer API Pay-As-You-Go pricing. If you need team dashboards, rule editors, and SLA targets, check out our <Link to="/pricing" className="text-[#F97316] underline">Platform SaaS plans</Link>. Claude Haiku pricing is slightly higher than Gemini Flash due to its higher API token costs from Anthropic, but it offers advanced reasoning. Switch engines anytime dynamically.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default PricingSection;

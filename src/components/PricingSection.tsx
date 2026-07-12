import { Check, ArrowRight, Zap, Building2, Landmark } from "lucide-react";
import { FadeUp } from "./arera/FadeUp";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "Free Sandbox",
      icon: Zap,
      price: "0",
      target: "For developers and early-stage testing.",
      volume: "25 applications / month",
      highlights: [
        "Core underwriting API",
        "Document parsing (JSON + PDF)",
        "Explainable decisions",
        "1 team member",
        "Developer Sandbox access",
      ],
      cta: "Get Sandbox Access",
      color: "#3B82F6",
      highlighted: false,
    },
    {
      name: "Starter",
      icon: Zap,
      price: "9,999",
      target: "For early-stage fintechs and NBFCs.",
      volume: "100 applications / month",
      highlights: [
        "Everything in Free Sandbox",
        "Basic underwriting engine",
        "Collections dashboard",
        "5 team members",
        "Standard support",
      ],
      cta: "Start Free Trial",
      color: "#F97316",
      highlighted: false,
    },
    {
      name: "Growth",
      icon: Building2,
      price: "49,999",
      target: "For scaling NBFCs with production operations.",
      volume: "500 applications / month",
      highlights: [
        "Everything in Starter",
        "Custom workflows & rules",
        "White-label portal",
        "RBI compliance reports",
        "20 team members",
      ],
      cta: "Start Free Trial",
      color: "#00FF94",
      highlighted: true,
    },
    {
      name: "Enterprise",
      icon: Landmark,
      price: "1,49,999",
      target: "For large NBFCs needing full control.",
      volume: "Unlimited applications",
      highlights: [
        "Everything in Growth",
        "99.9% SLA guarantee",
        "Dedicated account manager",
        "On-premise deployment",
        "SDK + custom integrations",
      ],
      cta: "Contact Sales",
      color: "#8B5CF6",
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
              Simple monthly pricing.
            </h2>
            <p className="font-['DM_Sans'] font-normal text-[17px] leading-[1.6] text-muted-foreground max-w-[520px] mx-auto">
              No setup fees. No per-decision charges. One monthly plan — scale as you grow.
            </p>
          </FadeUp>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
          {plans.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.1}>
              <div 
                className={`relative h-full flex flex-col bg-surface border rounded-[10px] p-[36px_32px] justify-between transition-all duration-150 ${
                  plan.highlighted 
                    ? 'border-[#F97316] ring-1 ring-[#F97316]/50' 
                    : 'border-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-[-13px] left-1/2 -translate-x-1/2 bg-[#F97316] text-foreground font-['DM_Sans'] font-semibold text-[11px] tracking-[0.05em] px-[14px] py-[4px] rounded-[20px] whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-auto">
                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-1">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${plan.color}15` }}
                    >
                      <plan.icon size={18} style={{ color: plan.color }} />
                    </div>
                    <div className="font-['DM_Sans'] font-bold text-[18px] text-foreground">{plan.name}</div>
                  </div>
                  <div className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground mb-5">{plan.target}</div>

                  {/* Price */}
                  {plan.price !== "Custom" ? (
                    <div className="flex items-baseline gap-1 mt-5">
                      <span className="font-['DM_Sans'] font-normal text-[14px] text-muted-foreground">₹</span>
                      <span className="font-['JetBrains_Mono'] font-bold text-[40px] text-foreground leading-none">{plan.price}</span>
                      <span className="font-['DM_Sans'] font-normal text-[12px] text-muted-foreground">/ month</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 mt-5">
                      <span className="font-['JetBrains_Mono'] font-bold text-[40px] text-foreground leading-none">{plan.price}</span>
                    </div>
                  )}
                  
                  <div className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground mt-2">{plan.volume}</div>

                  <div className="h-[1px] bg-border my-[24px]"></div>

                  {/* Features */}
                  <ul className="space-y-[12px]">
                    {plan.highlights.map((feature, j) => (
                      <li key={j} className="flex gap-[10px] items-start">
                        <Check size={16} className="text-[#00FF94] shrink-0 mt-0.5" />
                        <span className="font-['DM_Sans'] font-normal text-[14px] text-muted-foreground leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.cta === "Contact Sales" || plan.cta === "Get Sandbox Access" ? "/contact-sales" : "/pricing"}
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

        {/* Bottom CTA */}
        <FadeUp delay={0.4}>
          <div className="mt-12 text-center max-w-[900px] mx-auto">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 font-['DM_Sans'] font-semibold text-[14px] text-[#F97316] hover:text-[#EA580C] transition-colors"
            >
              View full feature comparison & annual plans <ArrowRight size={16} />
            </Link>
            <p className="font-['DM_Sans'] font-normal text-[12px] text-muted-foreground mt-3">
              All plans include AI engine selection (Gemini Flash or Claude Haiku). Free Sandbox includes 100 free test decisions — no credit card required.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default PricingSection;

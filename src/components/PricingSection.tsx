import { Check } from "lucide-react";
import { FadeUp } from "./arera/FadeUp";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      target: "For early-stage fintechs and NBFCs.",
      price: "2.50",
      volume: "Up to 500 decisions / month",
      features: [
        "Core underwriting API",
        "JSON + PDF input support",
        "Explainable output with reasons",
        "Audit log access",
        "Email support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Growth",
      target: "For scaling NBFCs with production lending operations.",
      price: "1.80",
      volume: "500–5,000 decisions / month",
      features: [
        "Everything in Starter",
        "Webhook delivery",
        "Batch processing (up to 100/request)",
        "Priority support (Email + Slack)",
        "Custom rule additions",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      target: "For large NBFCs needing full customization.",
      price: "Custom",
      volume: "5,000+ decisions / month",
      features: [
        "Everything in Growth",
        "Custom underwriting rule engine",
        "SLA guarantee (99.9%)",
        "Dedicated account manager",
        "On-premise deployment option",
        "24/7 Phone + Slack support",
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

                  <div className="flex items-baseline gap-1 mt-5">
                    {plan.price !== "Custom" && <span className="font-['DM_Sans'] font-normal text-[20px] text-muted-foreground">₹</span>}
                    <span className={`font-['JetBrains_Mono'] font-bold text-[52px] text-foreground leading-none`}>{plan.price}</span>
                    {plan.price !== "Custom" && <span className="font-['DM_Sans'] font-normal text-[14px] text-muted-foreground">/ analysis</span>}
                  </div>
                  <div className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground mt-1">{plan.volume}</div>

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
          <div className="mt-8 text-center">
            <p className="font-['DM_Sans'] font-normal text-[13px] text-muted-foreground">
              All plans include 100 free analyses to start. No credit card required.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default PricingSection;

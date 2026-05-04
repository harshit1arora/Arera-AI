import { FadeUp } from "./arera/FadeUp";

const HowItWorksSection = () => {
  const steps = [
    {
      id: "01",
      title: "Submit Transaction Data",
      body: "Send 3–6 months of bank statement transactions via JSON or PDF. No preprocessing required.",
      snippet: 'POST /v1/underwriting/analyze\n{ "transactions": [...] }'
    },
    {
      id: "02",
      title: "24 Rules Evaluate in Order",
      body: "Income detection, EMI ratio, salary regularity, balance patterns — each rule fires deterministically. Every result is logged with the rule ID and outcome.",
      checklist: [
        { label: "R001: income_above_minimum", checked: true },
        { label: "R007: emi_ratio_acceptable", checked: true },
        { label: "R012: salary_regular_credit", checked: true },
        { label: "R019: self_employed_check", checked: false },
      ]
    },
    {
      id: "03",
      title: "Decision + Full Audit Trail",
      body: "APPROVE / REJECT / REVIEW returned with credit limit, risk score, per-rule explanation, and immutable audit ID. Printable for RBI filing.",
      snippet: '{ "decision": "APPROVE",\n  "audit_id": "arera_...",\n  "rules_fired": 24 }'
    }
  ];

  return (
    <section id="infra" className="bg-[#111118] border-y border-[rgba(255,255,255,0.08)] py-[100px]">
      <div className="container mx-auto px-6 text-center">
        <FadeUp>
          {/* Section label */}
          <div className="font-['DM_Sans'] font-semibold text-[11px] tracking-[0.15em] text-[#F97316] uppercase mb-3">
            THE SOLUTION
          </div>

          {/* Headline */}
          <h2 className="font-['DM_Sans'] font-bold text-[46px] text-[#F0F0F0] mb-[60px]">
            From bank statement to decision in 3 steps.
          </h2>
        </FadeUp>

        {/* Steps Horizontal Row */}
        <div className="relative flex flex-col md:flex-row justify-between gap-12 md:gap-6">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[28px] left-[16.66%] right-[16.66%] h-[1px] bg-[rgba(255,255,255,0.08)] z-0"></div>

          {steps.map((step, idx) => (
            <FadeUp key={step.id} delay={idx * 0.15}>
              <div className="relative z-10 flex-1 flex flex-col items-center h-full">
                {/* Step circle */}
                <div className="w-[56px] h-[56px] rounded-full bg-[#16161F] border border-[rgba(255,255,255,0.12)] font-['JetBrains_Mono'] font-bold text-[20px] text-[#F97316] flex items-center justify-center mb-[16px]">
                  {step.id}
                </div>

                {/* Step title */}
                <h3 className="font-['DM_Sans'] font-semibold text-[16px] text-[#F0F0F0] mb-[8px]">
                  {step.title}
                </h3>

                {/* Step body */}
                <p className="font-['DM_Sans'] font-normal text-[14px] leading-[1.6] text-[#888899] mb-[14px] max-w-[280px]">
                  {step.body}
                </p>

                {/* Code snippet or checklist */}
                <div className="w-full bg-[#16161F] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-[12px] text-left mt-auto">
                  {step.snippet ? (
                    <pre className="font-['JetBrains_Mono'] text-[12px] text-[#00FF94] whitespace-pre-wrap leading-relaxed">
                      {step.snippet}
                    </pre>
                  ) : (
                    <div className="space-y-1">
                      {step.checklist?.map((item, i) => (
                        <div key={i} className="font-['JetBrains_Mono'] text-[11px] flex items-center gap-2">
                          <span className={item.checked ? "text-[#00FF94]" : "text-[#444455]"}>
                            {item.checked ? "✓" : "—"}
                          </span>
                          <span className={item.checked ? "text-[#F0F0F0]" : "text-[#444455]"}>
                            {item.label}
                          </span>
                          {!item.checked && <span className="text-[#444455] italic">(skipped)</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

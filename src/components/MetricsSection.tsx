import { FadeUp } from "./arera/FadeUp";

const MetricsSection = () => {
  return (
    <section className="bg-[#111118] border-y border-[rgba(255,255,255,0.08)] py-[36px]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          
          {/* Item 1 */}
          <FadeUp className="flex-1" delay={0}>
            <div className="flex flex-col items-center text-center">
              <div className="font-['JetBrains_Mono'] font-bold text-[44px] text-[#F0F0F0]">24</div>
              <div className="font-['DM_Sans'] text-[13px] text-[#888899]">Underwriting rules per request</div>
            </div>
          </FadeUp>

          <div className="hidden md:block h-[44px] border-l border-[rgba(255,255,255,0.08)]"></div>

          {/* Item 2 */}
          <FadeUp className="flex-1" delay={0.1}>
            <div className="flex flex-col items-center text-center">
              <div className="font-['JetBrains_Mono'] font-bold text-[44px] text-[#F0F0F0]">&lt; 2s</div>
              <div className="font-['DM_Sans'] text-[13px] text-[#888899]">Average decision time</div>
            </div>
          </FadeUp>

          <div className="hidden md:block h-[44px] border-l border-[rgba(255,255,255,0.08)]"></div>

          {/* Item 3 */}
          <FadeUp className="flex-1" delay={0.2}>
            <div className="flex flex-col items-center text-center">
              <div className="font-['JetBrains_Mono'] font-bold text-[44px] text-[#F0F0F0]">100%</div>
              <div className="font-['DM_Sans'] text-[13px] text-[#888899]">Decisions audit-logged</div>
            </div>
          </FadeUp>

          <div className="hidden md:block h-[44px] border-l border-[rgba(255,255,255,0.08)]"></div>

          {/* Item 4 */}
          <FadeUp className="flex-1" delay={0.3}>
            <div className="flex flex-col items-center text-center">
              <div className="font-['JetBrains_Mono'] font-bold text-[44px] text-[#00FF94]">0</div>
              <div className="font-['DM_Sans'] text-[13px] text-[#888899]">Black box decisions</div>
              <div className="font-['DM_Sans'] text-[11px] text-[#444455] mt-1">Every decision is explainable</div>
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
};

export default MetricsSection;

import { FadeUp } from "./arera/FadeUp";

const ComparisonSection = () => {
  const tableRows = [
    { feature: "Per-decision audit log", arera: "✓", perfios: "✗", karza: "✗", inhouse: "✗" },
    { feature: "Deterministic rule engine", arera: "✓", perfios: "✗", karza: "~", inhouse: "✗" },
    { feature: "RBI-compliant output format", arera: "✓", perfios: "✗", karza: "✗", inhouse: "✗" },
    { feature: "Explainability per decision", arera: "✓", perfios: "✗", karza: "✗", inhouse: "~" },
    { feature: "API-first integration", arera: "✓", perfios: "✗", karza: "✗", inhouse: "✗" },
    { feature: "No black-box ML", arera: "✓", perfios: "✗", karza: "✗", inhouse: "~" },
    { feature: "Webhook delivery", arera: "✓", perfios: "~", karza: "~", inhouse: "✗" },
  ];

  return (
    <section id="pricing" className="bg-[#0A0A0F] py-[100px]">
      <div className="container mx-auto px-6 text-center">
        <FadeUp>
          {/* Section label */}
          <div className="font-['DM_Sans'] font-semibold text-[11px] tracking-[0.15em] text-[#F97316] uppercase mb-3">
            COMPARE
          </div>

          {/* Headline */}
          <h2 className="font-['DM_Sans'] font-bold text-[46px] text-[#F0F0F0] mb-4">
            Why lenders are switching to Arera.
          </h2>

          {/* Subhead */}
          <p className="font-['DM_Sans'] font-normal text-[17px] leading-[1.6] text-[#888899] max-w-[520px] mx-auto mb-[48px]">
            We're not the only option. Here's an honest comparison.
          </p>
        </FadeUp>

        {/* Table Container */}
        <FadeUp delay={0.2}>
          <div className="max-w-[800px] mx-auto border border-[rgba(255,255,255,0.08)] rounded-[10px] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#16161F] border-b border-[rgba(255,255,255,0.08)]">
                  <th className="text-left px-6 py-4 font-['DM_Sans'] font-semibold text-[13px] text-[#888899]">Capability</th>
                  <th className="text-center px-6 py-4 font-['DM_Sans'] font-semibold text-[13px] text-[#F97316]">Arera</th>
                  <th className="text-center px-6 py-4 font-['DM_Sans'] font-semibold text-[13px] text-[#888899]">Perfios</th>
                  <th className="text-center px-6 py-4 font-['DM_Sans'] font-semibold text-[13px] text-[#888899]">Karza</th>
                  <th className="text-center px-6 py-4 font-['DM_Sans'] font-semibold text-[13px] text-[#888899]">In-house</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-[rgba(255,255,255,0.08)] last:border-0 hover:bg-[#16161F] transition-colors duration-150`}
                  >
                    <td className="text-left px-6 py-[14px] font-['DM_Sans'] font-normal text-[14px] text-[#F0F0F0]">
                      {row.feature}
                    </td>
                    <td className="text-center px-6 py-[14px] bg-[rgba(249,115,22,0.03)] font-bold text-[16px] text-[#00FF94]">
                      {row.arera}
                    </td>
                    <td className={`text-center px-6 py-[14px] text-[16px] ${row.perfios === '✓' ? 'text-[#00FF94] font-bold' : row.perfios === '~' ? 'text-[#F59E0B]' : 'text-[#444455]'}`}>
                      {row.perfios}
                    </td>
                    <td className={`text-center px-6 py-[14px] text-[16px] ${row.karza === '✓' ? 'text-[#00FF94] font-bold' : row.karza === '~' ? 'text-[#F59E0B]' : 'text-[#444455]'}`}>
                      {row.karza}
                    </td>
                    <td className={`text-center px-6 py-[14px] text-[16px] ${row.inhouse === '✓' ? 'text-[#00FF94] font-bold' : row.inhouse === '~' ? 'text-[#F59E0B]' : 'text-[#444455]'}`}>
                      {row.inhouse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>

        {/* Footer text */}
        <FadeUp delay={0.4}>
          <p className="mt-[16px] font-['DM_Sans'] font-normal text-[12px] text-[#444455] text-center">
            ~ = partial support. Based on public documentation as of 2024. <br />
            Perfios and Karza are data analytics providers, not underwriting decision engines.
          </p>
        </FadeUp>
      </div>
    </section>
  );
};

export default ComparisonSection;

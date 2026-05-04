import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FadeUp } from "./arera/FadeUp";

const DashboardSection = () => {
  // Pre-populated mock data for the homepage preview
  const mockData = [
    { month: "Jan", applications: 120, approved: 85 },
    { month: "Feb", applications: 150, approved: 110 },
    { month: "Mar", applications: 180, approved: 140 },
    { month: "Apr", applications: 220, approved: 175 },
    { month: "May", applications: 280, approved: 210 },
    { month: "Jun", applications: 350, approved: 285 },
  ];

  return (
    <section className="bg-[#0A0A0F] py-[100px] overflow-hidden relative">
      {/* Subtle grid and glows */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F97316]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <FadeUp>
            <div className="font-['DM_Sans'] font-semibold text-[11px] tracking-[0.15em] text-[#F97316] uppercase mb-3">
              THE ARENA
            </div>
            <h2 className="font-['DM_Sans'] font-bold text-[46px] text-[#F0F0F0] mb-4">
              Underwriting in real-time.
            </h2>
            <p className="font-['DM_Sans'] font-normal text-[17px] text-[#888899] max-w-[560px] mx-auto">
              A specialized terminal for credit teams. Monitor every decision, rule fire, and audit trail in one place.
            </p>
          </FadeUp>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-[1000px] mx-auto relative">
          <FadeUp delay={0.2}>
            {/* Sandbox Banner */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-[#F59E0B] text-black font-['JetBrains_Mono'] font-bold text-[11px] px-4 py-1 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              SANDBOX MODE: MOCK DATA
            </div>

            <div className="bg-[#111118] border border-[rgba(255,255,255,0.08)] rounded-[12px] overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#16161F]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#F97316] flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                  <span className="font-['DM_Sans'] font-semibold text-[14px] text-[#F0F0F0]">Arera Developer Arena</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse"></div>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#00FF94]">System Active</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Active Applications", value: "350", sub: "+12% vs last month" },
                    { label: "Approval Rate", value: "81.4%", sub: "Deterministic" },
                    { label: "Avg. Decision Time", value: "1.24s", sub: "Under SLA" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#16161F] border border-[rgba(255,255,255,0.08)] rounded-[8px] p-6">
                      <div className="font-['DM_Sans'] text-[12px] text-[#888899] mb-1">{stat.label}</div>
                      <div className="font-['JetBrains_Mono'] font-bold text-[28px] text-[#F0F0F0] mb-2">{stat.value}</div>
                      <div className="font-['DM_Sans'] text-[11px] text-[#444455]">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-[#16161F] border border-[rgba(255,255,255,0.08)] rounded-[8px] p-6">
                  <h4 className="font-['DM_Sans'] font-semibold text-[14px] text-[#F0F0F0] mb-6">Decision Volume (Last 6 Months)</h4>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockData}>
                        <defs>
                          <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#444455', fontSize: 11 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#444455', fontSize: 11 }}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#16161F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px' }}
                          itemStyle={{ color: '#F0F0F0', fontSize: '12px' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="applications" 
                          stroke="#F97316" 
                          fill="url(#colorApps)" 
                          strokeWidth={2} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="approved" 
                          stroke="#00FF94" 
                          fill="transparent" 
                          strokeWidth={2} 
                          strokeDasharray="4 4"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;

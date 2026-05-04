import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Database, Network, LineChart, Code, Smartphone, Zap, ShieldCheck } from "lucide-react";

const CreditScoring = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Zap size={14} className="text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">Deterministic Risk Infrastructure</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white mb-6">
            Credit Scoring for the Modern NBFC
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
            Go beyond traditional bureau scores. Leverage thousands of alternative data points to underwrite thin-file consumers and SMEs with 100% explainability.
          </p>
        </section>

        {/* Data Sources Grid */}
        <section className="container mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic mb-4">Unrivaled Data Enrichment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium">Our infrastructure automatically synthesizes data from diverse, permissioned sources.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Database, title: "Bureau Integration", desc: "CIBIL, Experian, Equifax, CRIF Highmark parallel fetching." },
              { icon: Network, title: "Bank Statements", desc: "Account Aggregator (AA) and net banking parsers." },
              { icon: Smartphone, title: "Device Telemetry", desc: "OS metadata, geolocation stability, and behavioral biometrics." },
              { icon: LineChart, title: "Alternative Signals", desc: "Telecom, GST fillings, and utility payment histories." }
            ].map((source, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-card/40 border border-white/10 hover:border-primary/40 transition-all group shadow-glow">
                <source.icon className="text-primary mb-8 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-2xl font-black mb-4 italic tracking-tight">{source.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{source.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Model Transparency */}
        <section className="container mx-auto px-6 mb-24">
          <div className="glass-panel-heavy bg-card/40 border border-white/10 rounded-[3rem] overflow-hidden shadow-glow flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-10 md:p-20 flex flex-col justify-center">
              <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic mb-8">Explainable Determinism</h2>
              <p className="text-lg text-muted-foreground mb-10 font-medium leading-relaxed">
                No black boxes here. Arera provides detailed reason codes for every score generated, ensuring you remain compliant with RBI's fairness guidelines while offering transparency to your applicants.
              </p>
              <ul className="space-y-5">
                {["Feature importance breakdowns", "Adverse action code mapping", "Scorecard performance monitoring", "Gini & KS statistic tracking in real-time"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-all">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 bg-black/40 p-10 md:p-16 border-l border-white/10 relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-40"></div>
               <pre className="text-xs font-mono text-primary/80 relative z-10 leading-loose italic">
<span className="text-green-400">"arera_score"</span>: <span className="text-orange-400">742</span>,
<span className="text-green-400">"engine_logic"</span>: <span className="text-yellow-400">"DETERMINISTIC_V2"</span>,
<span className="text-green-400">"risk_tier"</span>: <span className="text-yellow-400">"LOW_RISK"</span>,
<span className="text-green-400">"top_factors"</span>: [
  {"{"}
    <span className="text-green-400">"feature"</span>: <span className="text-yellow-400">"avg_monthly_balance_6m"</span>,
    <span className="text-green-400">"impact"</span>: <span className="text-orange-400">+45.2</span>,
    <span className="text-green-400">"value"</span>: <span className="text-orange-400">124500</span>
  {"}"},
  {"{"}
    <span className="text-green-400">"feature"</span>: <span className="text-yellow-400">"recent_credit_inquiries_30d"</span>,
    <span className="text-green-400">"impact"</span>: <span className="text-orange-400">-12.5</span>,
    <span className="text-green-400">"value"</span>: <span className="text-orange-400">3</span>
  {"}"}
]
               </pre>
            </div>
          </div>
        </section>

      </main>
      <CTASection />
      <Footer />
    </div>
  );
};

export default CreditScoring;

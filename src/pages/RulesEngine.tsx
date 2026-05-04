import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { GitMerge, Layers, Search, Workflow, ChevronRight, PlayCircle, ShieldCheck, Zap } from "lucide-react";

const RulesEngine = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24 max-w-5xl text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Zap size={14} className="text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">Deterministic Policy Engine v2.1.0-stable</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white mb-6">
            Codify Your Risk Appetite
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
            Empower your risk teams to build, test, and deploy complex underwriting workflows visually. 100% explainability, zero code, and RBI-compliant audit trails.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button className="px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-glow hover:scale-[1.02] transition-all flex items-center gap-2">
               <PlayCircle size={18} /> Test Current Policy
             </button>
             <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
               View Documentation
             </button>
          </div>
        </section>

        {/* Feature Overview */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-all">
                  <Layers className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 italic">Visual Flow Builder</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">Map out decision trees with logical operands (AND, OR, NOT), score threshold routing, and manual review triggers in a beautiful canvas.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-all">
                  <GitMerge className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 italic">Shadow Mode & Backtesting</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">Run challenger rulesets silently on incoming traffic or backtest against historical data to instantly see the impact on approval rates and NPAs.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-all">
                  <Search className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 italic">Audit Trails & Versioning</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">Track every change made to your policy. Rollback to previous versions instantly. Everything is logged in our immutable WORM ledger.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
               <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl animate-pulse" />
               <div className="relative glass-panel-heavy bg-card/40 border border-white/10 p-10 rounded-[3rem] shadow-glow">
                  {/* Abstract Workflow Graphic */}
                  <div className="space-y-6 font-mono text-[11px] font-bold">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center uppercase tracking-widest text-primary flex items-center justify-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                       New Application Received
                    </div>
                    <div className="flex justify-center"><ChevronRight className="rotate-90 text-white/20" size={20} /></div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-center flex flex-col justify-center gap-2">
                         <span className="font-black text-xs uppercase italic">Hard Reject</span>
                         <span className="text-[10px] opacity-60">CIBIL &lt; 650 || Age &lt; 21</span>
                      </div>
                      <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-center flex flex-col justify-center gap-2">
                         <span className="font-black text-xs uppercase italic">Analyze</span>
                         <span className="text-[10px] opacity-60 italic">Run Deterministic Engine</span>
                      </div>
                    </div>

                    <div className="flex justify-end pr-16"><ChevronRight className="rotate-90 text-white/20" size={20} /></div>

                    <div className="flex justify-end gap-6">
                      <div className="w-1/2 p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-2xl text-center flex flex-col gap-2">
                         <span className="font-black text-xs uppercase italic">Manual Review</span>
                         <span className="text-[10px] opacity-60 italic">Score 650-700</span>
                      </div>
                      <div className="w-1/2 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-center flex flex-col gap-2">
                         <span className="font-black text-xs uppercase italic">Auto Approve</span>
                         <span className="text-[10px] opacity-60 italic">Score &gt; 700</span>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-primary" />
                          <span className="text-[9px] uppercase tracking-widest text-white/40">Compliance Status</span>
                       </div>
                       <span className="text-[9px] font-black text-primary uppercase">RBI Verified</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

      </main>
      <CTASection />
      <Footer />
    </div>
  );
};

export default RulesEngine;

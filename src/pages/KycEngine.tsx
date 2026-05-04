import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Shield, Zap, CheckCircle2, Smartphone, FileSearch, Lock } from "lucide-react";

const KycEngine = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Shield size={14} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">Bank-Grade Onboarding</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white mb-6">
            Identity Verification at Scale
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
            Automate your entire KYC process across Aadhaar, PAN, CKYC, and Video KYC. 
            Reduce onboarding friction while maintaining 100% RBI compliance with deterministic verification logic.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-glow hover:scale-[1.02] transition-all">
              View Documentation
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Test in Sandbox
            </button>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="container mx-auto px-6 mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Sub-second Fetch", desc: "Instantly retrieve verified records directly from NSDL, UIDAI, and CERSAI." },
              { icon: FileSearch, title: "Tamper Detection", desc: "Deterministic pattern analysis detects forged documents and manipulated photos." },
              { icon: Smartphone, title: "Omnichannel Video KYC", desc: "Seamless WebRTC-based video verification built for low-bandwidth environments." }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-card/40 border border-white/10 hover:border-primary/40 transition-all group shadow-glow">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary/20 transition-all">
                  <feature.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4 italic tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Workflow */}
        <section className="container mx-auto px-6 mb-24">
          <div className="glass-panel-heavy bg-card/40 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center max-w-5xl mx-auto shadow-glow">
            <h2 className="text-4xl font-display font-black tracking-tighter mb-16 uppercase italic">Verification Pipeline</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black mb-6 group-hover:border-primary/40 transition-all italic text-muted-foreground/40">1</div>
                <h4 className="font-black text-xl mb-3 uppercase tracking-tight">Ingestion</h4>
                <p className="text-sm text-muted-foreground font-medium">User inputs ID strings or uploads document images.</p>
              </div>
              <div className="w-full md:w-20 h-0.5 bg-white/10 hidden md:block rounded-full"></div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-black mb-6 text-primary group-hover:bg-primary/20 transition-all italic shadow-glow">2</div>
                <h4 className="font-black text-xl mb-3 uppercase tracking-tight">Analysis</h4>
                <p className="text-sm text-muted-foreground font-medium">Deterministic extraction, pattern matching & liveliness checks.</p>
              </div>
              <div className="w-full md:w-20 h-0.5 bg-white/10 hidden md:block rounded-full"></div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl font-black mb-6 text-green-500 group-hover:bg-green-500/20 transition-all italic">3</div>
                <h4 className="font-black text-xl mb-3 uppercase tracking-tight">Decision</h4>
                <p className="text-sm text-muted-foreground font-medium">Instant boolean pass/fail with detailed confidence scores.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="container mx-auto px-6 mb-24">
          <h2 className="text-4xl font-display font-black tracking-tighter mb-16 text-center uppercase italic">Supported Vectors</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {["Aadhaar XML & OTP", "PAN Verification", "CKYC Download", "Voter ID", "Passport", "Driving License", "Vehicle RC", "Bank Account Penny Drop"].map((item, idx) => (
               <div key={idx} className="flex items-center gap-4 p-5 bg-card/40 border border-white/10 rounded-2xl hover:border-primary/40 transition-all group">
                 <CheckCircle2 size={20} className="text-primary shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                 <span className="font-black text-xs uppercase tracking-widest text-white/80">{item}</span>
               </div>
            ))}
          </div>
        </section>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
};

export default KycEngine;

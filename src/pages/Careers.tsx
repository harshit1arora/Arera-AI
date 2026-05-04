import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { ArrowRight, Briefcase, Heart, Cpu, MapPin } from "lucide-react";

const Careers = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        
        {/* Hero */}
        <section className="container mx-auto px-6 mb-24 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Briefcase size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">We're Hiring</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
            Build the brain of Indian lending
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Join a small, high-density talent pool of engineers, data scientists, and risk experts tackling some of the hardest algorithmic scale problems in fin-tech.
          </p>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-6 mb-24 max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="p-6 bg-secondary/30 rounded-2xl border border-border/50 text-center">
               <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4"><Heart className="text-primary" /></div>
               <h3 className="font-bold text-lg mb-2">Comprehensive Health</h3>
               <p className="text-sm text-muted-foreground">Top-tier health, dental, and vision coverage for you and dependents.</p>
            </div>
            <div className="p-6 bg-secondary/30 rounded-2xl border border-border/50 text-center">
               <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4"><MapPin className="text-primary" /></div>
               <h3 className="font-bold text-lg mb-2">Remote-First Culture</h3>
               <p className="text-sm text-muted-foreground">Work from anywhere in India, or join us at our HQ in Bengaluru.</p>
            </div>
            <div className="p-6 bg-secondary/30 rounded-2xl border border-border/50 text-center">
               <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4"><Cpu className="text-primary" /></div>
               <h3 className="font-bold text-lg mb-2">Latest Gear</h3>
               <p className="text-sm text-muted-foreground">Top-spec Apple Silicon MacBooks and a generous home office stipend.</p>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="container mx-auto px-6 mb-24 max-w-4xl">
          <h2 className="text-3xl font-display font-bold mb-8">Open Positions</h2>
          
          <div className="space-y-4">
            {[
              { role: "Senior Backend Engineer (Go)", team: "Engineering", loc: "Bengaluru / Remote" },
              { role: "Staff Machine Learning Engineer", team: "Data Science", loc: "Bengaluru" },
              { role: "Frontend Engineer (React)", team: "Product", loc: "Remote (India)" },
              { role: "Risk Strategy Lead", team: "Credit Risk", loc: "Mumbai" },
              { role: "Developer Advocate", team: "Dev Rel", loc: "Remote" }
            ].map((job, i) => (
              <div key={i} className="group p-6 md:px-8 border border-border/60 hover:border-primary/50 bg-card hover:bg-secondary/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between transition-all cursor-pointer">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{job.role}</h3>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.team}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.loc}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                  <span className="text-primary font-semibold flex items-center gap-2">View Role <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Careers;
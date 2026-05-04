import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Globe, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        
        {/* Hero */}
        <section className="container mx-auto px-6 mb-24 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8">
            Rebuilding the foundation of <span className="text-gradient">Indian credit</span>.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Credit is the engine of economic growth. Yet, for millions of Indians and thousands of small businesses, accessing fair credit is still hindered by outdated infrastructure, manual processes, and fragmented data. We're changing that.
          </p>
        </section>

        {/* Impact Numbers */}
        <section className="container mx-auto px-6 mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-secondary/30 rounded-3xl border border-border/50">
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">5B+</div>
              <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Data Points Processed</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">12M+</div>
              <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Decisions Made</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">40+</div>
              <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">NBFC Partners</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Uptime SLA</div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="container mx-auto px-6 mb-24 max-w-5xl">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Target, title: "Mission First", desc: "Every line of code we write is dedicated to unlocking capital for those who need it, faster and fairer than ever before." },
              { icon: Globe, title: "Built for Bharat", desc: "We don't just localize western models. We build exclusively for the nuances of the Indian consumer and MSME." },
              { icon: Users, title: "Collaborative Intelligence", desc: "We believe the best risk models are a synthesis of machine scale and human underwriting expertise." },
              { icon: Award, title: "Uncompromising Integrity", desc: "We treat our partners' data like our own. Security and privacy form the bedrock of our infrastructure." }
            ].map((v, i) => (
              <div key={i} className="flex gap-6 p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <v.icon className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
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

export default About;
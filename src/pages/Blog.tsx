import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        
        {/* Header */}
        <section className="container mx-auto px-6 mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
            Insights & Engineering
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep dives into risk algorithms, infrastructure scaling, and the future of Indian fintech.
          </p>
        </section>

        {/* Featured Post */}
        <section className="container mx-auto px-6 mb-16">
          <div className="group relative rounded-3xl overflow-hidden border border-border/60 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10 p-8 md:p-16 flex flex-col justify-center w-full md:w-2/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-max">
                Featured
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                Scaling our ML feature pipeline to process 10M events per second
              </h2>
              <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                How we migrated from Python celary workers to a bespoke Golang event streaming architecture backed by Kafka to achieve sub-millisecond feature vector generation for real-time credit scoring.
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Rahul Sharma</span>
                <span>•</span>
                <span>Oct 12, 2026</span>
              </div>
            </div>
            {/* Placeholder Background */}
            <div className="h-[400px] md:h-[500px] w-full bg-secondary bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"></div>
          </div>
        </section>

        {/* Recent Posts Grid */}
        <section className="container mx-auto px-6 mb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Why NBFCs are moving away from legacy monolithic LOS systems",
                excerpt: "The shift towards composable, API-first microservices in lending infrastructure is accelerating rapidly in India.",
                category: "Industry", author: "Priya Das", date: "Sep 28, 2026"
              },
              {
                title: "Product Update: Real-time CERSAI integration is now live",
                excerpt: "Instantly cross-check collateral registries during the loan application flow natively through our API.",
                category: "Product", author: "Arera Team", date: "Sep 15, 2026"
              },
              {
                title: "The hidden cost of manual underwriting in an instant-everything world",
                excerpt: "Analyzing the drop-off rates for unsecured personal loans when decisions take longer than 60 seconds.",
                category: "Industry", author: "Amit Patel", date: "Aug 22, 2026"
              },
              {
                title: "Understanding Alternative Data for Thin-File Borrowers",
                excerpt: "How device telemetry and utility bills can successfully predict intent to pay without traditional bureau history.",
                category: "Risk", author: "Dr. Ananya Singh", date: "Aug 05, 2026"
              },
              {
                title: "Deploying Python Scikit-Learn models to Go Microservices",
                excerpt: "A technical walkthrough of bridging Python data science environments into high-throughput production backends.",
                category: "Engineering", author: "Rahul Sharma", date: "Jul 18, 2026"
              },
              {
                title: "Securing financial APIs: Beyond JWTs",
                excerpt: "Our approach to mutual TLS, payload encryption, and strictly scoped ephemeral access tokens.",
                category: "Security", author: "Vikram Reddy", date: "Jul 02, 2026"
              }
            ].map((post, i) => (
              <div key={i} className="group p-6 border border-border/50 rounded-2xl bg-card hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full">
                <div className="mb-auto">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">{post.category}</span>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
                  <span className="font-medium text-foreground">{post.author}</span>
                  <span>{post.date}</span>
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

export default Blog;
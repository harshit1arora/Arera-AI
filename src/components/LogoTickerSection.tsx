import { motion } from "framer-motion";

const logos = [
  { name: "HDFC Bank", color: "text-[#004C8F]" },
  { name: "Muthoot Fincorp", color: "text-[#D3A144]" },
  { name: "Tata Capital", color: "text-[#0051B4]" },
  { name: "Bajaj Finserv", color: "text-[#008CB9]" },
  { name: "Kotak Mahindra", color: "text-[#ED1C24]" },
  { name: "Axis Bank", color: "text-[#97144D]" },
  { name: "SBI Cards", color: "text-[#007CC0]" },
  { name: "L&T Finance", color: "text-[#F15A22]" },
  { name: "ICICI Bank", color: "text-[#F26522]" },
];

const LogoTickerSection = () => (
  <section className="py-10 bg-background border-b border-border/40 overflow-hidden relative">
    <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
    <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    
    <div className="container mx-auto px-6 mb-8 text-center">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-accent">
        Architected to integrate seamlessly with modern financial ecosystems
      </p>
    </div>

    <div className="flex w-full relative overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        className="flex items-center w-max gap-16 px-8"
      >
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className={`text-3xl md:text-4xl font-black tracking-tight whitespace-nowrap cursor-default opacity-80 hover:opacity-100 transition-opacity drop-shadow-sm ${logo.color}`}
            style={{ fontFamily: "'Inter', 'SF Pro Display', sans-serif" }}
          >
            {logo.name}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default LogoTickerSection;

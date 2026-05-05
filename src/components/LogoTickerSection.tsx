import { motion } from "framer-motion";

const logos = [
  { name: "ICICI Bank", color: "text-orange-600 dark:text-orange-500" },
  { name: "HDFC Bank", color: "text-blue-800 dark:text-blue-500" },
  { name: "Muthoot Fincorp", color: "text-yellow-600 dark:text-yellow-500" },
  { name: "Tata Capital", color: "text-blue-600 dark:text-blue-400" },
  { name: "Bajaj Finserv", color: "text-cyan-700 dark:text-cyan-400" },
  { name: "Kotak Mahindra", color: "text-red-700 dark:text-red-500" },
  { name: "Axis Bank", color: "text-blue-700 dark:text-blue-400" },
  { name: "SBI Cards", color: "text-blue-500 dark:text-blue-300" },
  { name: "L&T Finance", color: "text-orange-700 dark:text-orange-400" },
  { name: "Aditya Birla", color: "text-purple-700 dark:text-purple-400" },
];

const LogoTickerSection = () => (
  <section className="py-10 bg-background border-b border-border/40 overflow-hidden relative">
    <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
    <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    
    <div className="container mx-auto px-6 mb-4 text-center">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-accent">
        Architected to integrate seamlessly with modern financial ecosystems
      </p>
    </div>

    <div className="flex w-full relative overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        className="flex whitespace-nowrap items-center w-max gap-16 px-8"
      >
        {/* Double the array for seamless infinite scroll */}
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className={`text-xl font-display font-black opacity-60 hover:opacity-100 transition-opacity cursor-default ${logo.color}`}
          >
            {logo.name}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default LogoTickerSection;

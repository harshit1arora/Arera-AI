import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, UploadCloud, Sparkles, BrainCircuit, Database, Zap } from "lucide-react";
import { submitApplication } from "../lib/firestore";
import { evaluateApplicationWithAI } from "../lib/ai-engine";
import { apiWithAuth } from "../lib/api-client";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const Apply = () => {
  const { orgId } = useAuth();
  const [formData, setFormData] = useState({
    applicantName: "",
    annualIncome: "",
    loanAmount: "",
    creditDebt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appId, setAppId] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [schema, setSchema] = useState<any[]>([]);
  const [dynamicData, setDynamicData] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAAFetching, setIsAAFetching] = useState(false);
  const [llmInsights, setLlmInsights] = useState<any>(null);

  const simulateAccountAggregator = async () => {
    setIsAAFetching(true);
    toast("Redirecting to Sahamati AA Consent Flow...", { icon: '🔒' });
    try {
      const res = await apiWithAuth(`/v1/evaluate/account-aggregator`, { method: "POST" });
      if (res.ok) {
        const aaData = await res.json();
        setLlmInsights(aaData);
        if (aaData.extractedData?.averageMonthlyBalance) {
          setFormData(prev => ({ ...prev, annualIncome: String(aaData.extractedData.averageMonthlyBalance * 12) }));
          setDynamicData(prev => ({ ...prev, annualIncome: String(aaData.extractedData.averageMonthlyBalance * 12) }));
        }
        toast.success("AA Consent Approved. Financials Imported.");
      }
    } catch (err) {
      toast.error("Failed to connect to AA gateway");
    } finally {
      setIsAAFetching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('statement', file);
      
      const res = await apiWithAuth(`/v1/evaluate/bank-statement`, {
        method: "POST",
        // Do NOT set Content-Type header manually when using FormData, browser will set it with the boundary
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setLlmInsights(data);
        // Auto-fill income based on average monthly balance
        if (data.extractedData?.averageMonthlyBalance) {
          setFormData(prev => ({ ...prev, annualIncome: String(data.extractedData.averageMonthlyBalance * 12) }));
          setDynamicData(prev => ({ ...prev, annualIncome: String(data.extractedData.averageMonthlyBalance * 12) }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Fetch products
    apiWithAuth(`/v1/products`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    // Fetch form schema for product
    apiWithAuth(`/v1/products/${selectedProduct}/form-schema`)
      .then(r => r.json())
      .then(data => {
        if (data && data.schema) setSchema(data.schema);
      })
      .catch(console.error);
  }, [selectedProduct]);

  const handleDynamicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDynamicData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const parsedData = {
        applicantName: formData.applicantName || dynamicData.borrowerName,
        annualIncome: Number(formData.annualIncome) || 0,
        loanAmount: Number(formData.loanAmount) || Number(dynamicData.loanAmount),
        creditDebt: Number(formData.creditDebt) || 0,
        productId: selectedProduct,
        ...dynamicData,
        orgId: orgId || "public-demo-bank", // Tag to active user's bank if logged in
      };

      // 1. Save to database
      const newAppId = await submitApplication(parsedData);
      setAppId(newAppId);
      
      // 2. Trigger async AI evaluation (in a real app this would be a Cloud Function)
      evaluateApplicationWithAI(newAppId, parsedData);

      setIsSuccess(true);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background relative flex overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none" />
      
      {/* Massive ARERA Watermark */}
      <div className="absolute top-1/2 left-[-5%] -translate-y-1/2 -rotate-90 text-[300px] font-display font-black text-white/[0.02] pointer-events-none select-none tracking-tighter mix-blend-overlay">
        ARERA
      </div>
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative border-r border-white/5">
        <div className="absolute inset-0 hero-gradient opacity-5 pointer-events-none" />
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[10%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <Link to="/" className="inline-block mb-16">
            <span className="text-2xl font-display font-bold tracking-tight text-foreground flex items-center gap-2 transition-transform hover:scale-105">
              <Sparkles className="text-primary" size={24} />
              Arera<span className="text-primary">.ai</span>
            </span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-6xl font-display font-black text-foreground leading-[1.1] tracking-tight mb-6">
              The speed of AI.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-primary bg-300% animate-gradient">The trust of enterprise.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-10">
              Experience how our Gemini-powered risk engine analyzes cash flow, detects hidden liabilities, and underwrites borrowers in milliseconds.
            </p>
            
            {/* Live Evaluation Graphic */}
            <div className="relative mb-12">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent blur-xl" />
               <div className="relative glass-panel border border-white/10 bg-background/40 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 max-w-xs shadow-2xl">
                 <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-glow animate-pulse">
                   <Zap className="text-white" size={20} />
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Live Engine Active</div>
                   <div className="text-sm font-medium">Processing 10K+ data points</div>
                 </div>
               </div>
            </div>

            <div className="flex gap-4 items-center">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-bold shadow-lg`}><BrainCircuit size={16} className="text-primary/70"/></div>)}
               </div>
               <div className="flex flex-col justify-center text-xs text-muted-foreground font-medium">
                 <span className="text-foreground">Join 100+ NBFCs</span>
                 <span>scaling with Arera</span>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 glass-panel border border-white/5 bg-background/50 p-6 rounded-2xl max-w-md backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2 text-primary font-bold text-sm uppercase tracking-widest">
            <CheckCircle size={16} /> Bank-grade Security
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">All data is processed securely and encrypted at rest. Fully compliant with RBI guidelines, Sahamati AA, and DPDP acts.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <main className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto">
        <Link to="/" className="absolute top-8 left-8 lg:hidden inline-block">
            <span className="text-xl font-display font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              Arera<span className="text-primary">.ai</span>
            </span>
        </Link>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="glass-panel neon-border-glow bg-background/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {!isSuccess ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-display font-bold text-foreground tracking-tight">Apply for Credit</h2>
                  <p className="text-sm text-muted-foreground mt-2">Enter details below to simulate an applicant flow.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {products.length > 0 && (
                    <div className="space-y-2 mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Loan Product</label>
                      <div className="relative">
                        <select 
                          required
                          value={selectedProduct || ''}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                          className="w-full appearance-none bg-secondary/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
                        >
                          <option value="" disabled>Select a product...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id} className="bg-background text-foreground">{p.name} ({p.segment})</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LLM Bank Statement Analysis Box */}
                  <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,0,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                    <div className="absolute inset-0 border border-primary/20 rounded-2xl group-hover:border-primary/40 transition-colors" />
                    
                    <div className="p-6 relative z-10">
                    {!llmInsights ? (
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                          <BrainCircuit size={20} className="text-primary" />
                        </div>
                        <h3 className="font-bold text-sm mb-1 text-foreground">Arera AI Document Parsing</h3>
                        <p className="text-[11px] text-muted-foreground mb-5 leading-relaxed">Upload a 6-month bank statement (PDF). Our Gemini 1.5 Pro engine will extract cash flow and auto-fill your application.</p>
                        
                        <div className="flex flex-col gap-3">
                          <label className="cursor-pointer relative overflow-hidden group/btn w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-xl text-xs font-bold transition-all">
                            {isAnalyzing ? (
                              <><Loader2 size={16} className="animate-spin"/> Analyzing Document...</>
                            ) : (
                              <><UploadCloud size={16} className="group-hover/btn:-translate-y-1 transition-transform" /> Upload Bank Statement</>
                            )}
                            <input type="file" className="hidden" accept=".pdf" disabled={isAnalyzing || isAAFetching} onChange={handleFileUpload} />
                          </label>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            <div className="h-px bg-white/10 flex-1" /> OR <div className="h-px bg-white/10 flex-1" />
                          </div>
                          <button 
                            type="button"
                            onClick={simulateAccountAggregator}
                            disabled={isAnalyzing || isAAFetching}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-secondary/80 border border-white/5 text-foreground rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                          >
                            {isAAFetching ? <><Loader2 size={16} className="animate-spin"/> Connecting to AA...</> : <><Database size={16} className="text-blue-400" /> Link Account Aggregator</>}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                          <CheckCircle size={18} />
                          <h3 className="font-bold text-sm">Statement Parsed & Embedded</h3>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center bg-background/80 backdrop-blur p-3 rounded-xl border border-white/5 text-xs shadow-sm">
                            <span className="text-muted-foreground font-medium">Est. Annual Income</span>
                            <span className="font-display font-bold text-sm text-foreground">₹{((llmInsights.extractedData?.averageMonthlyBalance || 0) * 12).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center bg-background/80 backdrop-blur p-3 rounded-xl border border-white/5 text-xs shadow-sm">
                            <span className="text-muted-foreground font-medium">Outward Bounces</span>
                            <span className={`font-display font-bold text-sm ${llmInsights.extractedData?.outwardBounces > 0 ? 'text-rose-500' : 'text-green-500'}`}>
                              {llmInsights.extractedData?.outwardBounces}
                            </span>
                          </div>
                        </div>

                        <div className="bg-background/90 backdrop-blur rounded-xl p-4 border border-primary/20 shadow-inner">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-primary mb-3">
                            <Sparkles size={12} /> Live AI Insights
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-2 list-none pl-1">
                            {llmInsights.insights?.map((insight: string, idx: number) => (
                              <motion.li 
                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                                key={idx} className={`relative pl-3 before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full ${insight.includes('bounce') || insight.includes('Undisclosed') ? 'text-orange-400 before:bg-orange-400' : 'before:bg-primary'}`}
                              >
                                {insight}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                    </div>
                  </div>

                  {schema.length > 0 ? (
                    <div className="space-y-4 pt-2">
                      {schema.map((field, i) => (
                        <div key={i} className="space-y-1.5">
                           <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{field.label}</label>
                           <input 
                             required={field.required}
                             type={field.type === 'number' ? 'number' : 'text'} 
                             name={field.name}
                             min={field.min}
                             max={field.max}
                             onChange={handleDynamicChange}
                             className="w-full bg-secondary/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                           />
                        </div>
                      ))}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Debt (₹)</label>
                        <input 
                          required
                          type="number" 
                          name="creditDebt"
                          value={formData.creditDebt}
                          onChange={handleChange}
                          placeholder="e.g. 100000" 
                          className="w-full bg-secondary/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleChange}
                      placeholder="e.g. Satoshi Nakamoto" 
                      className="w-full bg-secondary/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Annual Income (₹)</label>
                    <input 
                      required
                      type="number" 
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      placeholder="e.g. 1500000" 
                      className="w-full bg-secondary/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loan Amount (₹)</label>
                      <input 
                        required
                        type="number" 
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        placeholder="e.g. 500000" 
                        className="w-full bg-secondary/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Debt (₹)</label>
                      <input 
                        required
                        type="number" 
                        name="creditDebt"
                        value={formData.creditDebt}
                        onChange={handleChange}
                        placeholder="e.g. 100000" 
                        className="w-full bg-secondary/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                  </div>
                  )}

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full hero-gradient text-foreground font-bold rounded-xl py-4 mt-6 shadow-glow flex justify-center items-center gap-2 hover:opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing AI...</>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <CheckCircle size={40} className="relative z-10" />
                </div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-3 tracking-tight">Application Submitted</h2>
                <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                  ID: <span className="font-mono text-xs text-primary">{appId}</span>
                  <br/>
                  Arera AI has instantly processed your data and executed underwriting rules.
                </p>
                <Link to="/sandbox" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold transition-colors text-sm border border-white/5">
                  View Lender Dashboard <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Apply;

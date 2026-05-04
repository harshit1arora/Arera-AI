import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { submitApplication } from "../lib/firestore";
import { evaluateApplicationWithAI } from "../lib/ai-engine";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const parsedData = {
        applicantName: formData.applicantName,
        annualIncome: Number(formData.annualIncome),
        loanAmount: Number(formData.loanAmount),
        creditDebt: Number(formData.creditDebt),
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[10%] w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex justify-center min-h-[90vh] items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel border-2 border-white/10 bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {!isSuccess ? (
              <>
                <div className="mb-8">
                  <Link to="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft size={12} className="mr-1" /> Back to home
                  </Link>
                  <h1 className="text-2xl font-display font-bold text-foreground">Apply for Credit</h1>
                  <p className="text-sm text-muted-foreground mt-2">See Arera AI in action. Enter details below to simulate an applicant.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleChange}
                      placeholder="e.g. Satoshi Nakamoto" 
                      className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Annual Income (₹)</label>
                    <input 
                      required
                      type="number" 
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      placeholder="e.g. 1500000" 
                      className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80">Loan Amount (₹)</label>
                      <input 
                        required
                        type="number" 
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        placeholder="e.g. 500000" 
                        className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80">Current Debt (₹)</label>
                      <input 
                        required
                        type="number" 
                        name="creditDebt"
                        value={formData.creditDebt}
                        onChange={handleChange}
                        placeholder="e.g. 100000" 
                        className="w-full bg-secondary/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full hero-gradient text-primary-foreground font-bold rounded-xl py-3.5 mt-4 shadow-glow flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
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
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">Application Submitted!</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  ID: <span className="font-mono text-xs">{appId}</span>
                  <br/>
                  Arera AI has instantly processed your data.
                </p>
                <Link to="/auth" className="inline-block px-6 py-3 rounded-xl bg-white/10 text-foreground font-medium hover:bg-white/20 transition-colors text-sm border border-white/5">
                  Go to Lender Dashboard
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Command, Loader2, KeyRound } from "lucide-react";
import { signInWithGoogle, signInWithGithub, logInWithEmail, signUpWithEmail, resetPassword } from "../lib/firebase";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();
      toast.success(`Welcome back, ${user.displayName?.split(' ')[0]}!`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGithub();
      toast.success(`Welcome back, ${user.displayName?.split(' ')[0]}!`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isResetPassword) {
        if (!email) {
          toast.error("Please enter your email");
          return;
        }
        await resetPassword(email);
        toast.success("Recovery instructions sent to your email");
        setIsResetPassword(false);
        return;
      }

      if (isLogin) {
        await logInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, fullName);
      }
      toast.success("Identity Verified");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Entry Denied");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#FDFEFE] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-primary/20">
      
      {/* 1. SOFT BRANDED BACKGROUND BLURS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-50/50 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'linear-gradient(#F04B28 1px, transparent 1px), linear-gradient(90deg, #F04B28 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Navigation Indicator */}
        <div className="mb-6 flex justify-between items-center px-2">
           <button 
             onClick={() => isResetPassword ? setIsResetPassword(false) : navigate("/")}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors cursor-pointer"
           >
              <ArrowLeft size={12} /> {isResetPassword ? "Gate" : "Back"}
           </button>
           <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-50">
              Arera Console v1.0
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-[0_32px_64px_-16px_rgba(240,75,40,0.1)] border border-gray-100 relative">
          
          <div className="mb-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 border border-orange-100/50 transition-transform hover:rotate-6">
              {isResetPassword ? <KeyRound size={22} className="text-primary" /> : <Command size={22} className="text-primary" />}
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight">
              {isResetPassword ? "Recovery" : isLogin ? "System Access" : "Network Entry"}
            </h2>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && !isResetPassword && (
                <motion.div 
                  key="name-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Full Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="IDENTIFIER"
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-100 bg-gray-50/20 focus:bg-white focus:ring-[3px] focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-[11px] placeholder:text-gray-300"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Account Email</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="NAME@DOMAIN.COM"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-100 bg-gray-50/20 focus:bg-white focus:ring-[3px] focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-[11px] placeholder:text-gray-300"
                />
              </div>
            </div>

            <AnimatePresence>
              {!isResetPassword && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between ml-1 mb-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Password</label>
                    <button 
                      type="button"
                      onClick={() => setIsResetPassword(true)}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                      required={!isResetPassword}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-100 bg-gray-50/20 focus:bg-white focus:ring-[3px] focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-[11px] placeholder:text-gray-300"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl hero-gradient text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_8px_20px_-4px_rgba(240,75,40,0.2)] hover:shadow-[0_8px_25px_-2px_rgba(240,75,40,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4 text-white" /> : (isResetPassword ? "Transmit Recovery" : isLogin ? "Authenticate" : "Create ID")}
            </button>
          </form>

          {!isResetPassword && (
            <>
              <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-gray-50"></div>
                <span className="flex-shrink-0 mx-4 text-[9px] font-black text-gray-200 uppercase tracking-[0.3em]">Quick Sync</span>
                <div className="flex-grow border-t border-gray-50"></div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                 <button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2 h-11 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt=""/>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Google</span>
                 </button>
                 <button onClick={handleGithubSignIn} className="flex items-center justify-center gap-2 h-11 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]">
                    <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.572C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">GitHub</span>
                 </button>
              </div>

              <div className="text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/20 hover:border-primary transition-all">
                  {isLogin ? "Need Access? Request ID" : "Authorized Member? Sign In"}
                </button>
              </div>
            </>
          )}

          {isResetPassword && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsResetPassword(false)}
                className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer"
              >
                Cancel Recovery
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

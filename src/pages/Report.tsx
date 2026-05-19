import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, Share2, ArrowLeft, ChevronDown, TrendingUp, AlertCircle, 
  CheckCircle, BarChart3, PieChart, TrendingDown, LayoutDashboard, Brain, 
  Zap, ShieldCheck, Flame, ArrowRight, Award, Lock, ExternalLink, RefreshCw, 
  Sparkles, Activity, Check
} from 'lucide-react';
import { AnalysisResult } from '../utils/analysis/mockEngine';
import { useStore } from '../store/appStore';
import { useToast } from '@/hooks/use-toast';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#EAB308', '#06B6D4'];

export function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentAnalysis } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'archetype' | 'underwriting' | 'improvements'>('overview');
  const [expandedImprovement, setExpandedImprovement] = useState<number | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    toast({
      title: "Generating Underwriting PDF",
      description: "Compiling financial embedding charts. Print dialog opening..."
    });
    setTimeout(() => {
      window.print();
    }, 800);
  };

  const handleShare = () => {
    const shareUrl = window.location.origin + "/report/" + (id || currentAnalysis?.id || crypto.randomUUID());
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Unique Secure Link Copied!",
        description: "Your financial identity link is ready to share on X, LinkedIn, or WhatsApp."
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive"
      });
    });
  };

  const generateSocialShare = (platform: string) => {
    setIsGeneratingCard(true);
    toast({
      title: "Generating Flex Card",
      description: "Creating premium 4K shareable graphic for " + platform + "..."
    });
    setTimeout(() => {
      setIsGeneratingCard(false);
      handleShare();
    }, 1200);
  };

  if (!currentAnalysis) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Report Session Expired</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            For security and privacy compliance, financial statement embeddings are auto-purged from memory. Please re-upload your document.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/25"
          >
            Upload New Statement
          </button>
        </div>
      </div>
    );
  }

  const radarData = [
    { subject: 'Stability', A: currentAnalysis.financialStability, fullMark: 100 },
    { subject: 'Income', A: currentAnalysis.incomeConsistency, fullMark: 100 },
    { subject: 'EMI Capacity', A: currentAnalysis.emiCapacity, fullMark: 100 },
    { subject: 'Spending Health', A: currentAnalysis.spendingHealth, fullMark: 100 },
    { subject: 'Risk Rating', A: 100 - (currentAnalysis.riskLevel === 'high' ? 80 : currentAnalysis.riskLevel === 'medium' ? 50 : 20), fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 pb-32">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Dashboard
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <Lock className="w-3 h-3 text-orange-500" />
              <span>ID: {currentAnalysis.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/compare?score=" + currentAnalysis.approvalScore)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-orange-500" />
              <span className="hidden sm:inline">Compare</span>
            </button>
            <button 
              onClick={handleShare} 
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">Share Link</span>
            </button>
            <button 
              onClick={handleDownload} 
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* HERO SECTION: Addictive Approval Score & Summary */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-orange-400">AI Underwriting Identity Finalized</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Your Underwriting <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Intelligence Dashboard
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              We simulated 24 automated banking algorithms and shadow underwriting checks. Here is exactly how financial institutions view your credit profile.
            </p>

            {/* Quick Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="text-gray-400 text-xs mb-1 font-mono uppercase tracking-wider">Monthly Inflow</div>
                <div className="text-2xl font-bold text-white">₹{(currentAnalysis.monthlyIncome / 1000).toFixed(0)}K</div>
                <div className="text-xs text-green-400 mt-1 flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="text-gray-400 text-xs mb-1 font-mono uppercase tracking-wider">Monthly Outflow</div>
                <div className="text-2xl font-bold text-white">₹{(currentAnalysis.monthlyExpense / 1000).toFixed(0)}K</div>
                <div className="text-xs text-orange-400 mt-1 flex items-center gap-1 font-mono">
                  <Activity className="w-3 h-3" />
                  <span>{( (currentAnalysis.monthlyExpense/currentAnalysis.monthlyIncome)*100 ).toFixed(0)}% Burn</span>
                </div>
              </div>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="text-gray-400 text-xs mb-1 font-mono uppercase tracking-wider">Active EMIs</div>
                <div className="text-2xl font-bold text-white">₹{(currentAnalysis.totalEMI / 1000).toFixed(0)}K</div>
                <div className="text-xs text-blue-400 mt-1 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{( (currentAnalysis.totalEMI/currentAnalysis.monthlyIncome)*100 ).toFixed(0)}% FOIR</span>
                </div>
              </div>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="text-gray-400 text-xs mb-1 font-mono uppercase tracking-wider">Risk Tier</div>
                <div className="text-2xl font-bold text-white uppercase">{currentAnalysis.riskLevel}</div>
                <div className="text-xs text-purple-400 mt-1 flex items-center gap-1 font-mono">
                  <Brain className="w-3 h-3" />
                  <span>AI Scored</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* HERO RADIAL SCORE RINGS */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 flex flex-col items-center justify-center bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-orange-500/20 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer Glowing Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 via-orange-500/5 to-transparent blur-2xl animate-pulse"></div>

              {/* SVG Radial Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <motion.circle 
                  cx="100" cy="100" r="85" fill="none" 
                  stroke="url(#heroOrangeGradient)" strokeWidth="12"
                  strokeDasharray="534.07"
                  strokeDashoffset={534.07 - (currentAnalysis.approvalScore / 100) * 534.07}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 534.07 }}
                  animate={{ strokeDashoffset: 534.07 - (currentAnalysis.approvalScore / 100) * 534.07 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="heroOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Score Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                  <span className="text-6xl font-bold tracking-tight text-white">{currentAnalysis.approvalScore}%</span>
                  <div className="text-sm font-medium text-orange-400 mt-1">Approval Probability</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">Confidence: 98.4%</div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Percentile Bar */}
            <div className="w-full mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-orange-500" />
                  Global Percentile Rank
                </span>
                <span className="text-xs font-bold font-mono text-white">Top {100 - currentAnalysis.percentileRank}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: currentAnalysis.percentileRank + "%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                You are financially healthier than {currentAnalysis.percentileRank}% of analyzed borrowers.
              </p>
            </div>
          </motion.div>
        </div>

        {/* AI INSIGHTS SECTION: Rotating / Glowing Personalized Cards */}
        <div className="mb-16 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <Brain className="w-6 h-6 text-orange-500" />
                Algorithmic Underwriting Insights
              </h2>
              <p className="text-sm text-gray-400 mt-1">Deep neural analysis of your transaction velocity and behavioral triggers.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
              <span>Live AI Evaluation</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAnalysis.aiInsights.map((insight, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/50"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors pointer-events-none"></div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-mono text-xs font-bold">
                      0{index + 1}
                    </div>
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                      Behavioral Signal
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed font-medium">
                    {insight}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>Impact: {index % 2 === 0 ? 'High' : 'Medium'}</span>
                  <span className="text-orange-400/80 group-hover:text-orange-400 transition-colors flex items-center gap-1">
                    Underwriter Flag <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MASTER NAVIGATION TABS */}
        <div className="border-b border-white/10 mb-12 sticky top-20 z-30 bg-[#050505]/90 backdrop-blur-md pt-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4">
            {[
              { id: 'overview', label: 'Executive Summary', icon: LayoutDashboard },
              { id: 'archetype', label: 'Financial Archetype', icon: Flame },
              { id: 'analytics', label: 'Visual Analytics', icon: BarChart3 },
              { id: 'underwriting', label: 'Bank Evaluation Simulation', icon: ShieldCheck },
              { id: 'improvements', label: 'Actionable Improvements', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={"flex items-center gap-2 py-3 px-1 font-semibold text-sm transition-all relative whitespace-nowrap " + (activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200')}
              >
                <tab.icon className={"w-4 h-4 " + (activeTab === tab.id ? 'text-orange-500' : 'text-gray-500')} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="masterTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT SPACES */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
              {/* Radar Chart & Key Stability Breakdown */}
              <div className="grid lg:grid-cols-12 gap-8 items-center bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
                <div className="lg:col-span-5 flex flex-col items-center">
                  <h3 className="text-xl font-bold text-white mb-2">Underwriting Radar Profile</h3>
                  <p className="text-xs text-gray-400 mb-6 text-center max-w-xs">Multi-axis evaluation across five critical banking parameters.</p>
                  <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" stroke="#888" tick={{ fontSize: 12, fill: '#aaa' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#555" />
                        <Radar name="Borrower Profile" dataKey="A" stroke="#F97316" fill="#F97316" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">Core Algorithmic Breakdown</h3>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-300">Financial Stability Score</span>
                        <span className="text-white font-mono">{currentAnalysis.financialStability}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: currentAnalysis.financialStability + "%" }} transition={{ duration: 1 }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-300">Income Consistency Rating</span>
                        <span className="text-white font-mono">{currentAnalysis.incomeConsistency}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: currentAnalysis.incomeConsistency + "%" }} transition={{ duration: 1 }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-300">EMI Servicing Capacity</span>
                        <span className="text-white font-mono">{currentAnalysis.emiCapacity}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-purple-500" initial={{ width: 0 }} animate={{ width: currentAnalysis.emiCapacity + "%" }} transition={{ duration: 1 }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-300">Spending Health Index</span>
                        <span className="text-white font-mono">{currentAnalysis.spendingHealth}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-orange-500" initial={{ width: 0 }} animate={{ width: currentAnalysis.spendingHealth + "%" }} transition={{ duration: 1 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Flags & Positive Signals */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Algorithmic Red Flags</h3>
                      <p className="text-xs text-gray-400">Triggers that reduce your approval odds.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {currentAnalysis.redFlags.map((flag, i) => (
                      <div key={i} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-2xl p-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-200 leading-relaxed">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Positive Underwriting Signals</h3>
                      <p className="text-xs text-gray-400">Triggers that qualify you for prime interest rates.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {currentAnalysis.positiveSignals.map((signal, i) => (
                      <div key={i} className="flex items-start gap-3 bg-green-500/5 border border-green-500/10 rounded-2xl p-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-200 leading-relaxed">{signal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'archetype' && (
            <motion.div key="archetype" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              {/* Main Archetype Card */}
              <div className="bg-[#0A0A0A] border border-orange-500/30 rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-orange-500/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 max-w-3xl space-y-6">
                  <div className={"inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider " + currentAnalysis.archetypeDetails.badgeColor}>
                    <Flame className="w-4 h-4" />
                    <span>Financial Personality Archetype</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none">
                    {currentAnalysis.archetypeDetails.title}
                  </h2>
                  <p className="text-xl font-medium text-orange-400">
                    {currentAnalysis.archetypeDetails.subtitle}
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {currentAnalysis.archetypeDetails.description}
                  </p>

                  <div className="pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider font-mono flex items-center gap-2">
                        <Check className="w-4 h-4" /> Core Strengths
                      </h4>
                      <ul className="space-y-2.5">
                        {currentAnalysis.archetypeDetails.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Behavioral Vulnerabilities
                      </h4>
                      <ul className="space-y-2.5">
                        {currentAnalysis.archetypeDetails.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-mono mb-1">Underwriting Tendency</div>
                    <div className="text-lg font-bold text-white">{currentAnalysis.archetypeDetails.approvalTendency}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Cashflow Movement Area Chart */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Monthly Cashflow Movement</h3>
                      <p className="text-xs text-gray-400">Inflow vs Outflow velocity over 6 months.</p>
                    </div>
                    <Activity className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={currentAnalysis.cashflowMovement}>
                        <defs>
                          <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" tickFormatter={(val) => "₹" + (val/1000).toFixed(0) + "K"} />
                        <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="inflow" stroke="#10B981" fillOpacity={1} fill="url(#inflowGrad)" strokeWidth={2} name="Inflow" />
                        <Area type="monotone" dataKey="outflow" stroke="#F97316" fillOpacity={1} fill="url(#outflowGrad)" strokeWidth={2} name="Outflow" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Spending Breakdown Pie Chart */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Discretionary Spending Heatmap</h3>
                      <p className="text-xs text-gray-400">Categorical analysis of your financial outflows.</p>
                    </div>
                    <PieChart className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={Object.entries(currentAnalysis.spendingBreakdown).map(([name, value]) => ({ name, value }))}
                          cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value"
                        >
                          {Object.keys(currentAnalysis.spendingBreakdown).map((_, index) => (
                            <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {Object.entries(currentAnalysis.spendingBreakdown).map(([name], index) => (
                      <div key={name} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[11px] font-medium text-gray-300">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Factors Bar Chart */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Underwriting Risk Impact Factors</h3>
                    <p className="text-xs text-gray-400">Specific algorithmic penalties affecting your core approval score.</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentAnalysis.riskFactors}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="factor" stroke="#666" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#666" tickFormatter={(val) => val + "%"} />
                      <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                      <Bar dataKey="impact" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Risk Penalty" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'underwriting' && (
            <motion.div key="underwriting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 lg:p-12 space-y-8">
                <div className="max-w-3xl space-y-3">
                  <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-orange-500" />
                    How Banks & NBFCs Secretly Evaluate You
                  </h2>
                  <p className="text-gray-400 text-base leading-relaxed">
                    Underwriting goes far beyond your CIBIL score. Lenders use automated scraping rules to evaluate your bank statement for hidden behavioral signals. Here is the shadow evaluation of your uploaded document.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Automated Approval Boosters
                    </h3>
                    <div className="space-y-3">
                      {currentAnalysis.underwritingSimulation.approvalBoosters.map((b, i) => (
                        <div key={i} className="bg-green-500/5 border border-green-500/10 rounded-2xl p-4 flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-200">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" /> Hidden Rejection Triggers
                    </h3>
                    <div className="space-y-3">
                      {currentAnalysis.underwritingSimulation.rejectionTriggers.map((t, i) => (
                        <div key={i} className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-200">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'improvements' && (
            <motion.div key="improvements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl p-8 mb-8 flex items-center justify-between flex-wrap gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Projected Score Optimization</h3>
                  <p className="text-sm text-gray-400 max-w-xl">Implement these 4 actionable steps to elevate your profile from Medium/High Risk to Prime Tier Auto-Approval.</p>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/40 px-6 py-4 rounded-2xl text-center">
                  <div className="text-xs font-mono text-orange-400 uppercase tracking-wider">Potential Gain</div>
                  <div className="text-3xl font-bold text-white">+14 Pts</div>
                </div>
              </div>

              <div className="space-y-4">
                {currentAnalysis.actionableImprovements.map((imp, i) => (
                  <motion.div
                    key={i}
                    className="bg-[#0A0A0A] border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 transition-all cursor-pointer group"
                    onClick={() => setExpandedImprovement(expandedImprovement === i ? null : i)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-orange-500/30 group-hover:text-orange-500 transition-colors flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                              {imp.category}
                            </span>
                            <span className="text-xs font-mono text-orange-400">{imp.impact}</span>
                          </div>
                          <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">{imp.action}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-gray-500 font-mono">Timeframe</div>
                          <div className="text-sm font-bold text-white">{imp.timeframe}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 font-mono">Score Boost</div>
                          <div className="text-lg font-bold text-green-400 font-mono">+{imp.projectedScoreIncrease}%</div>
                        </div>
                        <ChevronDown className={"w-5 h-5 text-gray-500 group-hover:text-white transition-transform " + (expandedImprovement === i ? 'rotate-180' : '')} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedImprovement === i && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-6 mt-6 border-t border-white/5 text-gray-300 text-sm leading-relaxed"
                        >
                          {imp.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIRALITY ENGINE: SHARE CARD GENERATOR */}
        <div className="mt-24 pt-16 border-t border-white/10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2.5">
              <Share2 className="w-7 h-7 text-orange-500" />
              Generate Viral Identity Card
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Export a beautifully formatted, 4K dark-mode financial identity card to share on X/Twitter, LinkedIn, or Instagram Stories.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Share Card Preview */}
            <div className="lg:col-span-7 flex justify-center">
              <div 
                ref={shareCardRef}
                className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-orange-500/10 group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-display font-bold text-black text-xl">
                        A
                      </div>
                      <div>
                        <div className="font-bold text-white text-base tracking-tight">Arera AI Underwriting</div>
                        <div className="text-xs text-gray-500 font-mono">Verified Algorithmic Identity</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-2xl font-bold text-orange-400">{currentAnalysis.approvalScore}%</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Approval Odds</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">Primary Archetype Detected</div>
                    <div className="text-3xl font-bold tracking-tight text-white">{currentAnalysis.archetypeDetails.title}</div>
                    <div className="text-sm font-medium text-orange-400">{currentAnalysis.archetypeDetails.subtitle}</div>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
                    <div className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Key Underwriting Signal
                    </div>
                    <p className="text-sm text-gray-200 font-medium leading-relaxed italic">
                      "{currentAnalysis.aiInsights[0]}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-500 font-mono">
                    <span>arera.ai/report/{currentAnalysis.id.substring(0, 14)}...</span>
                    <span className="text-white font-bold">Top {100 - currentAnalysis.percentileRank}% Rank</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Platform Export Buttons */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Export Flex Card</h3>
              <div className="space-y-4">
                <button
                  onClick={() => generateSocialShare('X / Twitter')}
                  disabled={isGeneratingCard}
                  className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-white/10 transition-all flex items-center justify-between group font-bold text-white disabled:opacity-50"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 26.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Share to X (Twitter)
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </button>

                <button
                  onClick={() => generateSocialShare('LinkedIn')}
                  disabled={isGeneratingCard}
                  className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-white/10 transition-all flex items-center justify-between group font-bold text-white disabled:opacity-50"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 fill-current text-blue-500" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.048c.477-.9 1.637-1.85 3.365-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                    Share to LinkedIn
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </button>

                <button
                  onClick={() => generateSocialShare('WhatsApp')}
                  disabled={isGeneratingCard}
                  className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/40 hover:bg-white/10 transition-all flex items-center justify-between group font-bold text-white disabled:opacity-50"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 fill-current text-green-500" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.411 3.488 2.245 2.245 3.481 5.233 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L0 24zm6.597-3.859c1.659.982 3.524 1.5 5.408 1.5 5.449-.001 9.882-4.435 9.884-9.885.001-2.641-1.025-5.125-2.891-6.992-1.865-1.867-4.349-2.895-6.992-2.896-5.45-.001-9.884 4.436-9.886 9.885-.001 1.767.458 3.504 1.328 5.035l-1.002 3.66 3.751-.987zm8.883-7.531c-.488-.244-2.888-1.426-3.336-1.589-.448-.163-.775-.244-1.101.244-.326.488-1.263 1.589-1.548 1.915-.285.326-.571.367-1.059.123-.488-.244-2.061-.76-3.928-2.431-1.453-1.3-2.435-2.908-2.721-3.396-.285-.488-.03-.752.214-.996.22-.219.488-.571.733-.856.244-.285.326-.488.488-.814.163-.326.082-.612-.041-.856-.123-.244-1.101-2.658-1.509-3.636-.398-.956-.802-.827-1.101-.842-.285-.014-.612-.014-.938-.014s-.856.123-1.304.612c-.448.488-1.712 1.672-1.712 4.078 0 2.406 1.753 4.73 1.997 5.056.244.326 3.447 5.262 8.351 7.378 1.167.503 2.078.804 2.788 1.03.117.037.234.074.35.111 1.185.377 2.264.323 3.117.196.953-.142 2.888-1.181 3.295-2.323.407-1.142.407-2.12.285-2.323-.122-.204-.448-.326-.936-.571z"/></svg>
                    Share to WhatsApp
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportPage;

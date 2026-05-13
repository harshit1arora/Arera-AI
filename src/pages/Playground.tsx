import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PERSONAS,
  PAYLOADS,
  runAnalysis,
  AnalysisResult,
  Persona,
  TERMINAL_LINES,
  PROCESSING_LINES
} from '@/lib/mock-engine';
import { generateAnalysisPDF } from '@/lib/pdf-generator';
import {
  Play,
  Copy,
  Terminal as TerminalIcon,
  FileText,
  Loader2,
  CheckCircle2,
  Download,
  Code,
  AlertTriangle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';

const Playground = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'json' | 'personas' | 'pdf'>('personas');
  const [selectedPersona, setSelectedPersona] = useState<string>('strong');
  const [jsonValue, setJsonValue] = useState(JSON.stringify(PAYLOADS['strong'], null, 2));
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [processingLines, setProcessingLines] = useState<string[]>([]);
  const [jsonExpanded, setJsonExpanded] = useState(false);
  const [copied, setCopied] = useState<'curl' | 'json' | 'result' | null>(null);

  // Terminal typewriter effect on mount
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < TERMINAL_LINES.length) {
        setTerminalLines(prev => [...prev, TERMINAL_LINES[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 400); // Slightly slower for readability
    return () => clearInterval(interval);
  }, []);

  const handlePersonaSelect = (id: string) => {
    setSelectedPersona(id);
    setJsonValue(JSON.stringify(PAYLOADS[id], null, 2));
    setActiveTab('json');
    setResult(null);
    setStatus('idle');
    setProcessingLines([]);
  };

  const handleRunAnalysis = async () => {
    setStatus('loading');
    setResult(null);
    setProcessingLines([]);
    
    // Stagger processing lines for "Stripe-like" heavy-duty feel
    let currentLine = 0;
    const lineInterval = setInterval(() => {
      if (currentLine < PROCESSING_LINES.length) {
        setProcessingLines(prev => [...prev, PROCESSING_LINES[currentLine]]);
        currentLine++;
      }
    }, 400);

    try {
      const data = await runAnalysis(selectedPersona);
      // Wait for all lines to show before showing result
      const totalLinesTime = PROCESSING_LINES.length * 400;
      setTimeout(() => {
        clearInterval(lineInterval);
        setResult(data);
        setStatus('done');
      }, totalLinesTime + 400); 
    } catch (error) {
      console.error('Analysis failed', error);
      setStatus('idle');
    }
  };

  const copyCurl = () => {
    const curl = `curl -X POST https://api.arera.in/v1/underwriting/analyze \\
  -H "Authorization: Bearer sk_live_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '${jsonValue}'`;
    navigator.clipboard.writeText(curl);
    setCopied('curl');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonValue);
    setCopied('json');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied('result');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const downloadPDF = () => {
    if (result) {
      generateAnalysisPDF(result);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-background overflow-hidden">
      {/* BACK BUTTON HEADER */}
      <div className="h-[56px] border-b border-border flex items-center px-4 shrink-0 bg-background/50 backdrop-blur-sm">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-['DM_Sans'] text-[14px] font-medium">Back to Home</span>
        </button>
      </div>

      {/* PLAYGROUND CONTENT */}
      <div className="flex flex-1 bg-background overflow-hidden">
      {/* LEFT PANEL (55%) */}
      <div className="w-[55%] bg-surface border-r border-border flex flex-col h-full">
        {/* HEADER BAR */}
        <div className="h-[48px] border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[rgba(0,255,148,0.1)] border border-border text-[#00FF94] font-['JetBrains_Mono'] font-bold text-[10px] px-[7px] py-[2px] rounded-[4px]">POST</span>
            <span className="font-['JetBrains_Mono'] text-[13px] text-foreground/70">/v1/underwriting/analyze</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={copyCurl}
              className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] text-foreground/70 border border-border px-[10px] py-[4px] rounded-[4px] hover:text-foreground hover:border-border transition-all relative"
            >
              <TerminalIcon size={12} /> {copied === 'curl' ? 'Copied!' : '▷ cURL'}
            </button>
            <button 
              onClick={copyJson}
              className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] text-foreground/70 border border-border px-[10px] py-[4px] rounded-[4px] hover:text-foreground hover:border-border transition-all relative"
            >
              <Copy size={12} /> {copied === 'json' ? 'Copied!' : '⧉ Copy'}
            </button>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="h-[40px] border-b border-border flex items-center px-4 gap-1 shrink-0">
          {[
            { id: 'json', label: 'JSON Input' },
            { id: 'personas', label: 'Sample Personas' },
            { id: 'pdf', label: 'Upload PDF' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 h-full font-['DM_Sans'] text-[13px] transition-all relative ${
                activeTab === tab.id 
                  ? 'text-foreground border-b-2 border-[#F97316]' 
                  : 'text-foreground/70 hover:text-foreground/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          {activeTab === 'json' && (
            <>
              <textarea
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full bg-background border-none outline-none p-6 font-['JetBrains_Mono'] text-[13px] leading-[1.7] text-muted-foreground resize-none"
              />
              <div className="h-[24px] border-t border-border px-4 flex items-center justify-between shrink-0">
                <div className="flex gap-4">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-foreground/70">JSON</span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-foreground/70">UTF-8</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-[11px] text-foreground/70">Ready</span>
              </div>
            </>
          )}

          {activeTab === 'personas' && (
            <div className="p-4 space-y-2.5">
              {PERSONAS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handlePersonaSelect(p.id)}
                  className={`bg-muted border rounded-[6px] p-[14px_16px] cursor-pointer flex items-center gap-3 transition-all ${
                    selectedPersona === p.id
                      ? p.expected === 'APPROVE' 
                        ? 'border-border border-l-[3px] border-l-[#00FF94]'
                        : p.expected === 'REJECT'
                          ? 'border-border border-l-[3px] border-l-[#FF4444]'
                          : 'border-border border-l-[3px] border-l-[#F59E0B]'
                      : 'border-border'
                  }`}
                >
                  <div className={`px-2 py-0.5 rounded-[4px] font-['DM_Sans'] font-bold text-[11px] shrink-0 ${
                    p.expected === 'APPROVE' ? 'bg-[rgba(0,255,148,0.1)] text-[#00FF94]' :
                    p.expected === 'REJECT' ? 'bg-[rgba(255,68,68,0.1)] text-foreground' :
                    'bg-[rgba(245,158,11,0.1)] text-foreground'
                  }`}>
                    {p.expected}
                  </div>
                  <div className="flex-1">
                    <div className="font-['DM_Sans'] font-semibold text-[14px] text-foreground leading-none mb-1">{p.name}</div>
                    <div className="font-['DM_Sans'] font-normal text-[12px] text-foreground/70">{p.description}</div>
                  </div>
                  <div className={`font-['JetBrains_Mono'] text-[12px] shrink-0 ${
                    p.income > 0 
                      ? p.expected === 'REJECT' ? 'text-foreground' : 'text-[#00FF94]'
                      : 'text-foreground/70'
                  }`}>
                    {p.income > 0 ? `₹${p.income.toLocaleString('en-IN')}/mo` : 'No data'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="p-6">
              <label className="border-2 border-dashed border-border rounded-[8px] p-[40px_24px] text-center bg-border/30 cursor-pointer hover:bg-border/50 block transition-colors">
                <FileText size={32} className="mx-auto mb-4 text-foreground/70" />
                <div className="font-['DM_Sans'] font-semibold text-[14px] text-foreground/70 mb-1">Click to upload bank statement PDF</div>
                <div className="font-['DM_Sans'] font-normal text-[12px] text-foreground/70">Supported: HDFC, SBI, ICICI, Axis, PNB statements</div>
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    toast.success(`Mock parser: ${e.target.files[0].name} loaded`);
                  }
                }} />
              </label>

              <div className="mt-8">
                <div className="font-['DM_Sans'] font-semibold text-[12px] text-foreground/70 uppercase tracking-wider mb-4">Parser pipeline</div>
                <div className="space-y-3">
                  {[
                    "Extracting transactions from PDF...",
                    "Detecting income credit patterns...",
                    "Identifying EMI deductions...",
                    "Passing to underwriting engine..."
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-[18px] h-[18px] border border-border rounded-full flex items-center justify-center font-['JetBrains_Mono'] text-[10px] text-foreground/70">
                        {i + 1}
                      </div>
                      <span className="font-['JetBrains_Mono'] text-[12px] text-foreground/70">{text}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6 font-['JetBrains_Mono'] text-[11px] text-foreground/70">
                  Powered by Arera Parser v1
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RUN ANALYSIS BUTTON */}
        <button
          onClick={handleRunAnalysis}
          disabled={status === 'loading'}
          className={`h-[56px] w-full border-t flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
            status === 'loading' 
              ? 'bg-[rgba(249,115,22,0.6)] border-border cursor-not-allowed'
              : status === 'done'
                ? 'bg-[rgba(0,255,148,0.15)] border-border text-[#00FF94]'
                : 'bg-[#F97316] text-black border-border animate-[pulseGlow_2.5s_ease-in-out_infinite]'
          }`}
        >
          {status === 'loading' ? (
            <div className="flex items-center gap-2 font-['DM_Sans'] font-bold text-[14px] uppercase">
              <Loader2 size={18} className="animate-spin" /> Processing...
            </div>
          ) : status === 'done' && result ? (
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[13px]">
              <CheckCircle2 size={16} /> Analysis Complete — {result.processing_time_ms}ms
            </div>
          ) : (
            <span className="font-['DM_Sans'] font-bold text-[14px] uppercase tracking-wider">
              ▶ RUN ANALYSIS
            </span>
          )}
        </button>
      </div>

      {/* RIGHT PANEL (45%) */}
      <div className="w-[45%] bg-background flex flex-col h-full overflow-hidden">
        {/* HEADER BAR */}
        <div className="h-[48px] border-b border-border flex items-center justify-between px-4 shrink-0">
          <span className="font-['DM_Sans'] font-semibold text-[13px] text-foreground">Response</span>
          
          {status === 'done' && result && (
            <div className="flex items-center gap-2">
              <div className="bg-[rgba(0,255,148,0.1)] border border-border text-[#00FF94] font-['JetBrains_Mono'] text-[11px] px-2 py-0.5 rounded-[4px]">
                200 OK
              </div>
              <div className="bg-[rgba(245,158,11,0.1)] text-foreground font-['JetBrains_Mono'] text-[11px] px-2 py-0.5 rounded-[4px]">
                {result.processing_time_ms}ms
              </div>
              <button onClick={copyResult} className="text-foreground/70 hover:text-foreground p-1 transition-colors relative group">
                <Copy size={14} />
                {copied === 'result' && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded">Copied!</span>}
              </button>
              <button onClick={downloadPDF} className="text-foreground/70 hover:text-foreground p-1 transition-colors">
                <Download size={14} />
              </button>
            </div>
          )}
        </div>

        {/* RESPONSE CONTENT */}
        <div className="flex-1 overflow-y-auto p-0 flex flex-col">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-7 font-['JetBrains_Mono'] text-[13px] line-height-[1.8]"
              >
                {terminalLines.map((line, i) => (
                  <div key={i} style={{
                    color: (line && typeof line === 'string' && line.includes('RBI')) ? '#F59E0B' :
                           (line && typeof line === 'string' && line.includes('initialized')) ? 'rgba(255,255,255,0.5)' :
                           (line && typeof line === 'string' && line.includes('policies')) ? 'rgba(255,255,255,0.4)' :
                           (line && typeof line === 'string' && line.includes('Sandbox')) ? 'rgba(255,255,255,0.3)' :
                           'rgba(255,255,255,0.2)'
                  }}>
                    {line}
                  </div>
                ))}
                {terminalLines.length === TERMINAL_LINES.length && (
                  <span className="inline-block w-2 h-4 bg-background ml-1 animate-[blink_1.2s_step-end_infinite]">_</span>
                )}
              </motion.div>
            )}

            {status === 'loading' && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-7 font-['JetBrains_Mono'] text-[13px] space-y-1"
              >
                {processingLines.map((line, i) => (
                  <div key={i} style={{
                    color: (line && typeof line === 'string' && line.includes('Decision ready')) ? '#00FF94' :
                           (line && typeof line === 'string' && line.includes('policy rules')) ? '#F97316' :
                           'rgba(255,255,255,0.6)'
                  }}>
                    {line}
                  </div>
                ))}
              </motion.div>
            )}

            {status === 'done' && result && (
              <motion.div 
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 space-y-4 pb-10"
              >
                {/* ERROR STATE */}
                {result.error ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[rgba(255,68,68,0.08)] border border-border rounded-[8px] p-[20px_24px] mx-0 mt-4"
                  >
                    <div className="flex gap-2.5 items-center">
                      <AlertTriangle size={18} className="text-foreground" />
                      <span className="font-['JetBrains_Mono'] font-bold text-[14px] text-foreground">
                        {result.error.code} — {result.error.message}
                      </span>
                    </div>
                    <p className="mt-2 font-['DM_Sans'] font-normal text-[14px] text-foreground/70 leading-[1.6]">
                      {result.error.detail}
                    </p>
                    <div className="mt-3 flex gap-4 font-['JetBrains_Mono'] text-[12px]">
                      <span className="text-foreground/70">Minimum required: 3 months</span>
                      <span className="text-foreground">Detected: 1 month</span>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* BLOCK 1: Decision Banner */}
                    <motion.div 
                      initial={{ y: -12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className={`rounded-[8px] p-[20px_24px] flex justify-between items-center ${
                        result.decision === 'APPROVE' ? 'bg-[rgba(0,255,148,0.08)] border border-border' :
                        result.decision === 'REJECT' ? 'bg-[rgba(255,68,68,0.08)] border border-border' :
                        'bg-[rgba(245,158,11,0.08)] border border-border'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          {result.decision === 'APPROVE' && <CheckCircle2 size={24} className="text-[#00FF94]" />}
                          {result.decision === 'REJECT' && <XCircle size={24} className="text-foreground" />}
                          {result.decision === 'REVIEW' && <AlertCircle size={24} className="text-foreground" />}
                          <span className={`font-['DM_Sans'] font-extrabold text-[24px] ${
                            result.decision === 'APPROVE' ? 'text-[#00FF94]' :
                            result.decision === 'REJECT' ? 'text-foreground' :
                            'text-foreground'
                          }`}>
                            {result.decision === 'APPROVE' ? 'APPROVED' : result.decision === 'REJECT' ? 'REJECTED' : 'REVIEW REQUIRED'}
                          </span>
                        </div>
                        {(result.decision === 'APPROVE' || result.decision === 'REVIEW') && (
                          <span className="mt-1 font-['DM_Sans'] font-semibold text-[14px] text-foreground/70">
                            Credit Limit: ₹{result.credit_limit.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="relative w-[72px] h-[72px]">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="36" cy="36" r="32"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="4"
                              fill="transparent"
                            />
                            <circle
                              cx="36" cy="36" r="32"
                              stroke={result.risk_score > 65 ? '#00FF94' : result.risk_score > 40 ? '#F59E0B' : '#FF4444'}
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 32}
                              strokeDashoffset={2 * Math.PI * 32 * (1 - (result.risk_score / 100) * 0.75)}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-['JetBrains_Mono'] font-bold text-[18px] text-foreground">{result.risk_score}</span>
                          </div>
                        </div>
                        <span className="mt-1 font-['JetBrains_Mono'] text-[11px] text-foreground/70">
                          Confidence: {(result.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </motion.div>

                    {/* BLOCK 2: Decision Factors */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center px-1">
                        <span className="font-['DM_Sans'] font-semibold text-[13px] text-foreground/70">Decision Factors</span>
                        <span className="font-['JetBrains_Mono'] text-[11px] text-foreground/70">
                          {result.audit_id.slice(0, 24)}...
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {result.reasons.map((reason, i) => (
                          <motion.div 
                            key={reason.code}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                          >
                            <div className="flex justify-between mb-0.5">
                              <span className="font-['DM_Sans'] font-semibold text-[13px] text-foreground">{reason.label}</span>
                              <span className="font-['JetBrains_Mono'] text-[13px] text-foreground/70">{(reason.weight * 100).toFixed(0)}%</span>
                            </div>
                            <p className="font-['DM_Sans'] font-normal text-[12px] text-foreground/70 mb-1.5">
                              {reason.detail}
                            </p>
                            <div className="h-[5px] bg-foreground/5 rounded-[3px] overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${reason.weight * 100}%` }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 + i * 0.08 }}
                                className={`h-full rounded-[3px] ${
                                  reason.sentiment === 'positive' ? 'bg-[#10B981]' :
                                  reason.sentiment === 'negative' ? 'bg-[#FF4444]' :
                                  'bg-[#F59E0B]'
                                }`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* BLOCK 3: Rules Fired */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      <div className="flex justify-between items-center px-1">
                        <span className="font-['DM_Sans'] font-semibold text-[13px] text-foreground/70">Rules Evaluated</span>
                        <div className={`font-['JetBrains_Mono'] text-[11px] px-2 py-0.5 rounded-[4px] ${
                          result.rules_fired.filter(r => r.result).length > 2 ? 'text-[#00FF94] bg-[rgba(0,255,148,0.1)]' : 'text-foreground bg-[rgba(255,68,68,0.1)]'
                        }`}>
                          {result.rules_fired.filter(r => !r.skipped).length}/{result.rules_fired.length} triggered
                        </div>
                      </div>

                      <div className="space-y-2">
                        {result.rules_fired.map((rule, i) => (
                          <motion.div 
                            key={rule.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 + i * 0.05 }}
                            className="flex items-center gap-2.5 px-1"
                          >
                            <div className="shrink-0">
                              {rule.skipped ? (
                                <span className="text-foreground/70 font-bold">—</span>
                              ) : rule.result ? (
                                <CheckCircle2 size={16} className="text-[#00FF94]" />
                              ) : (
                                <XCircle size={16} className="text-foreground" />
                              )}
                            </div>
                            <span className="font-['JetBrains_Mono'] text-[11px] text-foreground/70 min-w-[40px]">{rule.id}</span>
                            <span className="font-['DM_Sans'] text-[13px] text-foreground/70">{rule.name}</span>
                            <span className="flex-1 text-right font-['JetBrains_Mono'] text-[11px] text-foreground/70">{rule.condition}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* BLOCK 4: Raw JSON */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.75 }}
                      className="border-t border-border pt-4"
                    >
                      <div 
                        onClick={() => setJsonExpanded(!jsonExpanded)}
                        className="flex justify-between items-center cursor-pointer px-1 group"
                      >
                        <span className="font-['DM_Sans'] font-semibold text-[13px] text-foreground/70 group-hover:text-foreground/70 transition-colors">Raw Response</span>
                        <div className="flex items-center gap-1.5 font-['DM_Sans'] text-[12px] text-foreground/70 group-hover:text-foreground/70">
                          {jsonExpanded ? '[Collapse ▴]' : '[Expand ▾]'}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {jsonExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-3"
                          >
                            <pre className="bg-muted border border-border rounded-[6px] p-4 font-['JetBrains_Mono'] text-[12px] text-foreground/70 max-height-[240px] overflow-y-auto whitespace-pre word-break-all">
                              {JSON.stringify(result, null, 2)}
                            </pre>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0px rgba(249,115,22,0); }
          50% { box-shadow: 0 0 24px rgba(249,115,22,0.5); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .line-height-1-8 { line-height: 1.8; }
      `}</style>
    </div>
  );
};

export default Playground;

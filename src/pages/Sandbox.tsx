import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Loader2, RefreshCcw, CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react";
import { submitApplication } from "@/lib/firestore";
import { evaluateApplicationWithAI } from "@/lib/ai-engine";

const scenarios = [
  {
    id: "prime",
    label: "Prime Applicant",
    payload: {
      applicant_id: "usr_prime_990",
      income: 1800000,
      bureau_score: 785,
      alt_data_flags: ["stable_location", "high_utility_payments"],
    },
    response: {
      decision: "APPROVED",
      arera_score: 812,
      max_approved_amount: 1200000,
      risk_tier: "LOW_RISK",
      reasons: ["Strong bureau history", "Stable geospatial telemetry"],
      latency_ms: 412
    }
  },
  {
    id: "thin_file",
    label: "Thin File (Alt Data)",
    payload: {
      applicant_id: "usr_thin_421",
      income: 450000,
      bureau_score: null,
      alt_data_flags: ["consistent_telecom", "gig_economy_income"],
    },
    response: {
      decision: "MANUAL_REVIEW",
      arera_score: 645,
      max_approved_amount: 50000,
      risk_tier: "MODERATE_RISK",
      reasons: ["No bureau hit", "Consistent alternate income verified"],
      latency_ms: 685
    }
  },
  {
    id: "high_risk",
    label: "High Risk",
    payload: {
      applicant_id: "usr_risk_004",
      income: 250000,
      bureau_score: 520,
      alt_data_flags: ["multiple_bounce_history", "frequent_device_swaps"],
    },
    response: {
      decision: "DECLINED",
      arera_score: 410,
      max_approved_amount: 0,
      risk_tier: "VERY_HIGH_RISK",
      reasons: ["Severe delinquency in bureau", "Device fingerprint anomalies"],
      latency_ms: 320
    }
  }
];

const Sandbox = () => {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleExecute = async () => {
    setIsExecuting(true);
    setResponse(null);
    
    try {
      const applicantNameMap: Record<string, string> = {
        "prime": "Sarah Connor",
        "thin_file": "John Doe",
        "high_risk": "Alice Smith"
      };

      const parsedData = {
        applicantName: applicantNameMap[activeScenario.id] || "Sandbox User",
        annualIncome: activeScenario.payload.income,
        loanAmount: 500000, 
        creditDebt: activeScenario.id === "high_risk" ? 250000 : activeScenario.payload.income * 0.1,
        orgId: "public-demo-bank"
      };

      const start = Date.now();
      const newAppId = await submitApplication(parsedData);
      const { score, status, reasoning } = await evaluateApplicationWithAI(newAppId, parsedData);
      const latency_ms = Math.round(Date.now() - start);

      const decisionMap: Record<string, string> = {
        "Approved": "APPROVED",
        "Rejected": "DECLINED",
        "Manual Review": "MANUAL_REVIEW"
      };

      setResponse({
        id: "res_" + newAppId.substring(0, 6),
        decision: decisionMap[status] || "MANUAL_REVIEW",
        arera_score: score,
        max_approved_amount: status === "Approved" ? 1200000 : status === "Manual Review" ? 50000 : 0,
        risk_tier: status === "Approved" ? "LOW_RISK" : status === "Manual Review" ? "MODERATE_RISK" : "VERY_HIGH_RISK",
        reasons: [reasoning],
        latency_ms
      });
      setIsExecuting(false);
    } catch (err) {
      console.error(err);
      setIsExecuting(false);
    }
  };

  const reset = () => {
    setResponse(null);
    setIsExecuting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <section className="container mx-auto px-6 max-w-6xl">
          
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Interactive API Sandbox
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience our underwriting engine in real-time. Select a borrower profile below and execute a test request to see the instant credit decision algorithm at work.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 shadow-elevated rounded-3xl overflow-hidden border border-border/60 bg-card">
            
            {/* Left Pane - Request Configuration */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r border-border/60 bg-secondary/10 relative">
              <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span> 
                Configure Payload
              </h2>
              
              <div className="mb-8 flex flex-wrap gap-2">
                {scenarios.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveScenario(s); reset(); }}
                    className={"px-4 py-2 rounded-lg text-sm font-semibold transition-all " + (activeScenario.id === s.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground')}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="mb-8 relative">
                 <div className="absolute top-0 right-0 p-3 flex gap-2">
                   <div className="text-xs font-mono font-bold text-muted-foreground bg-secondary px-2 py-1 rounded">POST /v1/underwrite</div>
                 </div>
                 <pre className="bg-background text-muted-foreground p-6 rounded-xl font-mono text-sm border border-border/50 overflow-x-auto shadow-inner">
                   <code>
<span className="text-pink-400">const</span> payload = {"{\n"}
  <span className="text-green-300">"applicant_id"</span>: <span className="text-yellow-200">"{activeScenario.payload.applicant_id}"</span>,
  <span className="text-green-300">"annual_income_inr"</span>: <span className="text-orange-300">{activeScenario.payload.income}</span>,
  <span className="text-green-300">"bureau_score"</span>: <span className="text-orange-300">{activeScenario.payload.bureau_score !== null ? activeScenario.payload.bureau_score : "null"}</span>,
  <span className="text-green-300">"alt_data_flags"</span>: [
{activeScenario.payload.alt_data_flags.map((flag, i) => (
  <span key={i}>
    {"    "}<span className="text-yellow-200">"{flag}"</span>{i < activeScenario.payload.alt_data_flags.length - 1 ? ',' : ''}
    {"\n"}
  </span>
))}
  ]
{"}"};
                   </code>
                 </pre>
              </div>

              <div className="flex gap-4">
                <button 
                   onClick={handleExecute}
                   disabled={isExecuting}
                   className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                 >
                   {isExecuting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                   {isExecuting ? "Processing Algorithms..." : "Execute Request"}
                </button>
                {response && (
                  <button onClick={reset} className="px-5 py-4 border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition">
                    <RefreshCcw size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Pane - API Response */}
            <div className="p-8 bg-background relative flex flex-col items-center justify-center min-h-[400px]">
              
              {!isExecuting && !response && (
                 <div className="text-center opacity-40">
                   <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 border border-border">
                     <Zap size={24} className="ml-1 text-foreground" />
                   </div>
                   <p className="font-mono text-sm text-foreground">Awaiting execution...</p>
                 </div>
              )}

              {isExecuting && (
                <div className="text-center space-y-6 w-full max-w-sm">
                  <Loader2 className="animate-spin text-primary mx-auto mb-8" size={48} />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span>Generating Risk Vectors</span>
                      <span className="text-green-400">DONE</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-1 overflow-hidden">
                       <div className="bg-primary h-1 rounded-full w-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span>Scoring ML Models</span>
                      <span className="text-yellow-400 animate-pulse">EVALUATING</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-1 overflow-hidden">
                       <div className="bg-primary h-1 rounded-full opacity-50 w-1/2"></div>
                    </div>
                  </div>
                </div>
              )}

              {response && !isExecuting && (
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                    <h2 className="font-bold text-foreground text-xl flex items-center gap-2">
                       <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span> 
                       Response
                    </h2>
                    <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                      200 OK — {response.latency_ms}ms
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="mb-6 flex gap-3">
                      {response.decision === "APPROVED" && <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 font-bold rounded-lg"><CheckCircle2 size={18}/> APPROVED</div>}
                      {response.decision === "MANUAL_REVIEW" && <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 font-bold rounded-lg"><AlertTriangle size={18}/> MANUAL REVIEW</div>}
                      {response.decision === "DECLINED" && <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 font-bold rounded-lg"><ShieldAlert size={18}/> DECLINED</div>}
                      
                      <div className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 font-bold rounded-lg font-mono">
                        Score: {response.arera_score}
                      </div>
                    </div>

                    <pre className="text-sm font-mono text-muted-foreground">
{"{\n"}
  <span className="text-green-300">"id"</span>: <span className="text-yellow-200">"res_89af74"</span>,
  <span className="text-green-300">"decision"</span>: <span className={response.decision === "APPROVED" ? "text-green-400" : response.decision === "DECLINED" ? "text-red-400" : "text-yellow-400"}>"{response.decision}"</span>,
  <span className="text-green-300">"arera_score"</span>: <span className="text-orange-300">{response.arera_score}</span>,
  <span className="text-green-300">"max_approved_amount"</span>: <span className="text-orange-300">{response.max_approved_amount}</span>,
  <span className="text-green-300">"risk_tier"</span>: <span className="text-yellow-200">"{response.risk_tier}"</span>,
  <span className="text-green-300">"reasons"</span>: [
{response.reasons.map((r: string, i: number) => (
  <span key={i}>
    {"    "}<span className="text-yellow-200">"{r}"</span>{i < response.reasons.length - 1 ? ',' : ''}
    {"\n"}
  </span>
))}
  ]
{"\n}"}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sandbox;

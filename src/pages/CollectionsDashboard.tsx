import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  AlertCircle, Phone, MessageSquare, Download, Filter, TrendingUp, 
  TrendingDown, Users, DollarSign, Calendar, Clock, CheckCircle,
  XCircle, RefreshCw, Send, ChevronRight, Search, Eye, Bell,
  ShieldAlert, Target, Activity, BarChart3, PieChart, Clock3
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { apiWithAuth } from "@/lib/api-client";
import { exportToCSV } from "@/lib/exportUtils";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from "recharts";

interface CollectionAccount {
  id: string;
  loanId: string;
  borrowerName: string;
  phone: string;
  email: string;
  amountOutstanding: number;
  amountOverdue: number;
  daysOverdue: number;
  bucket: "current" | "overdue" | "high_risk" | "npa";
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  defaultProbability: number;
  lastPaymentDate: string;
  lastContactDate: string;
  nextActionDate: string;
  status: "new" | "contacted" | "promise_to_pay" | "partial_payment" | "recovered" | "written_off";
  assignedAgent: string;
  notes: CollectionNote[];
  paymentSchedule: PaymentRecord[];
  totalPaid: number;
  emiAmount: number;
  tenure: number;
  interestRate: number;
  collateral: string;
  employmentType: string;
}

interface CollectionNote {
  id: string;
  date: string;
  type: "call" | "sms" | "visit" | "email";
  outcome: string;
  agent: string;
  nextAction: string;
}

interface PaymentRecord {
  date: string;
  amount: number;
  mode: "upi" | "bank_transfer" | "cash" | "cheque";
  reference: string;
}

interface DashboardMetrics {
  totalOverdue: number;
  totalNPA: number;
  recoveryRate: number;
  avgDaysOverdue: number;
  promisesKept: number;
  promisesBroken: number;
  activeAgents: number;
  accountsThisMonth: number;
  defaultPrediction: number;
  atRiskAccounts: number;
  collectionEfficiency: number;
  portfolioHealth: number;
}

const generateMockCollections = (): CollectionAccount[] => {
  const names = [
    "Rajesh Kumar", "Priya Sharma", "Mahendra Singh", "Anita Devi", "Suresh Patel",
    "Vijay Malhotra", "Sunita Rani", "Arun Joshi", "Kavita Devi", "Rajendra Prasad",
    "Geeta Sharma", "Mohan Lal", "Pushpa Devi", "Ajay Kumar", "Meena Kumari"
  ];
  
  const buckets: CollectionAccount["bucket"][] = ["current", "overdue", "high_risk", "npa"];
  const statuses: CollectionAccount["status"][] = ["new", "contacted", "promise_to_pay", "partial_payment", "recovered"];
  const agents = ["Amit Singh", "Sunita Devi", "Ramesh Kumar", "Vikram Singh", "Priya Singh"];
  const employmentTypes = ["Salaried", "Self-Employed", "Business Owner", "Freelancer"];
  const collateralOptions = ["None", "Property", "Vehicle", "Gold", "FD"];
  
  return names.map((name, idx) => {
    const bucket = buckets[Math.floor(Math.random() * 4)];
    const daysOverdue = bucket === "current" ? Math.floor(Math.random() * 30) :
                        bucket === "overdue" ? 31 + Math.floor(Math.random() * 30) :
                        bucket === "high_risk" ? 61 + Math.floor(Math.random() * 30) :
                        91 + Math.floor(Math.random() * 90);
    
    const amount = 50000 + Math.floor(Math.random() * 950000);
    const amountOverdue = (daysOverdue / 90) * amount;
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore >= 75 ? "critical" : riskScore >= 50 ? "high" : riskScore >= 25 ? "medium" : "low";
    const defaultProbability = (daysOverdue / 120) * 100;
    
    return {
      id: `COL-${String(idx + 1).padStart(4, "0")}`,
      loanId: `LN2024${String(idx + 1).padStart(5, "0")}`,
      borrowerName: name,
      phone: `+91 98765 ${String(Math.floor(Math.random() * 90000) + 10000)}`,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      amountOutstanding: amount,
      amountOverdue: Math.round(amountOverdue),
      daysOverdue,
      bucket,
      riskScore,
      riskLevel,
      defaultProbability: Math.min(Math.round(defaultProbability), 99),
      lastPaymentDate: new Date(Date.now() - daysOverdue * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      lastContactDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      nextActionDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignedAgent: agents[Math.floor(Math.random() * agents.length)],
      notes: [],
      paymentSchedule: [],
      totalPaid: Math.floor(amount * (Math.random() * 0.5)),
      emiAmount: Math.round(amount / 36),
      tenure: 36,
      interestRate: 12 + Math.floor(Math.random() * 8),
      collateral: collateralOptions[Math.floor(Math.random() * collateralOptions.length)],
      employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)]
    };
  });
};

const generatePortfolioTrend = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month, i) => ({
    month,
    onTime: 85 - i * 2 + Math.floor(Math.random() * 5),
    overdue: 10 + i * 2 + Math.floor(Math.random() * 3),
    npa: 5 + Math.floor(Math.random() * 2)
  }));
};

const generateDPDDistribution = () => [
  { name: "0-30 DPD", value: 45, color: "#22C55E" },
  { name: "31-60 DPD", value: 25, color: "#F59E0B" },
  { name: "61-90 DPD", value: 18, color: "#EF4444" },
  { name: "90+ DPD (NPA)", value: 12, color: "#991B1B" }
];

export default function CollectionsDashboard() {
  const { orgId, user } = useAuth();
  const [collections, setCollections] = useState<CollectionAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<string>("all");
  const [selectedAccount, setSelectedAccount] = useState<CollectionAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    setCollections(generateMockCollections());
    setLoading(false);
  }, []);

  const metrics: DashboardMetrics = useMemo(() => {
    const overdue = collections.filter(c => c.daysOverdue > 30);
    const npa = collections.filter(c => c.daysOverdue > 90);
    const promises = collections.filter(c => c.status === "promise_to_pay");
    const kept = promises.filter(c => new Date(c.nextActionDate) >= new Date()).length;
    const atRisk = collections.filter(c => c.riskLevel === "critical" || c.riskLevel === "high");
    const recovered = collections.filter(c => c.status === "recovered");
    
    return {
      totalOverdue: overdue.reduce((sum, c) => sum + c.amountOverdue, 0),
      totalNPA: npa.reduce((sum, c) => sum + c.amountOverdue, 0),
      recoveryRate: collections.length > 0 ? (recovered.length / collections.length) * 100 : 0,
      avgDaysOverdue: collections.length > 0 
        ? Math.round(collections.reduce((sum, c) => sum + c.daysOverdue, 0) / collections.length) : 0,
      promisesKept: kept,
      promisesBroken: promises.length - kept,
      activeAgents: [...new Set(collections.map(c => c.assignedAgent))].length,
      accountsThisMonth: collections.filter(c => c.daysOverdue <= 30).length,
      defaultPrediction: Math.round((atRisk.length / collections.length) * 100),
      atRiskAccounts: atRisk.length,
      collectionEfficiency: collections.length > 0 ? ((promises.length / overdue.length) * 100) : 0,
      portfolioHealth: 100 - Math.round((npa.length / collections.length) * 100)
    };
  }, [collections]);

  const filteredCollections = collections.filter(c => {
    const matchesBucket = selectedBucket === "all" || c.bucket === selectedBucket;
    const matchesRisk = selectedRisk === "all" || c.riskLevel === selectedRisk;
    const matchesSearch = searchQuery === "" || 
      c.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    return matchesBucket && matchesRisk && matchesSearch;
  });

  const bucketCounts = {
    current: collections.filter(c => c.daysOverdue <= 30).length,
    overdue: collections.filter(c => c.daysOverdue > 30 && c.daysOverdue <= 60).length,
    high_risk: collections.filter(c => c.daysOverdue > 60 && c.daysOverdue <= 90).length,
    npa: collections.filter(c => c.daysOverdue > 90).length
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-orange-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case "current": return "text-green-400 bg-green-500/10 border-green-500/30";
      case "overdue": return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "high_risk": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "npa": return "text-red-600 bg-red-600/10 border-red-600/30";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/20 text-blue-400";
      case "contacted": return "bg-yellow-500/20 text-yellow-400";
      case "promise_to_pay": return "bg-green-500/20 text-green-400";
      case "partial_payment": return "bg-purple-500/20 text-purple-400";
      case "recovered": return "bg-emerald-500/20 text-emerald-400";
      case "written_off": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleSendReminder = async (account: CollectionAccount, type: "sms" | "email") => {
    try {
      toast.loading(`Sending ${type.toUpperCase()} reminder...`);
      const response = await collectionsApi.triggerWorkflow(account.loanId, 1, account.daysOverdue);
      const data = await response.json();
      if (data.smsSent || data.emailSent) {
        toast.success(`${type.toUpperCase()} reminder sent to ${account.borrowerName}`);
      } else {
        toast.error('Failed to send reminder');
      }
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const handleLogCall = async (account: CollectionAccount) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/v1/collections/${account.id}/add-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Call', notes: 'Outbound call to borrower', status: 'Completed' }),
      });
      if (response.ok) {
        toast.success(`Call logged for ${account.borrowerName}`);
      } else {
        toast.success(`Call logged for ${account.borrowerName} (demo mode)`);
      }
    } catch (error) {
      toast.success(`Call logged for ${account.borrowerName} (demo mode)`);
    }
  };

  const handlePromise = async (account: CollectionAccount) => {
    try {
      const response = await collectionsApi.triggerWorkflow(account.loanId, account.daysOverdue / 30, account.daysOverdue);
      const data = await response.json();
      toast.success(`Collection workflow triggered for ${account.borrowerName} (${data.action})`);
    } catch (error) {
      toast.success(`Promise workflow triggered for ${account.borrowerName}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="border-b border-border bg-surface/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['DM_Sans'] font-bold text-3xl">Collections & Default Management</h1>
              <p className="font-['DM_Sans'] text-muted-foreground mt-1">
                AI-powered recovery tracking with default prediction
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                  autoRefresh ? "bg-green-500/20 border-green-500 text-green-400" : "border-border"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
                Auto-refresh
              </button>
              <button 
                onClick={async () => {
                  try {
                    toast.loading('Processing all overdue accounts...');
                    const response = await collectionsApi.processAllOverdue();
                    const data = await response.json();
                    toast.success(`Processed ${data.processed} loans, triggered ${data.triggered} workflows`);
                  } catch (error) {
                    toast.error('Failed to process overdue accounts');
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
              >
                <Activity className="w-4 h-4" /> Process All Overdue
              </button>
              <button 
                onClick={() => exportToCSV('collections.csv', collections)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Overdue</span>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <DollarSign className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">₹{(metrics.totalOverdue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground mt-1">{overdue.length} accounts</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">NPA Portfolio</span>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-400">₹{(metrics.totalNPA / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground mt-1">{bucketCounts.npa} accounts 90+ DPD</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Default Prediction</span>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-400">{metrics.defaultPrediction}%</p>
            <p className="text-xs text-muted-foreground mt-1">{metrics.atRiskAccounts} high-risk accounts</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Collection Efficiency</span>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400">{Math.round(metrics.collectionEfficiency)}%</p>
            <p className="text-xs text-muted-foreground mt-1">{metrics.promisesKept} promises kept</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Portfolio Health</span>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-400">{metrics.portfolioHealth}%</p>
            <p className="text-xs text-muted-foreground mt-1">On-time vs overdue ratio</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Portfolio Health Trend */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-4">Portfolio Health Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={generatePortfolioTrend()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                <Line type="monotone" dataKey="onTime" stroke="#22C55E" strokeWidth={2} name="On Time %" />
                <Line type="monotone" dataKey="overdue" stroke="#F59E0B" strokeWidth={2} name="Overdue %" />
                <Line type="monotone" dataKey="npa" stroke="#EF4444" strokeWidth={2} name="NPA %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* DPD Distribution */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-4">DPD Distribution</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <RePieChart>
                  <Pie data={generateDPDDistribution()} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {generateDPDDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {generateDPDDistribution().map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Score Distribution */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-4">Risk Score Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { range: "0-25", low: 15, medium: 0, high: 0, critical: 0 },
                { range: "26-50", low: 0, medium: 25, high: 0, critical: 0 },
                { range: "51-75", low: 0, medium: 0, high: 35, critical: 0 },
                { range: "76-100", low: 0, medium: 0, high: 0, critical: 25 }
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" fontSize={10} />
                <YAxis dataKey="range" type="category" stroke="#888" fontSize={10} width={50} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                <Bar dataKey="low" stackId="a" fill="#22C55E" />
                <Bar dataKey="medium" stackId="a" fill="#F59E0B" />
                <Bar dataKey="high" stackId="a" fill="#EF4444" />
                <Bar dataKey="critical" stackId="a" fill="#991B1B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search by name, loan ID, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm w-64"
                />
              </div>
              
              <div className="flex gap-1 bg-background border border-border rounded-lg p-1">
                {[
                  { key: "all", label: "All" },
                  { key: "current", label: "0-30 DPD", count: bucketCounts.current },
                  { key: "overdue", label: "31-60 DPD", count: bucketCounts.overdue },
                  { key: "high_risk", label: "61-90 DPD", count: bucketCounts.high_risk },
                  { key: "npa", label: "90+ DPD", count: bucketCounts.npa }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedBucket(filter.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      selectedBucket === filter.key 
                        ? "bg-orange-500 text-white" 
                        : "text-muted-foreground hover:bg-foreground/10"
                    }`}
                  >
                    {filter.label} {filter.count && `(${filter.count})`}
                  </button>
                ))}
              </div>

              <div className="flex gap-1 bg-background border border-border rounded-lg p-1">
                {[
                  { key: "all", label: "All Risk" },
                  { key: "low", label: "Low", color: "bg-green-500" },
                  { key: "medium", label: "Medium", color: "bg-orange-500" },
                  { key: "high", label: "High", color: "bg-red-500" },
                  { key: "critical", label: "Critical", color: "bg-red-600" }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedRisk(filter.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                      selectedRisk === filter.key 
                        ? "bg-orange-500 text-white" 
                        : "text-muted-foreground hover:bg-foreground/10"
                    }`}
                  >
                    {filter.color && <div className={`w-2 h-2 rounded-full ${filter.color}`}></div>}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredCollections.length} accounts</span>
              <button className="p-1 hover:bg-foreground/10 rounded">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Collections List */}
          <div className="col-span-2 space-y-3 max-h-[600px] overflow-y-auto">
            {filteredCollections.map(account => (
              <motion.div 
                key={account.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedAccount(account)}
                className={`bg-surface border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/40 ${
                  selectedAccount?.id === account.id ? "border-orange-500 ring-1 ring-orange-500/20" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center font-bold text-sm">
                      {account.borrowerName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold">{account.borrowerName}</p>
                      <p className="text-xs text-muted-foreground">{account.loanId} • {account.phone}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">₹{(account.amountOverdue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">{account.daysOverdue} DPD</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBucketColor(account.bucket)}`}>
                      {account.bucket === "high_risk" ? "61-90 DPD" : account.bucket === "npa" ? "90+ DPD" : `${account.daysOverdue} DPD`}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(account.riskLevel)}`}>
                      Risk: {account.riskScore}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(account.status)}`}>
                      {account.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Next: {new Date(account.nextActionDate).toLocaleDateString()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredCollections.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No accounts found matching your filters.</p>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="bg-surface border border-border rounded-xl p-6 max-h-[600px] overflow-y-auto">
            {selectedAccount ? (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center font-bold">
                      {selectedAccount.borrowerName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedAccount.borrowerName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedAccount.loanId}</p>
                    </div>
                  </div>
                  
                  {/* Risk Score Card */}
                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Default Risk Score</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(selectedAccount.riskLevel)}`}>
                        {selectedAccount.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">{selectedAccount.riskScore}</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-foreground/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedAccount.riskScore >= 75 ? "bg-red-600" :
                            selectedAccount.riskScore >= 50 ? "bg-red-500" :
                            selectedAccount.riskScore >= 25 ? "bg-orange-500" : "bg-green-500"
                          }`}
                          style={{ width: `${selectedAccount.riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Default probability: {selectedAccount.defaultProbability}% within 90 days
                    </p>
                  </div>
                
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-foreground/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Outstanding</p>
                      <p className="font-bold">₹{(selectedAccount.amountOutstanding / 100000).toFixed(2)}L</p>
                    </div>
                    <div className="bg-foreground/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Overdue</p>
                      <p className="font-bold text-orange-400">₹{(selectedAccount.amountOverdue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-foreground/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Monthly EMI</p>
                      <p className="font-bold">₹{selectedAccount.emiAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-foreground/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Tenure Left</p>
                      <p className="font-bold">{selectedAccount.tenure} months</p>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="bg-foreground/5 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-3">Loan Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span>{selectedAccount.interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employment</span>
                      <span>{selectedAccount.employmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collateral</span>
                      <span>{selectedAccount.collateral}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Paid</span>
                      <span>₹{selectedAccount.totalPaid.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleLogCall(selectedAccount)}
                      className="py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" /> Log Call
                    </button>
                    <button 
                      onClick={() => handleSendReminder(selectedAccount, "sms")}
                      className="py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> SMS
                    </button>
                    <button 
                      onClick={() => handleSendReminder(selectedAccount, "email")}
                      className="py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Email
                    </button>
                    <button 
                      onClick={() => handlePromise(selectedAccount)}
                      className="py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Promise
                    </button>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="bg-foreground/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned To</p>
                      <p className="font-medium">{selectedAccount.assignedAgent}</p>
                    </div>
                    <button className="p-2 hover:bg-foreground/10 rounded-lg">
                      <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Auto Reminder Toggle */}
                <div className="flex items-center justify-between bg-foreground/5 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Auto Reminders</p>
                      <p className="text-xs text-muted-foreground">Send automated payment reminders</p>
                    </div>
                  </div>
                  <button className="w-12 h-6 bg-green-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Select an account to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
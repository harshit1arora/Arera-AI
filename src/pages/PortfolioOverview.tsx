import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Building2, TrendingUp, TrendingDown, DollarSign, Users, Calendar,
  PieChart, BarChart3, Activity, Clock, CheckCircle, AlertTriangle,
  Download, Filter, Search, Eye, ArrowUpRight, ArrowDownRight,
  CreditCard, MapPin, Briefcase, Shield, Percent
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell,
  AreaChart, Area
} from "recharts";

interface Loan {
  id: string;
  borrowerName: string;
  loanAmount: number;
  disbursedAmount: number;
  outstandingAmount: number;
  emiAmount: number;
  tenure: number;
  tenureRemaining: number;
  interestRate: number;
  status: "active" | "repaid" | "default" | "NPA";
  emiStatus: "current" | "0-30" | "30-60" | "60-90" | "90+";
  startDate: string;
  nextPaymentDate: string;
  lastPaymentDate: string;
  creditScore: number;
  employmentType: string;
  city: string;
  purpose: string;
  collateral: string;
  interestEarned: number;
  profit: number;
}

const generateLoans = (): Loan[] => {
  const names = [
    "Rajesh Kumar", "Priya Sharma", "Mahendra Singh", "Anita Devi", "Suresh Patel",
    "Vijay Malhotra", "Sunita Rani", "Arun Joshi", "Kavita Devi", "Rajendra Prasad",
    "Geeta Sharma", "Mohan Lal", "Pushpa Devi", "Ajay Kumar", "Meena Kumari",
    "Vikram Singh", "Anil Kumar", "Ramesh Gupta", "Sanjay Sharma", "Vijay Kumar",
    "Deepak Sharma", "Poonam Devi", "Sanjeev Kapoor", "Rekha Singh", "Gaurav Mishra"
  ];
  
  const purposes = ["Personal", "Home", "Business", "Vehicle", "Education"];
  const employmentTypes = ["Salaried", "Self-Employed", "Business Owner", "Freelancer"];
  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];
  const statuses: Loan["status"][] = ["active", "active", "active", "active", "repaid", "NPA"];
  const emiStatuses: Loan["emiStatus"][] = ["current", "current", "current", "0-30", "30-60", "60-90"];
  const collaterals = ["None", "Property", "Vehicle", "Gold", "FD"];
  
  return names.map((name, idx) => {
    const loanAmount = Math.floor(Math.random() * 900000) + 50000;
    const tenure = Math.floor(Math.random() * 36) + 6;
    const monthsElapsed = Math.floor(Math.random() * tenure);
    const interestRate = 10 + Math.floor(Math.random() * 8);
    const emiAmount = Math.round(loanAmount / tenure);
    const interestEarned = Math.round(loanAmount * interestRate * (monthsElapsed / 1200));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const emiStatus = emiStatuses[Math.floor(Math.random() * emiStatuses.length)];
    
    return {
      id: `LN${String(idx + 1).padStart(5, "0")}`,
      borrowerName: name,
      loanAmount,
      disbursedAmount: loanAmount,
      outstandingAmount: status === "repaid" ? 0 : Math.round(loanAmount * (1 - monthsElapsed/tenure)),
      emiAmount,
      tenure,
      tenureRemaining: Math.max(0, tenure - monthsElapsed),
      interestRate,
      status,
      emiStatus,
      startDate: new Date(Date.now() - monthsElapsed * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      nextPaymentDate: new Date(Date.now() + Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      lastPaymentDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      creditScore: 500 + Math.floor(Math.random() * 250),
      employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      collateral: collaterals[Math.floor(Math.random() * collaterals.length)],
      interestEarned,
      profit: Math.round(interestEarned * 0.7)
    };
  });
};

const generateMonthlyTrend = () => [
  { month: "Oct", disbursed: 4500000, outstanding: 8200000, repaid: 1200000 },
  { month: "Nov", disbursed: 5200000, outstanding: 9500000, repaid: 1400000 },
  { month: "Dec", disbursed: 4800000, outstanding: 10200000, repaid: 1500000 },
  { month: "Jan", disbursed: 5800000, outstanding: 11800000, repaid: 1800000 },
  { month: "Feb", disbursed: 6200000, outstanding: 13200000, repaid: 2000000 },
  { month: "Mar", disbursed: 7000000, outstanding: 15200000, repaid: 2200000 },
];

const generateSectorDistribution = () => [
  { name: "Personal Loans", value: 35, color: "#3B82F6" },
  { name: "Business Loans", value: 28, color: "#22C55E" },
  { name: "Home Loans", value: 20, color: "#F59E0B" },
  { name: "Vehicle Loans", value: 12, color: "#8B5CF6" },
  { name: "Education", value: 5, color: "#EC4899" },
];

const generateIncomeSegmentation = () => [
  { range: "<50K", count: 45, percentage: 18 },
  { range: "50K-1L", count: 85, percentage: 34 },
  { range: "1L-2L", count: 75, percentage: 30 },
  { range: "2L-5L", count: 35, percentage: 14 },
  { range: ">5L", count: 10, percentage: 4 },
];

export default function PortfolioOverview() {
  const { orgId, user } = useAuth();
  const [loans] = useState<Loan[]>(generateLoans);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const metrics = useMemo(() => {
    const activeLoans = loans.filter(l => l.status === "active");
    const totalAUM = activeLoans.reduce((sum, l) => sum + l.outstandingAmount, 0);
    const disbursed = loans.reduce((sum, l) => sum + l.disbursedAmount, 0);
    const repaid = loans.filter(l => l.status === "repaid").reduce((sum, l) => sum + l.disbursedAmount, 0);
    const totalInterest = loans.reduce((sum, l) => sum + l.interestEarned, 0);
    const npaLoans = loans.filter(l => l.status === "NPA");
    const overdueLoans = loans.filter(l => l.emiStatus !== "current");
    
    const emiBuckets = {
      current: loans.filter(l => l.emiStatus === "current").length,
      "0-30": loans.filter(l => l.emiStatus === "0-30").length,
      "30-60": loans.filter(l => l.emiStatus === "30-60").length,
      "60-90": loans.filter(l => l.emiStatus === "60-90").length,
      "90+": loans.filter(l => l.emiStatus === "90+").length
    };
    
    return {
      totalLoans: loans.length,
      activeLoans: activeLoans.length,
      totalAUM,
      disbursed,
      repaid,
      totalInterest,
      defaultRate: loans.length > 0 ? ((npaLoans.length / loans.length) * 100).toFixed(1) : "0",
      npaAmount: npaLoans.reduce((sum, l) => sum + l.outstandingAmount, 0),
      overdueLoans: overdueLoans.length,
      avgTicketSize: activeLoans.length > 0 ? Math.round(totalAUM / activeLoans.length) : 0,
      monthlyEMI: activeLoans.reduce((sum, l) => sum + l.emiAmount, 0),
      emiBuckets
    };
  }, [loans]);

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = searchQuery === "" || 
      loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "repaid": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "NPA": return "bg-red-600/20 text-red-600 border-red-600/30";
      case "default": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getEMIStatusColor = (status: string) => {
    switch (status) {
      case "current": return "text-green-400";
      case "0-30": return "text-yellow-400";
      case "30-60": return "text-orange-400";
      case "60-90": return "text-red-400";
      case "90+": return "text-red-600";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="border-b border-border bg-surface/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['DM_Sans'] font-bold text-3xl">Loan Portfolio Overview</h1>
              <p className="font-['DM_Sans'] text-muted-foreground mt-1">
                AUM tracking, borrower segmentation, and portfolio health
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-border rounded-lg flex items-center gap-2 hover:bg-foreground/10">
                <Download className="w-4 h-4" /> Export Report
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
              <span className="text-sm text-muted-foreground">Total AUM</span>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">₹{(metrics.totalAUM / 10000000).toFixed(2)}Cr</p>
            <p className="text-xs text-muted-foreground mt-1">{metrics.activeLoans} active loans</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Disbursed</span>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">₹{(metrics.disbursed / 10000000).toFixed(2)}Cr</p>
            <p className="text-xs text-muted-foreground mt-1">+12% this month</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Interest Earned</span>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Percent className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-400">₹{(metrics.totalInterest / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground mt-1">Total profit: ₹{(metrics.totalInterest * 0.7 / 100000).toFixed(1)}L</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">NPA Ratio</span>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-400">{metrics.defaultRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">₹{(metrics.npaAmount / 100000).toFixed(1)}L in NPA</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Monthly EMI</span>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <CreditCard className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">₹{(metrics.monthlyEMI / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground mt-1">Collection target</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Portfolio Growth */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-4">6-Month Portfolio Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={generateMonthlyTrend()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={10} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                <Area type="monotone" dataKey="outstanding" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Outstanding" />
                <Area type="monotone" dataKey="disbursed" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} name="Disbursed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Distribution */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-4">Loan Purpose Distribution</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <RePieChart>
                  <Pie data={generateSectorDistribution()} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {generateSectorDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {generateSectorDistribution().map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EMI Bucket Distribution */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-4">EMI Payment Status</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { status: "Current", count: metrics.emiBuckets.current, color: "#22C55E" },
                { status: "0-30 DPD", count: metrics.emiBuckets["0-30"], color: "#EAB308" },
                { status: "30-60 DPD", count: metrics.emiBuckets["30-60"], color: "#F97316" },
                { status: "60-90 DPD", count: metrics.emiBuckets["60-90"], color: "#EF4444" },
                { status: "90+ DPD", count: metrics.emiBuckets["90+"], color: "#991B1B" },
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" fontSize={10} />
                <YAxis dataKey="status" type="category" stroke="#888" fontSize={10} width={80} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                <Bar dataKey="count" name="Accounts">
                  {[
                    { status: "Current", count: metrics.emiBuckets.current, color: "#22C55E" },
                    { status: "0-30 DPD", count: metrics.emiBuckets["0-30"], color: "#EAB308" },
                    { status: "30-60 DPD", count: metrics.emiBuckets["30-60"], color: "#F97316" },
                    { status: "60-90 DPD", count: metrics.emiBuckets["60-90"], color: "#EF4444" },
                    { status: "90+ DPD", count: metrics.emiBuckets["90+"], color: "#991B1B" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
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
                  placeholder="Search by name, loan ID, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm w-64"
                />
              </div>
              
              <div className="flex gap-1 bg-background border border-border rounded-lg p-1">
                {[
                  { key: "all", label: "All" },
                  { key: "active", label: "Active" },
                  { key: "repaid", label: "Repaid" },
                  { key: "NPA", label: "NPA" }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      statusFilter === filter.key 
                        ? "bg-orange-500 text-white" 
                        : "text-muted-foreground hover:bg-foreground/10"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-sm text-muted-foreground">{filteredLoans.length} loans</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Loans List */}
          <div className="col-span-2 space-y-3 max-h-[500px] overflow-y-auto">
            {filteredLoans.map(loan => (
              <motion.div 
                key={loan.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedLoan(loan)}
                className={`bg-surface border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/40 ${
                  selectedLoan?.id === loan.id ? "border-orange-500 ring-1 ring-orange-500/20" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center font-bold text-sm">
                      {loan.borrowerName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold">{loan.borrowerName}</p>
                      <p className="text-xs text-muted-foreground">{loan.id} • {loan.city}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">₹{(loan.outstandingAmount / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">₹{loan.emiAmount.toLocaleString()}/mo</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEMIStatusColor(loan.emiStatus)}`}>
                      {loan.emiStatus === "current" ? "Current" : `${loan.emiStatus} DPD`}
                    </span>
                    <span className="text-xs text-muted-foreground">{loan.tenureRemaining} mo left</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Next: {new Date(loan.nextPaymentDate).toLocaleDateString()}</span>
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="bg-surface border border-border rounded-xl p-6 max-h-[500px] overflow-y-auto">
            {selectedLoan ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center font-bold">
                      {selectedLoan.borrowerName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedLoan.borrowerName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedLoan.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-foreground/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Loan Amount</p>
                      <p className="font-bold">₹{(selectedLoan.loanAmount / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="bg-foreground/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Outstanding</p>
                      <p className="font-bold text-orange-400">₹{(selectedLoan.outstandingAmount / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="bg-foreground/5 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-3">Loan Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purpose</span>
                      <span>{selectedLoan.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span>{selectedLoan.interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly EMI</span>
                      <span>₹{selectedLoan.emiAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tenure Remaining</span>
                      <span>{selectedLoan.tenureRemaining} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employment</span>
                      <span>{selectedLoan.employmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collateral</span>
                      <span>{selectedLoan.collateral}</span>
                    </div>
                  </div>
                </div>

                {/* Financials */}
                <div className="bg-foreground/5 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-3">Financial Summary</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-green-400">₹{(selectedLoan.interestEarned / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">Interest Earned</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">{selectedLoan.creditScore}</p>
                      <p className="text-xs text-muted-foreground">Credit Score</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-foreground/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Next Payment</span>
                    <span className="font-medium">{new Date(selectedLoan.nextPaymentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Payment</span>
                    <span className="font-medium">{new Date(selectedLoan.lastPaymentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Select a loan to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
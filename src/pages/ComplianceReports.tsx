import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Download, Calendar, Shield, CheckCircle, XCircle, 
  AlertTriangle, Clock, Building2, Users, DollarSign, TrendingUp,
  Filter, Search, Eye, ChevronDown, Printer, Mail, FileSpreadsheet,
  Activity, ClipboardList, BarChart3, PieChart
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { exportToCSV } from "@/lib/exportUtils";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName: string;
  entityType: "loan" | "application" | "policy" | "user" | "report";
  entityId: string;
  details: string;
  ipAddress: string;
  status: "success" | "failed" | "warning";
}

interface PolicyViolation {
  id: string;
  timestamp: string;
  ruleName: string;
  entityType: string;
  entityId: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  resolved: boolean;
  resolvedBy: string | null;
  resolvedAt: string | null;
}

interface ComplianceReport {
  id: string;
  name: string;
  type: "lending_statistics" | "disbursement" | "compliance" | "audit" | "tax" | "custom";
  period: string;
  generatedAt: string;
  status: "ready" | "generating" | "failed";
  size: string;
  format: "pdf" | "excel" | "csv";
}

interface LoanDecision {
  id: string;
  loanId: string;
  applicantName: string;
  decision: "approved" | "rejected";
  score: number;
  rulesApplied: string[];
  incomeBracket: string;
  timestamp: string;
}

const generateAuditLogs = (): AuditLog[] => {
  const actions = [
    "Loan application submitted", "Credit decision made", "Loan disbursed", 
    "EMI payment received", "Policy rule updated", "User login", 
    "Report generated", "KYC verified", "Document uploaded", "Status changed"
  ];
  const users = ["Admin User", "Loan Officer", "System Admin", "Compliance Officer", "API User"];
  const entityTypes: AuditLog["entityType"][] = ["loan", "application", "policy", "user", "report"];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `AUD-${String(i + 1).padStart(5, "0")}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    action: actions[Math.floor(Math.random() * actions.length)],
    userId: `USR-${Math.floor(Math.random() * 100) + 1}`,
    userName: users[Math.floor(Math.random() * users.length)],
    entityType: entityTypes[Math.floor(Math.random() * entityTypes.length)],
    entityId: `LN${Math.floor(Math.random() * 100000)}`,
    details: "Action completed successfully",
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    status: Math.random() > 0.9 ? "failed" : Math.random() > 0.95 ? "warning" : "success" as const
  }));
};

const generateViolations = (): PolicyViolation[] => {
  const rules = [
    "Income below minimum threshold", "Multiple high-risk flags", 
    "Duplicate application detected", "Age outside allowed range",
    "Missing required documents", "Employment verification failed",
    "Credit score below minimum", "Address verification failed"
  ];
  const severities: PolicyViolation["severity"][] = ["critical", "high", "medium", "low"];
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `VIO-${String(i + 1).padStart(4, "0")}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString(),
    ruleName: rules[Math.floor(Math.random() * rules.length)],
    entityType: "loan_application",
    entityId: `APP${Math.floor(Math.random() * 100000)}`,
    severity: severities[Math.floor(Math.random() * 4)],
    description: "Policy rule violation detected during underwriting",
    resolved: Math.random() > 0.3,
    resolvedBy: Math.random() > 0.3 ? "Admin User" : null,
    resolvedAt: Math.random() > 0.3 ? new Date().toISOString() : null
  }));
};

const generateReports = (): ComplianceReport[] => [
  { id: "RPT-001", name: "Monthly Lending Statistics", type: "lending_statistics", period: "March 2024", generatedAt: "2024-04-01", status: "ready", size: "2.4 MB", format: "pdf" },
  { id: "RPT-002", name: "Disbursement Report", type: "disbursement", period: "Q1 2024", generatedAt: "2024-04-05", status: "ready", size: "1.8 MB", format: "excel" },
  { id: "RPT-003", name: "RBI Compliance Certificate", type: "compliance", period: "March 2024", generatedAt: "2024-04-10", status: "ready", size: "856 KB", format: "pdf" },
  { id: "RPT-004", name: "Audit Trail Export", type: "audit", period: "Full Year 2023", generatedAt: "2024-01-15", status: "ready", size: "15.2 MB", format: "csv" },
  { id: "RPT-005", name: "GST Compliance Report", type: "tax", period: "Q4 2023", generatedAt: "2024-01-20", status: "ready", size: "1.2 MB", format: "excel" },
  { id: "RPT-006", name: "NPA Analysis Report", type: "compliance", period: "March 2024", generatedAt: "2024-04-12", status: "generating", size: "-", format: "pdf" },
];

const generateDecisions = (): LoanDecision[] => {
  const names = ["Rajesh Kumar", "Priya Sharma", "Mahendra Singh", "Anita Devi", "Suresh Patel"];
  const brackets = ["<50K", "50K-1L", "1L-2L", "2L-5L", ">5L"];
  
  return Array.from({ length: 30 }, (_, i) => {
    const approved = Math.random() > 0.35;
    return {
      id: `DEC-${String(i + 1).padStart(5, "0")}`,
      loanId: `LN${Math.floor(Math.random() * 100000)}`,
      applicantName: names[Math.floor(Math.random() * names.length)],
      decision: approved ? "approved" : "rejected",
      score: approved ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 10,
      rulesApplied: ["Income Check", "Credit Score", "Employment Verification"].slice(0, Math.floor(Math.random() * 3) + 1),
      incomeBracket: brackets[Math.floor(Math.random() * brackets.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

const generateMonthlyStats = () => [
  { month: "Oct", approved: 145, rejected: 55, total: 200 },
  { month: "Nov", approved: 168, rejected: 62, total: 230 },
  { month: "Dec", approved: 152, rejected: 48, total: 200 },
  { month: "Jan", approved: 189, rejected: 71, total: 260 },
  { month: "Feb", approved: 175, rejected: 65, total: 240 },
  { month: "Mar", approved: 198, rejected: 52, total: 250 },
];

const generateIncomeDistribution = () => [
  { bracket: "<50K", approved: 45, rejected: 35, rate: 56 },
  { bracket: "50K-1L", approved: 78, rejected: 22, rate: 78 },
  { bracket: "1L-2L", approved: 85, rejected: 15, rate: 85 },
  { bracket: "2L-5L", approved: 92, rejected: 8, rate: 92 },
  { bracket: ">5L", approved: 96, rejected: 4, rate: 96 },
];

export default function ComplianceReports() {
  const { orgId, user } = useAuth();
  const [auditLogs] = useState<AuditLog[]>(generateAuditLogs());
  const [violations] = useState<PolicyViolation[]>(generateViolations());
  const [reports] = useState<ComplianceReport[]>(generateReports());
  const [decisions] = useState<LoanDecision[]>(generateDecisions());
  const [activeTab, setActiveTab] = useState<"audit" | "violations" | "reports" | "statistics">("audit");
  const [searchQuery, setSearchQuery] = useState("");

  const metrics = useMemo(() => {
    const totalDecisions = decisions.length;
    const approved = decisions.filter(d => d.decision === "approved").length;
    const pendingViolations = violations.filter(v => !v.resolved).length;
    const criticalViolations = violations.filter(v => v.severity === "critical" && !v.resolved).length;
    
    return {
      totalDecisions,
      approvalRate: Math.round((approved / totalDecisions) * 100),
      totalAuditLogs: auditLogs.length,
      violationsFound: violations.length,
      pendingViolations,
      criticalViolations,
      reportsReady: reports.filter(r => r.status === "ready").length
    };
  }, [auditLogs, violations, reports, decisions]);

  const filteredLogs = auditLogs.filter(log => 
    searchQuery === "" ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityId.includes(searchQuery)
  );

  const filteredViolations = violations.filter(v => 
    searchQuery === "" ||
    v.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.entityId.includes(searchQuery)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-orange-500 text-white";
      case "low": return "bg-yellow-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="border-b border-border bg-surface/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['DM_Sans'] font-bold text-3xl">Compliance & Reporting</h1>
              <p className="font-['DM_Sans'] text-muted-foreground mt-1">
                RBI audit trail, policy compliance, and regulatory reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-border rounded-lg flex items-center gap-2 hover:bg-foreground/10">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="px-4 py-2 border border-border rounded-lg flex items-center gap-2 hover:bg-foreground/10">
                <Mail className="w-4 h-4" /> Email Report
              </button>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Generate New Report
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
              <span className="text-sm text-muted-foreground">Total Decisions</span>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ClipboardList className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{metrics.totalDecisions}</p>
            <p className="text-xs text-muted-foreground mt-1">This period</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Approval Rate</span>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400">{metrics.approvalRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">RBI target: 70%+</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Audit Logs</span>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{metrics.totalAuditLogs}</p>
            <p className="text-xs text-muted-foreground mt-1">30-day trail</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Violations</span>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-400">{metrics.pendingViolations}</p>
            <p className="text-xs text-muted-foreground mt-1">{metrics.criticalViolations} critical</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Reports Ready</span>
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <FileText className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{metrics.reportsReady}</p>
            <p className="text-xs text-muted-foreground mt-1">Available for download</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-background border border-border rounded-lg p-1 mb-6 w-fit">
          {[
            { key: "audit", label: "Audit Trail", icon: Activity },
            { key: "violations", label: "Policy Violations", icon: Shield },
            { key: "reports", label: "Generated Reports", icon: FileText },
            { key: "statistics", label: "Lending Statistics", icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                  activeTab === tab.key 
                    ? "bg-orange-500 text-white" 
                    : "text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="bg-surface border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder={`Search ${activeTab === "audit" ? "audit logs" : activeTab === "violations" ? "violations" : "reports"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm w-full max-w-md"
              />
            </div>
            {activeTab === "statistics" && (
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" /> Export Statistics
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === "audit" && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-foreground/5 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold">Timestamp</th>
                  <th className="text-left p-4 text-sm font-semibold">Action</th>
                  <th className="text-left p-4 text-sm font-semibold">User</th>
                  <th className="text-left p-4 text-sm font-semibold">Entity</th>
                  <th className="text-left p-4 text-sm font-semibold">Details</th>
                  <th className="text-left p-4 text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.slice(0, 20).map(log => (
                  <tr key={log.id} className="border-t border-border hover:bg-foreground/5">
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-medium">{log.action}</td>
                    <td className="p-4 text-sm">{log.userName}</td>
                    <td className="p-4 text-sm">
                      <span className="text-muted-foreground">{log.entityType}</span>
                      <span className="ml-2 font-mono text-xs">{log.entityId}</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{log.details}</td>
                    <td className="p-4">{getStatusIcon(log.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-border text-center">
              <button className="text-sm text-orange-500 hover:underline">View all {auditLogs.length} audit logs →</button>
            </div>
          </div>
        )}

        {activeTab === "violations" && (
          <div className="space-y-4">
            {filteredViolations.map(violation => (
              <div 
                key={violation.id}
                className={`bg-surface border rounded-xl p-4 ${
                  violation.resolved 
                    ? "border-border opacity-60" 
                    : violation.severity === "critical" || violation.severity === "high"
                    ? "border-red-500/30" 
                    : "border-orange-500/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                      {violation.severity.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{violation.ruleName}</p>
                      <p className="text-sm text-muted-foreground">
                        Entity: {violation.entityId} • {new Date(violation.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {violation.resolved ? (
                      <span className="text-green-400 text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Resolved
                      </span>
                    ) : (
                      <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-foreground/5 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold">Report Name</th>
                  <th className="text-left p-4 text-sm font-semibold">Type</th>
                  <th className="text-left p-4 text-sm font-semibold">Period</th>
                  <th className="text-left p-4 text-sm font-semibold">Generated</th>
                  <th className="text-left p-4 text-sm font-semibold">Size</th>
                  <th className="text-left p-4 text-sm font-semibold">Format</th>
                  <th className="text-left p-4 text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id} className="border-t border-border hover:bg-foreground/5">
                    <td className="p-4 text-sm font-medium">{report.name}</td>
                    <td className="p-4 text-sm text-muted-foreground capitalize">{report.type.replace("_", " ")}</td>
                    <td className="p-4 text-sm">{report.period}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm">{report.size}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-foreground/10 rounded text-xs uppercase">{report.format}</span>
                    </td>
                    <td className="p-4">
                      <button className="text-orange-500 hover:underline text-sm flex items-center gap-1">
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="grid grid-cols-2 gap-6">
            {/* Monthly Decisions */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Monthly Lending Decisions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={generateMonthlyStats()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                  <Legend />
                  <Bar dataKey="approved" fill="#22C55E" name="Approved" />
                  <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Approval Rate by Income */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Approval Rate by Income Bracket</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={generateIncomeDistribution()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#888" />
                  <YAxis dataKey="bracket" type="category" stroke="#888" width={80} />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                  <Bar dataKey="rate" fill="#3B82F6" name="Approval Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* RBI Compliance Metrics */}
            <div className="col-span-2 bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">RBI Compliance Metrics</h3>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-sm text-muted-foreground">KYC Compliance</p>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">96.2%</p>
                  <p className="text-sm text-muted-foreground">Lending Norms</p>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">99.1%</p>
                  <p className="text-sm text-muted-foreground">Interest Rate Cap</p>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">97.8%</p>
                  <p className="text-sm text-muted-foreground">Margin Limits</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
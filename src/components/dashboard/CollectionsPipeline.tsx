import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Phone, MessageSquare, Briefcase, Filter } from "lucide-react";
import { toast } from "sonner";
import { apiWithAuth } from "../../lib/api-client";
import { exportToCSV } from "../../lib/exportUtils";
import { Download } from "lucide-react";

export default function CollectionsPipeline({ orgId }: { orgId: string | null }) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;
    const fetchCollections = async () => {
      try {
        const res = await apiWithAuth('/v1/collections');
        if (res.ok) {
          const data = await res.json();
          setCollections(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [orgId]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Collections Pipeline</h1>
          <p className="text-muted-foreground mt-1">Data-driven recovery tracking and NPA management.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 border border-border rounded-xl bg-background text-xs font-bold uppercase tracking-widest flex items-center gap-2">
             <Filter size={14} /> Filter 30/60/90+ DPD
           </button>
           <button onClick={() => exportToCSV('collections.csv', collections)} className="px-4 py-2 border border-border rounded-xl bg-background hover:bg-foreground/10 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
             <Download size={14} /> Export CSV
           </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {['Overdue (1-30 Days)', 'High Risk (31-89 Days)', 'NPA (90+ Days)'].map((bucket, idx) => (
           <div key={bucket} className="glass-panel bg-secondary/10 border border-white/5 p-6 rounded-3xl min-h-[400px]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                 <h3 className="font-black text-sm uppercase tracking-widest">{bucket}</h3>
                 <span className="bg-background px-2 py-1 rounded text-xs font-bold">
                   {collections.filter(c => 
                     (idx === 0 && c.daysOverdue <= 30) || 
                     (idx === 1 && c.daysOverdue > 30 && c.daysOverdue < 90) || 
                     (idx === 2 && c.daysOverdue >= 90)
                   ).length}
                 </span>
              </div>

              <div className="space-y-4">
                 {collections.filter(c => 
                     (idx === 0 && c.daysOverdue <= 30) || 
                     (idx === 1 && c.daysOverdue > 30 && c.daysOverdue < 90) || 
                     (idx === 2 && c.daysOverdue >= 90)
                   ).map(c => (
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} key={c.id} className="bg-background border border-border p-4 rounded-2xl hover:border-primary/40 cursor-pointer transition-all">
                      <div className="flex justify-between items-start mb-2">
                         <div className="font-bold text-sm">Loan #{c.loanId.substring(0,6)}</div>
                         <div className="text-xs font-black text-red-500">{c.daysOverdue} DPD</div>
                      </div>
                      <div className="text-xl font-display font-bold mb-3">₹{c.amountOutstanding.toLocaleString()}</div>
                      <div className="flex gap-2">
                         <button className="flex-1 py-1.5 bg-secondary hover:bg-muted text-xs font-bold rounded flex items-center justify-center gap-1 transition-all"><MessageSquare size={12}/> SMS</button>
                         <button className="flex-1 py-1.5 bg-secondary hover:bg-muted text-xs font-bold rounded flex items-center justify-center gap-1 transition-all"><Phone size={12}/> Call</button>
                      </div>
                   </motion.div>
                 ))}
                 
                 {collections.length === 0 && (
                   <div className="text-center opacity-40 text-xs italic mt-10">No accounts in this bucket.</div>
                 )}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}

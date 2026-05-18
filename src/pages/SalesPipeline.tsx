import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Target, Calendar, Mail, Phone,
  Plus, MoreVertical, ArrowUp, ArrowDown, Clock, CheckCircle,
  AlertTriangle, Filter, Download, MessageSquare, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Deal {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  stage: 'lead' | 'contacted' | 'demo' | 'proposal' | 'negotiating' | 'signed' | 'lost';
  value: number;
  probability: number;
  expectedClose: string;
  daysInStage: number;
  lastContact: string;
  source: 'inbound' | 'outbound' | 'referral' | 'partner';
  notes: string;
  activities: { type: string; date: string; note: string }[];
}

interface SalesActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  dealId: string;
  date: string;
  note: string;
  outcome: 'positive' | 'neutral' | 'negative';
}

const STAGES = [
  { id: 'lead', label: 'Lead', color: '#6B7280', probability: 10 },
  { id: 'contacted', label: 'Contacted', color: '#8B5CF6', probability: 20 },
  { id: 'demo', label: 'Demo', color: '#F97316', probability: 30 },
  { id: 'proposal', label: 'Proposal', color: '#FBBF24', probability: 50 },
  { id: 'negotiating', label: 'Negotiating', color: '#3B82F6', probability: 75 },
  { id: 'signed', label: 'Signed', color: '#00FF94', probability: 100 },
  { id: 'lost', label: 'Lost', color: '#EF4444', probability: 0 }
];

const SalesPipeline = () => {
  const [deals, setDeals] = useState<Deal[]>([
    { id: '1', companyName: 'Capital First NBFC', contactName: 'Rajesh Kumar', email: 'rajesh@capitalfirst.in', phone: '+91 98765 43210', stage: 'negotiating', value: 75000, probability: 75, expectedClose: '2025-06-15', daysInStage: 5, lastContact: '2025-05-18', source: 'inbound', notes: 'CTO wants to integrate within 2 weeks', activities: [{ type: 'call', date: '2025-05-18', note: 'Discussed pricing', outcome: 'positive' }] },
    { id: '2', companyName: 'Trust Finance Ltd', contactName: 'Priya Sharma', email: 'priya@trustfinance.com', phone: '+91 98765 43211', stage: 'demo', value: 50000, probability: 30, expectedClose: '2025-06-25', daysInStage: 3, lastContact: '2025-05-17', source: 'outbound', notes: 'Demo scheduled for Tuesday', activities: [] },
    { id: '3', companyName: 'Urban Money NBFC', contactName: 'Amit Singh', email: 'amit@urbanmoney.in', phone: '+91 98765 43212', stage: 'proposal', value: 100000, probability: 50, expectedClose: '2025-06-20', daysInStage: 8, lastContact: '2025-05-12', source: 'referral', notes: 'Sent custom pricing proposal', activities: [{ type: 'email', date: '2025-05-12', note: 'Sent proposal', outcome: 'neutral' }] },
    { id: '4', companyName: 'Apex Lending', contactName: 'Sonia Devi', email: 'sonia@apexlending.com', phone: '+91 98765 43213', stage: 'lead', value: 25000, probability: 10, expectedClose: '2025-07-15', daysInStage: 2, lastContact: '2025-05-16', source: 'inbound', notes: 'Inbound from website', activities: [] },
    { id: '5', companyName: 'Gold Loan Corp', contactName: 'Vijay Malhotra', email: 'vijay@goldloan.in', phone: '+91 98765 43214', stage: 'signed', value: 75000, probability: 100, expectedClose: '2025-05-01', daysInStage: 0, lastContact: '2025-05-01', source: 'partner', notes: 'Contract signed!', activities: [{ type: 'meeting', date: '2025-05-01', note: 'Signed contract', outcome: 'positive' }] },
    { id: '6', companyName: 'MicroFinance Plus', contactName: 'Sunita Rao', email: 'sunita@mfplus.in', phone: '+91 98765 43215', stage: 'lead', value: 40000, probability: 10, expectedClose: '2025-07-30', daysInStage: 1, lastContact: '2025-05-17', source: 'outbound', notes: 'Cold outreach', activities: [] },
    { id: '7', companyName: 'P2P India', contactName: 'Karthik', email: 'karthik@p2pindia.com', phone: '+91 98765 43216', stage: 'contacted', value: 60000, probability: 20, expectedClose: '2025-07-10', daysInStage: 4, lastContact: '2025-05-14', source: 'inbound', notes: 'Interested after webinar', activities: [{ type: 'email', date: '2025-05-14', note: 'Follow up email', outcome: 'positive' }] },
  ]);

  const [activities, setActivities] = useState<SalesActivity[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showDealDetail, setShowDealDetail] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Real-time metrics
  const pipelineValue = deals.filter(d => d.stage !== 'lost').reduce((sum, d) => sum + d.value, 0);
  const weightedValue = deals.filter(d => d.stage !== 'lost').reduce((sum, d) => sum + (d.value * d.probability / 100), 0);
  const closedValue = deals.filter(d => d.stage === 'signed').reduce((sum, d) => sum + d.value, 0);
  const conversionRate = Math.round((deals.filter(d => d.stage === 'signed').length / deals.filter(d => d.stage !== 'lost').length) * 100);
  
  // This month's forecast
  const thisMonthDeals = deals.filter(d => d.stage !== 'lost' && new Date(d.expectedClose).getMonth() === new Date().getMonth());
  const thisMonthForecast = thisMonthDeals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0);

  const getStageConfig = (stageId: string) => STAGES.find(s => s.id === stageId) || STAGES[0];

  const moveDeal = (dealId: string, newStage: string) => {
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage as Deal['stage'], daysInStage: 0 } : d));
    
    // Log activity
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setActivities([...activities, {
        id: `act_${Date.now()}`,
        type: 'note',
        dealId,
        date: new Date().toISOString().split('T')[0],
        note: `Moved to ${newStage}`,
        outcome: 'neutral'
      }]);
    }
  };

  const addActivity = (dealId: string, type: SalesActivity['type'], note: string, outcome: SalesActivity['outcome']) => {
    setActivities([...activities, {
      id: `act_${Date.now()}`,
      type,
      dealId,
      date: new Date().toISOString().split('T')[0],
      note,
      outcome
    }]);
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealDetail(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-['DM_Sans'] text-2xl font-bold text-foreground">Sales Pipeline</h1>
          <p className="font-['DM_Sans'] text-sm text-foreground/50">Track deals and forecast revenue</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download size={14} className="mr-1" /> Export
          </Button>
          <Button size="sm" className="bg-[#F97316] hover:bg-[#EA580C]" onClick={() => setShowAddDeal(true)}>
            <Plus size={14} className="mr-1" /> Add Deal
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <p className="font-['DM_Sans'] text-xs text-foreground/50 mb-1">Pipeline Value</p>
            <p className="font-['DM_Sans'] text-xl font-bold text-foreground">₹{pipelineValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <p className="font-['DM_Sans'] text-xs text-foreground/50 mb-1">Weighted</p>
            <p className="font-['DM_Sans'] text-xl font-bold text-[#F97316]">₹{Math.round(weightedValue).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <p className="font-['DM_Sans'] text-xs text-foreground/50 mb-1">This Month</p>
            <p className="font-['DM_Sans'] text-xl font-bold text-[#00FF94]">₹{Math.round(thisMonthForecast).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <p className="font-['DM_Sans'] text-xs text-foreground/50 mb-1">Closed (MTD)</p>
            <p className="font-['DM_Sans'] text-xl font-bold text-foreground">₹{closedValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <p className="font-['DM_Sans'] text-xs text-foreground/50 mb-1">Win Rate</p>
            <p className="font-['DM_Sans'] text-xl font-bold text-foreground">{conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.filter(s => s.id !== 'lost').map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          
          return (
            <div key={stage.id} className="min-w-[240px] flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="font-['DM_Sans'] text-sm font-medium text-foreground">{stage.label}</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs text-foreground/50">{stageDeals.length}</span>
              </div>
              
              <div className="bg-card/30 border border-border rounded-lg p-2 space-y-2 min-h-[400px]">
                {stageDeals.map(deal => (
                  <div 
                    key={deal.id}
                    onClick={() => handleDealClick(deal)}
                    className="bg-muted/50 border border-border rounded p-3 cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-['DM_Sans'] text-xs font-medium text-foreground truncate flex-1">{deal.companyName}</span>
                      <button className="text-foreground/30 hover:text-foreground">
                        <MoreVertical size={12} />
                      </button>
                    </div>
                    <p className="font-['JetBrains_Mono'] text-sm text-foreground mb-2">₹{deal.value.toLocaleString()}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-foreground/40">{deal.probability}%</span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-foreground/40">{deal.daysInStage}d</span>
                    </div>
                    {deal.source === 'inbound' && (
                      <span className="inline-block mt-2 font-['JetBrains_Mono'] text-[9px] bg-[rgba(0,255,148,0.1)] text-[#00FF94] px-1.5 py-0.5 rounded">INBOUND</span>
                    )}
                  </div>
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-foreground/30 font-['DM_Sans'] text-xs">
                    No deals
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-right">
                <span className="font-['JetBrains_Mono'] text-xs text-foreground/50">₹{stageValue.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Feed */}
      <Card className="bg-card/50 border-border mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-['DM_Sans'] text-sm font-semibold text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.length > 0 ? activities.slice(-5).reverse().map(act => {
              const deal = deals.find(d => d.id === act.dealId);
              return (
                <div key={act.id} className="flex items-start gap-3 p-2 bg-muted/30 rounded">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    act.outcome === 'positive' ? 'bg-[#00FF94]' :
                    act.outcome === 'negative' ? 'bg-[#EF4444]' : 'bg-foreground/30'
                  }`} />
                  <div className="flex-1">
                    <p className="font-['DM_Sans'] text-xs text-foreground">{deal?.companyName}</p>
                    <p className="font-['DM_Sans'] text-xs text-foreground/60">{act.note}</p>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-foreground/40">{act.date}</span>
                </div>
              );
            }) : (
              <p className="font-['DM_Sans'] text-xs text-foreground/40 text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Deal Modal */}
      <Dialog open={showAddDeal} onOpenChange={setShowAddDeal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['DM_Sans']">Add New Deal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="Company Name" className="bg-muted" />
            <Input placeholder="Contact Name" className="bg-muted" />
            <Input placeholder="Email" type="email" className="bg-muted" />
            <Input placeholder="Phone" className="bg-muted" />
            <Input placeholder="Deal Value (₹)" type="number" className="bg-muted" />
            <Input placeholder="Expected Close Date" type="date" className="bg-muted" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDeal(false)}>Cancel</Button>
            <Button className="bg-[#F97316]">Add Deal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deal Detail Modal */}
      <Dialog open={showDealDetail} onOpenChange={setShowDealDetail}>
        <DialogContent className="sm:max-w-lg">
          {selectedDeal && (
            <>
              <DialogHeader>
                <DialogTitle className="font-['DM_Sans']">{selectedDeal.companyName}</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-['DM_Sans'] text-xs text-foreground/50">Contact</p>
                    <p className="font-['DM_Sans'] text-sm text-foreground">{selectedDeal.contactName}</p>
                  </div>
                  <div>
                    <p className="font-['DM_Sans'] text-xs text-foreground/50">Value</p>
                    <p className="font-['JetBrains_Mono'] text-sm text-foreground">₹{selectedDeal.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-['DM_Sans'] text-xs text-foreground/50">Stage</p>
                    <select 
                      className="bg-muted border border-border rounded px-2 py-1 text-sm"
                      value={selectedDeal.stage}
                      onChange={(e) => moveDeal(selectedDeal.id, e.target.value)}
                    >
                      {STAGES.filter(s => s.id !== 'lost').map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="font-['DM_Sans'] text-xs text-foreground/50">Expected Close</p>
                    <p className="font-['JetBrains_Mono'] text-sm text-foreground">{selectedDeal.expectedClose}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone size={14} className="mr-1" /> Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail size={14} className="mr-1" /> Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare size={14} className="mr-1" /> Note
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPipeline;
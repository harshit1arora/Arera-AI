import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Zap, Building2, Landmark, ArrowRight, CreditCard, Shield, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 25000,
    period: 'month',
    description: 'For new NBFCs starting their AI journey',
    icon: Zap,
    color: '#F97316',
    features: [
      { name: '100 loan applications/month', included: true },
      { name: 'AI Document Parsing', included: true },
      { name: 'Basic Underwriting Engine', included: true },
      { name: 'Collections Dashboard', included: true },
      { name: '5 Team Members', included: true },
      { name: 'Email Support', included: true },
      { name: 'API Access', included: true },
      { name: 'Custom Workflows', included: false },
      { name: 'White-label', included: false },
      { name: 'Dedicated Account Manager', included: false },
      { name: 'SLA Guarantee', included: false },
      { name: 'RBI Compliance Reports', included: false },
    ],
    limits: { applications: 100, teamMembers: 5, apiCalls: 1000 }
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 75000,
    period: 'month',
    description: 'For scaling NBFCs processing 500+ loans monthly',
    icon: Building2,
    color: '#00FF94',
    popular: true,
    features: [
      { name: '500 loan applications/month', included: true },
      { name: 'AI Document Parsing', included: true },
      { name: 'Advanced Underwriting Engine', included: true },
      { name: 'All 6 Dashboards', included: true },
      { name: '20 Team Members', included: true },
      { name: 'Priority Support', included: true },
      { name: 'API Access', included: true },
      { name: 'Custom Workflows', included: true },
      { name: 'White-label', included: true },
      { name: 'Dedicated Account Manager', included: false },
      { name: 'SLA Guarantee (99.5%)', included: true },
      { name: 'RBI Compliance Reports', included: true },
    ],
    limits: { applications: 500, teamMembers: 20, apiCalls: 10000 }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 200000,
    period: 'month',
    description: 'For large NBFCs with custom requirements',
    icon: Landmark,
    color: '#8B5CF6',
    features: [
      { name: 'Unlimited loan applications', included: true },
      { name: 'AI Document Parsing', included: true },
      { name: 'Full Underwriting Suite', included: true },
      { name: 'All Dashboards + Custom', included: true },
      { name: 'Unlimited Team Members', included: true },
      { name: '24/7 Dedicated Support', included: true },
      { name: 'API Access + SDK', included: true },
      { name: 'Custom Workflows', included: true },
      { name: 'Full White-label', included: true },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'SLA Guarantee (99.9%)', included: true },
      { name: 'RBI Compliance Reports', included: true },
    ],
    limits: { applications: -1, teamMembers: -1, apiCalls: -1 }
  }
];

const COMPARISON_FEATURES = [
  { key: 'applications', label: 'Monthly Applications', starter: '100', growth: '500', enterprise: 'Unlimited' },
  { key: 'teamMembers', label: 'Team Members', starter: '5', growth: '20', enterprise: 'Unlimited' },
  { key: 'apiCalls', label: 'API Calls/month', starter: '1,000', growth: '10,000', enterprise: 'Unlimited' },
  { key: 'parsing', label: 'AI Document Parsing', starter: true, growth: true, enterprise: true },
  { key: 'underwriting', label: 'Underwriting Engine', starter: 'Basic', growth: 'Advanced', enterprise: 'Full' },
  { key: 'dashboards', label: 'Dashboards', starter: '3', growth: '6', enterprise: 'Custom' },
  { key: 'workflows', label: 'Custom Workflows', starter: false, growth: true, enterprise: true },
  { key: 'whitelabel', label: 'White-label', starter: false, growth: true, enterprise: true },
  { key: 'sla', label: 'SLA Guarantee', starter: false, growth: '99.5%', enterprise: '99.9%' },
  { key: 'compliance', label: 'RBI Compliance Reports', starter: false, growth: true, enterprise: true },
  { key: 'support', label: 'Support', starter: 'Email', growth: 'Priority', enterprise: '24/7 Dedicated' },
  { key: 'sdk', label: 'SDK + Integration', starter: false, growth: false, enterprise: true },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setShowCheckout(true);
  };

  const annualDiscount = 0.2;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F97316]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-['DM_Sans'] text-5xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h1>
            <p className="font-['DM_Sans'] text-xl text-foreground/60 max-w-2xl mx-auto mb-8">
              No hidden fees. No surprises. Scale your AI-powered lending operations with confidence.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`font-['DM_Sans'] text-sm ${billingCycle === 'monthly' ? 'text-foreground' : 'text-foreground/50'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-7 bg-[rgba(255,255,255,0.1)] rounded-full transition-colors"
              >
                <div className={`absolute top-1 w-5 h-5 bg-[#F97316] rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
              <span className={`font-['DM_Sans'] text-sm ${billingCycle === 'annual' ? 'text-foreground' : 'text-foreground/50'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <span className="bg-[rgba(0,255,148,0.1)] text-[#00FF94] font-['JetBrains_Mono'] text-xs px-2 py-0.5 rounded">
                  Save 20%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier, index) => {
            const Icon = tier.icon;
            const price = billingCycle === 'annual' 
              ? Math.round(tier.price * 12 * (1 - annualDiscount))
              : tier.price;
            
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-card border rounded-2xl p-6 ${
                  tier.popular 
                    ? 'border-[#00FF94] shadow-[0_0_30px_rgba(0,255,148,0.1)]' 
                    : 'border-border'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00FF94] text-black font-['DM_Sans'] text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${tier.color}20` }}
                  >
                    <Icon size={20} style={{ color: tier.color }} />
                  </div>
                  <div>
                    <h3 className="font-['DM_Sans'] text-xl font-bold text-foreground">{tier.name}</h3>
                    <p className="font-['DM_Sans'] text-xs text-foreground/50">{tier.limits.applications === -1 ? 'Unlimited' : tier.limits.applications} apps/mo</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="font-['DM_Sans'] text-4xl font-bold text-foreground">₹{price.toLocaleString('en-IN')}</span>
                  <span className="font-['DM_Sans'] text-foreground/50">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                </div>

                <p className="font-['DM_Sans'] text-sm text-foreground/60 mb-6">{tier.description}</p>

                <Button
                  onClick={() => handleSelectTier(tier.id)}
                  className={`w-full mb-6 ${
                    tier.popular 
                      ? 'bg-[#00FF94] hover:bg-[#00CC77] text-black' 
                      : 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-foreground border border-border'
                  }`}
                >
                  {tier.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                  <ArrowRight size={16} className="ml-2" />
                </Button>

                <div className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check size={16} className="text-[#00FF94]" />
                      ) : (
                        <X size={16} className="text-foreground/30" />
                      )}
                      <span className={`font-['DM_Sans'] text-sm ${feature.included ? 'text-foreground' : 'text-foreground/40'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pricing Clarification Note */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-muted/50 border border-border/80 rounded-xl p-6 text-center">
          <p className="font-['DM_Sans'] text-sm text-foreground/70 leading-relaxed">
            <strong>💡 Pricing Models:</strong> We offer two ways to scale. You can choose our <strong>Platform SaaS Plans</strong> above (which bundle user dashboards, rule editors, compliance reports, and monthly request quotas), or integrate directly via our raw developer API with <strong>Pay-As-You-Go per-decision pricing</strong> (₹7.50 for Gemini Flash / ₹9.50 for Claude Haiku) through the dashboard.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="font-['DM_Sans'] text-2xl font-bold text-foreground text-center mb-8">
            Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-['DM_Sans'] text-sm text-foreground/60 py-4 pr-4">Feature</th>
                  <th className="text-center font-['DM_Sans'] text-sm text-foreground py-4 px-4">Starter</th>
                  <th className="text-center font-['DM_Sans'] text-sm text-[#00FF94] py-4 px-4">Growth</th>
                  <th className="text-center font-['DM_Sans'] text-sm text-foreground py-4 pl-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-['DM_Sans'] text-sm text-foreground/70">{row.label}</td>
                    <td className="text-center py-3 px-4">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <Check size={16} className="mx-auto text-[#00FF94]" /> : <X size={16} className="mx-auto text-foreground/30" />
                      ) : (
                        <span className="font-['JetBrains_Mono'] text-sm text-foreground">{row.starter}</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {typeof row.growth === 'boolean' ? (
                        row.growth ? <Check size={16} className="mx-auto text-[#00FF94]" /> : <X size={16} className="mx-auto text-foreground/30" />
                      ) : (
                        <span className="font-['JetBrains_Mono'] text-sm text-[#00FF94]">{row.growth}</span>
                      )}
                    </td>
                    <td className="text-center py-3 pl-4">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check size={16} className="mx-auto text-[#00FF94]" /> : <X size={16} className="mx-auto text-foreground/30" />
                      ) : (
                        <span className="font-['JetBrains_Mono'] text-sm text-foreground">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Shield, label: 'RBI Compliant', desc: 'Built for Indian regulations' },
            { icon: Users, label: '15+ NBFC Pilots', desc: 'Trust our infrastructure' },
            { icon: Activity, label: '99.9% Uptime', desc: 'Target network availability' },
            { icon: CreditCard, label: 'Secure Payments', desc: 'Via certified gateways' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border">
              <item.icon size={24} className="text-[#F97316]" />
              <div>
                <p className="font-['DM_Sans'] text-sm font-semibold text-foreground">{item.label}</p>
                <p className="font-['DM_Sans'] text-xs text-foreground/50">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedTier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="font-['DM_Sans'] text-xl font-bold text-foreground mb-2">
              Subscribe to {PRICING_TIERS.find(t => t.id === selectedTier)?.name}
            </h3>
            <p className="font-['DM_Sans'] text-sm text-foreground/60 mb-6">
              Start your AI-powered lending journey today
            </p>
            
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-['DM_Sans'] text-sm text-foreground/70">Plan</span>
                <span className="font-['DM_Sans'] text-sm text-foreground">{PRICING_TIERS.find(t => t.id === selectedTier)?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-['DM_Sans'] text-sm text-foreground/70">Billing</span>
                <span className="font-['DM_Sans'] text-sm text-foreground capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-['DM_Sans'] text-sm font-semibold text-foreground">Total</span>
                <span className="font-['DM_Sans'] text-sm font-bold text-foreground">
                  ₹{Math.round((PRICING_TIERS.find(t => t.id === selectedTier)?.price || 0) * (billingCycle === 'annual' ? 9.6 : 1)).toLocaleString('en-IN')}/{billingCycle === 'annual' ? 'year' : 'mo'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <input 
                type="text" 
                placeholder="Company Name" 
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 font-['DM_Sans'] text-sm text-foreground placeholder:text-foreground/30"
              />
              <input 
                type="email" 
                placeholder="Business Email" 
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 font-['DM_Sans'] text-sm text-foreground placeholder:text-foreground/30"
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 font-['DM_Sans'] text-sm text-foreground placeholder:text-foreground/30"
              />
            </div>

            <Button className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white">
              Proceed to Payment
            </Button>
            
            <button 
              onClick={() => setShowCheckout(false)}
              className="w-full mt-3 text-center font-['DM_Sans'] text-sm text-foreground/50 hover:text-foreground"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
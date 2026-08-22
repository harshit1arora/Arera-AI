import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Building2, Landmark, ArrowRight, CreditCard, Shield, Users, Activity, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free Sandbox',
    price: 0,
    period: 'month',
    description: 'For developers and early-stage sandbox testing',
    icon: Zap,
    color: '#3B82F6',
    features: [
      { name: '25 loan applications/month', included: true },
      { name: 'AI Document Parsing', included: true },
      { name: 'Basic Underwriting Engine', included: true },
      { name: 'Collections Dashboard', included: false },
      { name: '1 Team Member', included: true },
      { name: 'Email Support', included: true },
      { name: 'API Access', included: true },
      { name: 'Custom Workflows', included: false },
      { name: 'White-label', included: false },
      { name: 'Dedicated Account Manager', included: false },
      { name: 'SLA Guarantee', included: false },
      { name: 'RBI Compliance Reports', included: false },
    ],
    limits: { applications: 25, teamMembers: 1, apiCalls: 250 }
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9999,
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
    price: 49999,
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
    price: 149999,
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
  { key: 'applications', label: 'Monthly Applications', free: '25', starter: '100', growth: '500', enterprise: 'Unlimited' },
  { key: 'teamMembers', label: 'Team Members', free: '1', starter: '5', growth: '20', enterprise: 'Unlimited' },
  { key: 'apiCalls', label: 'API Calls/month', free: '250', starter: '1,000', growth: '10,000', enterprise: 'Unlimited' },
  { key: 'parsing', label: 'AI Document Parsing', free: true, starter: true, growth: true, enterprise: true },
  { key: 'underwriting', label: 'Underwriting Engine', free: 'Basic', starter: 'Basic', growth: 'Advanced', enterprise: 'Full' },
  { key: 'dashboards', label: 'Dashboards', free: '—', starter: '3', growth: '6', enterprise: 'Custom' },
  { key: 'workflows', label: 'Custom Workflows', free: false, starter: false, growth: true, enterprise: true },
  { key: 'whitelabel', label: 'White-label', free: false, starter: false, growth: true, enterprise: true },
  { key: 'sla', label: 'SLA Guarantee', free: false, starter: false, growth: '99.5%', enterprise: '99.9%' },
  { key: 'compliance', label: 'RBI Compliance Reports', free: false, starter: false, growth: true, enterprise: true },
  { key: 'support', label: 'Support', free: 'Email', starter: 'Email', growth: 'Priority', enterprise: '24/7 Dedicated' },
  { key: 'sdk', label: 'SDK + Integration', free: false, starter: false, growth: false, enterprise: true },
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Navbar />

      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-100px] left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[-50px] right-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="flex-grow pt-32 pb-24 relative z-10">
        
        {/* Hero Header */}
        <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-400 mb-6 backdrop-blur-sm">
              <Sparkles size={12} className="text-[#F97316]" />
              <span>Transparent SaaS plans with no implementation fees</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white mb-6">
              Simple, <span className="bg-gradient-to-r from-[#F97316] to-[#00FF94] bg-clip-text text-transparent">transparent pricing</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              No hidden parameters. No developer seat costs. Scale your AI-powered lending operations with bank-grade predictability.
            </p>

            {/* Premium Billing Cycle Switcher */}
            <div className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-full max-w-[280px] mx-auto backdrop-blur-sm shadow-xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white/10 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`flex-1 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-white/10 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Annual
                <span className="bg-emerald-500/10 text-[#00FF94] text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  -20%
                </span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {PRICING_TIERS.map((tier, index) => {
              const Icon = tier.icon;
              const price = billingCycle === 'annual' 
                ? Math.round(tier.price * 12 * (1 - annualDiscount))
                : tier.price;
              
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.15 } }}
                  className={`relative flex flex-col justify-between rounded-2xl p-6 bg-gradient-to-b from-white/[0.03] to-transparent border backdrop-blur-md transition-all ${
                    tier.popular 
                      ? 'border-[#00FF94]/50 shadow-[0_15px_40px_rgba(0,255,148,0.06)]' 
                      : 'border-white/[0.08] hover:border-white/[0.15] shadow-xl'
                  }`}
                >
                  <div>
                    {tier.popular && (
                      <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-[#00FF94] text-black font-display text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                        RECOMMENDED
                      </div>
                    )}
                    
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5"
                        style={{ backgroundColor: `${tier.color}15` }}
                      >
                        <Icon size={18} style={{ color: tier.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{tier.name}</h3>
                        <p className="text-xs text-gray-500">{tier.limits.applications === -1 ? 'Unlimited' : `${tier.limits.applications} applications`}/mo</p>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="mb-4">
                      {tier.price === 0 ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold text-white">Free</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-gray-500 font-mono">₹</span>
                          <span className="text-4xl font-black text-white tracking-tight">
                            {price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            /{billingCycle === 'annual' ? 'yr' : 'mo'}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mb-6 min-h-[32px] leading-relaxed">{tier.description}</p>
                    
                    <div className="h-[1px] bg-white/[0.06] mb-6" />
                  </div>

                  {/* Button & Feature List */}
                  <div>
                    <Button
                      onClick={() => handleSelectTier(tier.id)}
                      className={`w-full py-5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 ${
                        tier.popular 
                          ? 'bg-[#00FF94] hover:bg-[#00D77D] text-black hover:shadow-[#00FF94]/20' 
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      {tier.id === 'free' ? 'Get Sandbox Access' : tier.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                      <ArrowRight size={12} />
                    </Button>

                    <ul className="space-y-3 mt-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          {feature.included ? (
                            <Check size={14} className="text-[#00FF94] shrink-0 mt-0.5" />
                          ) : (
                            <X size={14} className="text-gray-600 shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Full Feature Comparison</h2>
            <p className="text-gray-400 text-sm mt-2">Every feature details mapped side-by-side</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.01]">
                    <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-gray-400">Features</th>
                    <th className="py-4 px-6 text-center text-xs uppercase tracking-wider font-bold text-blue-400">Free Sandbox</th>
                    <th className="py-4 px-6 text-center text-xs uppercase tracking-wider font-bold text-orange-400">Starter</th>
                    <th className="py-4 px-6 text-center text-xs uppercase tracking-wider font-bold text-[#00FF94]">Growth</th>
                    <th className="py-4 px-6 text-center text-xs uppercase tracking-wider font-bold text-purple-400">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, i) => (
                    <tr 
                      key={i} 
                      className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="py-4 px-6 text-xs text-gray-300 font-medium">{row.label}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check size={14} className="mx-auto text-blue-400" /> : <X size={14} className="mx-auto text-gray-600" />
                        ) : (
                          <span className="text-xs font-mono font-bold text-blue-400">{row.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? <Check size={14} className="mx-auto text-orange-400" /> : <X size={14} className="mx-auto text-gray-600" />
                        ) : (
                          <span className="text-xs font-mono font-bold text-orange-400">{row.starter}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center bg-emerald-500/[0.01]">
                        {typeof row.growth === 'boolean' ? (
                          row.growth ? <Check size={14} className="mx-auto text-[#00FF94]" /> : <X size={14} className="mx-auto text-gray-600" />
                        ) : (
                          <span className="text-xs font-mono font-bold text-[#00FF94]">{row.growth}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? <Check size={14} className="mx-auto text-purple-400" /> : <X size={14} className="mx-auto text-gray-600" />
                        ) : (
                          <span className="text-xs font-mono font-bold text-purple-400">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* High Fidelity Trust Badges */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: 'RBI Compliant', desc: 'Securely audit decisions to comply with digital lending guidelines' },
              { icon: Users, label: '15+ NBFC Pilots', desc: 'Serving active lending operations in India' },
              { icon: Activity, label: '99.9% Target Uptime', desc: 'Robust network availability built on modern cloud systems' },
              { icon: CreditCard, label: 'Secure Gateways', desc: 'Fully compliant token validation via payment partners' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-[#F97316]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{item.label}</h4>
                  <p className="text-xs text-gray-500 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && selectedTier && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-2xl font-black tracking-tight text-white mb-2">
                {selectedTier === 'free' ? 'Configure Free Sandbox' : `Subscribe to ${PRICING_TIERS.find(t => t.id === selectedTier)?.name}`}
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                {selectedTier === 'free' 
                  ? 'Get instant sandbox keys to run mock decisions.' 
                  : 'Start your enterprise-ready underwriting journey with Gavel AI.'}
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <div className="flex justify-between mb-2.5 text-xs text-gray-400">
                  <span>Selected Tier</span>
                  <span className="font-semibold text-white">{PRICING_TIERS.find(t => t.id === selectedTier)?.name}</span>
                </div>
                <div className="flex justify-between mb-2.5 text-xs text-gray-400">
                  <span>Billing Cycle</span>
                  <span className="font-semibold text-white capitalize">{billingCycle}</span>
                </div>
                <div className="h-[1px] bg-white/10 my-3" />
                <div className="flex justify-between text-sm items-baseline">
                  <span className="font-semibold text-gray-300">Total Price</span>
                  <span className="font-bold text-white text-lg">
                    ₹{Math.round((PRICING_TIERS.find(t => t.id === selectedTier)?.price || 0) * (billingCycle === 'annual' ? 9.6 : 1)).toLocaleString('en-IN')}
                    <span className="text-[10px] text-gray-500 font-normal">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                  </span>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setShowCheckout(false); }} className="space-y-4 mb-6">
                <input 
                  type="text" 
                  required
                  placeholder="Company Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#F97316] transition-colors"
                />
                <input 
                  type="email" 
                  required
                  placeholder="Business Email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#F97316] transition-colors"
                />
                <input 
                  type="tel" 
                  required
                  placeholder="Phone Number" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#F97316] transition-colors"
                />
                
                <Button type="submit" className="w-full py-6 mt-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold tracking-wide shadow-lg">
                  {selectedTier === 'free' ? 'Activate Sandbox' : selectedTier === 'enterprise' ? 'Submit RFP Request' : 'Proceed to Payment'}
                </Button>
              </form>
              
              <button 
                onClick={() => setShowCheckout(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Pricing;
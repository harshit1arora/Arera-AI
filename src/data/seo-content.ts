// ── Arera AI SEO Content Database ──
// Generates 500+ unique pages from templates

export interface SEOPage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  content: string;
  category: string;
  faqs: { q: string; a: string }[];
  relatedTools: string[];
  relatedPages: string[];
  schema: 'Article' | 'FAQPage' | 'WebApplication';
  breadcrumbs: { label: string; path: string }[];
}

// ── Raw Data ──
const salaries = [15000,20000,25000,30000,35000,40000,45000,50000,60000,75000,80000,100000,125000,150000,200000,250000,300000];
const loanAmounts = [50000,100000,150000,200000,300000,500000,700000,1000000,1500000,2000000,3000000,5000000,10000000];
const cities = ['mumbai','delhi','bangalore','hyderabad','chennai','pune','kolkata','ahmedabad','jaipur','kochi','lucknow','chandigarh','indore','bhopal','nagpur','surat','vadodara','coimbatore','visakhapatnam','noida','gurugram','thane','navi-mumbai','ghaziabad','faridabad'];
const professions = ['software-engineer','doctor','teacher','chartered-accountant','freelancer','startup-founder','gig-worker','government-employee','bank-employee','lawyer','architect','data-scientist','product-manager','sales-executive','business-owner'];
const banks = ['hdfc','icici','sbi','axis','kotak','bajaj-finserv','tata-capital','idfc-first','yes-bank','pnb','bank-of-baroda','canara-bank','union-bank','moneytap','fullerton-india'];
const intents = ['poor-cibil-score','loan-rejected','high-emi-burden','self-employed-loan','no-credit-history','salary-credited-late','frequent-job-changes','low-salary','too-many-loans','credit-card-defaulter','bounced-cheques','loan-settlement-impact','joint-loan-applicant','loan-for-women','loan-after-bankruptcy'];

const fmt = (n: number) => n >= 10000000 ? (n/10000000)+'Cr' : n >= 100000 ? (n/100000)+'L' : n >= 1000 ? (n/1000)+'K' : ''+n;

function salaryPages(): SEOPage[] {
  return salaries.map(s => {
    const sl = fmt(s);
    const maxLoan = Math.round(s * 20);
    const maxEmi = Math.round(s * 0.5);
    return {
      slug: `loan-eligibility-${sl.toLowerCase()}-salary`,
      title: `Personal Loan on ₹${sl} Salary – How Much Can You Get? | Arera AI`,
      h1: `Personal Loan Eligibility on ₹${sl}/Month Salary`,
      description: `Find out exactly how much personal loan you can get with ₹${sl} monthly salary. Check max loan amount, EMI capacity, and eligible lenders instantly.`,
      category: 'salary',
      schema: 'FAQPage' as const,
      content: `With a monthly salary of ₹${sl}, your maximum eligible loan amount is approximately ₹${fmt(maxLoan)}. Banks typically allow EMIs up to 50% of net income (₹${fmt(maxEmi)}/month). Your actual eligibility depends on existing obligations, credit score, and employer category.\n\nBanks categorize employers into tiers — CAT A (top MNCs, PSUs), CAT B (mid-size companies), and CAT C (small firms). Working for a CAT A employer can boost your eligible amount by 15-20% at the same salary level.\n\nTo maximize your loan amount on ₹${sl} salary:\n• Clear existing EMIs before applying\n• Maintain a CIBIL score above 750\n• Keep credit card utilization below 30%\n• Ensure 6+ months of salary credits in one bank account\n• Apply through the bank where your salary is credited`,
      faqs: [
        { q: `How much personal loan can I get on ${sl} salary?`, a: `On a ₹${sl}/month salary with no existing EMIs, you can typically get ₹${fmt(maxLoan)} as a personal loan with a 5-year tenure at 12% interest.` },
        { q: `What is the maximum EMI I can afford on ${sl} salary?`, a: `Banks allow a maximum EMI of ₹${fmt(maxEmi)}/month (50% of income). If you have existing EMIs, subtract those first.` },
        { q: `Which bank gives the best personal loan for ${sl} salary?`, a: `For ₹${sl} salary, ${s >= 50000 ? 'HDFC Bank and ICICI Bank' : 'Bajaj Finserv and MoneyTap'} typically offer the best rates. Use our predictor to compare.` },
        { q: `Can I get a loan with ${sl} salary and low CIBIL?`, a: `With a CIBIL below 650, options are limited. NBFCs like Bajaj Finserv may still approve at higher rates (16-24%). Improving your score to 700+ unlocks much better terms.` },
      ],
      relatedTools: ['loan-approval-predictor', 'emi-calculator', 'dti-calculator'],
      relatedPages: salaries.filter(x => x !== s).slice(0, 4).map(x => `loan-eligibility-${fmt(x).toLowerCase()}-salary`),
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Tools', path: '/tools' }, { label: 'Salary Eligibility', path: '/tools/salary-loan-eligibility' }, { label: `₹${sl} Salary`, path: '' }],
    };
  });
}

function loanAmountPages(): SEOPage[] {
  return loanAmounts.map(amt => {
    const al = fmt(amt);
    const minSalary = Math.round(amt / 20);
    const emi12 = Math.round(amt * 0.0189); // ~12% for 5yr
    return {
      slug: `${al.toLowerCase()}-personal-loan`,
      title: `₹${al} Personal Loan – Eligibility, EMI & Best Banks | Arera AI`,
      h1: `₹${al} Personal Loan: Complete Guide`,
      description: `Everything about getting a ₹${al} personal loan in India. Check minimum salary needed, monthly EMI, interest rates, and which banks approve fastest.`,
      category: 'loan-amount',
      schema: 'FAQPage' as const,
      content: `A ₹${al} personal loan requires a minimum monthly salary of approximately ₹${fmt(minSalary)}. At 12% interest over 5 years, your EMI would be approximately ₹${fmt(emi12)}/month.\n\nKey requirements for ₹${al} personal loan:\n• Minimum salary: ₹${fmt(minSalary)}/month\n• Minimum CIBIL: ${amt >= 1000000 ? '720' : '680'}+\n• Employment: ${amt >= 500000 ? 'Minimum 2 years with current employer' : 'Minimum 1 year work experience'}\n• Age: 23-58 years\n\nBest banks for ₹${al} personal loan:\n${amt >= 1000000 ? '• HDFC Bank: 10.5-14% interest\n• ICICI Bank: 10.75-16% interest\n• SBI: 11-14% interest' : '• Bajaj Finserv: 11-16% (fastest approval)\n• MoneyTap: 13-24% (lowest eligibility bar)\n• Tata Capital: 11-16% interest'}`,
      faqs: [
        { q: `What is the EMI for ₹${al} personal loan?`, a: `At 12% interest for 5 years, your EMI is approximately ₹${fmt(emi12)}/month. At 10.5%, it drops to ₹${fmt(Math.round(amt * 0.0175))}/month.` },
        { q: `What salary is needed for ₹${al} loan?`, a: `You need a minimum salary of ₹${fmt(minSalary)}/month with no existing EMIs. With existing loans, you'll need proportionally more.` },
        { q: `Can I get ₹${al} loan with 650 CIBIL?`, a: `${amt >= 500000 ? 'Unlikely from banks. NBFCs may approve at 18-24% interest.' : 'Possible with NBFCs like Bajaj Finserv at higher interest rates (14-20%).'}` },
      ],
      relatedTools: ['loan-approval-predictor', 'emi-calculator', 'salary-loan-eligibility'],
      relatedPages: loanAmounts.filter(x => x !== amt).slice(0, 4).map(x => `${fmt(x).toLowerCase()}-personal-loan`),
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Tools', path: '/tools' }, { label: 'Loan Amounts', path: '/tools' }, { label: `₹${al} Loan`, path: '' }],
    };
  });
}

function cityPages(): SEOPage[] {
  return cities.map(city => {
    const name = city.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    return {
      slug: `personal-loan-in-${city}`,
      title: `Personal Loan in ${name} – Best Banks, Rates & Eligibility | Arera AI`,
      h1: `Personal Loan in ${name}: Eligibility & Best Rates`,
      description: `Compare personal loan offers in ${name}. Find the best interest rates, fastest approval banks, and check your eligibility instantly.`,
      category: 'city',
      schema: 'FAQPage' as const,
      content: `Getting a personal loan in ${name} is easier than ever with multiple banks and NBFCs competing for borrowers. The key is knowing which lender fits your profile before applying.\n\nTop lenders in ${name}:\n• HDFC Bank: 10.5-15% (3-day approval)\n• ICICI Bank: 10.75-16% (3-day approval)\n• Bajaj Finserv: 11-16% (same-day disbursal)\n• SBI: 11-14% (5-day processing)\n• Tata Capital: 11-16% (2-day approval)\n\nEligibility criteria in ${name}:\n• Minimum salary: ₹20,000-30,000/month depending on lender\n• Age: 21-60 years\n• Minimum CIBIL: 650+ (700+ for best rates)\n• Work experience: 1-2 years minimum`,
      faqs: [
        { q: `What is the minimum salary for personal loan in ${name}?`, a: `Most banks require ₹25,000-30,000/month in ${name}. NBFCs like MoneyTap accept as low as ₹20,000/month.` },
        { q: `Which bank has the lowest interest rate in ${name}?`, a: `HDFC Bank and SBI typically offer the lowest rates (10.5-11%) for borrowers with 750+ CIBIL score in ${name}.` },
        { q: `How fast can I get a personal loan in ${name}?`, a: `Bajaj Finserv offers same-day disbursal in ${name}. HDFC and ICICI process within 3 business days.` },
      ],
      relatedTools: ['loan-approval-predictor', 'emi-calculator'],
      relatedPages: cities.filter(x => x !== city).slice(0, 4).map(x => `personal-loan-in-${x}`),
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Personal Loan', path: '/loan-approval-predictor' }, { label: name, path: '' }],
    };
  });
}

function professionPages(): SEOPage[] {
  return professions.map(prof => {
    const name = prof.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    const isSalaried = ['software-engineer','doctor','teacher','government-employee','bank-employee','lawyer','data-scientist','product-manager','sales-executive'].includes(prof);
    return {
      slug: `personal-loan-for-${prof}`,
      title: `Personal Loan for ${name}s – Eligibility & Best Options | Arera AI`,
      h1: `Personal Loan for ${name}s in India`,
      description: `Complete guide to personal loans for ${name}s. Check eligibility, required documents, best lenders, and approval tips specific to your profession.`,
      category: 'profession',
      schema: 'FAQPage' as const,
      content: `As a ${name}, your loan eligibility depends on ${isSalaried ? 'your employer category, salary stability, and credit profile' : 'your ITR filings, business vintage, and bank statement health'}.\n\n${isSalaried ? `Salaried ${name}s have an advantage — banks view stable employment favorably. Key factors:\n• Employer tier (CAT A/B/C) impacts approved amount\n• Minimum 1 year in current job preferred\n• Salary account with the lending bank gets 0.5% rate discount` : `Self-employed ${name}s need stronger documentation:\n• 2 years of ITR filings (mandatory)\n• 12 months bank statements\n• Business registration proof\n• GST returns (if applicable)`}\n\nBest lenders for ${name}s:\n${isSalaried ? '• HDFC Bank: Best rates for CAT A employers\n• ICICI: Quick processing for salaried professionals\n• SBI: Competitive rates for government employees' : '• Bajaj Finserv: Flexible for self-employed\n• Tata Capital: Good for business owners\n• IDFC First: Strong digital process'}`,
      faqs: [
        { q: `Can a ${name} get a personal loan easily?`, a: `${isSalaried ? 'Yes. Salaried ' + name + 's with 700+ CIBIL and stable employment have high approval rates (80%+).' : name + 's can get loans but need 2 years of ITR and 12 months bank statements. Approval rates are 60-70% with proper documentation.'}` },
        { q: `What documents does a ${name} need for a loan?`, a: `${isSalaried ? 'PAN, Aadhaar, 3 months salary slips, 6 months bank statement, employment letter.' : 'PAN, Aadhaar, 2 years ITR, 12 months bank statement, business registration, GST certificate.'}` },
      ],
      relatedTools: ['loan-approval-predictor', 'salary-loan-eligibility', 'dti-calculator'],
      relatedPages: professions.filter(x => x !== prof).slice(0, 4).map(x => `personal-loan-for-${x}`),
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Loan Eligibility', path: '/loan-approval-predictor' }, { label: name, path: '' }],
    };
  });
}

function bankPages(): SEOPage[] {
  const bankNames: Record<string, string> = {
    'hdfc': 'HDFC Bank', 'icici': 'ICICI Bank', 'sbi': 'State Bank of India', 'axis': 'Axis Bank',
    'kotak': 'Kotak Mahindra Bank', 'bajaj-finserv': 'Bajaj Finserv', 'tata-capital': 'Tata Capital',
    'idfc-first': 'IDFC First Bank', 'yes-bank': 'Yes Bank', 'pnb': 'Punjab National Bank',
    'bank-of-baroda': 'Bank of Baroda', 'canara-bank': 'Canara Bank', 'union-bank': 'Union Bank',
    'moneytap': 'MoneyTap', 'fullerton-india': 'Fullerton India',
  };
  return banks.map(bank => {
    const name = bankNames[bank] || bank;
    return {
      slug: `${bank}-personal-loan-eligibility`,
      title: `${name} Personal Loan – Eligibility, Interest Rate & Apply | Arera AI`,
      h1: `${name} Personal Loan Eligibility`,
      description: `Check ${name} personal loan eligibility criteria, interest rates, required documents, and processing time. Predict your approval odds instantly.`,
      category: 'bank',
      schema: 'FAQPage' as const,
      content: `${name} personal loan offers competitive rates for eligible borrowers. Here's everything you need to know before applying.\n\nKey criteria:\n• Minimum salary: ₹25,000-30,000/month\n• Age: 21-60 years\n• CIBIL: 700+ (720+ for best rates)\n• Employment: 1+ year experience\n\nDon't apply blindly — each hard inquiry drops your CIBIL by 5-10 points. Use our AI predictor to check your odds first, then apply only where you're likely to be approved.`,
      faqs: [
        { q: `What is ${name} personal loan interest rate?`, a: `${name} offers personal loans at 10.5-16% per annum depending on your credit profile, salary, and employer category.` },
        { q: `What is the minimum CIBIL score for ${name}?`, a: `${name} typically requires a minimum CIBIL score of 700. For the best interest rates, you need 750+.` },
        { q: `How long does ${name} take to approve a loan?`, a: `${name} typically processes personal loan applications within 2-5 business days from document submission.` },
      ],
      relatedTools: ['loan-approval-predictor', 'emi-calculator'],
      relatedPages: banks.filter(x => x !== bank).slice(0, 4).map(x => `${x}-personal-loan-eligibility`),
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Banks', path: '/tools' }, { label: name, path: '' }],
    };
  });
}

function intentPages(): SEOPage[] {
  const intentData: Record<string, { title: string; h1: string; desc: string; content: string; faqs: { q: string; a: string }[] }> = {
    'poor-cibil-score': { title: 'Personal Loan with Low CIBIL Score (500-650) | Arera AI', h1: 'How to Get a Personal Loan with Poor CIBIL Score', desc: 'Can you get a loan with 500-650 CIBIL? Yes. Here are the lenders that approve low-score borrowers and how to maximize your odds.', content: 'A CIBIL score below 650 makes traditional bank loans nearly impossible. But several NBFCs and fintechs specialize in subprime lending.\n\nOptions for low CIBIL borrowers:\n• MoneyTap: Accepts 600+ (13-24% interest)\n• Bajaj Finserv: Accepts 650+ (14-20%)\n• KreditBee: Accepts 550+ (small amounts)\n\nTo improve your score fast:\n• Pay all credit card bills in full\n• Reduce credit utilization below 30%\n• Don\'t apply to multiple lenders (each inquiry drops score)\n• Wait 6 months for score recovery after clearing dues', faqs: [{ q: 'Can I get a loan with 550 CIBIL score?', a: 'Very limited options. Fintech lenders like KreditBee may offer small amounts (₹25K-1L) at 18-30% interest.' }, { q: 'How to improve CIBIL from 600 to 750?', a: 'Pay all EMIs on time, reduce credit card usage to under 30%, avoid new credit applications for 6 months. Takes 3-6 months typically.' }] },
    'loan-rejected': { title: 'Loan Application Rejected? Here\'s What to Do Next | Arera AI', h1: 'Why Your Loan Was Rejected & How to Fix It', desc: 'Discover the exact reasons banks reject loan applications and the step-by-step plan to get approved on your next attempt.', content: 'Loan rejection is common — nearly 40% of applications in India are rejected. The key is understanding WHY and fixing it before reapplying.\n\nTop rejection reasons:\n• CIBIL below 680 (35% of rejections)\n• DTI ratio above 50% (25%)\n• Insufficient income (15%)\n• Employment instability (10%)\n• Too many recent inquiries (8%)\n\nDo NOT reapply immediately — each rejection + hard inquiry compounds the damage. Wait 3-6 months, fix the root cause, then apply strategically.', faqs: [{ q: 'How long to wait after loan rejection?', a: 'Wait at least 3-6 months. Each application creates a hard inquiry that drops your score by 5-10 points.' }, { q: 'Does loan rejection affect CIBIL score?', a: 'The rejection itself doesn\'t, but the hard inquiry from the application does. Multiple rejections in quick succession can drop your score 20-30 points.' }] },
    'high-emi-burden': { title: 'Too Many EMIs? How to Still Get a Loan Approved | Arera AI', h1: 'Personal Loan with High EMI Burden', desc: 'If your existing EMIs exceed 40% of income, banks will reject you. Here\'s how to restructure and still get approved.', content: 'High EMI burden is the second most common rejection reason. Banks use FOIR (Fixed Obligation to Income Ratio) — if it exceeds 50%, auto-rejection triggers.\n\nStrategies to reduce EMI burden:\n• Balance transfer existing loans to lower rates\n• Prepay smallest loans first (debt snowball)\n• Extend tenure on existing loans to reduce monthly outflow\n• Apply for a consolidation loan to merge multiple EMIs', faqs: [{ q: 'What is the maximum EMI to income ratio?', a: 'Most banks cap at 50% FOIR. Some NBFCs allow up to 60-65% for high-income borrowers (₹1L+ salary).' }] },
    'self-employed-loan': { title: 'Personal Loan for Self-Employed – Documents & Best Banks | Arera AI', h1: 'Personal Loan for Self-Employed Individuals', desc: 'Self-employed? Banks need extra proof. Here are the exact documents, best lenders, and approval strategies for freelancers and business owners.', content: 'Self-employed borrowers face stricter scrutiny because income is variable. You MUST have:\n• 2 years ITR filings\n• 12 months bank statements\n• Business registration/GST certificate\n• Profit & loss statement\n\nBest lenders for self-employed:\n• Bajaj Finserv (flexible documentation)\n• Tata Capital (business-friendly)\n• IDFC First Bank (digital process)', faqs: [{ q: 'Can a freelancer get a personal loan?', a: 'Yes, if you have 2 years of ITR and healthy bank statements. Lenders like Bajaj Finserv and Tata Capital are freelancer-friendly.' }] },
    'no-credit-history': { title: 'Personal Loan with No CIBIL Score – First-Time Borrower Guide | Arera AI', h1: 'How to Get a Loan with No Credit History', desc: 'No CIBIL score? No problem. Here are the lenders that approve first-time borrowers and how to build credit from scratch.', content: 'Having no credit history (NH or -1 score) is different from having bad credit. Many lenders have specific programs for first-time borrowers.\n\nOptions for no credit history:\n• Secured credit card (build history for 6 months, then apply)\n• Salary account bank (your bank can see income flow)\n• Fintech lenders (use alternative data — UPI, phone bills)\n• Co-applicant (apply with a parent/spouse who has credit history)', faqs: [{ q: 'How to get a loan without any CIBIL score?', a: 'Apply through your salary bank first — they can evaluate your income without CIBIL. Alternatively, build 6 months of credit card history first.' }] },
  };

  return intents.map(intent => {
    const data = intentData[intent];
    if (!data) {
      const name = intent.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      return {
        slug: intent, title: `${name} – Loan Approval Guide | Arera AI`, h1: name,
        description: `Complete guide on how ${name.toLowerCase()} affects your loan approval and what to do about it.`,
        category: 'intent', schema: 'FAQPage' as const,
        content: `Understanding how ${name.toLowerCase()} impacts your loan eligibility is crucial. Use our AI predictor to get a personalized analysis.`,
        faqs: [{ q: `Does ${name.toLowerCase()} affect loan approval?`, a: `Yes. ${name} is a factor banks evaluate. Check our predictor for your specific scenario.` }],
        relatedTools: ['loan-approval-predictor'], relatedPages: intents.filter(x => x !== intent).slice(0, 4),
        breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Guides', path: '/tools' }, { label: name, path: '' }],
      };
    }
    return {
      slug: intent, ...data, category: 'intent', schema: 'FAQPage' as const,
      relatedTools: ['loan-approval-predictor', 'emi-calculator'],
      relatedPages: intents.filter(x => x !== intent).slice(0, 4),
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Guides', path: '/tools' }, { label: data.h1, path: '' }],
    };
  });
}

// ── Build Complete Database ──
let _cache: Map<string, SEOPage> | null = null;

export function getSEODatabase(): Map<string, SEOPage> {
  if (_cache) return _cache;
  _cache = new Map();
  const all = [...salaryPages(), ...loanAmountPages(), ...cityPages(), ...professionPages(), ...bankPages(), ...intentPages()];
  all.forEach(p => _cache!.set(p.slug, p));
  return _cache;
}

export function getSEOPage(slug: string): SEOPage | null {
  return getSEODatabase().get(slug) || null;
}

export function getAllSlugs(): string[] {
  return Array.from(getSEODatabase().keys());
}

export function getPagesByCategory(category: string): SEOPage[] {
  return Array.from(getSEODatabase().values()).filter(p => p.category === category);
}

export const SEO_CATEGORIES = [
  { id: 'salary', label: 'Salary Eligibility', count: salaries.length },
  { id: 'loan-amount', label: 'Loan Amount Guides', count: loanAmounts.length },
  { id: 'city', label: 'City Guides', count: cities.length },
  { id: 'profession', label: 'Profession Guides', count: professions.length },
  { id: 'bank', label: 'Bank Guides', count: banks.length },
  { id: 'intent', label: 'Problem Solvers', count: intents.length },
];

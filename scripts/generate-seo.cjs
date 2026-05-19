const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.tryarera.com';

const staticPages = [
  { path: '', priority: 1.0, changefreq: 'daily' },
  { path: '/loan-approval-predictor', priority: 0.95, changefreq: 'daily' },
  { path: '/tools', priority: 0.9, changefreq: 'weekly' },
  { path: '/upload', priority: 0.8, changefreq: 'weekly' },
  { path: '/apply', priority: 0.8, changefreq: 'weekly' },
  { path: '/blog', priority: 0.7, changefreq: 'weekly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.4, changefreq: 'monthly' },
  { path: '/security', priority: 0.4, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changefreq: 'yearly' },
];

const toolPages = [
  'emi-calculator', 'salary-loan-eligibility', 'credit-utilization',
  'home-loan-affordability', 'dti-calculator', 'car-loan-emi-calculator',
  'credit-score-simulator', 'loan-affordability-calculator',
  'emergency-fund-calculator', 'interest-rate-comparison',
  'loan-tenure-optimizer', 'prepayment-impact-calculator',
  'business-loan-eligibility', 'education-loan-calculator',
  'credit-card-debt-payoff', 'salary-loan-mapping',
  'nbfc-vs-bank-comparison', 'monthly-budget-planner',
  'financial-health-check',
];

const salaries = [15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 75000, 80000, 100000, 125000, 150000, 200000, 250000, 300000];
const loanAmounts = [50000, 100000, 150000, 200000, 300000, 500000, 700000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000];
const cities = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad', 'jaipur', 'kochi', 'lucknow', 'chandigarh', 'indore', 'bhopal', 'nagpur', 'surat', 'vadodara', 'coimbatore', 'visakhapatnam', 'noida', 'gurugram', 'thane', 'navi-mumbai', 'ghaziabad', 'faridabad'];
const professions = ['software-engineer', 'doctor', 'teacher', 'chartered-accountant', 'freelancer', 'startup-founder', 'gig-worker', 'government-employee', 'bank-employee', 'lawyer', 'architect', 'data-scientist', 'product-manager', 'sales-executive', 'business-owner'];
const banks = ['hdfc', 'icici', 'sbi', 'axis', 'kotak', 'bajaj-finserv', 'tata-capital', 'idfc-first', 'yes-bank', 'pnb', 'bank-of-baroda', 'canara-bank', 'union-bank', 'moneytap', 'fullerton-india'];
const intents = ['poor-cibil-score', 'loan-rejected', 'high-emi-burden', 'self-employed-loan', 'no-credit-history', 'salary-credited-late', 'frequent-job-changes', 'low-salary', 'too-many-loans', 'credit-card-defaulter', 'bounced-cheques', 'loan-settlement-impact', 'joint-loan-applicant', 'loan-for-women', 'loan-after-bankruptcy'];

const fmt = (n) => n >= 10000000 ? (n / 10000000) + 'Cr' : n >= 100000 ? (n / 100000) + 'L' : n >= 1000 ? (n / 1000) + 'K' : '' + n;

const getSlugs = () => {
  const slugs = [];
  salaries.forEach(s => slugs.push(`loan-eligibility-${fmt(s).toLowerCase()}-salary`));
  loanAmounts.forEach(amt => slugs.push(`${fmt(amt).toLowerCase()}-personal-loan`));
  cities.forEach(city => slugs.push(`personal-loan-in-${city}`));
  professions.forEach(prof => slugs.push(`personal-loan-for-${prof}`));
  banks.forEach(bank => slugs.push(`${bank}-personal-loan-eligibility`));
  intents.forEach(intent => slugs.push(intent));
  return slugs;
};

function generate() {
  const today = new Date().toISOString().split('T')[0];
  const slugs = getSlugs();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  for (const page of staticPages) {
    xml += `  <url>\n    <loc>${DOMAIN}${page.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority.toFixed(2)}</priority>\n  </url>\n`;
  }

  // Tool pages
  for (const tool of toolPages) {
    xml += `  <url>\n    <loc>${DOMAIN}/tools/${tool}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n  </url>\n`;
  }

  // SEO pages
  for (const slug of slugs) {
    xml += `  <url>\n    <loc>${DOMAIN}/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.60</priority>\n  </url>\n`;
  }

  xml += '</urlset>';

  const robots = `User-agent: *
Allow: /
Allow: /tools/
Allow: /loan-approval-predictor
Allow: /blog/

Disallow: /dashboard
Disallow: /console
Disallow: /playground
Disallow: /setup-wizard
Disallow: /usage-billing
Disallow: /metrics-roi
Disallow: /sales-pipeline
Disallow: /collections
Disallow: /loan-origination
Disallow: /compliance
Disallow: /agents
Disallow: /portfolio
Disallow: /api-reference

Sitemap: ${DOMAIN}/sitemap.xml
`;

  // Write to public directory
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);

  console.log(`Generated sitemap.xml with ${staticPages.length + toolPages.length + slugs.length} pages.`);
  console.log(`Generated robots.txt pointing to ${DOMAIN}/sitemap.xml.`);
}

generate();

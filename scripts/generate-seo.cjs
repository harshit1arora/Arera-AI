const fs = require('fs');
const path = require('path');
const config = require('../src/data/seo-config.json');

const DOMAIN = 'https://www.tryarera.com';

const staticPages = [
  { path: '', priority: 1.0, changefreq: 'daily' },
  { path: '/loan-approval-predictor', priority: 0.95, changefreq: 'daily' },
  { path: '/tools', priority: 0.9, changefreq: 'weekly' },
  { path: '/upload', priority: 0.8, changefreq: 'weekly' },
  { path: '/apply', priority: 0.8, changefreq: 'weekly' },
  { path: '/blog', priority: 0.7, changefreq: 'weekly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/brand', priority: 0.5, changefreq: 'monthly' },
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

const fmt = (n) => {
  if (n >= 10000000) return (n / 10000000) + 'cr';
  if (n >= 100000) return (n / 100000) + 'l';
  if (n >= 1000) return (n / 1000) + 'k';
  return '' + n;
};

const getSlugs = () => {
  const slugs = [];

  // 1. Salary Pages
  config.salaries.forEach(s => {
    slugs.push(`loan-eligibility-${fmt(s)}-salary`);
  });

  // 2. Loan Amount Pages
  config.loanAmounts.forEach(amt => {
    slugs.push(`${fmt(amt)}-personal-loan`);
  });

  // 3. City Pages (2 variations)
  config.cities.forEach(city => {
    slugs.push(`personal-loan-in-${city}`);
    slugs.push(`home-loan-in-${city}`);
  });

  // 4. Profession Pages
  config.professions.forEach(prof => {
    slugs.push(`personal-loan-for-${prof}`);
  });

  // 5. Bank Pages (3 variations)
  config.banks.forEach(bank => {
    slugs.push(`${bank}-personal-loan-eligibility`);
    slugs.push(`${bank}-loan-rejection-reasons`);
    slugs.push(`${bank}-loan-analysis`);
  });

  // 6. Intent Pages
  config.intents.forEach(intent => {
    slugs.push(intent);
  });

  // 7. Salary + Profession (20 salaries, 15 professions)
  const subSalaries = config.salaries.slice(0, 20);
  const subProfessions = config.professions.slice(0, 15);
  subSalaries.forEach(s => {
    const sl = fmt(s);
    subProfessions.forEach(prof => {
      slugs.push(`loan-eligibility-${sl}-salary-for-${prof}`);
    });
  });

  // 8. Bank + Profession (10 banks, 10 professions)
  const subBanks = config.banks.slice(0, 10);
  const subProfessions2 = config.professions.slice(0, 10);
  subBanks.forEach(bank => {
    subProfessions2.forEach(prof => {
      slugs.push(`${bank}-personal-loan-for-${prof}`);
    });
  });

  // 9. Bank + Salary (10 banks, 15 salaries)
  const subSalaries2 = config.salaries.slice(0, 15);
  subBanks.forEach(bank => {
    subSalaries2.forEach(s => {
      slugs.push(`${bank}-loan-eligibility-for-${fmt(s)}-salary`);
    });
  });

  // 10. Profession + City (15 professions, 15 cities)
  const subProfessions3 = config.professions.slice(0, 15);
  const subCities = config.cities.slice(0, 15);
  subProfessions3.forEach(prof => {
    subCities.forEach(city => {
      slugs.push(`personal-loan-for-${prof}-in-${city}`);
    });
  });

  // 11. Datasets
  slugs.push('average-approval-score-by-profession');
  slugs.push('most-common-rejection-reasons');
  slugs.push('financial-trends-by-salary-range');
  slugs.push('emi-stress-trends');

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

  // Programmatic SEO pages
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

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowRight, ChevronDown, ChevronUp, Zap, BookOpen, Calculator, Home as HomeIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSEOPage, getPagesByCategory, SEO_CATEGORIES, type SEOPage } from '../../data/seo-content';

const DOMAIN = 'https://tryarera.com';

const toolRoutes: Record<string, string> = {
  'loan-approval-predictor': '/loan-approval-predictor',
  'emi-calculator': '/tools/emi-calculator',
  'salary-loan-eligibility': '/tools/salary-loan-eligibility',
  'dti-calculator': '/tools/dti-calculator',
  'credit-utilization': '/tools/credit-utilization',
  'home-loan-affordability': '/tools/home-loan-affordability',
};

function Breadcrumbs({ items }: { items: { label: string; path: string }[] }) {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem', position: i + 1,
      name: item.label,
      ...(item.path ? { item: DOMAIN + item.path } : {}),
    })),
  });

  return (
    <>
      <Helmet><script type="application/ld+json">{jsonLd}</script></Helmet>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-gray-600">/</span>}
            {item.path ? (
              <Link to={item.path} className="hover:text-orange-400 transition-colors">{item.label}</Link>
            ) : (
              <span className="text-gray-300">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
}

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-white/10 rounded-xl overflow-hidden hover:border-orange-500/20 transition-all">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left gap-4">
            <span className="text-base font-semibold text-white">{faq.q}</span>
            {open === i ? <ChevronUp className="w-5 h-5 text-orange-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
          </button>
          {open === i && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5">
              <p className="text-gray-400 leading-relaxed">{faq.a}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

function RelatedLinks({ pages, tools }: { pages: string[]; tools: string[] }) {
  const navigate = useNavigate();
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {tools.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-orange-500" /> Related Tools
          </h3>
          <div className="space-y-2">
            {tools.map(tool => {
              const path = toolRoutes[tool] || `/tools/${tool}`;
              const label = tool.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
              return (
                <Link key={tool} to={path} className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-400 transition-colors py-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />{label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {pages.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" /> Related Guides
          </h3>
          <div className="space-y-2">
            {pages.map(slug => {
              const label = slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
              return (
                <Link key={slug} to={`/${slug}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-400 transition-colors py-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />{label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PredictorCTA() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0A0A0A] border border-orange-500/20 rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3">Stop Guessing. Know Your Exact Odds.</h3>
        <p className="text-gray-400 mb-6 max-w-xl">
          Reading guides is step one. Step two is running our AI engine against your actual profile to predict your exact approval probability across 7+ lenders.
        </p>
        <Button onClick={() => navigate('/loan-approval-predictor')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-xl text-lg font-bold group">
          Check My Approval Odds <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

const DynamicSEOPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  if (!slug) return <div className="min-h-screen bg-[#050505]" />;

  const data = getSEOPage(slug);

  // Fallback for unknown slugs
  if (!data) {
    const cleanTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const fallback: SEOPage = {
      slug, title: `${cleanTitle} | Arera AI`, h1: cleanTitle,
      description: `Learn about ${cleanTitle.toLowerCase()} and how it impacts your loan eligibility.`,
      content: `This is a comprehensive guide for ${cleanTitle}. Use our AI predictor to check your exact approval odds.`,
      category: 'dynamic', schema: 'Article',
      faqs: [{ q: `What is ${cleanTitle}?`, a: `${cleanTitle} is a factor in loan eligibility. Use our tools for a personalized analysis.` }],
      relatedTools: ['loan-approval-predictor'], relatedPages: [],
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: cleanTitle, path: '' }],
    };
    return renderPage(fallback);
  }

  return renderPage(data);
};

function renderPage(data: SEOPage) {
  const faqSchema = data.faqs.length > 0 ? JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: data.faqs.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }) : null;

  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: data.h1, description: data.description,
    publisher: { '@type': 'Organization', name: 'Arera AI', url: DOMAIN },
    datePublished: '2025-01-01', dateModified: new Date().toISOString().split('T')[0],
  });

  const paragraphs = data.content.split('\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-orange-500/30">
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        <link rel="canonical" href={`${DOMAIN}/${data.slug}`} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:url" content={`${DOMAIN}/${data.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.description} />
        <script type="application/ld+json">{articleSchema}</script>
        {faqSchema && <script type="application/ld+json">{faqSchema}</script>}
      </Helmet>

      <Navbar />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <Breadcrumbs items={data.breadcrumbs} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-400 capitalize">{data.category} Guide</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white leading-tight">
              {data.h1}
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">{data.description}</p>
          </motion.div>

          {/* Main Content */}
          <article className="prose prose-invert prose-orange max-w-none mb-16">
            {paragraphs.map((p, i) => {
              if (p.startsWith('•')) {
                return <li key={i} className="text-gray-300 leading-relaxed ml-4 list-disc">{p.replace('• ', '')}</li>;
              }
              return <p key={i} className="text-lg text-gray-300 leading-loose mb-4">{p}</p>;
            })}
          </article>

          {/* Predictor CTA */}
          <div className="mb-16"><PredictorCTA /></div>

          {/* FAQ Section */}
          {data.faqs.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8">People Also Ask</h2>
              <FAQAccordion faqs={data.faqs} />
            </section>
          )}

          {/* Related Links */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Explore More</h2>
            <RelatedLinks pages={data.relatedPages} tools={data.relatedTools} />
          </section>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Ready to Check Your Loan Eligibility?</h3>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">Join 2 lakh+ users who checked their odds before applying. Free, instant, no CIBIL impact.</p>
            <Button size="lg" onClick={() => window.location.href = '/loan-approval-predictor'}
              className="h-14 px-8 text-lg font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/25">
              Run AI Analysis <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DynamicSEOPage;

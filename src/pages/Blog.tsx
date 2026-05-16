import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const POSTS = [
  {
    slug: "underwriting-for-nbfcs",
    title: "The Future of Underwriting for NBFCs",
    excerpt: "How automated, deterministic rules engines are replacing manual credit teams and improving accuracy.",
    date: "2025-05-10"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Arera Blog | Underwriting Insights</title>
        <meta name="description" content="Read the latest insights on automated underwriting, RBI compliance, and NBFC technology." />
        <link rel="canonical" href="https://www.tryarera.com/blog" />
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold font-['DM_Sans'] text-foreground mb-12">Blog</h1>
        <div className="grid gap-8">
          {POSTS.map(post => (
            <article key={post.slug} className="border border-border p-6 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <h2 className="text-2xl font-bold font-['DM_Sans'] text-foreground mb-2">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-muted-foreground font-['DM_Sans'] mb-4">{post.excerpt}</p>
              <div className="text-sm font-['JetBrains_Mono'] text-foreground/60">{post.date}</div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
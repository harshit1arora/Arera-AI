import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const POSTS: Record<string, any> = {
  "underwriting-for-nbfcs": {
    title: "The Future of Underwriting for NBFCs",
    excerpt: "How automated, deterministic rules engines are replacing manual credit teams and improving accuracy.",
    content: "The landscape of NBFC underwriting in India is changing rapidly. With RBI's latest guidelines, deterministic and explainable models are required. This post explores how Arera helps NBFCs stay compliant while reducing processing time from hours to seconds.",
    date: "2025-05-10"
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? POSTS[slug] : null;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "author": { "@type": "Organization", "name": "Arera" },
    "publisher": { "@type": "Organization", "name": "Arera", "logo": "https://www.tryarera.com/arera-logo.png" },
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString()
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{post.title} | Arera Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://www.tryarera.com/blog/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-24 max-w-3xl">
        <article>
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-['DM_Sans'] text-foreground mb-4 leading-tight">{post.title}</h1>
            <div className="text-muted-foreground font-['JetBrains_Mono']">{post.date}</div>
          </header>
          <div className="prose prose-invert max-w-none font-['DM_Sans'] text-foreground/80 leading-relaxed">
            <p>{post.content}</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BLOG_POSTS } from "@/data/blog-posts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

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
          <div className="prose prose-invert prose-orange max-w-none font-['DM_Sans'] text-foreground/80 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

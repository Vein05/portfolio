import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Copy, Check } from 'lucide-react';
import Breadcrumb from '../../components/blog/Breadcrumb';
import BlogLayout from '../../components/blog/BlogLayout';
import { posts } from '../../data/posts';

const CopyableCodeBlock = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const handleCopy = () => {
    const text = ref.current?.querySelector('code')?.innerText ?? '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group/code my-6">
      <pre ref={ref} {...props} className="!my-0">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded opacity-0 group-hover/code:opacity-100 transition-opacity duration-150 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

const parseMarkdown = (markdownString) => {
  const fileString = markdownString.trim();
  
  if (!fileString.startsWith('---')) {
    return { frontmatter: {}, body: fileString };
  }

  // Find the exact positions of the bounding fences
  const firstFenceEnd = 3; 
  const nextFenceStart = fileString.indexOf('\n---', firstFenceEnd);
  
  if (nextFenceStart === -1) {
    // Malformed frontmatter
    return { frontmatter: {}, body: fileString };
  }

  const rawFrontmatter = fileString.slice(firstFenceEnd, nextFenceStart).trim();
  const body = fileString.slice(nextFenceStart + 4).trim(); // +4 for \n---

  const frontmatter = {};
  rawFrontmatter.split('\n').forEach(line => {
    const splitIndex = line.indexOf(':');
    if (splitIndex > -1) {
      const key = line.slice(0, splitIndex).trim();
      let value = line.slice(splitIndex + 1).trim();
      // Remove surrounding quotes if they exist
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
};

const BlogPost = () => {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Look up metadata from the central index
  const postMeta = posts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    
    // Fetch the raw markdown file from the public folder
    fetch(`/posts/${slug}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Post not found');
        }
        return response.text();
      })
      .then(text => {
        const { body } = parseMarkdown(text);
        setMarkdown(body);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading post:", err);
        setError(true);
        setIsLoading(false);
      });
  }, [slug]);

  if (!postMeta && !isLoading) {
    return <Navigate to="/404" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-custom text-ink-dark mb-4">Post not found</h1>
          <p className="font-serif text-ink-muted mb-8">The requested article could not be loaded.</p>
          <a href="/blog" className="text-ink-blue underline">Return to Blog</a>
        </div>
      </div>
    );
  }

  // Structured data for rich search results
  const jsonLd = postMeta ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": postMeta.title,
    "datePublished": postMeta.date,
    "description": postMeta.excerpt,
    "author": {
      "@type": "Person",
      "name": "Sugam Panthi",
      "url": "https://sugampanthi.com"
    }
  } : null;

  return (
    <div className="min-h-screen bg-paper-light">
      {postMeta && (
        <Helmet>
          <title>{`${postMeta.title} - Sugam Panthi`}</title>
          <meta name="description" content={postMeta.excerpt} />
          <meta property="og:title" content={postMeta.title} />
          <meta property="og:description" content={postMeta.excerpt} />
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={postMeta.date} />
          <meta name="twitter:card" content="summary_large_image" />
          {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
        </Helmet>
      )}

      <Breadcrumb title={postMeta?.title} status={postMeta?.status} />

      <BlogLayout hideToc={isLoading}>
        {isLoading ? (
          <div className="animate-pulse space-y-8 mt-8">
            <div className="h-12 bg-border-paper/50 rounded w-3/4"></div>
            <div className="h-4 bg-border-paper/50 rounded w-1/4 mb-12"></div>
            <div className="space-y-4">
              <div className="h-4 bg-border-paper/50 rounded w-full"></div>
              <div className="h-4 bg-border-paper/50 rounded w-full"></div>
              <div className="h-4 bg-border-paper/50 rounded w-5/6"></div>
            </div>
          </div>
        ) : (
          <>
            <header className="mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-ink-dark mb-6 leading-[1.15] tracking-tight">
                {postMeta?.title}
              </h1>
              <div className="flex items-center gap-4 text-sm uppercase tracking-wider text-ink-muted">
                <time dateTime={postMeta?.date}>
                  {postMeta && new Date(postMeta.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
                <span className="hidden sm:inline">•</span>
                <span className="text-ink-blue hidden sm:inline">{postMeta?.category}</span>
              </div>
            </header>

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{ pre: CopyableCodeBlock }}
            >
              {markdown}
            </ReactMarkdown>
            
            <footer className="mt-20 pt-8 border-t border-border-paper">
              <p className="text-sm italic text-ink-muted">
                Thanks for reading. If you enjoyed this piece, consider sharing it.
              </p>
            </footer>
          </>
        )}
      </BlogLayout>
    </div>
  );
};

export default BlogPost;

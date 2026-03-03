import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import 'highlight.js/styles/atom-one-dark.css';
import Breadcrumb from '../../components/blog/Breadcrumb';
import BlogLayout from '../../components/blog/BlogLayout';
import RichMarkdown from '../../components/blog/RichMarkdown';
import { posts } from '../../data/posts';

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

const stripLeadingTitleHeading = (body, title) => {
  if (!title || !body) return body;

  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const titleHeadingRegex = new RegExp(`^#\\s+${escapedTitle}\\s*\\n+`, 'i');
  return body.replace(titleHeadingRegex, '');
};

const BlogPost = () => {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Look up metadata from the central index
  const postMeta = posts.find(p => p.slug === slug);
  const seriesPosts = postMeta?.series
    ? posts
        .filter((p) => p.series === postMeta.series)
        .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
    : [];
  const currentSeriesIndex = seriesPosts.findIndex((p) => p.slug === slug);
  const prevSeriesPost = currentSeriesIndex > 0 ? seriesPosts[currentSeriesIndex - 1] : null;
  const nextSeriesPost =
    currentSeriesIndex >= 0 && currentSeriesIndex < seriesPosts.length - 1
      ? seriesPosts[currentSeriesIndex + 1]
      : null;
  const siteUrl = 'https://sugampanthi.com.np';
  const canonicalPath = postMeta?.canonicalPath || `/blog/${postMeta?.slug || slug}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const seriesNavItems = seriesPosts.map((post, index) => ({
    id: post.slug,
    href: `/blog/${post.slug}`,
    label: post.title.replace(/^Getting Started with Go for Web Services \(Part \d+\):\s*/i, ''),
    number: `${index + 1}.`,
    currentLabel: post.slug === slug ? 'You are here' : undefined,
  }));

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
        setMarkdown(stripLeadingTitleHeading(body, postMeta?.title));
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading post:", err);
        setError(true);
        setIsLoading(false);
      });
  }, [slug, postMeta?.title]);

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
    "headline": postMeta.seoTitle || postMeta.title,
    "datePublished": postMeta.date,
    "description": postMeta.seoDescription || postMeta.excerpt,
    "mainEntityOfPage": canonicalUrl,
    "keywords": postMeta.tags?.join(', '),
    "author": {
      "@type": "Person",
      "name": "Sugam Panthi",
      "url": "https://sugampanthi.com.np"
    }
  } : null;

  return (
    <div className="min-h-screen bg-paper-light">
      {postMeta && (
        <Helmet>
          <title>{postMeta.seoTitle || `${postMeta.title} - Sugam Panthi`}</title>
          <meta name="description" content={postMeta.seoDescription || postMeta.excerpt} />
          <meta name="keywords" content={postMeta.tags?.join(', ')} />
          <link rel="canonical" href={canonicalUrl} />
          {prevSeriesPost && <link rel="prev" href={`${siteUrl}/blog/${prevSeriesPost.slug}`} />}
          {nextSeriesPost && <link rel="next" href={`${siteUrl}/blog/${nextSeriesPost.slug}`} />}
          <meta property="og:title" content={postMeta.seoTitle || postMeta.title} />
          <meta property="og:description" content={postMeta.seoDescription || postMeta.excerpt} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="article:published_time" content={postMeta.date} />
          <meta property="article:section" content={postMeta.category} />
          {postMeta.tags?.map((tag) => (
            <meta property="article:tag" content={tag} key={tag} />
          ))}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={postMeta.seoTitle || postMeta.title} />
          <meta name="twitter:description" content={postMeta.seoDescription || postMeta.excerpt} />
          {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
        </Helmet>
      )}

      <Breadcrumb title={postMeta?.title} status={postMeta?.status} />

      <BlogLayout hideToc={isLoading} seriesItems={seriesNavItems} currentSeriesId={slug}>
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

            <RichMarkdown markdown={markdown} />
            
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

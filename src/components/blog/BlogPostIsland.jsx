import React, { useState } from 'react';
import BlogLayout from './BlogLayout';
import RichMarkdown from './RichMarkdown';

/**
 * Astro island — renders the blog post body.
 * All data (markdown string, post meta, series nav) is passed as props from the Astro page.
 * No react-router-dom, no fetch — Astro handles the markdown at build time.
 */
const BlogPostIsland = ({ markdown = '', postMeta = null, seriesNavItems = [], slug = '' }) => {
  const [isLoading] = useState(false);

  if (!postMeta) {
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

  return (
    <BlogLayout hideToc={isLoading} seriesItems={seriesNavItems} currentSeriesId={slug}>
      <header className="mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-ink-dark mb-6 leading-[1.15] tracking-tight">
          {postMeta.title}
        </h1>
        <div className="flex items-center gap-4 text-sm uppercase tracking-wider text-ink-muted">
          <time dateTime={postMeta.date}>
            {new Date(postMeta.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
          <span className="hidden sm:inline">•</span>
          <span className="text-ink-blue hidden sm:inline">{postMeta.category}</span>
        </div>
      </header>

      <RichMarkdown markdown={markdown} />

      <footer className="mt-20 pt-8 border-t border-border-paper">
        <p className="text-sm italic text-ink-muted">
          Thanks for reading. If you enjoyed this piece, consider sharing it.
        </p>
      </footer>
    </BlogLayout>
  );
};

export default BlogPostIsland;

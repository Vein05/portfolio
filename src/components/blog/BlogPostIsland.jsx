import React, { useState } from 'react';
import BlogLayout from './BlogLayout';
import RichMarkdown from './RichMarkdown';
import KitchenSprite from './KitchenSprite';
import { Check, Copy } from 'lucide-react';

/**
 * Astro island — renders the blog post body.
 * All data (markdown string, post meta, series nav) is passed as props from the Astro page.
 * No react-router-dom, no fetch — Astro handles the markdown at build time.
 */
const BlogPostIsland = ({ markdown = '', postMeta = null, seriesNavItems = [], slug = '', pantryIngredients = [] }) => {
  const [isLoading] = useState(false);
  const [markdownCopied, setMarkdownCopied] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setMarkdownCopied(true);
      window.setTimeout(() => setMarkdownCopied(false), 1800);
    } catch {
      setMarkdownCopied(false);
    }
  };

  const copyMarkdownButton = (
    <button
      type="button"
      className="post-copy-markdown-btn"
      onClick={handleCopyMarkdown}
      aria-label="Copy post markdown"
      title="Copy post markdown"
    >
      {markdownCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{markdownCopied ? 'Copied' : 'Markdown'}</span>
    </button>
  );

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
    <BlogLayout hideToc={isLoading} seriesItems={seriesNavItems} currentSeriesId={slug} pantryIngredients={pantryIngredients}>
      <header className="mb-12 md:mb-16 relative">
        <div className="md:pr-52">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-ink-dark mb-6 leading-[1.15] tracking-tight">
            {postMeta.title}
          </h1>
          <div className="flex items-center gap-4 text-sm uppercase tracking-wider text-ink-muted">
            <time dateTime={postMeta.date}>
              {new Date(postMeta.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
            </time>
            <span className="hidden sm:inline">•</span>
            <span className="text-ink-blue hidden sm:inline">{postMeta.category}</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end gap-3 absolute top-0 right-0">
          {postMeta.status && (
            <div className="flex flex-col items-center gap-1.5">
              <div className="post-header-action-row">
                <KitchenSprite status={postMeta.status.toLowerCase()} size={72} />
                {copyMarkdownButton}
              </div>
              <div className="post-kitchen-strip" aria-label="Article context">
                <span>
                  Type <strong>{postMeta.category}</strong>
                </span>
                <span>
                  State <strong>{postMeta.status.toLowerCase()}</strong>
                </span>
                {postMeta.series && postMeta.seriesOrder && (
                  <span>
                    Series <strong>part {postMeta.seriesOrder}</strong>
                  </span>
                )}
              </div>
            </div>
          )}
          {!postMeta.status && copyMarkdownButton}
        </div>
        {/* Mobile fallback — compact metadata strip */}
        <div className="md:hidden mt-4 flex items-start justify-start gap-3">
          <div className="post-kitchen-strip post-kitchen-strip--mobile" aria-label="Article context">
            <span>
              Type <strong>{postMeta.category}</strong>
            </span>
            {postMeta.status && (
              <span>
                State <strong>{postMeta.status.toLowerCase()}</strong>
              </span>
            )}
            {postMeta.series && postMeta.seriesOrder && (
              <span>
                Series <strong>part {postMeta.seriesOrder}</strong>
              </span>
            )}
            {postMeta.status && (
              <span className="post-kitchen-sprite-cell" aria-hidden="true">
                <KitchenSprite status={postMeta.status.toLowerCase()} size={32} />
              </span>
            )}
          </div>
          {copyMarkdownButton}
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

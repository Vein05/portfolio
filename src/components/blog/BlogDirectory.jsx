import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Github, Search, X } from 'lucide-react';
import { posts } from '../../data/posts';
import Breadcrumb from '../../components/blog/Breadcrumb';
import SidebarNav from '../../components/SidebarNav';

const BlogDirectory = () => {
  const REPO_URL = 'https://github.com/vein05/portfolio';
  const POSTS_DIR_URL = 'https://github.com/vein05/portfolio/tree/main/public/posts';
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = useMemo(
    () => ['all', ...new Set(posts.map((post) => post.category.toLowerCase()))],
    []
  );

  const topTags = useMemo(() => {
    const counts = posts.reduce((acc, post) => {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 7);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const visiblePosts = useMemo(() => {
    const base = posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory;
      const matchesTag =
        selectedTag === 'all' ||
        post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [post.title, post.excerpt, post.category, post.tags.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesTag && matchesQuery;
    });

    return base.sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.date) - new Date(a.date);
    });
  }, [normalizedQuery, selectedCategory, selectedTag, sortBy]);

  const clearFilters = () => {
    setQuery('');
    setSelectedTag('all');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper-light tech-paper-page">
      <Helmet>
        <title>Blog - Sugam Panthi</title>
        <meta name="description" content="Thoughts on engineering, design, and machine learning by Sugam Panthi." />
        <meta property="og:title" content="Blog - Sugam Panthi" />
        <meta property="og:url" content="https://sugampanthi.com.np/blog" />
      </Helmet>

      <Breadcrumb />

      {/* Decorative noise panels for layout structure */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] body-container tech-grid">
        
        {/* Left Gutter */}
        <div className="sidebar-panel hidden lg:flex flex-col border-r border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)]">
          <SidebarNav
            title="Categories"
            items={categories.map((category) => ({
              id: category,
              label: category === 'all' ? 'All Posts' : category,
            }))}
            activeId={selectedCategory}
            onItemClick={(item, event) => {
              event.preventDefault();
              setSelectedCategory(item.id);
            }}
          />
        </div>

        {/* Main Content Area */}
        <main className="w-full px-6 sm:px-8 lg:px-10 py-8 lg:py-12">
          <header className="mb-10 md:mb-12 directory-header">
            <div className="title-row">
              <div className="title-main">
                <h1 className="text-4xl md:text-5xl text-ink-dark mb-3 tracking-tight">Writing</h1>
                <p className="text-base text-ink-muted max-w-2xl">
                  Thoughts on engineering, design, and building software.
                </p>
              </div>
              <div className="controls-source-links title-links">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="source-link"
                  aria-label="Open GitHub repository"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                </a>
                <a
                  href={POSTS_DIR_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="source-link"
                  aria-label="Open markdown posts folder on GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>MD Folder</span>
                </a>
              </div>
            </div>
          </header>

          <section className="directory-controls border border-border-paper mb-5">
            <div className="controls-top-row p-4 md:p-5 border-b border-border-paper">
              <div className="controls-search-wrap">
                <label htmlFor="blog-search" className="sr-only">Search posts</label>
                <Search className="w-4 h-4 controls-search-icon" aria-hidden="true" />
                <input
                  id="blog-search"
                  type="search"
                  placeholder="Search title, excerpt, tag..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="controls-search-input"
                />
                {query && (
                  <button
                    type="button"
                    className="controls-clear-btn"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="controls-right-wrap">
                <div className="controls-sort-wrap">
                  <label htmlFor="sort-by" className="text-[11px] uppercase tracking-widest text-ink-muted font-mono">
                    Sort
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="controls-sort-select"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="controls-chip-row p-4 md:p-5">
              <div className="controls-meta">
                <span className="text-[11px] uppercase tracking-widest text-ink-muted font-mono">
                  Top Topics
                </span>
                <span className="text-[11px] uppercase tracking-widest text-ink-muted/80 font-mono">
                  {visiblePosts.length} result{visiblePosts.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="controls-chips">
                <button
                  type="button"
                  onClick={() => setSelectedTag('all')}
                  className={`topic-chip ${selectedTag === 'all' ? 'active' : ''}`}
                >
                  All Topics
                </button>
                {topTags.map(([tag, count]) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`topic-chip ${selectedTag === tag ? 'active' : ''}`}
                  >
                    {tag}
                    <span className="chip-count">{count}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="controls-reset-btn"
                disabled={
                  query.length === 0 &&
                  selectedTag === 'all' &&
                  selectedCategory === 'all' &&
                  sortBy === 'newest'
                }
              >
                Reset
              </button>
            </div>
          </section>

          <div className="border border-border-paper directory-list directory-grid">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group block bg-paper-light transition-all duration-300 directory-row directory-card"
                >
                  <article className="p-4 md:p-6 directory-row-inner">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                      <span className="text-xs uppercase tracking-wider text-ink-blue group-hover:text-ink-blue/80 font-mono">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-ink-muted group-hover:text-paper-light/60 font-mono">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                        </time>
                        {post.status && (
                          <span className="px-2 py-0.5 border border-border-paper group-hover:border-paper-light/35 text-ink-muted group-hover:text-paper-light/70">
                            {post.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl text-ink-dark group-hover:text-paper-light mb-3 transition-colors duration-300">
                      {post.title}
                    </h2>

                    <p className="text-ink-muted group-hover:text-paper-light/65 leading-relaxed mb-5 transition-colors duration-300">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-xs border border-border-paper group-hover:border-paper-light/35 px-2 py-0.5 text-ink-muted group-hover:text-paper-light/70 font-mono uppercase tracking-wide transition-colors duration-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-paper-light/70 transform group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="px-4 md:px-6 py-10 text-center directory-empty">
                <p className="text-ink-dark text-lg mb-2">No posts match these filters.</p>
                <p className="text-ink-muted text-sm mb-5">Try another search term, tag, category, or sort option.</p>
                <button type="button" onClick={clearFilters} className="controls-reset-btn">
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogDirectory;

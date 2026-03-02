import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { posts } from '../../data/posts';
import Breadcrumb from '../../components/blog/Breadcrumb';
import SidebarNav from '../../components/SidebarNav';

const BlogDirectory = () => {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper-light">
      <Helmet>
        <title>Blog - Sugam Panthi</title>
        <meta name="description" content="Thoughts on engineering, design, and machine learning by Sugam Panthi." />
        <meta property="og:title" content="Blog - Sugam Panthi" />
        <meta property="og:url" content="https://sugampanthi.com/blog" />
      </Helmet>

      <Breadcrumb />

      {/* Decorative noise panels for layout structure */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_240px] xl:grid-cols-[280px_minmax(0,1fr)_280px] body-container">
        
        {/* Left Gutter */}
        <div className="sidebar-panel hidden lg:flex flex-col border-r border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)]">
          <SidebarNav
            title="Categories"
            items={[
              { id: "all", label: "All Posts" },
              { id: "engineering", label: "Engineering" },
              { id: "design", label: "Design" },
              { id: "career", label: "Career" },
            ]}
            activeId="all"
          />
        </div>

        {/* Main Content Area */}
        <main className="w-full max-w-4xl mx-auto px-6 sm:px-10 py-8 lg:py-12">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl text-ink-dark mb-3 tracking-tight">Writing</h1>
            <p className="text-base text-ink-muted max-w-2xl">
              Thoughts on engineering, design, and building software.
            </p>
          </header>

          <div className="space-y-px border border-border-paper">
            {sortedPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block border-b border-border-paper last:border-b-0 bg-paper-light hover:bg-ink-dark transition-colors duration-200"
              >
                <article className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                    <span className="text-xs uppercase tracking-wider text-ink-blue group-hover:text-ink-blue/70 font-mono">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-ink-muted group-hover:text-paper-light/40 font-mono">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </time>
                      {post.status && (
                        <span className="px-2 py-0.5 border border-border-paper group-hover:border-paper-light/20 text-ink-muted group-hover:text-paper-light/40">
                          {post.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl text-ink-dark group-hover:text-paper-light mb-3 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-ink-muted group-hover:text-paper-light/50 leading-relaxed mb-5 transition-colors">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs border border-border-paper group-hover:border-paper-light/20 px-2 py-0.5 text-ink-muted group-hover:text-paper-light/40 font-mono uppercase tracking-wide transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-paper-light/50 transform group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </main>

        {/* Right Gutter */}
        <div className="sidebar-panel hidden lg:block border-l border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)]">
        </div>
        
      </div>
    </div>
  );
};

export default BlogDirectory;

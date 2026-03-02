import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ title, status }) => {
  const location = useLocation();
  const isBlog = location.pathname.startsWith('/blog');
  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className="breadcrumb-bar sticky top-0 z-40 w-full flex">

      <div className="hidden lg:flex items-center flex-shrink-0 w-[240px] xl:w-[280px] px-6 py-3 border-r border-[#2e2e24]">
        <Link
          to="/"
          className="text-sm uppercase tracking-widest text-paper-light font-medium whitespace-nowrap hover:text-ink-blue transition-colors"
        >
          Sugam Panthi
        </Link>
      </div>

      {/* Breadcrumb path — main content area */}
      <div className="flex-1 px-6 sm:px-12 py-3 flex items-center justify-between min-w-0">
        <nav className="flex items-center space-x-2 text-sm uppercase tracking-wide text-paper-light">

          {/* Mobile: always show brand since sidebar slot is hidden */}
          <Link to="/" className="lg:hidden hover:text-ink-blue transition-colors">
            Sugam Panthi
          </Link>

          {/* Path crumbs */}
          {isHome ? (
            /* On home, just a subtle em-dash placeholder on desktop */
            <span className="hidden lg:inline text-paper-light opacity-30 text-xs tracking-widest">—</span>
          ) : (
            <>
              {/* Mobile separator after brand */}
              <ChevronRight className="lg:hidden w-4 h-4 text-ink-muted" />
              <Link to="/" className="hover:text-ink-blue transition-colors">Home</Link>
              {isBlog && (
                <>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                  <Link to="/blog" className="hover:text-ink-blue transition-colors">Blog</Link>
                </>
              )}
              {title && (
                <>
                  <ChevronRight className="w-4 h-4 text-ink-muted hidden sm:block" />
                  <span
                    className="hidden sm:block text-paper-light opacity-80 truncate max-w-[200px] md:max-w-md"
                    title={title}
                  >
                    {title}
                  </span>
                </>
              )}
            </>
          )}
        </nav>

        {/* Status badge */}
        {status && (
          <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
            <span className="text-xs uppercase tracking-wider text-paper-light opacity-60">Status:</span>
            <span className="px-2 py-0.5 text-xs uppercase tracking-wider bg-ink-blue text-white rounded-sm outline outline-1 outline-offset-1 outline-ink-blue">
              {status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;

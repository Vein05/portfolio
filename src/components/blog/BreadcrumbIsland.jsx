import React from 'react';
import { ChevronRight, Moon, Sun } from 'lucide-react';

/**
 * Astro-compatible Breadcrumb — receives `currentPath` as a prop
 * instead of calling useLocation() so it works as a React island.
 */
const BreadcrumbIsland = ({ title = null, status = null, currentPath = '/' }) => {
  const isBlog = currentPath.startsWith('/blog');
  const isHome = currentPath === '/' || currentPath === '/home';
  const [theme, setTheme] = React.useState('daylight');

  React.useEffect(() => {
    const current = document.documentElement.dataset.theme === 'dim' ? 'dim' : 'daylight';
    setTheme(current);
  }, []);

  const nextTheme = theme === 'dim' ? 'daylight' : 'dim';
  const toggleTheme = () => {
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('portfolio-theme', nextTheme);
    } catch {
      // Theme persistence is optional; the visual state still updates.
    }
    setTheme(nextTheme);
  };

  return (
    <div className="breadcrumb-bar sticky top-0 z-40 w-full flex">
      <div className="hidden lg:flex items-center flex-shrink-0 w-[240px] xl:w-[280px] px-6 py-3 border-r border-bar-border">
        <a
          href="/"
          className="text-sm uppercase tracking-widest text-paper-light font-medium whitespace-nowrap hover:text-ink-blue transition-colors"
        >
          Sugam Panthi
        </a>
      </div>

      {/* Breadcrumb path — main content area */}
      <div className="flex-1 px-6 sm:px-12 py-3 flex items-center justify-between min-w-0">
        <nav className="flex items-center space-x-2 text-sm uppercase tracking-wide text-paper-light">

          {/* Mobile: always show brand since sidebar slot is hidden */}
          <a href="/" className="lg:hidden hover:text-ink-blue transition-colors">
            Sugam Panthi
          </a>

          {/* Path crumbs */}
          {isHome ? (
            <span className="hidden lg:inline text-paper-light opacity-30 text-xs tracking-widest">—</span>
          ) : (
            <>
              <ChevronRight className="lg:hidden w-4 h-4 text-ink-muted" />
              <a href="/" className="hover:text-ink-blue transition-colors">Home</a>
              {isBlog && (
                <>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                  <a href="/blog" className="hover:text-ink-blue transition-colors">Blog</a>
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

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          {isHome && (
            <a
              href="/blog"
              className="lg:hidden flex-shrink-0 text-xs uppercase tracking-widest text-paper-light/60 hover:text-ink-blue transition-colors"
            >
              Blog →
            </a>
          )}

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme === 'dim' ? 'dim' : 'daylight'} theme`}
            title={`Switch to ${nextTheme === 'dim' ? 'Dim' : 'Daylight'}`}
          >
            {theme === 'dim' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{theme === 'dim' ? 'Dim' : 'Daylight'}</span>
          </button>

          {/* Status badge */}
          {status && (
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider text-paper-light opacity-60">Status:</span>
              <span className="px-2 py-0.5 text-xs uppercase tracking-wider bg-ink-blue text-white rounded-sm outline outline-1 outline-offset-1 outline-ink-blue">
                {status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbIsland;

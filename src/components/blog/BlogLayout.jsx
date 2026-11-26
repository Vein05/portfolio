import React, { useState, useEffect } from 'react';
import TableOfContents from './TableOfContents';
import Pantry from './Pantry';
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const BlogLayout = ({ children, hideToc = false, seriesItems = [], currentSeriesId = '', pantryIngredients = [] }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop sidebar; remembered across posts

  useEffect(() => {
    if (window.localStorage.getItem('blog-sidebar-open') === '0') setSidebarOpen(false);
  }, []);

  const toggleSidebar = (open) => {
    setSidebarOpen(open);
    window.localStorage.setItem('blog-sidebar-open', open ? '1' : '0');
  };

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkViewport();
    
    // Listen for resize
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <div className={`w-full min-h-screen grid grid-cols-1 ${sidebarOpen ? 'lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]' : ''}`}>
      
      {/* Left Sidebar (Desktop only) */}
      <aside className={`sidebar-panel hidden ${sidebarOpen ? 'lg:block' : ''} border-r border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)] overflow-y-auto`}>
        <button
          type="button"
          onClick={() => toggleSidebar(false)}
          className="absolute top-3 right-3 z-10 p-1.5 text-ink-muted hover:text-ink-dark"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
        {!hideToc && <TableOfContents seriesItems={seriesItems} currentSeriesId={currentSeriesId} />}
        {pantryIngredients.length > 0 && <Pantry ingredients={pantryIngredients} />}
      </aside>

      {/* Reopen button while the desktop sidebar is closed */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => toggleSidebar(true)}
          className="hidden lg:flex fixed left-0 top-[3.5rem] z-20 items-center gap-2 px-3 py-2 border border-l-0 border-t-0 border-border-paper bg-paper-surface text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink-dark"
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <PanelLeftOpen className="w-4 h-4" />
          <span>Contents</span>
        </button>
      )}

      {/* Main Content Area */}
      <main className="body-container w-full px-6 sm:px-10 py-4 lg:py-4">
        
        {/* Mobile ToC Collapsible */}
        {isMobile && !hideToc && (
          <div className="mb-6 border border-border-paper bg-paper-surface">
            <button 
              onClick={() => setTocOpen(!tocOpen)}
              className="w-full flex items-center justify-between p-3 text-xs font-mono uppercase tracking-widest text-ink-dark"
            >
              <span>Table of Contents</span>
              {tocOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {tocOpen && (
              <div className="border-t border-border-paper py-3 pb-5">
                <TableOfContents seriesItems={seriesItems} currentSeriesId={currentSeriesId} />
              </div>
            )}
          </div>
        )}

        {/* The beautiful serif prose */}
        <article className="blog-prose w-full">
          {children}
        </article>
      </main>

    </div>
  );
};

export default BlogLayout;

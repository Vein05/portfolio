import React, { useState, useEffect } from 'react';
import TableOfContents from './TableOfContents';
import { ChevronDown, ChevronRight } from 'lucide-react';

const BlogLayout = ({ children, hideToc = false, seriesItems = [], currentSeriesId = '' }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

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
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
      
      {/* Left Sidebar (Desktop only) */}
      <aside className="sidebar-panel hidden lg:block border-r border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)] overflow-y-auto">
        {!hideToc && <TableOfContents seriesItems={seriesItems} currentSeriesId={currentSeriesId} />}
      </aside>

      {/* Main Content Area */}
      <main className="body-container w-full px-6 sm:px-10 py-6 lg:py-6">
        
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
        <article className="blog-prose">
          {children}
        </article>
      </main>

    </div>
  );
};

export default BlogLayout;

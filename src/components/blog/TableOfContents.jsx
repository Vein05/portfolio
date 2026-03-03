import React, { useEffect, useState } from 'react';
import SidebarNav from '../SidebarNav';

const TableOfContents = ({ seriesItems = [], currentSeriesId = '' }) => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.blog-prose h1, .blog-prose h2, .blog-prose h3'));

      const seenIds = new Map();
      let count = 0;
      const navItems = elements.map((elem) => {
        let baseId = elem.id || elem.innerText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        // Deduplicate: append -2, -3, etc. for repeated ids
        const seen = seenIds.get(baseId) ?? 0;
        seenIds.set(baseId, seen + 1);
        const uniqueId = seen === 0 ? baseId : `${baseId}-${seen + 1}`;

        if (!elem.id || elem.id !== uniqueId) elem.id = uniqueId;
        const level = parseInt(elem.tagName.replace('H', ''), 10);
        const isTopLevel = level <= 2;
        if (isTopLevel) count++;
        return {
          id: uniqueId,
          label: elem.innerText,
          level,
          number: isTopLevel ? `${String(count).padStart(2, '0')}.` : undefined,
          node: elem,
        };
      });

      setItems(navItems);

      if (navItems.length === 0) return;

      const getActive = () => {
        const nearBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
        if (nearBottom) return navItems[navItems.length - 1].id;

        const readingLine = window.innerHeight * 0.35;
        let current = navItems[0].id;

        for (const { id } of navItems) {
          const el = document.getElementById(id);
          if (!el) continue;
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= readingLine && bottom > readingLine) {
            current = id;
            break;
          }
          if (bottom <= readingLine) {
            current = id;
          }
        }

        return current;
      };

      const onScroll = () => setActiveId(getActive());
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      return () => window.removeEventListener('scroll', onScroll);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleClick = (item, e) => {
    e.preventDefault();
    item.node.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => window.scrollBy(0, -80), 500);
    setActiveId(item.id);
  };

  return (
    <div className="h-full flex flex-col">
      <SidebarNav
        title="Contents"
        items={items}
        activeId={activeId}
        onItemClick={handleClick}
      />
      {seriesItems.length > 0 && (
        <div className="mt-auto border-t border-border-paper/80">
          <SidebarNav
            title="Go"
            items={seriesItems}
            activeId={currentSeriesId}
            uppercase={false}
            grow={false}
          />
        </div>
      )}
    </div>
  );
};

export default TableOfContents;

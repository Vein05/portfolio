import React, { useEffect, useState } from 'react';
import SidebarNav from '../SidebarNav';

const TableOfContents = () => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.blog-prose h1, .blog-prose h2, .blog-prose h3'));

      // Build heading list with stable ids and assign 01. 02. numbers to top-level headings
      let count = 0;
      const navItems = elements.map((elem) => {
        if (!elem.id) {
          elem.id = elem.innerText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        }
        const level = parseInt(elem.tagName.replace('H', ''), 10);
        const isTopLevel = level <= 2;
        if (isTopLevel) count++;
        return {
          id: elem.id,
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
    <SidebarNav
      title="Contents"
      items={items}
      activeId={activeId}
      onItemClick={handleClick}
    />
  );
};

export default TableOfContents;

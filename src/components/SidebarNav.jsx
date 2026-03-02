import React from 'react';

/**
 * Shared sidebar navigation with the ink-sweep active animation.
 * Used by both Home.jsx (static sections) and TableOfContents (blog headings).
 *
 * Props:
 *   title     — section header text (e.g. "Sections" | "Contents")
 *   items     — [{ id, label, level?, number? }]
 *   activeId  — currently active item id
 *   onItemClick(item, e) — optional click override (for smooth-scroll in blog TOC)
 */
const SidebarNav = ({ title, items, activeId, onItemClick }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="py-8 px-6 flex-1 flex flex-col">
      {title && (
        <h2 className="text-xs uppercase tracking-widest text-ink-muted mb-6 px-0">
          {title}
        </h2>
      )}
      <ul className="space-y-1 text-xs font-mono uppercase tracking-wide flex-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isSubItem = item.level && item.level >= 3;

          return (
            <li key={item.id} className="relative overflow-hidden -mx-6">
              {/* Ink envelope sweep */}
              <span
                className={`absolute inset-0 bg-ink-dark transition-transform duration-300 ease-in-out ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
                style={{ transformOrigin: 'left center' }}
              />
              <a
                href={`#${item.id}`}
                onClick={onItemClick ? (e) => onItemClick(item, e) : undefined}
                className={`relative z-10 block py-1.5 truncate transition-colors duration-300 ${
                  isSubItem ? 'pl-10 pr-6' : 'px-6'
                } ${
                  isActive
                    ? 'text-paper-light'
                    : 'text-ink-dark hover:text-ink-blue'
                }`}
              >
                {item.number && (
                  <span className={`mr-2 ${isActive ? 'text-paper-light/50' : 'text-ink-dark/50'}`}>
                    {item.number}
                  </span>
                )}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarNav;

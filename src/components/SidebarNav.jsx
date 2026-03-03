import React from 'react';
// NOTE: react-router-dom Link replaced with <a> for Astro compatibility
// This file is used as a React island — no BrowserRouter context available.

/**
 * Shared sidebar navigation with the ink-sweep active animation.
 * Used by both Home.jsx (static sections) and TableOfContents (blog headings).
 *
 * Props:
 *   title      — section header text (e.g. "Sections" | "Contents")
 *   items      — [{ id, label, level?, number? }]
 *   activeId   — currently active item id
 *   onItemClick(item, e) — optional click override (for smooth-scroll in blog TOC)
 *   decoration — show mountain + rain illustration at the bottom (left sidebar only)
 */
const HATTIESBURG_TZ = 'America/Chicago';

const getHattiesburgSkyState = () => {
  const date = new Date();
  const hourParts = new Intl.DateTimeFormat('en-US', {
    timeZone: HATTIESBURG_TZ,
    hour: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const hour = Number(hourParts.find((part) => part.type === 'hour')?.value ?? '0');
  const isDay = hour >= 6 && hour < 18;

  const timeLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: HATTIESBURG_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(date);

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: HATTIESBURG_TZ,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  return { isDay, timeLabel, dateLabel };
};

const MountainDecoration = ({ mode = 'night' }) => {
  const isAutoMode = mode === 'auto-local';
  const [skyState, setSkyState] = React.useState(() => getHattiesburgSkyState());

  React.useEffect(() => {
    if (!isAutoMode) return undefined;

    const updateSkyState = () => setSkyState(getHattiesburgSkyState());
    updateSkyState();

    const intervalId = window.setInterval(updateSkyState, 60_000);
    return () => window.clearInterval(intervalId);
  }, [isAutoMode]);

  const isDay = isAutoMode ? skyState.isDay : false;

  return (
    <div
      className={`-mx-6 -mb-8 mt-auto relative overflow-hidden ${
        isDay ? 'bg-gradient-to-t from-paper-surface via-paper-light to-transparent' : ''
      }`}
      style={
        isDay
          ? undefined
          : { background: 'linear-gradient(to top, #1a1a14 0%, #6b6560 45%, transparent 100%)' }
      }
    >

    <svg
      viewBox="0 0 200 135"
      className="w-full opacity-90"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="md-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {!isDay && (
        <g>
          <g transform="translate(165,10.5) scale(1.6) translate(-165,-10.5)">
            <path
              d="M 165,4 A 6.5,6.5 0 0,1 165,17 A 5,6.5 0 0,0 165,4 Z"
              fill="white" opacity="0.88" filter="url(#md-glow)"
            />
          </g>

          <g transform="translate(0, 12)" className="text-ink-dark">
            {/* ── Sky stars — 4-pointed sparkle: M cx,cy-r L cx+ri,cy-ri L cx+r,cy ... ── */}
            {/* (18,9) r=1.8 */}
            <path d="M 18,7.2 L 18.4,8.6 L 19.8,9 L 18.4,9.4 L 18,10.8 L 17.6,9.4 L 16.2,9 L 17.6,8.6 Z" fill="currentColor">
              <animate attributeName="opacity" values="0.7;1;0.4;0.9;0.7" dur="2.8s" repeatCount="indefinite" />
            </path>
            {/* (42,5) r=1.2 tiny */}
            <path d="M 42,3.8 L 42.26,4.74 L 43.2,5 L 42.26,5.26 L 42,6.2 L 41.74,5.26 L 40.8,5 L 41.74,4.74 Z" fill="currentColor">
              <animate attributeName="opacity" values="0.5;1;0.3;0.8;0.5" dur="4.1s" repeatCount="indefinite" />
            </path>
            {/* (68,11) r=2 glow */}
            <path d="M 68,9 L 68.44,10.56 L 70,11 L 68.44,11.44 L 68,13 L 67.56,11.44 L 66,11 L 67.56,10.56 Z" fill="currentColor" filter="url(#md-glow)">
              <animate attributeName="opacity" values="0.8;1;0.5;1;0.8" dur="3.5s" repeatCount="indefinite" />
            </path>
            {/* (90,6) r=1.4 */}
            <path d="M 90,4.6 L 90.31,5.69 L 91.4,6 L 90.31,6.31 L 90,7.4 L 89.69,6.31 L 88.6,6 L 89.69,5.69 Z" fill="currentColor">
              <animate attributeName="opacity" values="0.3;0.8;0.5;1;0.3" dur="5.2s" repeatCount="indefinite" />
            </path>
            {/* (108,13) r=1.5 */}
            <path d="M 108,11.5 L 108.33,12.67 L 109.5,13 L 108.33,13.33 L 108,14.5 L 107.67,13.33 L 106.5,13 L 107.67,12.67 Z" fill="currentColor">
              <animate attributeName="opacity" values="0.6;0.3;1;0.5;0.6" dur="3.8s" repeatCount="indefinite" />
            </path>
            {/* (130,8) r=1 tiny */}
            <path d="M 130,7 L 130.22,7.78 L 131,8 L 130.22,8.22 L 130,9 L 129.78,8.22 L 129,8 L 129.78,7.78 Z" fill="currentColor">
              <animate attributeName="opacity" values="0.2;0.7;0.3;0.6;0.2" dur="6.0s" repeatCount="indefinite" />
            </path>
            {/* (148,14) r=1.5 glow */}
            <path d="M 148,12.5 L 148.33,13.67 L 149.5,14 L 148.33,14.33 L 148,15.5 L 147.67,14.33 L 146.5,14 L 147.67,13.67 Z" fill="currentColor" filter="url(#md-glow)">
              <animate attributeName="opacity" values="0.8;0.3;1;0.5;0.8" dur="4.6s" repeatCount="indefinite" />
            </path>
          </g>
        </g>
      )}

      <g transform="translate(0, 12)" className={isDay ? 'text-ink-muted' : 'text-paper-light'}>
        {/* ── Mountain ridges — start higher for bigger left-side presence ── */}
        <polyline
          points="0,78 20,68 40,73 62,58 80,64 100,52 118,60 138,48 160,55 178,45 200,50 200,135 0,135"
          fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" opacity="0.4"
        />
        <polyline
          points="0,76 15,62 35,70 58,42 82,58 104,46 126,55 148,34 170,50 190,40 210,45 210,135 0,135"
          fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinejoin="round" opacity="0.55"
        />
        <polyline
          points="-5,95 12,74 28,83 52,28 74,60 92,50 115,14 138,48 154,36 178,62 200,52 210,58 210,125 -5,125"
          fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"
        />

        <polygon points="52,28 58,39 46,39" fill={isDay ? 'currentColor' : 'white'} opacity="0.2" />
        <path
          d="M 52,24.5 L 52.28,27.72 L 55.5,28 L 52.28,28.28 L 52,31.5 L 51.72,28.28 L 48.5,28 L 51.72,27.72 Z"
          fill={isDay ? 'currentColor' : 'white'} opacity="0.95" filter="url(#md-glow)"
        />
        {/* Peak 2 at (115,14) — tallest */}
        <polygon points="115,14 122.5,27 107.5,27" fill={isDay ? 'currentColor' : 'white'} opacity="0.18" />
        <path
          d="M 115,9.5 L 115.35,13.65 L 119.5,14 L 115.35,14.35 L 115,18.5 L 114.65,14.35 L 110.5,14 L 114.65,13.65 Z"
          fill={isDay ? 'currentColor' : 'white'} opacity="0.95" filter="url(#md-glow)"
        />
        {/* Peak 3 at (154,36) */}
        <polygon points="154,36 160,46 148,46" fill={isDay ? 'currentColor' : 'white'} opacity="0.2" />
        <path
          d="M 154,32.2 L 154.25,35.75 L 157.8,36 L 154.25,36.25 L 154,39.8 L 153.75,36.25 L 150.2,36 L 153.75,35.75 Z"
          fill={isDay ? 'currentColor' : 'white'} opacity="0.95" filter="url(#md-glow)"
        />
      </g>
    </svg>

      {isAutoMode && (
        <div
          className={`absolute right-3 bottom-2 z-20 text-[10px] font-mono uppercase tracking-wide ${
            isDay ? 'text-ink-muted' : 'text-paper-light/70'
          }`}
        >
          {`Hattiesburg, MS · ${skyState.dateLabel} · ${skyState.timeLabel} · ${isDay ? 'Day' : 'Night'}`}
        </div>
      )}

  </div>
  );
};

const SidebarNav = ({
  title,
  items,
  activeId,
  onItemClick,
  decoration = false,
  decorationMode = 'night',
  uppercase = true,
  grow = true,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`py-8 px-6 flex flex-col ${grow ? 'flex-1' : ''}`}>
      {title && (
        <h2 className="text-xs uppercase tracking-widest text-ink-muted mb-6 px-0">
          {title}
        </h2>
      )}
      <ul className={`space-y-1 text-xs font-mono tracking-wide ${grow ? 'flex-1' : ''} ${uppercase ? 'uppercase' : ''}`}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isSubItem = item.level && item.level >= 3;
          const baseClass = `relative z-10 block py-1.5 truncate transition-colors duration-300 ${
            isSubItem ? 'pl-10 pr-6' : 'px-6'
          } ${
            isActive
              ? 'text-paper-light'
              : 'text-ink-dark hover:text-ink-blue'
          }`;
          const content = (
            <>
              {item.number && (
                <span className={`mr-2 ${isActive ? 'text-paper-light/50' : 'text-ink-dark/50'}`}>
                  {item.number}
                </span>
              )}
              {item.label}
              {isActive && item.currentLabel && (
                <span className="ml-2 text-[10px] tracking-normal normal-case text-paper-light/70">
                  {item.currentLabel}
                </span>
              )}
            </>
          );

          return (
            <li key={item.id} className="relative overflow-hidden -mx-6">
              {/* Ink envelope sweep */}
              <span
                data-section-id={item.id}
                className={`absolute inset-0 bg-ink-dark transition-transform duration-300 ease-in-out ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
                style={{ transformOrigin: 'left center' }}
              />
              {item.href ? (
                <a href={item.href} data-section-link={item.id} className={baseClass}>
                  {content}
                </a>
              ) : (
                <a
                  href={`#${item.id}`}
                  data-section-link={item.id}
                  onClick={onItemClick ? (e) => onItemClick(item, e) : undefined}
                  className={baseClass}
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {decoration && <MountainDecoration mode={decorationMode} />}
    </div>
  );
};

export default SidebarNav;

import React from 'react';

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
const SUN_RAY_COUNT = 8;
const STAR_PATHS = [
  {
    d: 'M 18,7.2 L 18.4,8.6 L 19.8,9 L 18.4,9.4 L 18,10.8 L 17.6,9.4 L 16.2,9 L 17.6,8.6 Z',
    dur: '2.8s',
    values: '0.7;1;0.4;0.9;0.7',
  },
  {
    d: 'M 42,3.8 L 42.26,4.74 L 43.2,5 L 42.26,5.26 L 42,6.2 L 41.74,5.26 L 40.8,5 L 41.74,4.74 Z',
    dur: '4.1s',
    values: '0.5;1;0.3;0.8;0.5',
  },
  {
    d: 'M 68,9 L 68.44,10.56 L 70,11 L 68.44,11.44 L 68,13 L 67.56,11.44 L 66,11 L 67.56,10.56 Z',
    dur: '3.5s',
    values: '0.8;1;0.5;1;0.8',
    glow: true,
  },
  {
    d: 'M 90,4.6 L 90.31,5.69 L 91.4,6 L 90.31,6.31 L 90,7.4 L 89.69,6.31 L 88.6,6 L 89.69,5.69 Z',
    dur: '5.2s',
    values: '0.3;0.8;0.5;1;0.3',
  },
  {
    d: 'M 108,11.5 L 108.33,12.67 L 109.5,13 L 108.33,13.33 L 108,14.5 L 107.67,13.33 L 106.5,13 L 107.67,12.67 Z',
    dur: '3.8s',
    values: '0.6;0.3;1;0.5;0.6',
  },
  {
    d: 'M 130,7 L 130.22,7.78 L 131,8 L 130.22,8.22 L 130,9 L 129.78,8.22 L 129,8 L 129.78,7.78 Z',
    dur: '6.0s',
    values: '0.2;0.7;0.3;0.6;0.2',
  },
  {
    d: 'M 148,12.5 L 148.33,13.67 L 149.5,14 L 148.33,14.33 L 148,15.5 L 147.67,14.33 L 146.5,14 L 147.67,13.67 Z',
    dur: '4.6s',
    values: '0.8;0.3;1;0.5;0.8',
    glow: true,
  },
];

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

export const MountainDecoration = ({ mode = 'night' }) => {
  const isAutoMode = mode === 'auto-local';
  // Initialize to null so SSR and client first-paint always match (night mode).
  // useEffect corrects to real local time after hydration.
  const [skyState, setSkyState] = React.useState(null);
  const [theme, setTheme] = React.useState('daylight');
  const sceneRef = React.useRef(null);
  const sunRef = React.useRef(null);
  const sunRaysRef = React.useRef(null);
  const moonRef = React.useRef(null);
  const starsRef = React.useRef(null);
  const hasMountedRef = React.useRef(false);
  const glowId = React.useId().replace(/:/g, '');

  React.useEffect(() => {
    if (!isAutoMode) return undefined;

    const updateSkyState = () => setSkyState(getHattiesburgSkyState());
    updateSkyState();

    const intervalId = window.setInterval(updateSkyState, 60_000);
    return () => window.clearInterval(intervalId);
  }, [isAutoMode]);

  React.useEffect(() => {
    const getTheme = () => (document.documentElement.dataset.theme === 'dim' ? 'dim' : 'daylight');
    const updateTheme = () => setTheme(getTheme());

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isDay = theme !== 'dim';

  React.useEffect(() => {
    if (!sceneRef.current || !sunRef.current || !sunRaysRef.current || !moonRef.current || !starsRef.current) {
      return undefined;
    }

    const EASE = {
      power2InOut: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      power2In: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
      power3Out: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      sineOut: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
      power1Out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };

    const setStyles = (el, styles) => {
      for (const [k, v] of Object.entries(styles)) el.style[k] = v;
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setDayScene = () => {
      setStyles(sunRef.current, { transform: 'translate(0px, 0px) scale(1)', opacity: '1', transformOrigin: '32px 15px' });
      setStyles(sunRaysRef.current, { transform: 'rotate(0deg)', opacity: '1', transformOrigin: '32px 15px' });
      setStyles(moonRef.current, { transform: 'translate(0px, 0px) scale(1)', opacity: '0', transformOrigin: '162px 10.7px' });
      setStyles(starsRef.current, { transform: 'translateX(22px)', opacity: '0' });
    };

    const setNightScene = () => {
      setStyles(sunRef.current, { transform: 'translate(108px, 22px) scale(0.9)', opacity: '0', transformOrigin: '32px 15px' });
      setStyles(sunRaysRef.current, { transform: 'rotate(18deg)', opacity: '0.16', transformOrigin: '32px 15px' });
      setStyles(moonRef.current, { transform: 'translate(0px, 0px) scale(1)', opacity: '1', transformOrigin: '162px 10.7px' });
      setStyles(starsRef.current, { transform: 'translateX(0px)', opacity: '1' });
    };

    if (!hasMountedRef.current || prefersReducedMotion) {
      if (theme === 'dim') setNightScene();
      else setDayScene();
      hasMountedRef.current = true;
      return undefined;
    }

    const animations = [];
    const run = (el, keyframes, opts) => {
      const a = el.animate(keyframes, { fill: 'forwards', ...opts });
      animations.push(a);
      return a;
    };

    if (theme === 'dim') {
      // Day → Night
      run(sunRaysRef.current,
        [{ transform: 'rotate(0deg)', opacity: 1 }, { transform: 'rotate(18deg)', opacity: 0.16 }],
        { duration: 920, easing: EASE.power2InOut });
      run(sunRef.current,
        [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: 'translate(124px, 26px) scale(0.92)' }],
        { duration: 1320, easing: EASE.power2InOut });
      run(sunRef.current,
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 580, easing: EASE.power2In, delay: 720, composite: 'accumulate' });
      run(starsRef.current,
        [{ transform: 'translateX(-24px)', opacity: 0 }, { transform: 'translateX(0px)', opacity: 1 }],
        { duration: 1080, easing: EASE.sineOut, delay: 240 });
      run(moonRef.current,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 850, easing: EASE.sineOut, delay: 500 });
    } else {
      // Night → Day
      run(starsRef.current,
        [{ transform: 'translateX(0px)', opacity: 1 }, { transform: 'translateX(24px)', opacity: 0 }],
        { duration: 580, easing: EASE.power2InOut });
      run(sunRef.current,
        [{ transform: 'translate(-42px, 18px) scale(0.9)', opacity: 0 }, { transform: 'translate(0px, 0px) scale(1)', opacity: 1 }],
        { duration: 1060, easing: EASE.power3Out, delay: 100 });
      run(sunRaysRef.current,
        [{ transform: 'rotate(-24deg)', opacity: 0.2 }, { transform: 'rotate(0deg)', opacity: 1 }],
        { duration: 1120, easing: EASE.power3Out, delay: 140 });
      run(moonRef.current,
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 240, easing: EASE.power1Out });
    }

    hasMountedRef.current = true;

    return () => {
      for (const a of animations) a.cancel();
    };
  }, [theme]);

  return (
    <div
      ref={sceneRef}
      className={`mountain-decoration -mx-6 -mb-8 mt-auto relative overflow-hidden ${isDay ? 'is-day' : 'is-night'}`}
    >
      <svg
        viewBox="0 0 200 135"
        className="w-full opacity-90"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id={`md-glow-${glowId}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g ref={sunRef} className="mountain-sun" transform="translate(0, 12)">
          <circle
            className="mountain-sun-core"
            cx="32"
            cy="15"
            r="8"
            opacity="0.78"
            filter={`url(#md-glow-${glowId})`}
          />
          <g ref={sunRaysRef}>
            {Array.from({ length: SUN_RAY_COUNT }, (_, index) => {
              const angle = (index / SUN_RAY_COUNT) * Math.PI * 2;
              const x1 = 32 + Math.cos(angle) * 11;
              const y1 = 15 + Math.sin(angle) * 11;
              const x2 = 32 + Math.cos(angle) * 15;
              const y2 = 15 + Math.sin(angle) * 15;

              return (
                <line
                  className="mountain-sun-ray"
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  opacity="0.58"
                />
              );
            })}
          </g>
        </g>

        <g className="mountain-night-sky">
          <g ref={moonRef} className="mountain-moon" transform="translate(0, 12)">
            <path
              className="mountain-moon-shape"
              d="M 162,2.8 A 7.8,7.8 0 0,1 162,18.4 A 6,7.8 0 0,0 162,2.8 Z"
              opacity="0.9"
              filter={`url(#md-glow-${glowId})`}
            />
          </g>

          <g ref={starsRef} className="mountain-stars" transform="translate(0, 12)">
            {STAR_PATHS.map((star, index) => (
              <path
                className="mountain-star"
                key={star.d}
                d={star.d}
                filter={star.glow ? `url(#md-glow-${glowId})` : undefined}
              >
                <animate
                  attributeName="opacity"
                  values={star.values}
                  dur={star.dur}
                  repeatCount="indefinite"
                  begin={`${index * 0.18}s`}
                />
              </path>
            ))}
          </g>
        </g>

        <g className="mountain-ridges" transform="translate(0, 12)">
          {/* Mountain ridges sit high to make the sidebar feel like a full scene, not a footer stamp. */}
          <polyline
            points="0,78 20,68 40,73 62,58 80,64 100,52 118,60 138,48 160,55 178,45 200,50 200,135 0,135"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="round"
            opacity="0.4"
          />
          <polyline
            points="0,76 15,62 35,70 58,42 82,58 104,46 126,55 148,34 170,50 190,40 210,45 210,135 0,135"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <polyline
            points="-5,95 12,74 28,83 52,28 74,60 92,50 115,14 138,48 154,36 178,62 200,52 210,58 210,125 -5,125"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <polygon className="mountain-peak" points="52,28 58,39 46,39" opacity="0.2" />
          <path
            className="mountain-peak-spark"
            d="M 52,24.5 L 52.28,27.72 L 55.5,28 L 52.28,28.28 L 52,31.5 L 51.72,28.28 L 48.5,28 L 51.72,27.72 Z"
            opacity="0.95"
            filter={`url(#md-glow-${glowId})`}
          />
          <polygon className="mountain-peak" points="115,14 122.5,27 107.5,27" opacity="0.18" />
          <path
            className="mountain-peak-spark"
            d="M 115,9.5 L 115.35,13.65 L 119.5,14 L 115.35,14.35 L 115,18.5 L 114.65,14.35 L 110.5,14 L 114.65,13.65 Z"
            opacity="0.95"
            filter={`url(#md-glow-${glowId})`}
          />
          <polygon className="mountain-peak" points="154,36 160,46 148,46" opacity="0.2" />
          <path
            className="mountain-peak-spark"
            d="M 154,32.2 L 154.25,35.75 L 157.8,36 L 154.25,36.25 L 154,39.8 L 153.75,36.25 L 150.2,36 L 153.75,35.75 Z"
            opacity="0.95"
            filter={`url(#md-glow-${glowId})`}
          />
        </g>
      </svg>

      {isAutoMode && skyState && (
        <div
          className="mountain-scene-label absolute right-3 bottom-2 z-20 text-[10px] font-mono uppercase tracking-wide"
        >
          {`Hattiesburg, MS · ${skyState.dateLabel} · ${skyState.timeLabel} · ${theme === 'dim' ? 'Dim' : 'Daylight'}`}
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

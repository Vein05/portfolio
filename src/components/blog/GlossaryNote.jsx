import React, { useEffect, useRef, useState } from 'react';

// Notebook-style side note listing the terms a post uses. Written in markdown
// as a ```glossary fence, one "term: definition" per line; an optional first
// "title:" line replaces the default heading. On wide screens it floats to the
// right of the opening paragraphs and the list scrolls inside the note; a thin
// track on the right and soft top/bottom fades show when there is more.
const parseGlossary = (raw) => {
  let title = 'Terms used here';
  const entries = [];
  raw.split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const term = line.slice(0, idx).trim();
    const text = line.slice(idx + 1).trim();
    if (!term || !text) return;
    if (term.toLowerCase() === 'title') title = text;
    else entries.push([term, text]);
  });
  return { title, entries };
};

const GlossaryNote = ({ raw }) => {
  const { title, entries } = parseGlossary(raw);
  const listRef = useRef(null);
  const [scroll, setScroll] = useState(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight + 1) {
        setScroll(null);
        return;
      }
      const thumb = Math.max(clientHeight / scrollHeight, 0.15);
      setScroll({
        more: { up: scrollTop > 1, down: scrollTop + clientHeight < scrollHeight - 1 },
        thumbSize: thumb,
        thumbPos: (scrollTop / (scrollHeight - clientHeight)) * (1 - thumb),
      });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  const fadeClass = scroll
    ? `${scroll.more.up ? ' has-more-up' : ''}${scroll.more.down ? ' has-more-down' : ''}`
    : '';

  return (
    <aside className="glossary-note" aria-label={title}>
      <div className="glossary-note__title">{title}</div>
      <div className="glossary-note__scroll">
        <dl ref={listRef} className={`glossary-note__list${fadeClass}`} tabIndex={scroll ? 0 : undefined}>
          {entries.map(([term, text]) => (
            <div key={term} className="glossary-note__entry">
              <dt>{term}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        {scroll ? (
          <div className="glossary-note__track" aria-hidden="true">
            <div
              className="glossary-note__thumb"
              style={{ top: `${scroll.thumbPos * 100}%`, height: `${scroll.thumbSize * 100}%` }}
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default GlossaryNote;

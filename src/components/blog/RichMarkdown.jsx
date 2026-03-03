import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check, AlertTriangle } from 'lucide-react';

const MERMAID_SCRIPT_ID = 'mermaid-cdn-script';
const MERMAID_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
const SAFE_IFRAME_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
  'codepen.io',
  'codesandbox.io',
  'www.loom.com',
  'loom.com',
]);

const parseKVBlock = (rawValue) => {
  const lines = rawValue
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.reduce((acc, line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return acc;

    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (!key || !value) return acc;

    acc[key] = value;
    return acc;
  }, {});
};

const normalizeImageSource = (src = '') => {
  if (process.env.NODE_ENV !== 'production' && src.startsWith('/.netlify/images')) {
    const params = new URLSearchParams(src.split('?')[1]);
    return params.get('url') || src;
  }

  return src;
};

const getMediaLayoutClass = (layout = 'full') => {
  switch (layout.toLowerCase()) {
    case 'narrow':
      return 'max-w-2xl mx-auto';
    case 'wide':
      return 'max-w-5xl -mx-2 sm:-mx-4 md:-mx-8';
    case 'left':
      return 'max-w-2xl mr-auto';
    case 'right':
      return 'max-w-2xl ml-auto';
    default:
      return 'w-full';
  }
};

const getVerticalAlignmentClass = (value = 'top') => {
  switch (value.toLowerCase()) {
    case 'middle':
    case 'center':
      return 'items-center';
    case 'bottom':
      return 'items-end';
    default:
      return 'items-start';
  }
};

const getJustifyClass = (value = 'end') => {
  switch (value.toLowerCase()) {
    case 'start':
    case 'left':
      return 'md:justify-start';
    case 'center':
    case 'middle':
      return 'md:justify-center';
    case 'between':
      return 'md:justify-between';
    case 'around':
      return 'md:justify-around';
    case 'evenly':
      return 'md:justify-evenly';
    default:
      return 'md:justify-end';
  }
};

const getItemWidthClass = (value = 'md') => {
  switch (value.toLowerCase()) {
    case 'sm':
      return 'md:w-1/3';
    case 'lg':
      return 'md:w-1/2';
    default:
      return 'md:w-5/12';
  }
};

const decodeEscapedLines = (value = '') => value.replace(/\\n/g, '\n');

const isSafeIframeSrc = (src = '') => {
  try {
    const parsed = new URL(src, window.location.origin);
    return parsed.protocol === 'https:' && SAFE_IFRAME_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
};

const CopyableCodeBlock = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const handleCopy = () => {
    const text = ref.current?.querySelector('code')?.innerText ?? '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group/code my-6">
      <pre ref={ref} {...props} className="!my-0">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded opacity-0 group-hover/code:opacity-100 transition-opacity duration-150 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

const MediaFigure = ({ children, caption, layout = 'full' }) => (
  <figure className={`my-8 ${getMediaLayoutClass(layout)}`}>
    {children}
    {caption ? <figcaption className="mt-2 text-sm text-ink-muted italic">{caption}</figcaption> : null}
  </figure>
);

const MarkdownImage = ({ src, alt, title }) => {
  const resolvedSrc = normalizeImageSource(src || '');
  return (
    <MediaFigure caption={title}>
      <img
        src={resolvedSrc}
        alt={alt ?? ''}
        className="w-full rounded-sm border border-border-paper"
        loading="lazy"
        decoding="async"
      />
    </MediaFigure>
  );
};

const RichImageBlock = ({ payload }) => {
  const src = normalizeImageSource(payload.src || '');
  if (!src) return null;

  return (
    <MediaFigure caption={payload.caption} layout={payload.layout}>
      <img
        src={src}
        alt={payload.alt || ''}
        className="w-full rounded-sm border border-border-paper"
        loading="lazy"
        decoding="async"
      />
    </MediaFigure>
  );
};

const VideoBlock = ({ payload }) => {
  const src = payload.src;
  if (!src) return null;

  const poster = payload.poster;
  const controls = payload.controls !== 'false';
  const autoplay = payload.autoplay === 'true';
  const loop = payload.loop === 'true';
  const muted = payload.muted !== 'false';

  return (
    <MediaFigure caption={payload.caption} layout={payload.layout}>
      <video
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        className="w-full rounded-sm border border-border-paper bg-ink-dark"
      />
    </MediaFigure>
  );
};

const IframeBlock = ({ payload }) => {
  const src = payload.src;
  if (!src) return null;

  if (!isSafeIframeSrc(src)) {
    return (
      <div className="my-6 p-4 border border-red-400/40 bg-red-50 text-red-900 rounded flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <p className="text-sm">This embed was blocked because the iframe source is not in the allowlist.</p>
      </div>
    );
  }

  const height = Number.parseInt(payload.height || '440', 10);

  return (
    <MediaFigure caption={payload.caption} layout={payload.layout}>
      <iframe
        src={src}
        title={payload.title || 'Embedded content'}
        loading="lazy"
        className="w-full rounded-sm border border-border-paper bg-paper-surface"
        style={{ minHeight: Number.isNaN(height) ? 440 : height }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </MediaFigure>
  );
};

const YouTubeBlock = ({ payload }) => {
  const id = payload.id;
  if (!id) return null;

  const title = payload.title || 'YouTube video';
  const src = `https://www.youtube-nocookie.com/embed/${id}`;

  return <IframeBlock payload={{ ...payload, src, title }} />;
};

const MermaidBlock = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const containerId = useMemo(() => `mermaid-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        if (!window.mermaid) {
          await new Promise((resolve, reject) => {
            const existing = document.getElementById(MERMAID_SCRIPT_ID);
            if (existing) {
              if (window.mermaid) {
                resolve();
                return;
              }
              existing.addEventListener('load', resolve, { once: true });
              existing.addEventListener('error', reject, { once: true });
              return;
            }

            const script = document.createElement('script');
            script.id = MERMAID_SCRIPT_ID;
            script.src = MERMAID_SCRIPT_URL;
            script.async = true;
            script.addEventListener('load', resolve, { once: true });
            script.addEventListener('error', reject, { once: true });
            document.head.appendChild(script);
          });
        }

        if (!window.mermaid) {
          throw new Error('Mermaid library unavailable.');
        }

        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          fontFamily: 'Oswald, sans-serif',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
          themeVariables: {
            background: 'transparent',
            primaryColor: '#edeae0',
            primaryTextColor: '#1a1a14',
            primaryBorderColor: '#d4cfc4',
            lineColor: '#6b6560',
            secondaryColor: 'transparent',
            tertiaryColor: 'transparent',
            edgeLabelBackground: 'transparent',
            clusterBkg: '#edeae0',
            clusterBorder: '#d4cfc4',
          },
        });
        const { svg: rendered } = await window.mermaid.render(containerId, chart);
        if (!cancelled) {
          setSvg(rendered);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render Mermaid diagram.');
        }
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [chart, containerId]);

  if (error) {
    return (
      <div className="my-6 p-4 border border-red-400/40 bg-red-50 text-red-900 rounded text-sm">
        Mermaid render failed: {error}
      </div>
    );
  }

  if (!svg) {
    return <div className="my-6 p-4 border border-border-paper rounded text-sm text-ink-muted">Rendering diagram...</div>;
  }

  return (
    <MediaFigure>
      <div
        className="mermaid-diagram my-0 p-4 rounded border border-border-paper bg-transparent overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </MediaFigure>
  );
};

const TwoImagesBlock = ({ payload }) => {
  const src1 = normalizeImageSource(payload.src1 || payload.leftsrc || payload.image1 || '');
  const src2 = normalizeImageSource(payload.src2 || payload.rightsrc || payload.image2 || '');
  if (!src1 || !src2) return null;

  const justifyClass = getJustifyClass(payload.justify || 'end');
  const alignment = getVerticalAlignmentClass(payload.valign || payload.align || 'end');
  const widthClass = getItemWidthClass(payload.itemwidth || 'md');

  return (
    <MediaFigure caption={payload.caption} layout={payload.layout || 'full'}>
      <div className={`flex flex-col md:flex-row gap-4 md:gap-6 ${justifyClass} ${alignment}`}>
        <img
          src={src1}
          alt={payload.alt1 || payload.leftalt || ''}
          className={`w-full ${widthClass} rounded-sm border border-border-paper my-0`}
          loading="lazy"
          decoding="async"
        />
        <img
          src={src2}
          alt={payload.alt2 || payload.rightalt || ''}
          className={`w-full ${widthClass} rounded-sm border border-border-paper my-0`}
          loading="lazy"
          decoding="async"
        />
      </div>
    </MediaFigure>
  );
};

const TextAndImageBlock = ({ payload }) => {
  const src = normalizeImageSource(payload.src || payload.image || '');
  const text = decodeEscapedLines(payload.text || payload.copy || '');
  if (!src || !text) return null;

  const imageLeft = (payload.position || payload.side || 'right').toLowerCase() === 'left';
  const alignment = getVerticalAlignmentClass(payload.valign || payload.align || 'top');
  const textOrderClass = imageLeft ? 'md:order-2' : 'md:order-1';
  const imageOrderClass = imageLeft ? 'md:order-1' : 'md:order-2';
  const headingId =
    payload.id ||
    (payload.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  return (
    <MediaFigure layout={payload.layout || 'full'}>
      {payload.title ? (
        <h2 id={headingId || undefined} className="text-2xl md:text-3xl leading-tight tracking-tight mb-4">
          {payload.title}
        </h2>
      ) : null}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 ${alignment}`}>
        <div className={textOrderClass}>
          <div className="text-and-image-copy">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {text}
            </ReactMarkdown>
          </div>
        </div>
        <div className={imageOrderClass}>
          <img
            src={src}
            alt={payload.alt || ''}
            className="w-full rounded-sm border border-border-paper"
            loading="lazy"
            decoding="async"
          />
          {payload.caption ? (
            <figcaption className="mt-2 text-sm text-ink-muted italic">{payload.caption}</figcaption>
          ) : null}
        </div>
      </div>
    </MediaFigure>
  );
};

const RichCode = ({ inline, className, children, ...props }) => {
  const rawCode = String(children).replace(/\n$/, '');
  const isInlineCode = inline === true || (!className && !rawCode.includes('\n'));

  if (isInlineCode) {
    return <code className={className} {...props}>{children}</code>;
  }

  const classes = (className || '').split(/\s+/).filter(Boolean);
  const languageClass = classes.find((token) => token.startsWith('language-'));
  const language = languageClass ? languageClass.replace('language-', '').toLowerCase() : '';
  if (!language) {
    return <CopyableCodeBlock><code>{rawCode}</code></CopyableCodeBlock>;
  }

  if (language === 'mermaid') {
    return <MermaidBlock chart={rawCode} />;
  }

  if (['image', 'video', 'iframe', 'youtube', 'textandimage', 'twoimages'].includes(language)) {
    const payload = parseKVBlock(rawCode);

    if (language === 'image') return <RichImageBlock payload={payload} />;
    if (language === 'video') return <VideoBlock payload={payload} />;
    if (language === 'iframe') return <IframeBlock payload={payload} />;
    if (language === 'textandimage') return <TextAndImageBlock payload={payload} />;
    if (language === 'twoimages') return <TwoImagesBlock payload={payload} />;
    return <YouTubeBlock payload={payload} />;
  }

  return (
    <CopyableCodeBlock>
      <code className={className} {...props}>{children}</code>
    </CopyableCodeBlock>
  );
};

const RichMarkdown = ({ markdown }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
    components={{
      pre: ({ children }) => <>{children}</>,
      code: RichCode,
      img: MarkdownImage,
    }}
  >
    {markdown}
  </ReactMarkdown>
);

export default RichMarkdown;

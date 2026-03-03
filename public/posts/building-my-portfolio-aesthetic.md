---
title: "Building My Portfolio Aesthetic"
date: "2024-10-25"
category: "Design"
status: "MATURE"
---

# Designing with Texture

When I started this portfolio, the goal was less "build a trendy site" and more "build a place that feels printed."

```image
src: /posts/images/building-my-portfolio-aesthetic/painting.png
alt: Canvas
caption: Canvas, Painting
```

Most modern portfolio UIs lean toward glass, blur, gradient blobs, and soft cards. I intentionally moved in the opposite direction: tighter structure, physical texture, and ink-like contrast. The north star was simple:

**Make the interface feel like paper and ink, but keep the ergonomics of a modern React app.**

This post started as a quick style note, but during implementation we made a lot of concrete decisions that shaped the final system. This is the fuller version of those decisions.

## Choosing the Color Palette

Early on, we moved from "a couple colors" to a strict token system in `tailwind.config.js`. That was important because the visual language breaks quickly when random hex values sneak into components.

The core tokens:

* `paper-light` (`#f5f0e8`) for page-level paper
* `paper-surface` (`#edeae0`) for secondary paper panels
* `ink-dark` (`#1a1a14`) for text and high-contrast surfaces
* `ink-muted` (`#6b6560`) for metadata and secondary labels
* `ink-blue` (`#2563eb`) for links and active accents
* `ink-red` (`#dc2626`) for destructive hover states only
* `blue-soft` (`#e7e1d2`) for inline-code backgrounds
* `border-paper` (`#d4cfc4`) for all border rhythm

The practical rule became: **no raw hex values in JSX for normal UI states**. Use tokens so the whole app keeps the same material feel.

### Exact code (tokens)

```js
// tailwind.config.js
extend: {
  colors: {
    "paper-light": "#f5f0e8",
    "paper-surface": "#edeae0",
    "ink-dark": "#1a1a14",
    "ink-muted": "#6b6560",
    "ink-blue": "#2563eb",
    "ink-red": "#dc2626",
    "blue-soft": "#e7e1d2",
    "border-paper": "#d4cfc4",
  },
}
```

## Texture: From Concept to CSS Utility

The original concept used inline SVG noise. During implementation, we standardized around a reusable texture asset (`src/images/noise.webp`) and wrapped it into utility classes:

* `.noise-panel` for light textured surfaces
* `.sidebar-panel` for darker, weightier paper on side rails
* `.body-container` for the main reading column with fixed attachment
* `.breadcrumb-bar` for the top ink strip, also textured

That utility layer solved two problems:

1. Texture was consistent everywhere.
2. We avoided repeating long background declarations in components.

The texture is intentionally subtle. If users "notice the effect" first, it is too strong.

### Exact code (texture utilities)

```css
/* src/index.css */
.noise-panel {
  background-color: #f5f0e8;
  background-image: url('./images/noise.webp');
  background-repeat: repeat;
}

.sidebar-panel {
  background-color: #ede8df;
  background-image: url('./images/noise.webp');
  background-repeat: repeat;
}

.body-container {
  background-color: #f5f0e8;
  background-image: url('./images/noise.webp');
  background-repeat: repeat;
  background-attachment: fixed;
}
```

## Layout Architecture: Editorial Grid Over Card Soup

A big decision was to stop thinking in floating cards and design around a fixed editorial frame:

* Desktop blog layout uses a two-column grid:
  * `240px` sidebar + fluid content
  * expands to `280px` sidebar on `xl`
* Sticky sidebars use `top-[3.5rem] h-[calc(100vh-3.5rem)]`
* Breadcrumb is always the first child and acts like a fixed masthead

This gave the site a "publication spine." On smaller screens, the table of contents collapses into a single mobile panel, so navigation still exists without crushing the reading flow.

### Exact code (layout frame)

```jsx
// src/components/blog/BlogLayout.jsx
<div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
  <aside className="sidebar-panel hidden lg:block border-r border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)] overflow-y-auto">
    <TableOfContents />
  </aside>
  <main className="body-container w-full px-6 sm:px-10 py-6 lg:py-6">
    <article className="blog-prose">{children}</article>
  </main>
</div>
```

## Typography: One Family, Many Roles

I originally explored a multi-font stack, but implementation reality pushed us toward consistency and maintainability. The current system maps all families to **Oswald** in Tailwind (`sans`, `serif`, `mono`, and `clash` aliases), then differentiates hierarchy through size, spacing, case, and weight.

Important prose decisions in `.blog-prose`:

* Base size `1.0625rem`, line-height `1.8`
* Headings use tighter spacing and stronger weight
* `h2` includes a paper-border divider for section rhythm
* Inline `code` uses `blue-soft` rather than gray callouts
* Code blocks invert to `ink-dark` with high contrast text

This kept the voice coherent across pages while preserving technical readability in long engineering posts.

### Exact code (`.blog-prose`)

```css
/* src/index.css */
.blog-prose {
  font-family: 'Oswald', sans-serif;
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #1a1a14;
}

.blog-prose h2 {
  font-size: 1.4rem;
  font-weight: 600;
  border-bottom: 1px solid #d4cfc4;
  padding-bottom: 0.35rem;
}
```

## Motion and Interaction Rules

Another major decision: keep interactions sharp, fast, and restrained.

Patterns we standardized:

* Card hover: `paper-light` to `ink-dark` inversion
* Card metadata fades to translucent paper tones
* Active sidebar items use an ink sweep (`scale-x`) from the left
* Links/nav use `ink-blue` on hover, not random accent colors
* Most color transitions run around `duration-200` to stay crisp

The goal was to make hover states feel like "ink activating on paper," not like floating app chrome.

## Blog as a Structured Publishing System

The aesthetic decisions weren’t only visual. We also made content-system decisions so posts could carry the same style language without manual HTML every time.

Markdown posts in `public/posts/*.md` support richer fenced blocks:

* `image`
* `youtube`
* `video`
* `iframe` (with host allowlist for safety)
* `textandimage`
* `twoimages`
* `mermaid`

The renderer (`RichMarkdown`) also includes:

* syntax highlighting
* copy-to-clipboard on code blocks
* figure/caption wrappers
* responsive layout variants (`narrow`, `wide`, `left`, `right`)

For blog assets, we standardized image storage in `public/posts/images/[slug]/` and route delivery through Netlify image transforms in production, which keeps visual quality while controlling payload.

## Markdown Flow (Authoring -> Rendering)

I wanted writing posts to feel like plain Markdown, but still support richer visual blocks. The flow now looks like this:

1. Author post in `public/posts/[slug].md` with frontmatter + markdown.
2. `BlogPost.jsx` fetches the markdown at runtime, parses frontmatter, then renders body.
3. `RichMarkdown.jsx` transforms markdown with `remark-gfm` and custom fenced block parsers.
4. Special blocks (`image`, `youtube`, `iframe`, `mermaid`, etc.) are mapped to React components.
5. Media components apply consistent figure layout + borders + captions.

### Exact code (loading markdown)

```jsx
// src/pages/blog/BlogPost.jsx
useEffect(() => {
  fetch(`/posts/${slug}.md`)
    .then((response) => {
      if (!response.ok) throw new Error('Post not found');
      return response.text();
    })
    .then((text) => {
      const { body } = parseMarkdown(text);
      setMarkdown(stripLeadingTitleHeading(body, postMeta?.title));
      setIsLoading(false);
    });
}, [slug, postMeta?.title]);
```

### Exact code (renderer pipeline)

```jsx
// src/components/blog/RichMarkdown.jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const parseKVBlock = (rawValue) => {
  const lines = rawValue.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.reduce((acc, line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return acc;
    acc[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
    return acc;
  }, {});
};
```

### Exact code (authoring a custom block)

~~~md
```image
src: /.netlify/images?url=/posts/images/building-my-portfolio-aesthetic/hero.webp&w=1600&fit=cover
alt: Paper and ink design study
caption: Tokenized palette + texture stack.
layout: wide
```
~~~

## Breadcrumbs, TOC, and Reading Flow

The breadcrumb bar became more than a path indicator. It anchors orientation:

* brand label on desktop and mobile
* contextual crumb trail (`Home > Blog > Post`)
* optional status badge (`MATURE`, `DRAFT`, etc.)

Combined with sticky TOC behavior, this gives long posts an always-available navigation frame without turning the page into a dashboard.

## Tradeoffs We Accepted

No design language is free. The main tradeoffs:

* The strong visual identity is less "neutral template" and more opinionated
* Uniform typography sacrifices some contrast between prose and code voices
* Texture/background layers add style complexity to global CSS
* Strict token usage requires discipline when building new components

I still think these were the right tradeoffs. The portfolio now feels authored, not assembled.

## What I Learned

The biggest lesson from this project is that "aesthetic" is mostly system design.

The final look came from repeatable rules:

* named tokens instead of ad hoc colors
* reusable utility surfaces for material consistency
* a stable layout skeleton
* explicit interaction conventions
* a markdown pipeline that preserves visual language at scale

That combination made the site easier to extend. New pages and posts inherit the same DNA instead of forcing another design reset each time.

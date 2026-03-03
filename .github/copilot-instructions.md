# Copilot Instructions — sugampanthi.com.np

This is a React + Tailwind CSS portfolio site with a deliberate **paper + ink** aesthetic.
Always follow the design language below when editing or adding UI.

---

## Color Tokens

Defined in `tailwind.config.js` under `theme.extend.colors`.
Never use raw hex values in JSX — always use these tokens.

| Token | Value | Usage |
|---|---|---|
| `paper-light` | `#f5f0e8` | Page background, card backgrounds |
| `paper-surface` | `#edeae0` | Slightly darker paper (SVG fills, mild contrast surfaces) |
| `ink-dark` | `#1a1a14` | Primary text, active states, hover backgrounds |
| `ink-muted` | `#6b6560` | Secondary / dimmed text |
| `ink-blue` | `#2563eb` | Links, accents, active text in some contexts |
| `ink-red` | `#dc2626` | Destructive / close actions on hover only |
| `blue-soft` | `#e7e1d2` | Inline code background |
| `border-paper` | `#d4cfc4` | All borders |

> `main` (`#E0D0C1`) is defined in `theme.colors` (not extended) — avoid using it, it's a legacy token.

---

## CSS Utility Classes (`src/index.css`)

| Class | Purpose |
|---|---|
| `.noise-panel` | Light paper bg + noise texture. Used for decorative gutters. |
| `.sidebar-panel` | Darker tinted paper bg + noise + deeper inset shadow. Used for all sidebars. |
| `.body-container` | Main content column bg + noise texture + fixed bg attachment. |
| `.breadcrumb-bar` | `ink-dark` sticky top bar with noise. |
| `.blog-prose` | Full typography system for markdown blog content. |

---

## Layout Patterns

### Home & Blog Post (two/three-column grid)
```
[240px sidebar] [minmax(0,1fr) main] [240px sidebar]  (lg+)
xl: 280px columns
```
- Outer wrapper always gets `body-container` class.
- Sidebars use `sidebar-panel` + `sticky top-[3.5rem] h-[calc(100vh-3.5rem)]`.
- `Breadcrumb` component always sits at the top, uses `breadcrumb-bar` class.

### Breadcrumb Bar (`src/components/blog/Breadcrumb.jsx`)
Always the first child inside the page wrapper. Receives optional `title` and `status` props.

---

## Sidebar Navigation

Use the shared `<SidebarNav>` component (`src/components/SidebarNav.jsx`) for **all** sidebar nav lists.
Never write inline sidebar `<ul>` markup — always go through this component.

```jsx
<SidebarNav
  title="Sections"          // header label
  items={[                  // array of nav items
    { id: "about", label: "About" },
    { id: "projects", label: "Projects", number: "01." },  // optional number prefix
    { id: "sub-item", label: "Details", level: 3 },        // level≥3 = indented
  ]}
  activeId={activeSection}  // currently highlighted item
  onItemClick={handleClick} // optional — for smooth-scroll override (blog TOC)
/>
```

**Active animation:** black ink sweep from left (`bg-ink-dark scale-x-100`), text becomes `paper-light`.

---

## Hover Conventions

| Element | Default | Hover |
|---|---|---|
| Cards (project, blog post) | `bg-paper-light` | `bg-ink-dark` |
| Card title | `text-ink-dark` | `text-paper-light` |
| Card excerpt / meta | `text-ink-muted` | `text-paper-light/50` or `/40` |
| Card tags / borders | `border-border-paper text-ink-muted` | `border-paper-light/20 text-paper-light/40` |
| Arrow icon | `text-ink-muted` | `text-paper-light/50` + `translate-x-1` |
| Close / dismiss button | `text-paper-light/40` | `text-ink-red` |
| Links / nav items | `text-ink-dark` | `text-ink-blue` |

Always use `transition-colors duration-200` on hover targets. Use Tailwind `group` / `group-hover:` pattern for cards.

---

## Expanded / Detail Panels

When a card expands inline (e.g. project detail panel):
- Background: `bg-ink-dark`
- Border: `border-t border-ink-dark/30`
- Title: `text-paper-light`
- Meta / tags: `text-paper-light/40`
- Body text: `text-paper-light/80`
- Dashes / decorators: `text-paper-light/30`

---

## Typography

All fonts are **Oswald** (mapped to `sans`, `serif`, `mono`, `clash` in the config).
- Body size: `1.0625rem`, line-height `1.8` (set via `.blog-prose`)
- Headings: uppercase, `tracking-tight` or `tracking-widest` depending on context
- Labels / tags / nav: `text-xs font-mono uppercase tracking-wide` or `tracking-wider`
- Page titles: `text-4xl md:text-5xl`, `text-ink-dark`, `tracking-tight`

---

## Blog Images

All blog post images live in `public/posts/images/[post-slug]/`. The slug must match the markdown filename (without `.md`).

```
public/posts/
  getting-started-with-go.md
  images/
    getting-started-with-go/
      hero.webp
      diagram.webp
```

**Always serve images through the Netlify Image CDN** — never reference the raw path directly in markdown or JSX:

```md
<!-- In markdown -->
![Alt text](/.netlify/images?url=/posts/images/getting-started-with-go/hero.webp&w=800&fit=cover)
```

```jsx
// In JSX
<img src={`/.netlify/images?url=/posts/images/${slug}/hero.webp&w=800&fit=cover`} alt="..." />
```

Common Netlify Image CDN params: `w` (width), `h` (height), `fit` (`cover` | `contain` | `fill`), `position`, `q` (quality 1–100).

- Convert and compress automatically — always upload source images as high-quality originals (WebP preferred).
- Never store blog images anywhere else (no `public/images/`, no external URLs unless Cloudinary).
- Keep `public/images/` only for site-level assets: `headshot.jpeg`, `logo.jpg`.

---

## Component Locations

| Component | Path |
|---|---|
| Shared sidebar nav | `src/components/SidebarNav.jsx` |
| Blog layout (TOC + main) | `src/components/blog/BlogLayout.jsx` |
| Table of contents (blog) | `src/components/blog/TableOfContents.jsx` |
| Breadcrumb bar | `src/components/blog/Breadcrumb.jsx` |
| Home page | `src/pages/Home.jsx` |
| Blog directory | `src/pages/blog/BlogDirectory.jsx` |
| Blog post | `src/pages/blog/BlogPost.jsx` |
| Posts metadata | `src/data/posts.js` |
| Markdown files | `public/posts/*.md` |
| Blog post images | `public/posts/images/[slug]/` |


## Sitemap maintenance

- This project uses `public/sitemap.xml` for search indexing.
- Whenever blog posts are added, removed, or slugs/canonical paths change in `src/data/posts.js`, regenerate the sitemap.
- Run:

```bash
npm run sitemap
```

- Before deployment, run `npm run build` so prerender + sitemap are refreshed.
- Canonical domain is `https://sugampanthi.com.np` and must stay consistent across metadata and sitemap URLs.

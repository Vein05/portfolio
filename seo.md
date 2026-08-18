# Portfolio SEO & Metadata Direction

The technical SEO playbook for spanthi.com. This is the operational layer: the exact metadata contract every page and post must satisfy, plus how `llms.txt`, the sitemap, robots, and structured data are produced.

`writing.md` owns the *content* side — voice, the one-sharp-claim rule, search-job framing, internal linking, cadence. This file owns the *machinery* side. When they overlap (both care that a title carries the topic, not just a clever hook), they agree; follow either.

This is a personal site, not a product SEO farm. We do not do programmatic pages, doorway pages, or keyword-stuffed templates. The goal is narrower: every real page is cleanly indexable, honestly described, and extractable by AI answer engines. We compete on being the primary source for a specific claim, not on volume.

---

## Core standard

Every indexed URL must:

1. Answer one real thing a person or model would look for.
2. Carry a title that names the topic, not only a metaphor.
3. Have a hand-written meta description in the 120–160 character band.
4. Resolve to exactly one canonical URL.
5. Be reachable from the sitemap and, if it is a page or post worth citing, from `llms.txt`.

A post is not "done" for SEO until its `src/data/posts.js` entry is complete. The prose can be brilliant; if the entry is missing fields, the post ships with a fallback title and no description, and that is the single most common own-goal on this site.

---

## Where metadata lives

`src/data/posts.js` is the **single source of truth** for per-post SEO. Prose lives in `src/content/blog/*.md`; discoverability metadata lives in `posts.js`. This split is deliberate and load-bearing — `BaseLayout.astro`, the blog directory, JSON-LD, and `llms.txt` all read from `posts.js`, not from frontmatter.

Consequence: **the markdown frontmatter `date` is not what renders.** The displayed date, the `article:published_time`, and the JSON-LD `datePublished` all come from `posts.js`. Keep the two `date` values identical, but if they ever diverge, `posts.js` wins on the live site. When you change a publish date, change it in `posts.js` first.

### Per-post field contract (`posts.js`)

| Field | Required | Rule |
|-------|----------|------|
| `slug` | yes | Matches the markdown filename and the URL. Lowercase, hyphenated, keyword-bearing where natural. |
| `title` | yes | The human title. May be literary. |
| `date` | yes | `YYYY-MM-DD`. Authoritative. Mirror it into the markdown frontmatter. |
| `category` | yes | One of: Research, Engineering, Design, Career. |
| `status` | yes | Kitchen vocabulary: `draft` (hidden — not in sitemap/llms.txt), then a public doneness ladder: `raw` → `cooking` (published but flagged to readers as a working draft) → `plated` (finished) → `fermented` (older/settled). Anything except `draft` is publicly visible and indexed. |
| `excerpt` | yes | 1–3 sentences, the directory blurb. Concrete result up front. Not a duplicate of `seoDescription`. |
| `tags` | yes | 3–7 topical tags. Drives the "pantry" internal-linking. Reuse existing tag spellings exactly so posts cluster. |
| `seoTitle` | yes | ≤ 60 characters *before* the ` \| Sugam Panthi` suffix. Front-loads the searchable topic. This is the `<title>` and OG/Twitter title. |
| `seoDescription` | yes | 120–160 characters. States the concrete finding + scope. This is the meta description and the JSON-LD description. |
| `ogImage` | when one exists | Absolute URL to a 1200×630 image. Omit if none; BaseLayout falls back to the headshot. |
| `canonicalPath` | yes | Usually `/blog/<slug>`. Set explicitly so canonical is never guessed. |
| `series`, `seriesOrder` | series only | Enables prev/next `<link>` and series nav. |

### `seoTitle` vs `title`

`title` can keep the literary hook. `seoTitle` must lead with the topic a searcher or model would type. Example from this repo:

- `title`: "Eternal-Present Memory: Why Your Assistant Thinks You Still Live Where You Were Only Visiting"
- `seoTitle`: "Temporal Memory Consolidation in LLMs | Sugam Panthi"

The hook wins attention in a feed; the `seoTitle` wins the search result. We get both because they are separate fields. Do not collapse them.

### `seoDescription` rules

- 120–160 characters. Under 120 wastes the snippet; over ~160 gets truncated.
- Lead with the concrete result or claim, then the scope ("across 19 models", "a 2,000-call pilot").
- No marketing verbs, no "in this post". Write it as the sentence you would want quoted.
- Distinct from `excerpt`. `excerpt` sells the click on-site; `seoDescription` is the SERP/answer-engine snippet.

---

## The `<head>` contract

`src/layouts/BaseLayout.astro` emits the full stack for every page. Do not hand-roll meta tags in a page; pass props to `BaseLayout`. It renders:

- `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta name="author">`
- Open Graph: `og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image` (+ typed dimensions), `article:published_time` for posts
- Twitter: `summary_large_image`, `twitter:site`/`creator` `@SugamPanthi`, title/description/image
- JSON-LD per route: `BlogPosting` + `BreadcrumbList` on posts, `WebPage` on the home page

New page types pass `title`, `description`, `canonical`, `ogTitle`, `ogUrl`, `ogType`, and `ogImage` as needed. Add page-specific JSON-LD via the `head` slot, not by editing BaseLayout.

### Structured data policy

- Posts emit `BlogPosting` + `BreadcrumbList` (both Google-supported).
- Do **not** emit `FAQPage` — Google restricts that rich result to authoritative health/government domains; on a personal site it will not render and risks looking like markup spam.
- Author and publisher are both the `Person` "Sugam Panthi". Keep it consistent for entity consolidation.

---

## `llms.txt`

Served at `/llms.txt` by `src/pages/llms.txt.ts`, generated at build time from `posts.js` + the core page list. Standard llms.txt format:

```
# Sugam Panthi
> one-line site description
## Core Pages
- [Title](https://spanthi.com/path): description
## Writing
- [seoTitle](https://spanthi.com/blog/slug): seoDescription
```

Rules:
- Generated, never hand-maintained. Adding a `posts.js` entry adds it to `llms.txt` automatically.
- Only `status !== 'draft'` posts appear.
- Descriptions come from `seoDescription` (fallback `excerpt`), which is why those fields must always be filled.
- Posts are listed newest-first.

## Sitemap

- **One source:** `@astrojs/sitemap` (configured in `astro.config.mjs`) generates `/sitemap-index.xml` + `/sitemap-0.xml` at build, always in sync with real routes.
- There is **no** hand-maintained `public/sitemap.xml`. A static file goes stale the moment a post is added and silently competes with the generated one. If you find one, delete it.
- `robots.txt` points only at the generated `/sitemap-index.xml`, plus `/llms.txt`.

## robots.txt

`public/robots.txt`: allow all, declare the sitemap index and llms.txt. No crawl blocks on a personal site we want fully indexed.

---

## Checklist for a new post

1. Write the post in `src/content/blog/<slug>.md` with `title`, `date`, `category`, `status` frontmatter.
2. Add the full `posts.js` entry per the field contract above. Same `slug`, same `date`.
3. Confirm `seoTitle` ≤ 60 chars (pre-suffix) and leads with the topic.
4. Confirm `seoDescription` is 120–160 chars and states the concrete result.
5. Reuse existing `tags` spellings so the post clusters with siblings.
6. `npm run build` — the post is now in the sitemap and `llms.txt` automatically. No manual sitemap edit.

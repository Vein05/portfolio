# Paper Poster System — Design

Date: 2026-08-25. Status: implemented and shipped — see `poster.md` (repo root) for the living design-principles doc; this file is the original approved spec.

Implementation deviations from the spec below, all user-approved during the build: one page file per poster (`src/pages/poster/memory-targets.astro`) instead of a `[slug]` route + data module; no screen toolbar (the page is only the poster; browser zoom/print are the UI); figures are the paper's own vector PDFs converted to SVG rather than site-styled rebuilds; the poster uses the paper's LaTeX palette (Raw #4C72B0 / Source #55A868 / Canonical #C44E52), not the site theme; an eighth TL;DR band was added.

## Goal

Full-size vertical (A0 portrait) research-poster pages that live on the website, print correctly, and export as high-quality vector PDF for poster sessions. One reusable skeleton; each paper's poster is hand-arranged on top of it. First poster: **Same Ranking, Different Winner: How Scoring Targets Shape LLM Memory Benchmarks** (arXiv 2605.24060, EMNLP Findings 2026).

## Approach (chosen: A)

HTML/CSS poster page with a print stylesheet. Rejected alternatives: SVG-first (no text wrapping, high maintenance), LaTeX/tikzposter (second design system, poor web experience). Known accepted limitation: browser print-to-PDF yields vector output that prints perfectly and can be *placed* in Illustrator/PowerPoint, but text imports as fragments, not editable paragraphs.

## Architecture

- **Route:** `src/pages/poster/[slug].astro`, driven by a per-poster data/content module so future papers reuse the machinery. First slug: `memory-targets`.
- **Rendering:** static Astro/HTML + inline SVG. **No React islands inside the poster canvas** — print output must not depend on hydration timing. Screen-only chrome (zoom fit/100% toggle, Print/Save-PDF button, back link) lives outside the canvas and is hidden in print; a tiny inline script may drive the zoom toggle.
- **Components:** `src/components/poster/` — `PosterShell` (canvas + grid), cell types `TitleBand` (title, authors, venue, QR to the paper), `ClaimCell`, `FigureCell` (kicker / takeaway title / SVG / provenance caption, same idiom as `ChartCard`), `MethodCell`, `TakeawayCell`.

## Canvas, layout, export

- Canvas is a fixed `841mm × 1189mm` element (true A0 portrait). On screen, scaled to fit the viewport with `transform: scale()`; 100% mode for proofreading.
- Print: `@page { size: 841mm 1189mm; margin: 0 }`, transform removed, chrome hidden. Cmd+P → Save as PDF is the export path for both printing and other software.
- Layout: 12-column CSS **bento grid** of typed cells. Because bento grids are ambiguous about reading order, every content cell carries a numbered marker (①–⑥) forming an explicit reading spine.
- Typography at poster scale: ~90–110pt title, ~36–48pt section heads, ~24–28pt body (readable at 1.5 m). Paper-and-ink aesthetic per `design.md`; theme tokens throughout; print uses the light theme.

## Content rules

All numbers come from the paper itself (fetched from arXiv during implementation) — same honesty rules as `design.md`/`writing.md`: real data only, captions state takeaway then provenance. Planned centerpiece for the first poster: slope/dumbbell figure showing the fixed ranking producing different winners under Raw vs Source vs Canonical scoring targets across LoCoMo, LongMemEval-S, Mem0, MemoryOS; plus a TIAP-audit diagram for method. Final figure set decided against the actual paper.

## Discovery

"Poster" link on the paper's card in `Papers.jsx`, same idiom as the arXiv link.

## Verification

1. Headless-Chrome screenshot of the screen view (hydration-independent, but keep the standard recipe).
2. Headless `--print-to-pdf` to confirm: A0 page size, vector text, no clipped or overflowing cells.

# Poster System — Design Principles

How research posters are built here. Companion to `design.md` (site figures) and `writing.md` (prose, binding for poster copy too); the original approved spec is `research/2026-08-25-paper-poster-design.md`. Posters so far: `/poster/memory-targets` (EMNLP Findings 2026), `/poster/outcome-monitors` (arXiv 2608.19303), `/poster/rag-compression` (arXiv 2606.21807).

## What this is

Full-size A0-portrait (841 × 1189 mm) research posters that live on the website, print correctly, and export as single-page vector PDF for poster sessions. One reusable skeleton; each paper's poster is hand-arranged on top of it.

## Principles

1. **The page IS the poster.** A poster route renders nothing but the poster: no site nav, no toolbar, no theme machinery. The canvas scales to fill the window width; browser zoom is the zoom UI; browser print is the export UI. Cmd+P → Save as PDF must yield the exact single-page vector A0 file.
2. **Physical units, always.** The canvas is a fixed `841mm × 1189mm` element; type is set in `pt`. Screen display is a pure `transform: scale()` on top — so what you proof on screen is geometrically identical to print.
3. **Static markup only.** No React islands or hydration inside the canvas. Print output must never depend on client-side timing. The only script is the tiny inline fit-to-width scaler.
4. **Self-contained styling.** Posters do not import the site's themed `global.css`. `src/styles/poster.css` defines its own fixed near-white palette. No site textures, tints, or theme switching — a poster is an academic artifact, not a page of the personal site.
5. **The paper is the theme.** Each poster adopts its paper's own figure palette as CSS tokens. For memory-targets that is the LaTeX-defined seaborn-deep set: `RawTurnColor #4C72B0`, `SourceFamilyColor #55A868`, `CanonicalColor #C44E52` (+ `#DD8452` for partial-verdict orange). Custom charts must be hue-identical to the embedded paper figures; never mix the site palette into a poster.
6. **Redraw figures at poster scale; the paper figure is the spec, not the asset.** Compiled paper figures are drawn for a 3.3-inch column: blown up to A0 their strokes, fonts, and label density read as postage stamps of the paper (this sank the first outcome-monitors poster). Rebuild each figure as inline SVG in the poster page — same content, same palette, same encoding as the paper figure, but Oswald type and poster-weight strokes — using the paper's TikZ/matplotlib source as the ground truth for every value. Compute coordinates from the raw numbers in Astro frontmatter (type the numbers once, derive coordinates), never hand-placed. `pdftocairo -svg` conversion of paper PDFs is acceptable only for figures that are already large-canvas and poster-legible.
7. **Real numbers only.** Every value on the poster comes from the camera-ready paper, or, when the research repo's frozen analysis is ahead of the posted arXiv version (rag-compression), from the repo's frozen result artifacts (note the divergence in the page's frontmatter comment). When the blog and the paper disagree (e.g. an earlier pilot audit vs the final one), the paper wins. Captions state the takeaway, then provenance ("Data: paper Table 5").
8. **Poster copy follows `writing.md`.** All prose rules apply to titles, captions, takeaways, and the TL;DR, especially: no em dashes (restructure with periods, commas, colons, semicolons, or parentheses), bounded claims, kill throat-clearing.
9. **Bento grid with a reading spine.** Layout is a 12-column grid of typed cells, but bento grids are ambiguous about order — so every content cell carries a numbered marker (①…⑧) forming an explicit reading path: problem → method → core result → consequences → validity → takeaway → TL;DR.
10. **Typography is calculated, not eyeballed.** At print scale 1pt = 0.353mm; readable distance ≈ text height in mm × 300. Tiers: title ~62pt (~6 m), cell titles 28pt (~2.5 m), body/TL;DR 21–23pt (~1.5 m, standard poster distance), captions 18pt / kickers 16pt (~1 m lean-in tier). Nothing below 14pt.
11. **End with a TL;DR band.** A full-width three-column strip (what we did / what we found / what you should do) is the last cell — the walk-away message, set at body size, never fine print.

## Architecture

- `src/components/poster/PosterShell.astro` — bare HTML shell + A0 canvas + fit-to-width scaler.
- `src/components/poster/PosterCell.astro` — bento cell: `span`, numbered `marker`, `kicker`, `title`.
- `src/components/poster/TitleBand.astro` — full-width header: venue kicker, title, authors, QR to the paper.
- `src/styles/poster.css` — tokens, canvas, cells, shared chart pieces (winner grid, TL;DR band), print rules (`@page { size: 841mm 1189mm; margin: 0 }`).
- `src/pages/poster/<slug>.astro` — one hand-crafted page per paper on top of the shared parts.
- `public/poster/` — QR codes (`npx -y qrcode -t svg -o ... "<arxiv-url>"`) and converted figure SVGs.

## Adding a poster (checklist)

1. Pull real numbers from the camera-ready paper (arXiv), not the blog post.
2. Redraw the paper's figures as inline SVG at poster scale (principle 6), computing coordinates from the raw numbers in frontmatter; convert a paper PDF into `public/poster/figures/` only if it is already poster-legible.
3. Extract the paper's palette (grep `definecolor` in the LaTeX source) into poster tokens.
4. Generate the QR SVG; add a "Poster" link (`posterHref`) on the paper's card in `Papers.jsx`.
5. Lay out cells against the height budget (~1150mm of usable canvas); leave real margin under the last row.
6. Verify on the **production build** (`npm run build` + `astro preview`), not the dev server — dev can silently drop scoped styles for slot content. Check: headless screenshot for layout; headless `--print-to-pdf` must give **1 page, MediaBox 2383.92 × 3370.08 pt**, no clipped cells.

## Known limitation

The exported PDF is vector and prints perfectly, and can be placed into Illustrator/PowerPoint — but text imports there as fragments, not editable paragraphs. Accepted trade-off of the HTML/CSS approach (spec, approach A).

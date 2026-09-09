# Portfolio Design Guide

How figures, charts, and visual components should look and be built here. Design is a first-class priority on this site, not a finishing touch: invest real effort in making things clean, precise, and infographic-grade. When in doubt, spend the extra pass.

This file governs the visual layer. `writing.md` governs prose; `AGENTS.md` holds the deeper craft/voice section.

---

## Aesthetic

Paper-and-ink technical aesthetic: restrained, hand-drawn, editorial. Think a well-made research figure or a New York Times explainer, not a SaaS dashboard. Reference the existing hand-drawn SVG thumbnails in `src/components/Papers.jsx` for the house style.

- **Theme-aware, always.** Never hardcode hex colors for content. Use the CSS variables so light/dark both work: `rgb(var(--color-ink-dark))`, `--color-ink-muted`, `--color-ink-blue`, `--color-ink-red`, `--color-paper-surface`, `--color-paper-light`, `--color-border-paper`, `--color-blue-soft`. A rare accent hex is acceptable only for a semantic third color that has no token (document why).
- **Palette semantics.** Ink for structure and neutral values. Blue for the good/fixed/intervention state. Red for the failure/danger/baseline-problem state. Muted for scaffolding (axes, ticks, secondary labels).
- **Type.** Monospace (Oswald mono stack) for chart labels, kickers, and values. Uppercase plus letter-spacing for kickers and axis titles. Small type is still reading type. Follow the figure-text minimums below.

---

## Figures

- Every figure is a `<figure>` built with the shared `ChartCard` wrapper in `src/components/blog/ResearchCharts.jsx`: a bordered `bg-paper-surface` card with a kicker (uppercase mono), a bold one-line title that states the takeaway, the chart, and a caption.
- **Centered on desktop.** `.blog-prose figure { margin: 2rem auto }` in `global.css` centers all figures. Cards use `max-w-[720px] mx-auto`. Do not reintroduce a left/right margin that overrides the auto centering.
- **Captions state the takeaway, then the provenance.** Lead with the claim the figure proves. For any data chart, the caption must name the model and sample size (e.g., "DeepSeek V4 Flash, 300 clusters per condition"). This is non-negotiable and mirrors the honesty rule in `writing.md`.
- **Responsive.** SVGs use a `viewBox` with `width="100%" height="auto"`. Include a real `role="img"` + `aria-label` describing the finding.

### Figure-text minimums

Judge text at its rendered size, not only by the number written in `fontSize`. A `10`-unit SVG label becomes 5 CSS pixels when a 720-unit chart is squeezed into a 360-pixel column.

At the standard 720 CSS-pixel desktop chart width:

- Figure title: at least 16 CSS pixels, bold.
- Figure kicker: at least 11 CSS pixels.
- Primary row and category labels: at least 14 CSS pixels; prefer 15 when space permits.
- Values printed on or beside marks: at least 15 CSS pixels and weight 600 or 700.
- Axis ticks, legends, annotations, and secondary labels: at least 12 CSS pixels; prefer 13.
- Caption: at least 13 CSS pixels with a line height of at least 1.5.

No essential figure text may render below 12 CSS pixels at any supported viewport. On narrow screens, use one of these options in order:

1. Reflow the figure into a taller mobile layout.
2. Shorten labels without changing their meaning.
3. Give the SVG a readable minimum width and allow horizontal scrolling.

Never make labels smaller to avoid wrapping or scrolling. Shared research charts keep a 720 CSS-pixel minimum drawing width so a 14-unit label in a 720-unit SVG does not shrink below 14 CSS pixels. Test at 720 CSS pixels and 360 CSS pixels. At both widths, a reader must be able to identify every category, value, legend entry, and axis without browser zoom.

---

## Charts

Custom SVG components, no charting library. Each chart is a component in `src/components/blog/ResearchCharts.jsx`, dispatched from markdown via a fenced block:

    ```chart
    type: seam-absorption
    ```

The `type` maps to a component in the `ResearchChart` switch at the bottom of that file. To add a chart: build the component with `ChartCard`, register it in the switch, reference it by `type` in the post.

Rules:

1. **Real data only.** Every number in a chart must come from the paper/experiment and match the post prose exactly. Never fabricate or round-desync values. If prose says 31.3%, the bar says 31.3%.
2. **No data, no data chart.** When a finding is qualitative or pilot-stage (e.g., n=1), use a labeled conceptual diagram, not a bar chart that implies a rate. Caption it as conceptual.
3. **Annotate the point.** Draw the reader's eye to the finding: a "7× drop" bracket, a highlighted row, a delta label. The chart should teach its title wordlessly.
4. **Legends and axes are muted; data is saturated.** Ticks and gridlines dashed and light; the data marks carry the color.
5. **Reuse patterns.** Dumbbell/slope for before→after, forest plot for effects with CIs, stacked bars for composition, panel for many models. Match spacing and label conventions already in the file.
6. **Icons** (model families, etc.) live in `public/posts/images/<slug>/icons/` and are referenced by path. Confirm the asset exists before shipping.

---

## Always verify visually

Do not claim a visual change is done without looking at it. Small issues (off-center figures, clipped labels, overflow) pass the build and hide in code review.

1. `npm run dev` (Astro, http://localhost:4321).
2. Headless screenshot:
   ```
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
     --hide-scrollbars --force-device-scale-factor=2 --window-size=880,7200 \
     --virtual-time-budget=9000 --screenshot=out.png <url>
   ```
   Charts are client-side React islands, so `--virtual-time-budget` is required to let them hydrate.
3. Crop to each chart with Python PIL (`/opt/homebrew` python3) to read fine detail, and inspect for clipping, overflow, overlap, and centering.
4. Test desktop width (≥1024, sidebar visible) to confirm figures are centered within the article column.
5. Test a 360-pixel content viewport. Confirm that figure text remains at least 12 CSS pixels; if the chart scrolls, the scroll region must contain the entire SVG and no page-level horizontal overflow.

**Previewing a draft:** posts with `status: "draft"` 404 even in dev. To preview, temporarily set a visible status AND add a `src/data/posts.js` entry (the metadata source; without it the island shows "Post not found"). Revert both before commit.

---

## Acid test

Before shipping a figure, ask: would this look at home in a strong explainer or a well-made paper? If it looks like a default library chart, or a stranger couldn't read the finding from the title and caption alone, it needs another pass.

# Landscape Posters — 44 × 32 in

Companion to `poster.md`, which remains the authority on everything format-independent (principles, palette, figure redrawing, real-numbers rule). This file covers only what changes when the same poster is also printed on the lab's landscape sheet. First built 2026-09-14 for `/poster/memory-targets/landscape/`.

## What this is

A second sheet format for a poster that already exists in A0 portrait: **44 × 32 in (1117.6 × 812.8 mm, 3168 × 2304 pt)**. This is the size the group's print shop runs and what every other AIMS Lab poster is printed at, so a poster shown alongside them should match it. A0 is *not* retired — both formats are published, from one authored source.

Do not confuse this with a roll-width constraint. 44 in is also a common roll width, and "44 × 32" can mean either a landscape sheet or a portrait poster on a 44-in roll. Ask which before rebuilding anything: if it is roll width, an A0 portrait sheet fits inside it unchanged and there is no work to do.

## Principles

1. **One source, two routes.** The sheet content lives in `src/components/poster/sheets/<Name>.astro` and takes a `format` prop. `src/pages/poster/<slug>.astro` and `src/pages/poster/<slug>/landscape.astro` are route shims of about six lines each. Never duplicate a poster per format — the prose and numbers would drift the first time one is corrected.
2. **Format is one value with four consumers.** The route sets it; `PosterShell` puts it on `<body data-format>` and picks the sheet size; the sheet's frontmatter branches figure geometry on it; `PosterCell` picks its span from it. Nothing else should need to know.
3. **Prefer a knob to a branch.** Anything that is the same design at a different size belongs in a CSS custom property set once per format, not in a per-rule override and not in markup. Current knobs: `--type-scale`, `--fig-w`, `--qr-size`, the grid row weights, and `landscapeSpan`.
4. **CSS scales; it cannot re-lay-out.** A figure whose internal arrangement is wrong for the sheet needs its `viewBox` changed in frontmatter. No amount of CSS turns two side-by-side chart panels into stacked ones. Reach for a `format` branch only when the *arrangement* changes, never for size.
5. **The scarce resource is height, not width.** A0 is 1189 mm tall; this sheet is 812.8 mm. Every layout decision is a height decision. A0 habits — six stacked rows, a full-width hero chart — do not transfer.
6. **Fill the sheet or shrink the cell.** A cell padded out with whitespace reads as an unfinished poster. If a cell cannot fill its height, either its artwork grows (see the audit bar) or its band takes a smaller share of the sheet. Never leave a dead band.
7. **The lab header replaces the TitleBand.** On the landscape sheet the house header (`LabHeader.astro`) is used so the poster matches the group's others. Portrait keeps `TitleBand` and its QR. The two are not interchangeable: TitleBand carries a QR and an affiliation line; LabHeader carries institutional marks and an acceptance line.

## The house header

Rebuilt from the group's reference PDF; every value measured, not eyeballed. Fractions are of the **sheet width** (3168 pt), expressed as `calc(var(--sheet-w) * f)`.

| element | measured | fraction of width |
|---|---|---|
| band height | 251 pt | 0.0792298 |
| closing rule | 10 pt, `#7F7F7F`, full width | 0.0031566 |
| USM mark | 530.2 × 226.5 pt at x=0, y=3.7 | 0.167361 × 0.071496 |
| venue / chip slot | 529.5 × 72.8 pt at x=2625, y=17.2 | 0.828598, 0.022980 |
| AIMS mark | 480.8 × 83.2 pt at x=2645.2, y=120 | 0.834975 × 0.026263 |
| title | Times New Roman Bold 66 pt, `#000` | 0.0208333 |
| authors | Times New Roman Bold 48 pt, `#595959` | 0.0151515 |

Rules that came out of building it:

- **Never `cqw` in the header.** Chrome resolves container-query units inconsistently in the interactive print path: the band collapsed in Save-as-PDF while headless `--print-to-pdf` rendered it correctly, so it passed every automated check. Use `calc(var(--sheet-w) * f)`; `--sheet-w` is set inline on the canvas by `PosterShell`.
- **The title block is centred between the logo zones, not on a fixed baseline.** The reference pins its title to a baseline, which only works for a short one-line title. A real paper title is 70+ characters and runs under both marks. The block is inset left `0.167361` and right `0.171401` and centres vertically, so a short title lands where the reference puts it and a long one wraps.
- **The logos are the real marks, never redrawn.** They live in `public/poster/logos/`. Extracted from the reference PDF at ~200 ppi effective, which is adequate for print; vector originals from the lab are a drop-in replacement. Do not approximate an institutional mark in SVG.
- **Key white out of any logo placed on the paper.** The canvas is `245 240 232`, not white, so a logo on a white ground shows as a rectangle. Alpha is `1 - min(r,g,b)`, then unpremultiply off white. Using `1 - max` instead desaturates saturated colours to grey — it silently destroyed the AIMS blue on the first attempt.
- **One lab, one badge.** The chip slot is for a genuinely co-badged poster only; `LabHeader` takes `venue` or `lab`, and the AIMS mark re-centres when neither sits above it. The acceptance line does **not** go there: a real one ("Accepted at EMNLP Findings 2026") runs two lines in that slot and crowds the AIMS mark. It is the sheet's last line instead, flush left below the bottom band (`.poster-venue-line`, red `#C00000`), outside every cell, where it reads as a stamp on the paper rather than as poster content.
- Double-blind still applies: no venue in that slot until the paper is accepted (`poster.md` 7b).

## Layout

### What the sheet actually prints at

Measured off the print PDF, not the screen. On this sheet CSS pt equals printed pt, because the canvas is sized in physical units (`mm`) and prints 1:1. At `--type-scale: 1.4`:

| element | printed pt |
|---|---|
| house title / authors | 66 / 48 (fixed by the reference, not the type scale) |
| cell headline | 44.7 |
| body copy | 30.8 |
| caption | 28.7 |
| kicker | 25.5 |
| floor for any text inside a figure | ~20, and never below 18 |

To re-measure after a change, read the sizes out of the PDF rather than trusting the source numbers:

```
mutool draw -F stext -o out.xml poster.pdf     # then group <font size="…"> by size
```

### Rules

- **Three bands, not six rows.** Portrait's `(5,7) (12) (6,6) (6,6) (12)` becomes roughly `(5,4,3) (3,3,3,3) (12)`. Give the widest cell to whichever figure has the most extreme aspect ratio, not to the most important cell — importance is carried by the marker order and the title, and a squeezed chart serves no one.
- **Weight the bands.** `grid-template-rows: auto minmax(0, 1.12fr) minmax(0, 0.88fr) auto`. The argument band (problem / method / core result) carries more than the supporting-checks band, so an equal split leaves the lower cells padding out height. `minmax(0, …)` is load-bearing: it lets bands compress so height-capped figures give up room instead of the last band overflowing and being clipped by the print rules.
- **Figures fill, capped by height.** `width: var(--fig-w, 100%); height: auto; max-height: 100%; object-fit: contain`, in a figure that is `flex: 1` with `justify-content: center`. `height: auto` with `flex: 1` does **not** grow a replaced element — it only adds whitespace around it. A wide chart stays width-bound and its leftover height splits above and below rather than pooling under the cell.
- **Type is one number, and that number is 1.4.** Every `font-size` in `poster.css` is `calc(Npt * var(--type-scale, 1))`. Portrait is the 1.0 baseline; landscape is **1.4** (2026-09-15). It was 1.14 until the printed sheet was actually measured, which put body copy at 25 pt under a 66 pt house title — well below what the group's other 44 × 32 sheets run. 1.4 is the largest step all five sheets take without a cell clipping; past it the fix is cut copy, not CSS.
- **`--type-scale` does not reach inside a figure.** An inline SVG's `font-size` is in viewBox units, so it scales with the figure's rendered width and ignores the type knob entirely. Raising the sheet's type therefore *shrinks* every chart label relative to the prose around it. Give any figure that needs it its own step (`k` in the geometry object, `const sfs = (n) => Math.round(n * k)`) and apply `sfs()` to **every** `font-size` in that SVG, and to the label-dodge spacing. Scale the text baselines too: a panel title at `y = 24` with a 32-unit font rides off the top of its own viewBox.
- **A figure that cannot fill gets a deeper viewBox.** The audit bar is 4.5:1 and cannot grow into a narrow, tall cell. Its landscape geometry is a separate object in frontmatter (`h: 360` vs `160`, thicker bar, 58 pt numerals) rather than a CSS override. Same for the slope chart: portrait is two panels side by side (`1440 × 340`), landscape stacks them (`720 × 690`), which is what lets that cell hand width back to its neighbour.

## Traps

- **A change "for the landscape sheet" usually reaches portrait too.** Moving the 83.4–94.0 % stat from cell ② to cell ① was requested while looking at landscape; applied to both, it grew the taller cell of portrait's first row and pushed the TL;DR band off A0. Anything that changes a cell's *content volume* needs an `isLandscape` branch and a portrait re-check. Size knobs do not — they default to the portrait value.
- **`Pages: 1` does not mean it fits, and neither does a healthy bottom margin.** The print rules set `overflow: hidden`. Sheet-level overflow is caught by the margin check, but a **cell** whose content exceeds its grid row is clipped silently and reports nothing: one page, full margin, half a caption gone. Two sheets shipped that way before anyone noticed. Measure the cells, in a real browser, at full sheet size:

  ```js
  // in an iframe sized 4224 x 3072 css px (landscape) so the poster is at 1:1
  [...doc.querySelectorAll('.poster-cell')]
    .map((c, i) => ({ i: i + 1, over: Math.round(c.scrollHeight - c.clientHeight) }))
    .filter((x) => x.over > 1)
  ```

  Anything over 1 px is a clip. This is also how to find the type ceiling: set `--type-scale` on the canvas and re-read, rather than rebuilding per guess.
- **The gallery iframe and the format switch.** `posters.astro` reads `src/data/posters.js`; give a poster a `formats` entry when it gains a landscape sheet. The switch in the toggle group shows the *other* format's label and navigates; it is a link, not a view toggle, and is set off by a rule for that reason.
- The screen toggle sits bottom-right, not top-right, because the landscape header uses its top-right corner.
- **Never embed a compiled paper figure.** `poster.md` says this already; raising the type scale is what makes it undeniable. The paper's matplotlib panels carry their own baked-in type, so when body copy went to 30.8 pt the transfer chart's labels were still printing at 10 pt. A 2 × 2 grid of three-point panels also cannot survive a one-column cell. Both were fixed by redrawing the figure poster-native as a single slope panel in the same language as its neighbour. Check the whole set with the `mutool` scan above: anything under 18 pt is an embedded figure or a figure that needs its own `k`.
- **A dead gutter in a viewBox reads as a centring bug.** The loud/silent figure looked left-shifted in its cell; it was not. Its viewBox was `900 × 264` while the drawing only reached x=684, so a quarter of the box was empty and `object-fit` centred box-plus-gutter rather than the drawing. Check with `svg.getBBox()` against the viewBox before touching any alignment CSS, and crop the viewBox to the content.
  - Cropping a viewBox changes the figure's **aspect ratio**, which changes its height at a given width. A width-bound sheet (A0 always is) gets a taller figure for free and can tip over the sheet edge. Give the narrowed box an explicit width so the drawing stays the size it was.
- **`--fig-w` reaches an `<img>` in both formats but an inline `<svg>` only in landscape.** `poster.css` sets `width: var(--fig-w, 100%)` on `.poster-figure img` at the top level and on `svg, img` inside the landscape block. Setting `--fig-w` on a figure that holds an inline SVG therefore does nothing on A0. Set `width` on the `svg` directly when the portrait sheet is what needs it.
- **Height comes from the band weights, not from the cell.** A figure that will not grow is usually in a band that is too short, not in a cell with a bug. Before trimming copy, check what the row weights give it. Conversely, when one cell overflows, the cheapest room is often in the fixed-`mm` gaps and paddings that do *not* scale with type (`.winner-grid`'s `gap` and the chip `padding` were tuned against 22 pt copy and gave back 30 mm at 1.4).

## Adding a landscape sheet to an existing poster (checklist)

1. Move the poster body from `src/pages/poster/<slug>.astro` into `src/components/poster/sheets/<Name>.astro`, add the `format` prop and `const isLandscape = format === 'landscape'`. Leave a route shim behind and add `src/pages/poster/<slug>/landscape.astro`.
2. Add `formats: ['portrait', 'landscape']` to the poster's entry in `src/data/posters.js`.
3. Swap `TitleBand` for `LabHeader` under `isLandscape`. If the paper is accepted, add `{isLandscape && <p class="poster-venue-line">Accepted at ...</p>}` as the last child of `PosterShell`, not a `venue` on the header.
4. Give every cell a `landscapeSpan`; aim for three bands.
5. Branch the `viewBox` of any figure whose *arrangement* is wrong on a wide, short sheet. Size alone is not a reason to branch.
6. Set `--fig-w` per figure for landscape where the A0 percentage no longer suits the column.
7. Verify on the **production build** (`npm run build` + `astro preview`), per `poster.md`. Both sheets, every time:
   - `--print-to-pdf` gives **1 page, 3168 × 2304 pt** landscape and **2383.92 × 3370.08 pt** portrait.
   - Bottom margin is a real margin, not zero. Use the checker, which reports page geometry and fit together:
     ```
     python3 scripts/check-poster-pdf.py http://localhost:4330/poster/<slug>/landscape/
     ```
     Do NOT hand-roll this scan. Chrome's PDF raster leaves a one-pixel artifact line on the page edge at some resolutions, which a naive threshold counts as content and reports as a 0 mm margin. It is dpi-dependent, so it false-alarms on some sheets and not others; the checker inhibits a 2 px frame and requires a row to carry more than 1% of the page width. A genuine clip still reports near zero.
   - **No cell overflows.** Run the per-cell scan in Traps. The margin check does not cover this.
   - No text inside any figure prints under 18 pt. Run the `mutool` scan in Layout.
   - Screenshot the header in **both** the screen and print paths — they diverge, and that is exactly where the `cqw` bug hid.
   - Check the portrait sheet even when you only touched landscape.
8. Trimming a cell that will not fit, cheapest first: drop the kicker on landscape only (`kicker={isLandscape ? undefined : '…'}`) — the marker and headline carry the cell without it; tighten fixed-`mm` gaps that did not scale with the type; cut the caption to its `Data:` line; then cut prose. Move a stat out of a cell only if the TL;DR band or another headline already carries the number.

## Status (2026-09-15)

All five landscape sheets and all five A0 sheets print one page at the right geometry with a real bottom margin, and **no cell overflows on any of them** (per-cell scan in Traps).

Portrait `outcome-monitors` used to land on the sheet edge at 0 mm. It carries nine cells in six rows where the other posters carry seven in five, so its gutters and cell paddings alone added a row's worth of height. It is fixed by tightening **that poster's** A0 gutter to 6 mm and its cell padding to 6 mm, in its own sheet's `is:global` block, which costs no copy. Prefer that over cutting content when a sheet is close, and do not go below 6 mm: at 5 mm the cells stop reading as separate panels from across a room.

Still open: text inside some figures prints below the 18 pt floor, worst on `seam` (the pasted-artifact mock at 11 pt and the leaderboard at 13 pt) and `outcome-monitors` (the lane diagram at 11 pt). Both need the `k` treatment, and the seam mock may need redrawing rather than scaling: it is a UI screenshot in SVG form and its boxes are sized to its current type.

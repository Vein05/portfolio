# Changelog

All notable changes to the portfolio site are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## 2026-09-04

### Added
- **Poster gallery** at `/posters` (`src/pages/posters.astro`): one card per A0 poster with a live scaled iframe preview, venue, authors, and a Draft/Poster chip.
- **Draft poster: "The Stale Answer Problem: Where the Current Statement Drops Out"** (`src/pages/poster/stale-policy.astro`). Idea proposition, no paper. Illustrative 120/90-day FAQ-versus-policy example, the three-stage diagnostic, six literature rows with arXiv links, two ingestion observations from the 2026-09-04 lib.usm.edu crawl, hypothesis, plan, and kill criteria.
- **Poster view toggle** (`PosterShell.astro`): Fit width or A4 width on screen, remembered in localStorage, hidden inside iframes and in print.
- **Right-click export menu** on every poster: "Download PDF · A0 full size" and "Download PDF · A4" open the print dialog with the page size preset (`poster.css` `@page` rules keyed on `body[data-print-size]`; A4 uses CSS zoom 210/841). `?print=a4|a0` preselects for headless checks. Verified with Playwright: all four posters export as one page at A0 and at A4.
- **arXiv ids are links**: `TitleBand.astro` auto-links `arXiv:NNNN.NNNNN` in the kicker; the draft poster links its literature ids.

- **Cell lightbox** (`PosterShell.astro`, `poster.css`): double-click a cell to open a cloned copy in a full-screen dialog, fit to viewport, with +/−/Fit buttons and ⌘/ctrl+wheel zoom. Vector content, so lossless. Off in iframes and print.
- **Cell slack rules** (`poster.css`, `PosterCell.astro`): a trailing caption (or `.pin-bottom` element) pins to the cell floor; `fill` prop distributes a list-only cell's items over the cell height. Applied to the three takeaway cells. Principle 9a in `poster.md`.

### Changed
- **Outcome Monitors poster and gallery card** no longer name the submission venue (double-blind); arXiv id only. Rule added to `AGENTS.md` and `poster.md` (7b).
- `poster.md` principle 1 rewritten for the two views and the export menu; principle 9a (cell slack), draft-poster rules, architecture and checklist entries updated.
- Draft poster copy: subtitle rewritten as an open question (frequency of the cross-page case is what gate 1 measures, not a premise); four overclaiming or obvious lines cut; arrow labels moved off their lines.

## 2026-08-20

### Added
- **New post: "Five Years, Zero Fives: Half a Decade of ACL Rolling Review Scores"** (`src/content/blog/five-years-zero-fives.md`), with its `posts.js` metadata entry. Analyzes 35 ARR cycles (69,781 scored submissions, 2021–2026): no paper ever averages a 5.0, the mode is 2.5, and the meta score swings wider than a paper's averaged reviews. Opens with the IC-Light [10, 10, 10, 10] ICLR 2025 contrast.
- **Three ARR charts** in `src/components/blog/ResearchCharts.jsx`, registered in the dispatch switch: `arr-score-ceiling` (per-paper score distribution), `arr-reviewer-vs-ac` (averaged reviews vs meta), `arr-mean-vs-volume` (flat mean under 100x volume growth).
- **Paper: "Outcome Monitors: Recovery Affordances for Silent Tool Failures"** (arXiv 2608.19303, Panthi & Abdelfattah), now public:
  - `citations.js` BibTeX entry (`outcome-monitors`).
  - Papers panel entry in `Papers.jsx` with a new hand-drawn `OutcomeMonitor` thumbnail.
  - Cited in the `agents-believe-tools-that-lie` post: live arXiv link plus a "Cite this work" BibTeX block.

### Changed
- **Homepage hero bio** (`src/pages/index.astro`) simplified to "Hello, I'm Sugam Panthi." with two section links ("what I'm working on" → `#projects`, "researching" → `#research-conversational-memory`). Removed the dementia line and the `@Pali` mention.
- **`OutcomeMonitor` thumbnail**: removed the recovery-branch arrowhead; the dashed line now runs to the door without it.

### Fixed
- Aligned the ARR post prose and chart labels to the corrected data model: the ARR histogram reports one aggregate score per paper (equal to the active-submission count), not individual reviewer scores. Removed the unsupported "no reviewer gives a five" claim in favor of "no paper averages a 5.0," and flagged the averaging confound in the reviewer-vs-area-chair comparison.

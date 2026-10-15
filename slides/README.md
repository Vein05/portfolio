# Slides

Talk decks served at `spanthi.com/slides/<slug>/`. Each deck is an Astro page of full-screen slides on a
1600×900 stage that scales to the window. Space or the arrow keys move between slides and builds; F
goes full screen; the URL hash keeps the slide number.

Set up on 2026-10-14. Decks: `lapse` (LAPSE, public), `preference-survival` (draft).

## Files

| file | read when |
|---|---|
| `CLAUDE.md` | always; the short list of binding rules |
| `writing.md` | writing any text on a slide (finding titles, teaching voice, length, accuracy) |
| `presenting.md` | choosing slides and how they present (talk order, ideas from LAPSE, builds, guess first) |
| `prose-check.toml` | config for `prose-check` on slide text |
| `check.mjs` | headless check of one deck: layout, screenshots, word counts, venue names, prose |
| `template.astro` | starting point for a new deck |
| `build/<slug>/` | check output, not committed: `NN.png` per slide, `text.md` |

The code is under `src/`, because Astro builds only from there:

| file | what it does |
|---|---|
| `src/layouts/SlideDeck.astro` | the stage, scaling, keyboard, touch and hash navigation, builds, full screen, controls, progress bar, shared deck CSS; `draft` keeps a deck out of the built site |
| `src/components/slides/Slide.astro` | one slide: `label`, `kicker`, `title`, `variant="title"`, `devOnly`, `titleStep` |
| `src/components/slides/PaperFigure.astro` | a paper's own figure on a white card; `fill` takes the remaining height |
| `src/components/slides/RelatedCards.astro`, `RelatedCard.astro` | related-work cards with a Difference line; a card with `result` widens on double-click |
| `src/components/slides/Guess.astro` | guess first: the question, then the answer on the next press |
| `src/pages/slides/<slug>.astro` | one deck |
| `src/pages/slides/index.astro` | the list of decks; drafts show only under `astro dev` |
| `public/slides/<slug>/` | the deck's images (WebP) |

## Make a deck

1. Copy `slides/template.astro` to `src/pages/slides/<slug>.astro`. Keep `draft` on until the user says
   the deck can be public.
2. Add an entry to `decks` in `src/pages/slides/index.astro` (`draft: true` while it is a draft).
3. Put images in `public/slides/<slug>/`.
4. Write the slides by `writing.md` and `presenting.md`. Classes the shared CSS provides: `lede`,
   `byline`, `hint` (title slides), `two-up`, `foot`, `takeaway`, `label`, `blue`, `red`, `muted`,
   `nowrap`. Add `data-step="n"` to build an element in.

## Check

```bash
pnpm dev                                          # in one terminal
node slides/check.mjs <slug>                      # default base http://localhost:4321
node slides/check.mjs <slug> --base http://localhost:4400 --no-prose
```

It opens every slide with all builds shown and:

- fails on an element outside the slide or cut off by its box, on each widened card as well;
- fails when a slide the built site shows names a submission venue;
- warns on a title over 12 words or a body over 40 words (figures and code not counted);
- writes `build/<slug>/text.md` and runs `prose-check` on it; errors fail the check.

Then look at the screenshots and read the `##` lines of `text.md`: those are the titles in order.

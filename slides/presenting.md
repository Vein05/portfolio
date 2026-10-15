# How a deck presents

Taken on 2026-10-14 from the LAPSE deck (`src/pages/slides/lapse.astro`) and the LAPSE paper-notes page
(`research/paper-notes/papers/lapse/`, rules in `research/paper-notes/page.md`).

## The order of a research talk

The LAPSE deck's order, which a new deck follows unless it has a reason not to:

| # | slide | what it does | LAPSE example |
|---|---|---|---|
| 1 | title | the question as the lede, the lab as the byline | "does it keep the verb form that says a fact is ongoing?" |
| 2 | the problem | one concrete case, then its name | Figure 1: "I'm working at" becomes "works at"; "We call the change aspectual flattening" |
| 3 | related work | the three closest papers as cards, each with a "Difference" line | Ma and Miyao, Kwon, STALE |
| 4 to 6 | what we did | the data, one matched example, how outputs were scored | a matched pair that differs only in the verb |
| 7 | the main result | the result first and alone, usually the paper's own figure filling the slide | Figure 2 |
| 8 | it also happens in real systems | the same effect outside the lab setup | mem0, Graphiti, Letta bars |
| 9 | why it matters | what changes downstream, and a takeaway bar | the "working" note gets estimates 16 to 32 points lower |
| 10 | thanks | | |

From the paper-notes page: a limits slide ("what this does not show") goes after the main result,
before the takeaway.

## Ideas to reuse

1. **Kicker plus finding title.** A small numbered kicker names the part of the talk ("04 The
   benchmark"); the title states the finding (`writing.md`, section 1).
2. **One concrete case first.** The problem slide shows one real example before any name or number
   (paper-notes: "The question in one picture").
3. **The paper's own figures, not redraws.** Show the figure on a white card (`<PaperFigure>`), filling
   the slide when it is the main result (`fill`). Redraw only an idea the figures do not show.
4. **Related work as cards with a Difference line.** Each card: badge (venue or arXiv), title, cite, one
   sentence on what they show, then "Difference" in one sentence. A card with a `result` widens on
   double-click to show that paper's main result and source, so the detail is there when someone asks
   (`<RelatedCards>`, `<RelatedCard>`).
5. **Number cards and bars for a few numbers.** Up to four numbers as big figures with a one-line gloss
   (LAPSE's "99.1% human with human"), or as bars with the count in the label (LAPSE's pipelines slide).
6. **Takeaway bar.** One dark bar at the bottom of the "why it matters" slide with the one sentence to
   remember (`<p class="takeaway">`).
7. **Foot line for the fine print.** Sample size, what was fixed in advance, and limits go in
   `<p class="foot">` at the bottom, in muted text, not in the body.
8. **One color meaning per deck.** Blue and red each mean one thing on every slide, in text and figures.
   In LAPSE, blue is the ongoing form that survives and red is what was flattened. Define the meaning on
   the first slide that uses it.

## Builds

A slide can build in steps: each element with `data-step="n"` appears on the next key press, in order of
n. Elements with the same n appear together. Going back to a slide shows all its steps.

1. **Use a build to keep the room on one part,** such as the stages of a pipeline, or a question before
   its answer. Do not build a slide that is read at once.
2. **Steps fade in without moving the layout.** Hidden steps keep their space.
3. With "reduce motion" on, steps appear without movement.

## Guess first

From the paper-notes page (`page.md`, "Guess first"), where it is backed by the prequestion
meta-analysis (St. Hilaire, Chan and Ahn 2024). Before a main result, the slide asks the room to guess
it; the answer appears on the next press (`<Guess question="...">answer</Guess>`).

1. **Only on main results,** at most three per deck. Questions asked first help people learn what was
   asked and do almost nothing for the rest.
2. **Ask for a direction or a size, not a detail.** "How often is a preference that differs from the
   default answered correctly?" The answer is the source's number.
3. **Nothing before the answer gives it away,** including the slide's own title. Give the slide
   `titleStep={1}`: the finding title then appears with the answer.

## Icons

Icons only for an actor or object the slide shows or names, one icon per role for the whole deck. Brand
marks only for named systems (LAPSE uses the mem0, Graphiti and Letta logos on the pipelines slide).

# Slides: binding rules

Read `README.md` first, then `writing.md` and `presenting.md`, before writing or editing a deck. This file
is the short list.

1. **Titles tell the finding.** Each title is a full sentence of at most 12 words that states the slide's
   point. Read in order, the titles alone tell the talk. The topic goes in the kicker (`writing.md`,
   section 1).
2. **Teaching voice, never sales voice.** Show, name, explain. No hype, no hooks, no exclamation marks
   (`writing.md`, section 2).
3. **Short.** At most 40 body words per slide, one fact per sentence, at most two numbers per sentence
   (`writing.md`, section 3).
4. **Example first, then the name, then why.** The main finding comes first and alone (`writing.md`,
   section 4).
5. **Every number has a source** in a comment next to it. Citations from primary sources only. Made-up
   examples say so on the slide. Early results carry their study, size and labels (`writing.md`,
   section 6).
6. **Never name a submission venue on a public slide.** Use `<Slide devOnly>`. A deck about unpublished
   work is `<SlideDeck draft>` until the user says it can be public (`writing.md`, section 7).
7. **Shared code only.** A deck is a page of `<Slide>` blocks on `src/layouts/SlideDeck.astro`, using the
   components in `src/components/slides/`. Styles that only one deck uses stay in that deck's file.
8. **Present like LAPSE.** Follow the talk order and reuse the ideas in `presenting.md`: the paper's own
   figures, related-work cards with a Difference line, builds, guess first on main results only.
9. **Checks before showing a deck:** `node slides/check.mjs <slug>` passes; you have looked at every
   screenshot; the titles alone tell the talk; a fresh reader agent has read `text.md` (`writing.md`,
   section 8).

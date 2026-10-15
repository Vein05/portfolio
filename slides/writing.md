# Writing rules for slides

Adapted on 2026-10-14 from `research/paper-notes/writing.md`. The voice, the order and the accuracy rules
are the same. The length rules are tighter, because a slide is seen for about a minute while someone
talks over it.

The reader is a person in the room: a lab meeting, an advisor, a talk audience. They know the field but
have never seen this project. They read the title, glance at the body, and listen. Every rule below
serves that reader.

## 1. Titles tell the finding

The title is the slide's main point, written as a full sentence. A person who reads only the title knows
what the slide shows and does not have to search the body for it.

1. **A sentence with a verb, not a topic label.** Write "Writers drop the progressive and keep the simple
   present", not "Results". Write "Prior work tests the original sentence, never the rewritten note",
   not "Related work". The topic goes in the kicker above the title ("06 Result").
2. **At most 12 words.** `check.mjs` warns past 12.
3. **The titles alone tell the talk.** Read every title in order, with nothing else. That list must be
   the whole argument. If one title only names a topic, rewrite it.
4. **A design slide states what the design does.** "Each user states a preference once, then talks
   about other things for eight sessions." A prediction says it is a prediction: "We predict ...".
5. **The title slide asks the question or states the main finding.** The lede under it gives the other
   one.

## 2. The teaching voice

Write like a patient teaching assistant at a whiteboard. That person shows an example, names it, and says
why it works. They say which part is hard. They say what the work does not show. They never try to make
the audience excited.

The sales voice does the opposite. It tells the audience how to feel ("this changes everything"),
promises ease ("simply plug in"), and hides the limits. A sales sentence can be cut without losing any
fact. A teaching sentence cannot.

| sales voice | teaching voice |
|---|---|
| This groundbreaking method unlocks powerful new reasoning. | The method adds one step: the model checks its answer against the passage before it replies. |
| Here's the kicker: it beats every baseline! | It scores higher than the three methods it is compared with, on two of the four datasets. |
| Obviously, more data helps. | More data helped in these tests. We did not test past 1 million examples. |
| Let's dive into the magic behind it. | (delete) |

1. **No hype words, no promises of ease.** The banned list is in `prose-check.toml`.
2. **No hooks.** No rhetorical question as a title, no "imagine", no "here's the best part", no
   exclamation marks. A guess-first prompt (`presenting.md`) is not a hook: it is a real question the
   room answers before the slide shows the result.
3. **Claim strength is the source's.** If the paper says "suggests", the slide says "suggests". Every
   result says what it was tested on.
4. **Say what is hard,** in one plain sentence, when a slide is hard.

## 3. Length

1. **Body: at most 40 words per slide,** not counting the title, the kicker, figure text and widened
   cards. `check.mjs` warns past 40. What does not fit goes into what you say, or into a second slide.
2. **Sentences: one fact each.** No comma chains. `prose-check` fails a sentence over 24 words.
3. **Numbers: at most two per sentence.** Each number says what it is compared with ("50% correct, the
   same as a coin flip"). Big numbers go in a number card, one per card.
4. **Common words.** "use" not "utilize", "show" not "demonstrate", "about" not "approximately".
5. **Labels are words, not codes.** Never name a thing by an internal code ("E1", "S0a", "v2",
   "channel-v1"). Write its full name.

## 4. Order: show, name, explain

These come from the user's paper writing practices.

1. **Explain it to a 10-year-old first.** Say the slide's point as you would to a child. Then write the
   slide in the same order.
2. **Example first, name second, reason third.** Show one concrete case, then name it ("We call this X:
   <plain definition>"), then say why it happens. Never name a thing before the room has seen it.
3. **Main verb early.** No participle openers ("Using a retriever, the model ..."); write "When the model
   uses a retriever, it ...".
4. **Answer the next question on the next slide.** If a slide makes the room ask "why?", the next slide
   answers it.
5. **One story.** The main finding comes first and alone, on its own slide. Side results and caveats come
   after it.

## 5. Analogies

An analogy is allowed when it explains a mechanism the room cannot see.

1. Say where it breaks, right after it.
2. One analogy per idea.
3. No flourish in place of a plain statement: "a parameter worth varying", never "a dial worth turning".

## 6. Accuracy

1. **Every number has a source.** Next to each number in the `.astro` file, a comment names where it
   comes from: a paper table, a report section, a results file. Copy numbers as the source rounds them.
2. **Citations come from primary sources.** Titles, authors, years and claims about a cited paper are
   checked against the paper or its arXiv abstract, never written from memory (`research/CLAUDE.md`,
   "Citations").
3. **Examples are real, or marked.** An example made up for teaching says "made-up example" on the slide.
4. **Early results say what they are.** Results from work that is not yet a paper carry their study, its
   size and its labels on the slide ("development study: 36 synthetic users, labels from a model judge").
   This is the portfolio's honest-data rule.
5. **Limits get a slide.** What the work does not show is said plainly, not hidden in a footnote.

## 7. Portfolio rules that apply to slides

From the portfolio `AGENTS.md`:

1. **Never name a submission venue** for work that is not accepted. A slide about a target venue is
   `<Slide devOnly>`: it shows under `astro dev` and is left out of the built site. `check.mjs` fails a
   public slide that names one.
2. **No em dashes.** No middle-dot lists (" · ").
3. **One bold run per block,** at most.
4. **Straight edges.** No rounded corners.

## 8. Checks before a deck is shown

1. `node slides/check.mjs <slug>` with the dev server running (`README.md`). It fails on layout problems,
   on `prose-check` errors and on a public slide that names a venue. It warns on long titles and bodies.
2. Look at every screenshot in `slides/build/<slug>/` yourself.
3. **Titles only.** Read the titles in order (the `##` lines of `slides/build/<slug>/text.md`). They
   must tell the whole talk.
4. **Fresh reader.** A new agent reads only `text.md` and the screenshots, says the talk's point in one
   sentence, and says where it lost the thread. Verify its claims before acting on them.

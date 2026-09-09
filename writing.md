# Portfolio Writing Guide

How to write posts and posters that sound like the person who ran the experiment, make the work clear to several kinds of reader, and remain useful when found through search.

This file is the canonical writing guide. `AGENTS.md` holds the deeper craft/voice section; this file is the operational layer on top of it: structure, discoverability, authenticity, linking, and cadence. When the two agree, follow either. When this file adds a rule `AGENTS.md` does not have, follow this one.

---

## Voice

Precise technical essayist, not a marketer and not a lecturer. Confident but bounded. Personal where the experience earns it, never diary-like. Full craft rules (openings, sentence music, revision passes) live in `AGENTS.md`. The non-negotiables:

1. **One sharp claim.** If the post does not reduce to one sentence, it is not ready. Write that sentence at the top of the draft and cut anything that does not serve it.
2. **Felt problem first.** Open with the smallest real scene that contains the whole post. For research posts: here is the thing you thought was stable, here is the exact way it breaks. Never open with "In today's world," a definitions dump, or a list of what the article covers.
3. **First person for what you did.** "I measured," "I expected," "I was wrong." Not for decoration.
4. **Bounded claims beat oversized ones.** State scope. Label inference as inference. Never hedge a result the table shows ("may suggest" becomes "shows"); never claim beyond what you ran.
5. **No em dashes.** Use periods, commas, colons, semicolons, or parentheses. If a sentence needs an em dash, restructure it.
6. **Kill throat-clearing.** No "it is important to note," "basically," "obviously," "clearly," "in order to," "utilize," "leverage," "various," "very," "really" unless the word earns its place.
7. **No middle-dot fragments.** "A · B · C" is banned everywhere. Comma list, sentence, or label-then-colon.
8. **Bold once per block, if at all.** Bold marks the single load-bearing phrase. Adjacent bold runs cancel each other.

## The three-reader test

Every substantial block must work for three readers at once:

1. A Grade 12 computer science student can explain the failure, the main comparison, and why it matters after one read.
2. An NLP PhD student can recover the design, evidence, and limits without guessing what was held fixed.
3. A senior scientist can scan it without translating inflated language, decoding a slogan, or rereading a repeated defense.

These readers expose different failures. If the student cannot retell the result, the prose is too compressed or too abstract. If the PhD reader cannot identify the comparison and controls, it is too vague. If the senior reader sees the same claim twice, cut or combine it.

For posters, apply the test to the title band, every cell title, the first sentence of every cell, every caption, and the TL;DR. A visitor should be able to read only those lines and recover the poster's claim, intervention, evidence, and strongest limit.

### The talk-through test

Write the page so it can serve as the explanation you give another person. If you stand beside the poster or scroll through the post and explain it aloud, the next fact you need should already be on the page, in the order you need it.

At each step, anticipate the listener's next honest question:

1. What happened?
2. Why did it happen?
3. How do you know?
4. What exactly did you do or change?
5. Who or what made each consequential choice?
6. What was held fixed, withheld, or compared?
7. Where does the claim stop being true?
8. What should I remember or do differently?

The page does not need these as headings. It needs a progression that answers them before the explanation has to pause and fetch missing context from the paper, source code, or the author's memory. A detail belongs where a listener would first need it, not where the experiment log happened to record it.

Read the finished page aloud as if explaining the work to one curious person. Do not paraphrase around a weak line or add facts that are absent from the page. Every time you need to say "what this means is," "the way we did that was," or "the important detail is," the page has found a missing sentence. Add that sentence, or replace the line that forced the detour.

## Say what happened

The house voice is direct, not aphoristic. A short sentence is not automatically clear. Contrast, symmetry, and sentence fragments can make weak copy look finished while forcing the reader to reconstruct the actual claim.

Prefer a literal subject, action, and consequence:

| Avoid | Prefer |
|---|---|
| "A timeout is loud. A cached error page is silent." | "A cached error page looks like a valid tool result, so the agent uses it as fact." |
| "The ranked list never changed. The winner did." | "Rescoring the same ranked list changes which memory system wins." |
| "A useful compressor can hide the comparison you ran." | "Fixed compression shrinks a 31.8-point reader gap to 7.8 points." |
| "The curves rise, and they flatten." | "Compression helps lower-scoring readers more, which flattens the reader curve." |

The preferred versions are not templates. They show the required information: what object changed, what stayed fixed, and what consequence followed. Use the exact nouns from the study instead of substituting mood words such as "loud," "silent," "hidden," "uncanny," or "dangerous" when the mechanism can be named.

### Patterns to challenge during revision

These are warning signs, not automatic bans. Keep one only when the contrast is real, necessary, and more economical than a direct statement.

- **Manufactured contrast:** "not X but Y," "not merely X," "doesn't just X," or two clipped sentences arranged as opposites. State Y directly unless X is a documented reader misconception that the paragraph has already established.
- **Manufactured punch:** a vague sentence of three to seven words followed by another fragment. Join them and name the causal link.
- **Rule-of-three filler:** three verbs, adjectives, or nouns chosen for rhythm when one exact term would do. Lists are for distinct measured parts, not a feeling of completeness.
- **Abstract agents:** "the result," "the system," "the approach," or "this" when a more specific noun is available.
- **Hidden work:** passive constructions such as "contracts are mined," "cases were selected," or "scores were computed" when the method, actor, or acceptance rule matters. Name the program, researcher, annotator, or model that did the work and say what it did to which input.
- **Interpretive padding:** "highlights," "underscores," "reflects," "serves as," "demonstrates the importance of," and claims about a broader landscape. Replace the interpretation with the observed consequence.
- **Repeated defense:** claim, caveat, then a second sentence restating the claim in safer words. State the bounded claim once.
- **Poster advertising:** headings that tease, warn, or promise instead of reporting the result. A poster heading should survive being read without its kicker or body.

Do not edit to fool an AI detector. Detection is unreliable, and human writing can contain every pattern above. Edit because canned rhetoric hides the experiment and makes several pages sound as if they were generated from the same prompt.

### Expand method verbs

A technical term can be correct and still leave the method unexplained. On first use, unpack verbs such as "mine," "derive," "curate," "filter," "align," "validate," "admit," "freeze," and "score." The nearby text should answer the questions that affect trust:

1. Who or what performed the operation: a deterministic program, a language model, the authors, independent annotators, or a public data source?
2. What input did it read, and what information was it prohibited from reading?
3. What operation did it perform?
4. What rule admitted, rejected, or transformed an item?
5. Which choices were manual?
6. What was held out or held fixed?

Do not answer all six mechanically in every paragraph. Answer the ones a skeptical reader needs to distinguish the method from a different plausible procedure. For a poster, one concrete line can often do the work: "A deterministic program scans clean executions for rules that hold in every qualifying example; five-fold task splitting keeps each test workflow out of its checker's input." The paper can carry the complete thresholds and rule classes.

---

## The spine

Every post has a spine. The reader always knows why the next section exists.

1. **Felt problem** the reader recognizes: a failure, a confusion, a result that should not be possible.
2. **Mechanism**: why the thing happens.
3. **Evidence**: numbers, traces, code, examples, primary sources.
4. **Consequence**: why it matters in practice.
5. **Resolution**: a better frame, design, or next move.

Headings are turns in the argument, not labels from the notes. A heading should make the reader want the next paragraph. Prefer claim-style headings ("Whitespace is not the lever") over topic headings ("Results").

---

## Structure for discoverability

Search matters after the article works for a human reader. Make important sections self-contained enough to quote accurately, but do not flatten the post into a sequence of interchangeable answer blocks.

1. **Inverted pyramid per section.** Put the direct answer in the first two sentences (roughly 40 to 70 words), then supporting detail, then context. That opening block is what gets extracted.
2. **Self-contained sections.** A section should identify its subject and evidence without making the reader reconstruct missing context. Do not repeat the whole thesis in every section.
3. **Headings state the turn.** Use the language a reader would search when it fits naturally, but prefer a precise claim over a forced question. "Compression helps weaker readers more" is better than "Results" and usually better than "Does compressing evidence help every reader?"
4. **Short paragraphs.** Two to four sentences. Vary rhythm so it does not read mechanically.
5. **FAQ only when readers have recurring questions.** Do not append an FAQ for search coverage. If the body already answers the question, link to that section or omit it.
6. **Specific numbers always.** Not "accuracy went up" but "the help-to-damage ratio fell from 3:1 to 1:1 across 20 readers." Every number in prose should exist in a table or a linked artifact.

---

## Post types

Pick the shape that fits the material. Do not force one template.

- **Paper companion.** The public, plain-language version of a paper. Felt problem, the one surprising result, the mechanism, the honest limitations, then the cite block. This is the highest-value type for citation: it captures topic search and hands the reader the BibTeX. (Examples: the compression and memory-benchmark posts.)
- **Phenomenon / idea proposition.** An early framing of an effect before the full study lands. Name the phenomenon, show the smallest convincing instance, state what you will measure. Mark uncertainty loudly and keep it `status: "draft"` until the evidence is in.
- **Methods / how-to.** A concrete walkthrough of a technique, with the why alongside the how and the failure modes named.
- **Benchmark / comparison.** High search intent. Lead with a one-line verdict for scanners, review each option from real use, then a comparison table, then a verdict by use case.
- **Engineering deep-dive.** A real problem, why the usual solution is incomplete, the working abstraction, the lessons.

---

## Linking: pillar and cluster

Papers are pillars. Companion and phenomenon posts are the cluster. This is what makes strangers googling the topic land on you, and what builds the entity association that gets you surfaced by AI.

1. **Cluster around each paper.** One paper can support two or three posts at different angles (the reader-dependence angle, the deployment-risk angle, the methods angle). Each targets a different query cluster.
2. **Internal links carry weight.** Companion posts link to the paper and to each other; the paper's homepage card links back. Link related posts in body text, not only in a sidebar.
3. **Always attach the cite block.** End every paper-backed post with the BibTeX component so the reader can cite you in one copy:

    ```bibtex
    key: rag-compression
    ```

   The `key` pulls from `src/data/citations.js` (single source of truth). If the paper is not in that file yet, paste raw BibTeX in the block instead. Add new papers to `citations.js` once and cite them anywhere; the homepage Papers panel reads the same source for its "Copy BibTeX" button.
4. **External links build trust.** Link primary sources: arXiv, the code repo, the benchmark, other authors' work. Distributing authority is a trust signal, not a leak of it.
5. **Cross-link sister sites** where genuinely relevant, in body context.

---

## SEO pass

After the draft is written, before publishing:

1. **Title** includes the primary keyword, reads like the search, ideally under 60 characters for the tag.
2. **Meta description** 150 to 160 characters, includes the keyword, gives a reason to click. In this repo, set `seoTitle` and `seoDescription` in `src/data/posts.js`.
3. **H1** matches search intent; **H2s** target secondary keywords and People Also Ask questions.
4. **Alt text on every image** describes what is shown with relevant terms.
5. **Structured data.** Confirm `Article` and author `Person` schema, `BreadcrumbList`, and `ImageObject` for original figures. Person schema (`name`, `jobTitle`, `knowsAbout`, `sameAs`) is the E-E-A-T signal that matters most.
6. **Sitemap.** The build regenerates it; resubmit in Search Console after deploy to speed recrawl.
7. **No links in headings or FAQ answer text.** They break the table of contents and render as raw markdown in FAQ blocks. Body paragraphs only.

SEO never gets veto power over the sentence. Do not add a keyword, question heading, FAQ, repeated definition, or generic summary that makes the article sound less like the work itself.

---

## Authenticity and E-E-A-T

First-hand experience is the primary ranking differentiator, and it is the thing an AI content farm cannot fake. For a research portfolio that means experimental specificity.

| Trustworthy | Generic / AI-sounding |
|---|---|
| "I tested 20 readers across 12 families; the crossover is at 35 to 40% naive accuracy" | "Model size affects compression benefits" |
| "15.3% of already-correct rows were broken, 261 of 1,711" | "Compression can sometimes hurt accuracy" |
| "n=1 probes, unverified at rate, and here is the confound I have not ruled out" | Presents a preliminary finding as settled |
| Names the exact datasets, models, and metrics | Speaks in generalities about "benchmarks" |

Non-negotiables per post:

- Real author byline and a bio with specific standing ("LLM memory and evaluation researcher," not "AI enthusiast").
- Links to where the work lives: arXiv, Google Scholar, Semantic Scholar, GitHub.
- At least one admitted limitation, trade-off, or failed attempt.
- The numbers, with their n. Every rate paired with its sample size.

---

## Cadence

Quality over volume. A few strong posts beat a burst of thin ones, which also reads as a content-farm signal. Hold phenomenon posts as drafts until the evidence supports the claim, then publish and resubmit the sitemap. Papers under double-blind review stay unpublished until camera-ready; do not deanonymize a submission for traffic.

---

## The acid test

Before publishing, ask:

> Could only someone who actually ran this work write this post?

If no, it needs more specific numbers, more real detail from the experiments, an admitted limitation, and the mechanism explained rather than asserted. Every post should pass.

Then run the sentence test:

> Does this line tell the reader what happened, or does it merely sound like a line that belongs here?

If it only sounds finished, rewrite it with the study's actual noun, comparison, and consequence. Read the title, headings, captions, and TL;DR as one continuous page. Repeated contrast templates are more visible across the whole page than inside any single block.

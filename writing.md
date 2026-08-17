# Portfolio Writing Guide

How to write posts that read like they came from the person who ran the experiment, rank for the topic (not just the name), and get extracted by AI answer engines and cited alongside the paper.

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

## Structure for discoverability (GEO)

AI answer engines and Google's AI Overview extract self-contained passages. Write so a single section can be lifted out and still be correct and complete.

1. **Inverted pyramid per section.** Put the direct answer in the first two sentences (roughly 40 to 70 words), then supporting detail, then context. That opening block is what gets extracted.
2. **Self-contained sections.** Each H2/H3 fully answers its own sub-question without requiring the reader to scroll back up. Aim for extractable answer blocks around 130 to 170 words.
3. **Headings phrased as the query.** People and models search in questions. "Does compressing evidence help every reader?" outranks "Compression results" for the traffic you want.
4. **Short paragraphs.** Two to four sentences. Vary rhythm so it does not read mechanically.
5. **FAQ section, 3 to 5 questions.** Pull them from Google's "People Also Ask" for the topic. Answers around 40 to 60 words, each self-contained. FAQ rich results are being deprecated from display, but the structure still feeds AI extraction.
6. **Specific numbers always.** Not "accuracy went up" but "the help-to-damage ratio collapsed from 3:1 to 1:1 across 20 readers." Every number in prose should exist in a table or a linked artifact.

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

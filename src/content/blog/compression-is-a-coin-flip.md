---
title: "RAG Compression Can Hide Most of a Reader Upgrade"
date: "2026-04-24"
category: "Research"
status: "plated"
---

```glossary
title: Words used here
reader: the model that answers the question from the retrieved passages.
compressor: a model that shortens or rewrites the retrieved passages before the reader sees them. RECOMP and EXIT are trained compressors; a shared summary is one prompted LLM summary per question.
raw passages: the retrieved passages with no compression.
reader upgrade: how many points better one reader scores than another on the same questions.
retention: the share of the raw-passage upgrade still visible under compression. A 31.8-point gap that falls to 7.8 points has 24.5% retention.
exact match (EM): an answer counts only if it matches the gold answer after normalization.
rescued: an answer that was wrong on raw passages and right on compressed text.
damaged: an answer that was right on raw passages and wrong on compressed text.
```

A RAG pipeline often puts a compressor between retrieval and the answering model, and the compressor stays in place when the team tries a different model. So the question "is the bigger model worth it?" gets answered behind the compressor.

I ran that comparison on 500 HotpotQA questions. On the raw passages, Llama 3.1 70B scored 44.4% exact match and Claude 3.5 Haiku scored 12.6%, a gap of 31.8 points. Then I compressed each question's passages once with RECOMP, a compressor trained on HotpotQA, stored the output, and gave that identical text to both readers. Haiku rose to 36.4%. Llama 3.1 70B scored 44.2%. The gap was 7.8 points.

The compressor helped the pipeline: mean exact match across the 20 readers I tested rose from 33.0% to 40.4%. It also hid three quarters of the difference between the readers. This is the main result of [Compression Is Not Evaluation-Neutral](https://arxiv.org/abs/2606.21807), the paper Rabab Abdelfattah and I revised on arXiv in October 2026.

## One stored RECOMP output shrank a 31.8-point reader gap to 7.8

Only the evidence changed between the two conditions. The 500 questions, the prompt, the readers, and the scoring stayed fixed. In the raw condition, each reader saw the ten paragraphs HotpotQA supplies for the question, most of them distractors. In the compressed condition, RECOMP ranked those ten paragraphs with BM25, compressed the top five, and that output was stored once per question with a content hash. Every reader received the same bytes.

The stored output is the control. If a summarizer is called again for a later batch of readers, it can write different text, and then two readers are no longer compared on the same evidence. The eight compression papers I audited for related work show 2 to 4 readers in their cross-reader comparisons, and none reports enough provenance to check that each reader received identical compressed text.

```chart
type: rc-reader-replay
```

Under raw passages the 20 readers spread from 12.6% to 44.4%. Under the stored RECOMP text they bunch between 33.8% and 45.6%. Lower raw scorers gained more across the whole panel, not just at the two ends: the correlation between a reader's raw score and its gain is −0.96 after removing the sampling noise the two quantities share. Token F1 gives the same retention, 24.5%.

The retention estimate is uncertain. Resampling questions and reader families together puts it between −0.7% and 37.9%. The interval rules out a comparison that survives intact; it does not pin down whether a quarter or almost none of the gap remains.

## The lowest raw scorers were not small models

The two lowest raw scorers were Claude 3.5 Haiku and Grok 4.1 Fast, not the 7B and 8B models. Their raw answers show why. Here is the first question in the slice: "The director of the romantic comedy 'Big Stone Gap' is based in what New York city?" The gold answer is Greenwich Village, New York City.

On the ten raw paragraphs, Grok 4.1 Fast and Llama 3.1 70B both answered "Unknown". Haiku answered "Unknown. While the retrieved evidence mentions 'Big Stone Gap' in a context about a music album (Kingston Morning), there is no information about the director..." On the stored RECOMP text, all three answered "Greenwich Village, New York City".

Answer length explains part of Haiku's gain. I counted words in its answers in the released matrix: the median raw answer is 28 words, and the median compressed answer is 2. Exact match gives no credit to a 28-word answer, so some of Haiku's rescued answers are a change of format, not of what the reader found. Llama 3.1 70B's median answer is 2 words in both conditions. The paper's claim is about the comparison an evaluation reports, and an evaluation scored with exact match reports this one. The word counts are my reading of the outputs; the paper does not test why answers changed.

## Rescue and damage happen inside the same average

A mean that rises by 7.4 points looks like a uniform improvement. Counting answers one by one shows two opposite movements. Across the 10,000 reader-question pairs, RECOMP rescued 1,915, or 19.1%. Of the 3,299 pairs a reader answered correctly on raw passages, RECOMP damaged 1,179, or 35.7%.

```chart
type: rc-rescue-damage
```

The balance depends on the reader. Claude 3.5 Haiku gained 132 answers and lost 13. Llama 3.1 70B gained 75 and lost 76. For the strongest raw readers the compressor removed about as many right answers as it added, so their scores stayed flat while the lower readers rose toward them. That is how the panel average can climb while the reader gap shrinks.

## A larger average gain did not mean more of the upgrade survived

RECOMP on HotpotQA is one of 13 fixed-compression panels in the paper, across HotpotQA, MuSiQue, LongMemEval, NQ-Open, and TriviaQA, with 8 to 20 readers each. In every panel the point estimate shows the upgrade between the lowest and highest raw scorers shrinking, from 83.6% retention down to 4.5%.

```chart
type: rc-retention
```

The average gain does not predict retention. On HotpotQA, a shared generated summary raised the panel mean by 13.6 points and kept 18.1% of the reader upgrade. EXIT, another trained compressor, raised the mean by 1.7 points and kept 83.6%. An accuracy check on the compressed pipeline cannot tell these two apart, so each deployed compressor needs its own check.

I also tried to predict retention from the raw spacing between readers and the compressor's type, with the predictor fixed before testing it. It did worse than raw spacing alone.

## Smaller gaps are harder to tell apart

Shrinking an upgrade also makes it harder to detect with the same number of questions. I split the 500 questions into random halves 5,000 times and took the reader pairs that differ significantly on one half under raw passages (exact McNemar test, p < .05). Only 41.7% of those HotpotQA pairs were still significant in the same direction under compression. On MuSiQue, 27.6% were.

Orderings also reversed more often. Swapping which raw half was scored reversed 1.5% of separated HotpotQA reader pairs. Compression added 16.7 points to that reversal rate. On MuSiQue, scored by token F1, DeepSeek R1 Distill Llama 70B wins on raw passages, and GPT-4.1-mini wins among the raw top three under the compressed summary. Under exact match the MuSiQue winner does not change.

Part of the extra reversals comes from the gaps being smaller, not from readers changing order underneath. A simulation that gives every reader the same rescue and damage rates reproduces most of the HotpotQA exact-match excess and about half of the MuSiQue excess.

## A large retriever change moved the comparison less than compression

I wanted to know whether any change to the evidence would do this. On a twelve-reader LongMemEval panel, switching from BM25 to dense retrieval changed 45.9% of the retrieved candidates. It kept 92.3% of the raw upgrade and reversed none of 43 separated reader pairs. Fixed SIEVE compression on the same panel kept 53.8% and reversed two.

MuSiQue raised a different worry. Its raw input holds the first 8 of up to 20 paragraphs, while the summary could draw on all 20. Giving three readers every paragraph on the raw side still left 8% to 11% exact-match retention across three summaries.

## Where the result stops

The panels are not a random sample of models, and none of the readers is smaller than 7B. I did not vary the prompt. I have no production A/B logs, and I did not test why a given answer changed. The MuSiQue equal-access check covers three readers. Retention at the two ends of a panel is specific to that panel and sometimes imprecise, as the HotpotQA interval shows.

## How this started: the SIEVE runs

This post first reported the runs that led to the paper. In April I built SIEVE, which compiles retrieved conversation turns into structured evidence once per question, and replayed that one output across twenty readers on LongMemEval. The smallest readers abstained on 37% to 43% of answerable questions with raw context, and compression rescued about three answers for each one it broke. For the strongest reader, rescue and damage were about one to one.

That raised the question the paper answers: if one fixed compressor helps some readers much more than others, what happens to the comparison between them? On the paper's fifteen-reader LongMemEval panel, fixed SIEVE kept 43.2% of the reader upgrade.

## Check a reader swap on your own pipeline

When the compressor stays fixed and the reader changes, score both readers on the raw passages and on the same stored compressed text, and report both upgrades. The [ragscale](https://github.com/aimsresearchlab/ragscale) toolkit from the paper runs this check on scores you already have:

```bash
pip install "git+https://github.com/aimsresearchlab/ragscale"
ragscale replay-audit --input paired_scores.csv --metric exact_match --output audit/
```

The CSV needs one row per question and reader, with `example_id`, `reader`, `reader_family`, `raw_score`, `compressed_score`, `candidate_pool_id`, `compressed_artifact_hash`, `raw_policy_id`, and `metric`. The audit stops with an error if two readers have different `compressed_artifact_hash` values on the same question, which is the same rule the paper's panels follow. It reports the raw and compressed upgrade, retention, and reversals for the readers you supply.

To run the whole pipeline instead, `ragscale init --preset openrouter --output demo` followed by `ragscale run demo/ragscale.yaml` compiles one LLM summary for each of 100 bundled HotpotQA questions and replays two hosted readers on raw and compressed evidence, 500 API calls in total. The committed example run in the repository compares Qwen 2.5 7B with Llama 3.3 70B: a 9.0-point raw gap became 3.0 points, 33.3% retention, on one summary draw.

Audit the readers you are actually choosing between. A shortcut that audits only the lowest, middle, and highest raw scorers, chosen in advance, caught 1.9% to 8.5% of the reversals in the full panels.

The paper is on [arXiv](https://arxiv.org/abs/2606.21807). The code is on [GitHub](https://github.com/aimsresearchlab/ragscale), and the 176,864-row matrix of reader answers is also on [Hugging Face](https://huggingface.co/datasets/vein05/ragscale-interaction-matrix). The poster is at [spanthi.com/poster/rag-compression](/poster/rag-compression/). A related paper finds a similar problem in memory benchmarks, where changing which stored form of the evidence counts as correct changes the winning system: [Scoring Targets Change Which Memory System Wins](/blog/your-memory-benchmark-is-lying-to-you/).

## Cite this

```bibtex
key: rag-compression
```

---
title: "The Thinking Gain Depends on Which Passage Was Kept"
date: "2026-10-03"
category: "Research"
status: "cooking"
---

```glossary
title: Words used here
reader: the model that answers the question.
thinking gain: a reader's accuracy with thinking minus its accuracy when it answers directly, on the same questions and evidence, in percentage points.
direct answering: the same reader with thinking switched off.
abstain: answer that the evidence does not give the answer. Exact match scores this as wrong.
exact match: an answer counts as right only if it matches the gold answer.
comparison question: a question about two options, like "who is younger, A or B?", where each option has its own passage.
correct option's passage: the passage about the option that is the answer.
other option's passage: the passage about the option that is not the answer.
all gold passages: every passage the question needs, with nothing else added.
shortcut: direct answering naming whichever option the passage describes, right or wrong.
forced-answer instruction: two added sentences asking for a best answer and forbidding "unknown".
bridge: a passage that links the question to the answer passage without containing the answer.
```

"Who is younger, Nicolas Görtler or Michel De Salzmann?" I gave DeepSeek V4.1 Flash this question with one passage: the one that says Görtler was born on 8 March 1990. Nothing in the context mentions De Salzmann's birth date.

Answering directly, the model said "Nicolas Görtler" in all three runs. Exact match scored it right. With thinking on, it noted that there was no evidence about De Salzmann and said the answer could not be determined, also in all three runs. Exact match scored that as wrong, though it is the honest reading of the evidence.

Then I added two sentences to the prompt asking for a best answer. Thinking recalled that De Salzmann was born in 1923 and answered Görtler. The thinking mode could answer this question correctly, and the thinking gain still counted it as worse than direct answering.

```image
src: /posts/images/thinking-gain-missing-passage/answer-passage-example.png
alt: A 2Wiki comparison question with only the answer passage. DeepSeek V4.1 Flash answers Görtler directly, says the answer cannot be determined when thinking, and answers Görtler when thinking under the forced-answer instruction.
width: 520px
caption: Thinking loses exact-match credit by abstaining, not by answering wrongly. A real 2Wiki question; counts are over three runs. Five of six readers abstain here when thinking, and all six answer right when forced.
```

## A thinking gain mixes two behaviors when a passage is missing

Evaluations of reasoning models often report the thinking gain: accuracy with thinking minus accuracy when the same model answers directly. If one model gains 20 points and another gains 5, it is natural to read the first as benefiting more from reasoning.

Retrieval rarely hands a model every passage a multi-hop question needs. When one is missing, the gain picks up two behaviors that have little to do with reasoning. Thinking more often abstains, and exact match counts that as wrong. Direct answering names whichever option the kept passage describes, and exact match counts that as right only when the kept passage happens to describe the answer.

Comparison questions make this easy to test, because each option has its own passage and I can choose which one the reader sees.

## With the correct option's passage, thinking scored up to 79 points lower

I took 600 comparison questions, 300 from [2Wiki](https://aclanthology.org/2020.coling-main.580/) and 300 from [HotpotQA](https://aclanthology.org/D18-1259/), chosen by a fixed rule that never looks at model output. Three readers (DeepSeek V4.1 Flash, GPT-5.6 Luna, and MiniMax M3) answered each one in both modes, three times, under three evidence conditions: the correct option's passage alone, the other option's passage alone, or all gold passages.

With only the correct option's passage, DeepSeek V4.1 Flash's thinking gain on 2Wiki was **−79.1 points**. Its thinking mode abstained on 94% of the questions. Direct answering took the shortcut and was right on 85 to 93% of questions for DeepSeek V4.1 Flash and Luna. Luna's gain was −35.1 on 2Wiki and −32.2 on HotpotQA.

MiniMax M3 is the exception. Its two modes abstain at similar rates, and its gain with the correct option's passage was +4.6.

## Which passage was kept set the size of the gain

With the other option's passage, the shortcut points at the wrong answer. Direct answering named that described, wrong option on 55 to 79% of 2Wiki questions and 32 to 49% of HotpotQA questions. On 2Wiki the thinking gain rose by 48.2 points for DeepSeek V4.1 Flash and by 63.6 for Luna, whose gain turned positive.

With all gold passages, both modes almost never abstained and thinking was ahead for all three readers, by 3.9 to 15.1 points.

```chart
type: thinking-gain-passages
```

So on the same 300 questions, DeepSeek V4.1 Flash's thinking gain runs from −79.1 to +10.7 points, depending only on which passages are in the context. The deficit is not just direct answering getting lucky, either. Averaged over the two single-passage conditions it is still −55.0 points, because the thinking mode abstains on 94% of questions with one passage and 99% with the other.

## Two added sentences removed the deficit

The standard prompt asks the reader to answer "using only the supplied evidence." The forced-answer instruction keeps that sentence and adds two more:

> Always give your single best answer, even if the evidence seems incomplete. Do not reply that the answer is unknown or cannot be determined.

Under this instruction, abstention fell to at most 1.1% in every condition, and the gain with the correct option's passage landed between −1.8 and +19.7 points for all three readers. With all gold passages, the instruction moved the gain by less than 4 points. When nothing is missing, the two sentences barely change either mode's answers, so their large effect elsewhere comes from the missing passage.

I also tried a second wording of the instruction on three readers. The gains stayed within 4.1 points of the first wording.

## Direct answering followed the passage even on questions it knew

Once both modes answer, they can be compared answer for answer. With the other option's passage, direct answering still named the described option on 59 to 77% of 2Wiki questions and 34 to 46% of HotpotQA questions. Thinking did so on 7 to 12% for DeepSeek V4.1 Flash and Luna, and was right on 87 to 93% of these questions. The passage does not describe the answer, so these two readers compared the options using what they already knew.

I checked what direct answering knows by running the 600 questions closed book, with no passage. Direct answering was right on 49 to 87% of them. Given only the other option's passage, its accuracy dropped by 16 to 47 points. I had predicted a drop of at least 15 points in four cells before seeing the outputs, and all four held. On the questions it got right in all three closed-book runs, it named the described wrong option on 24 to 72% of answers once the passage was there.

One caveat on this comparison: the closed-book prompt drops the "use only the supplied evidence" sentence, so it changes the instruction as well as the evidence. MiniMax M3's thinking also follows the passage more often than the other two readers' thinking, naming the described option on 41% of 2Wiki questions.

## The deficit stays on comparison questions

I don't see the same pattern on questions that take two steps. On 125 two-step 2Wiki questions, the answer passage names a likely answer but not its link to the question, and the evidence-only gain stays between −4.8 and +8.3 points across six readers. On [MuSiQue](https://aclanthology.org/2022.tacl-1.31/), where every question is a chain, the two readers tested under both instructions show no deficit. On HotpotQA questions about a single property ("which is a type of herb"), one passage usually settles the answer and the deficit is small.

On the 68 comparison questions among those 193 2Wiki questions, five of six readers show the deficit, with thinking 27 to 78 points below direct answering. MiniMax M3 again does not.

## Removing a linking passage pointed the same way

The first experiment I ran on this question was different. I deleted the bridge, the passage that links the question to the answer passage, from an otherwise full context with distractors, and expected thinking to lose its advantage. It did on two of six readers.

```chart
type: bridge-deletion
```

DeepSeek V4 Flash's gain fell by 31.4 points, and its thinking abstention rose from 9.8% to 42.7%, as labeled by the judge model described below. Most of that fall is on comparison questions (71.1 points, against 9.9 on two-step questions). Under the forced-answer instruction the fall shrank to 1.4 points. Qwen3-8B kept abstaining under the instruction in this run, so the instruction explanation is untested for it here.

A synthetic world shows what happens when the reader cannot know the missing fact. [SynthWorlds](https://arxiv.org/abs/2510.24427) renames every entity, so no model can recall the facts from pretraining. There, Nemotron 3.5 Lightning's gain fell by 31.5 points when the bridge was removed, and the instruction removed only 9.5 points of that fall (95% interval 1.9 to 17.4). The reader and question type differ from the 2Wiki runs, but the result fits the closed-book check: the instruction recovers most where the reader already knows the answer.

## Where these results stop

This is exploratory evidence. Each run followed an analysis rule fixed before its outcomes, but each question arose after earlier results, and the comparisons across readers were made after seeing all of them. Ten numeric predictions were fixed for the 600-question run; one failed (DeepSeek V4.1 Flash on HotpotQA rose 5.2 points with the other option's passage, short of the predicted 10).

Abstention on 2Wiki and HotpotQA is labeled by a judge model, Mistral Small 3.2 24B. I chose it as the best of three candidates on 100 human labels drawn from other models' outputs, where it reached κ = 0.92, so that agreement is optimistic. No human has labeled this study's outputs yet.

The readers also differ in thinking budget and serving. GPT-5.6 Luna reports zero reasoning tokens on 11 to 24% of its thinking answers to the 600 questions, and DeepSeek V4 Flash is served by third-party providers. Each gain compares a reader only with itself; none of this ranks readers.

## What to report with a thinking gain

A thinking gain measured with an incomplete context can come mostly from which mode is willing to answer and which passage the retriever kept. To read one, I need three more things next to it: the answer instruction, each mode's answer rate, and on comparison questions, which option each mode names.

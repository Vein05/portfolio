---
title: "Where Does the Paste End? When Models Edit Your Afterthought Into Your Document"
date: "2026-08-17"
category: "Research"
status: "cooking"
---

You paste a cover letter into a chat and type one line after it:

> Make this tighter. I still need to add my address at the top.

The model returns a tighter cover letter. It also puts “I still need to add my address at the top” inside the letter, polished into the applicant’s voice.

You were talking to the assistant. The assistant thought you were still writing the document.

This failure has a simple cause. The chat interface knew exactly which characters came from the clipboard and which ones you typed afterward. The model received one flat string. A boundary that existed at composition time was discarded before inference, leaving the model to reconstruct it from prose.

I call the pasted content the **artifact**, the typed tail the **afterthought**, and the invisible boundary between them the **paste seam**. When the afterthought enters the returned artifact, that is **instruction absorption**.

Across 19 models, the failure is not rare, and larger models do not make it disappear. The strongest cue is not extra space. It is provenance markup.

## The afterthought asks for nothing

Most instruction-data separation tests place an instruction inside untrusted content and ask whether the model executes it. Absorption runs in the opposite direction.

The afterthought is deliberately inert:

> Oat milk lattes are overrated, honestly.

It contains no request. If that opinion appears inside a revised essay, email, or code comment, the model has not obeyed a hidden instruction. It has assigned the text to the wrong speaker and the wrong artifact.

That distinction lets the benchmark isolate boundary inference instead of task obedience. Each of 300 source artifacts produces matched conditions in which the task, artifact, and afterthought stay fixed while only the seam changes:

- **clean:** no afterthought;
- **newline:** one line break before the afterthought;
- **blank:** a blank line before it;
- **boundary:** collision-safe tags wrap the artifact;
- **mitigation:** the boundary plus one instruction explaining that outside text is conversational context;
- **register-matched:** the bare newline remains, but the afterthought is rewritten in the artifact’s own style.

The artifacts come from six licensed code and prose sources. Because every condition belongs to the same 300 composition clusters, the comparisons are paired: the seam changes; the underlying document does not.

## More space does not create a boundary

The first result is almost comically direct. A blank line does not help.

For DeepSeek V4 Flash, absorption was 31.3% after one newline and 30.3% after a blank line. Boundary markup dropped it to 4.4%. Adding the one-line mitigation reduced it to 0.3%.

```chart
type: seam-absorption
```

That is not a quirk of one model. Across the full 19-model panel, bare-newline absorption ranged from 7.7% to 68.0%. A blank line never produced a statistically significant reduction. Every whitespace contrast that survived multiple-comparison correction went the other direction: the larger gap absorbed more.

Explicit boundary markup reduced absorption in 18 of 19 models, by as much as 22×. The extra mitigation line pushed the observed rate to zero in 9 of 19. An observed zero over 300 cases still has uncertainty—it places the exact 95% upper bound at 1.3%—but the ordering is remarkably stable: **mark the seam first, instruct second**.

```chart
type: seam-model-panel
```

The exception is instructive. Llama 3.1 8B had the panel’s lowest bare-seam rate, 7.7%, but boundary markup left it at 7.3%. A low number alone does not prove that a model found the seam. It may simply omit afterthoughts regardless of whether the boundary is marked.

## The model is listening for voice

The genre results initially looked reassuring. Casual afterthoughts entered edited prose often and code almost never. With Flash, the two code sources were near zero while fluency-edit prose reached 90% across the at-risk conditions.

That could mean code has a naturally strong boundary. Or it could mean a sentence about coffee does not look like Python.

To separate those explanations, I kept the artifact and bare newline fixed and rewrote each afterthought in the artifact’s register. In code, the same proposition became a plausible code comment. In scientific prose, it became formal academic prose. It remained declarative and still requested nothing.

Absorption rose in all four models tested:

- DeepSeek V4 Flash: 31.3% to 51.3%, **+20.0 points**;
- Qwen3 32B: 32.7% to 52.7%, **+20.0 points**;
- Claude Opus 4.8: 19.0% to 56.0%, **+37.0 points**;
- GPT-5.6-sol: 32.0% to 65.3%, **+33.3 points**.

Every paired contrast was highly significant. The cleanest diagnostic came from code: casual afterthoughts were absorbed in 0% of code cases for all four models; register-matched afterthoughts raised that to 35%, 19%, 81%, and 42%.

```chart
type: seam-register
```

Code was not inherently safe. It was protected by a mismatch in voice.

This is the mechanism that makes the problem more interesting than “models ignore blank lines.” When explicit provenance is missing, models use linguistic fit as a proxy. Text that sounds like the artifact is treated as part of the artifact—even when the interface knows it was typed after the paste.

## Frontier models fail in different voices

The two frontier models did not merely differ in rate. They failed differently.

Under boundary markup, Claude Opus 4.8 often noticed the outside text and mentioned it separately. A complete candidate review found 17.7% visibly flagged cases and 1.3% silent absorption after accounting for two scorer residuals. The model frequently found the seam and said so.

GPT-5.6-sol never produced a flagged outcome in 1,500 seam-condition cases. Its boundary rate remained 11.7%, and 62 positives were visible only to the semantic detector because the afterthought had been paraphrased. One model tended to fail loudly; the other failed silently through fluent rewriting.

Both reached 0/300 detected absorption under the added mitigation instruction. That sounds like a complete fix. It is not.

## A mitigation can fix the metric and damage the task

The benchmark measures whether afterthought content enters the artifact. It does not automatically reward a useful returned artifact.

On a deterministic Python syntax check, Opus returned invalid extracted code in 16 of 50 mitigation cases, compared with 0 of 50 matched clean cases. Half of those failures echoed boundary wrappers into the code; the other half remained invalid after wrapper removal. Another model refused a mitigation case outright.

Lower absorption is real. It is not a free utility win.

This is why the interface-level fix matters more than asking users to paste special instructions around their documents. The application already owns exact clipboard offsets. It can pass provenance as structured input without making the model reproduce wrapper syntax or making the user manage tags manually.

## The pattern occurs outside the benchmark

The controlled prompts are synthetic by construction. That is what makes the seam causal, but it leaves an ecological question: do people naturally place an artifact and then continue speaking in the same message?

A deterministic screen searched 477,103 English first-turn WildChat messages for that textual shape. It found 82,050 paste-shaped messages and 16,134 deduplicated candidates. Those are retrieval counts, not prevalence.

One author then reviewed 50 screen-selected candidates without seeing earlier model-assisted labels. Twenty-three were clear artifact-then-user-continuation cases spanning code debugging, email and document editing, coursework, product design, academic writing, and creative generation.

That audit establishes occurrence and task diversity. It does **not** establish how common the pattern is, whether a clipboard paste actually happened, or how often models fail on natural messages. WildChat contains text, not clipboard telemetry, and the reviewed sample was selected for likely positives.

## Counting absorption without asking another model to grade it

Each afterthought contains an atomic proposition with distinctive witnesses. The scorer compares the treated output against the matched clean output, extracts only the returned artifact, and uses a deterministic cascade: exact witnesses, constrained lexical patterns, then a pinned entailment model for paraphrases.

Every semantic positive was read end to end. New model families received lexical spot checks, unusable completions were excluded with their matched controls, and placebo sweeps stayed effectively at zero. The audit still treats measured absorption as a lower bound: a paraphrase missed by the entailment tier remains invisible.

That measurement work matters because chatty models often acknowledge an afterthought without inserting it. “I left out your comment about coffee” is not absorption. “After an exhausting coffee-fueled night…” inside the returned essay is.

## The interface threw away the answer

The model does not need to infer every paste boundary from language. The application already observed the boundary as an input event.

The 19-model study supports a narrow practical rule:

> If provenance exists at composition time, preserve it as markup at inference time.

Whitespace is presentation. Register is an unreliable guess. Explicit provenance is the actual signal.

Until chat systems carry that signal forward, models will keep editing the user’s afterthought into the thing the user asked them to edit.

## Research context

- [WildChat](https://arxiv.org/abs/2405.01470) supplies the natural-conversation audit corpus.
- [StruQ](https://arxiv.org/abs/2402.06363) studies structured instruction-data separation in the opposite, instruction-execution direction.
- [Instruction Hierarchy](https://arxiv.org/abs/2404.13208) is related work on conflicts between trusted and untrusted instructions.

This article reports the manuscript’s current measured results. The paper, benchmark, and full reproducibility artifact will be linked here with the public release.

## Frequently asked questions

### What is instruction absorption?

Instruction absorption happens when an LLM places text typed after a pasted artifact inside the artifact it returns. The afterthought does not need to contain an instruction. The failure is a provenance mistake: the model assigns the user’s conversational text to the document.

### Does adding a blank line after pasted text prevent absorption?

Not in this study. Across 19 models, a blank line never significantly reduced absorption compared with a single newline. Explicit boundary markup reduced the rate in 18 of 19 models, showing that the presence of a provenance cue matters more than the amount of whitespace.

### Why does matching the artifact’s writing style make absorption worse?

When no explicit paste boundary reaches the model, linguistic register becomes a proxy for provenance. An afterthought written like academic prose resembles part of a paper; the same thought written as a code comment resembles part of a program. Holding the seam fixed and matching register raised absorption by 20 to 37 percentage points in all four models tested.

### What should chat applications do with paste boundaries?

Applications should preserve clipboard span information and pass it to the model as structured provenance markup. The interface already knows where a paste begins and ends. Keeping that signal is more reliable than asking the model to reconstruct the boundary from spacing or voice.

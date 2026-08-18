---
title: "Eternal-Present Memory: Why Your Assistant Thinks You Still Live Where You Were Only Visiting"
date: "2026-08-03"
category: "Research"
status: "cooking"
---

Months ago, you told an assistant:

> I’m staying in Pasadena for the conference.

Today it drafts a message that begins, “Since you live in Pasadena…”

The city is correct. The timeline is not.

“I’m staying” presents a temporary situation. “I live” presents a standing one. A human hears that difference before reaching the place name. A memory pipeline can preserve every noun in the sentence and still destroy what the sentence said about time.

I have been testing where that destruction happens. The first measured pilot points less to a model forgetting tense at retrieval than to something more mechanical: the consolidation step rewrites temporary forms into permanent facts, and the date stamp it leaves behind barely changes later behavior.

The public benchmark for this work is **LAPSE**: Linguistic Aspect Persistence and Stability Evaluation. The evidence here is an initial 2,000-call pilot on one model, not yet a cross-model result. Within that boundary, the mechanism is sharp.

## The same fact can carry a different expiry

These sentences share a location and differ in how that location is presented:

- “I **live** in Pasadena.”
- “I’m **staying** in Pasadena.”
- “I’m staying in Pasadena **until December**.”

The first invites persistence. The second marks an unfolding, temporary situation. The third supplies an explicit bound. LAPSE pairs forms like these across neutral content frames and asks what an assistant does after enough time has passed for the temporary reading to be stale.

There are two separate tests.

The **behavioral leg** gives the model the original conversation and later asks it to act: draft the pickup message, use the saved address, continue the plan. Does it verify the old fact, or commit to it?

The **consolidation leg** first asks the model to write a memory note. Later, the model acts from its own note instead of the original transcript. This reveals whether temporal information disappears before retrieval even begins.

Positive controls matter. A model that always “helpfully” proceeds could look aspect-blind even if it never read any form at all. The pilot therefore distinguishes a form effect from a global proceed-and-assume policy.

## The model knew the rule and did not use it

On stale behavioral cases, DeepSeek V4 Flash produced **0 hedges across 300 trials**. It proceeded on simple, progressive, and explicitly bounded forms alike. Even facts marked “until December” were acted on eight months later: 92 direct commitments and 8 commitments with a caveat.

The frozen validity gate calls this model **policy-flat**. Because it did not distinguish even the explicit boundary from the simple form, the pilot does not support a clean claim that aspect itself caused the behavior. A global bias toward proceeding can explain the result.

Then the same model was asked the rule directly. It answered correctly 98% of the time for progressive forms and 91% for simple forms: no, the old statement should not automatically be assumed current.

```chart
type: lapse-dissociation
```

This is a say-do dissociation, not evidence that the model lacks the linguistic knowledge. It can state the norm when quizzed and fail to apply it when quietly using memory.

That difference matters for system design. More explanation in the prompt may teach the model nothing it does not already know. The missing step is getting the rule to govern action.

## Consolidation erased the temporary form

The cleaner result appeared one stage earlier.

When the input used a progressive temporary form, 80 of 100 memory notes destroyed its temporal marking. Seventy-five were coerced into a stative fact such as “Lives at X”; five manufactured a write-time deictic such as “currently.” Only 20 preserved the form.

Simple-present inputs were preserved in 100 of 100 matched clusters.

Explicitly bounded inputs did not fare much better. Sixty-nine of 100 lost temporal information: 62 were coerced into a stative form, 5 dropped the bound, and 2 manufactured false currency.

```chart
type: lapse-consolidation
```

The paired progressive-versus-simple destruction contrast was 80/0 discordant clusters, with an exact p-value of 1.7 × 10⁻²⁴. In this pilot, consolidation selectively destroyed the form that carried temporary validity.

The dominant failure was not the dramatic sentence “User currently lives in Pasadena.” It was quieter:

> Lives at the Wexford Residences (as of December 9, 2025).

The date survived. The aspect did not.

That is worse than an obviously wrong timestamp. The note looks careful and sourced. Its grammar still presents “lives at” as a standing fact, while the parenthetical date asks a later reader to infer expiry on its own.

## A timestamp is not a validity model

Many memory systems attach dates and assume the reader will do the rest. The pilot tested that assumption by feeding the model its own date-anchored notes.

From the raw transcript, it proceeded in 100 of 100 cases. From its consolidated notes, it still proceeded or proceeded with a caveat in 95 of 100. The “as of” date moved behavior by roughly five points at best.

Recency metadata tells a model when a note was written. It does not say how long the underlying claim was meant to remain true. A six-month-old birthday is still valid. A six-month-old hotel address probably is not. Validity is semantic, not merely chronological.

This is why “we store timestamps” is not an answer to temporal memory.

## The obvious prompt fix failed

The pilot also tested a one-line consolidation instruction intended to preserve temporal validity.

It did not work on this model. Progressive-form destruction fell only from 80% to 74%, while explicit manufacture rose from 5% to 9%. The preregistered lever gate failed.

That null is useful. It prevents an easy ending in which the entire problem disappears after adding “preserve tense” to a summarization prompt. A production fix will probably need a structured validity representation or a more constrained extraction target, not a polite reminder.

The result may differ across models. A small earlier smoke suggested the instruction could help elsewhere, but that observation is not a rate and is not evidence of a general solution.

## “Currently” is only one kind of time bomb

The first probes made manufactured “currently” look like the central mechanism. The measured pilot corrected that story.

False deictics are real, but they were uncommon: 5 of 100 progressive notes. The dominant mechanism was **coercion**—rewriting “I’m staying at X” into “Lives at X.” The consolidation step did not add an obviously temporal word. It removed the grammatical evidence that the fact was temporary.

Both mechanisms create an eternal present:

- **manufacture:** insert “currently,” which asserts validity at write time and ages badly;
- **coercion:** replace a temporary form with a standing predicate;
- **bound dropping:** preserve the fact while deleting “until December.”

A memory system that audits only timestamps or words like “currently” will miss the largest class.

## What this pilot does not establish

This is one model, one decoding regime, and a constructed benchmark. The project’s cross-model success criterion has not been met. The behavioral leg is policy-flat, so it cannot isolate a causal aspect contrast. The scored run has extensive deterministic and judge checks, but the broader claim still needs replication and human-gold validation at the final study level.

The safe claims are narrower:

- one evaluated model knew the explicit rule but did not apply it behaviorally;
- its consolidation step selectively destroyed temporary and bounded forms;
- date metadata barely rescued downstream use;
- the tested one-line instruction did not fix the mechanism.

Those are already enough to change how I think about memory architecture.

## Store validity, not just text and time

A memory record usually has content and a timestamp:

```json
{
  "fact": "User lives at the Wexford Residences",
  "created_at": "2025-12-09"
}
```

The pilot suggests that this schema is missing the field that matters:

```json
{
  "fact": "User is staying at the Wexford Residences",
  "observed_at": "2025-12-09",
  "validity": {
    "kind": "temporary",
    "bound": "2025-12-31",
    "verify_after": "2025-12-31"
  }
}
```

That representation is a design direction, not an evaluated solution. But it makes the responsibility explicit. Consolidation should preserve the user’s temporal commitment or translate it into a validity field. It should not silently promote a visit into a residence and hope a later model notices the date.

The city was never the hard part. The hard part was remembering when the sentence stopped being true.

This article reports the current LAPSE pilot. The benchmark, paper, and reproducibility materials will be linked here as the study clears its cross-model gates.

## Frequently asked questions

### Why is a timestamp not enough for LLM memory?

A timestamp records when a statement was observed, not how long it should remain valid. “My birthday is May 4” and “I’m staying in Pasadena this week” age differently even if stored on the same day. A memory system needs temporal validity semantics, not only recency metadata.

### What did the initial LAPSE pilot establish?

For one evaluated model, consolidation destroyed temporal marking in 80% of progressive inputs and 69% of explicitly bounded inputs, while preserving all matched simple-present inputs. The same model knew the explicit temporal rule but behaved policy-flat on stale facts. These are single-model pilot results, not yet a cross-model generalization.

### How does consolidation turn a temporary fact into a standing fact?

The dominant pilot failure was grammatical coercion. A statement such as “I’m staying at X” became a note such as “Lives at X.” Less often, consolidation dropped an explicit bound or inserted a word such as “currently.” Each rewrite removes or changes the information that tells a later reader when the fact expires.

### What should an LLM memory record store?

At minimum, it should preserve the original temporal form or translate it into explicit validity metadata: whether the fact is temporary, any stated end bound, and when the system should verify it again. The structured schema proposed in this article is a design direction; it has not yet been evaluated as a mitigation.

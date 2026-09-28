---
title: "Every Reported Number Should Trace to One Scorer and Run"
date: "2026-08-18"
category: "Research"
status: "cooking"
---

Two weeks after a run, you open the manuscript and find a number you cannot reproduce.

It is in a table. It is doing real work: it is the reason a claim in the abstract is phrased the way it is. But you no longer know which scorer version produced it, which split it ran on, or whether the value was copied by hand from a terminal you have since closed. The number is probably right. You cannot prove it is right. And "probably right" is not a thing you can defend to a reviewer, or to yourself at 2 a.m. before a deadline.

I built the workflow in this article to prevent that bookkeeping failure.

I use a small set of rules across concurrent paper projects: every reported value has provenance, stop conditions are written before the run, paid runs require a gate, logs are append-only, and detector outputs are read before they become claims. Each section explains who performs the check, when it happens, and which failure it prevents.

## Every reported value points to a scorer version and run ID

The rule: every reported number links to a scorer version and a run provenance record. No value is ever copied, rounded or not, from one document into another by hand.

The failure it prevents is the one above. A result detached from its origin can only be taken on trust. The fix is unglamorous: results live in one ledger per project, each row carries the code version and run ID that produced it, and every table in the paper points back to a row rather than to your memory.

```chart
type: trace-chain
```

The discipline extends to documents you would never think of as instruments. When an internal audit recently killed one of my results (more on that below), the audit memo itself shipped with a reproducer script. Its headline value, a −39.744-point change in exact match on yes/no questions, regenerates from one command against the frozen run outputs. The memo that says a number was wrong has to show where its own numbers came from too.

The test for whether you have this rule is simple. Pick any number in your draft. Can you, in under a minute, name the exact code that produced it and the command that ran it? If not, you cannot show a reader where it came from, and neither can anyone else.

## Write the stop condition before spending money or interpreting results

The rule: no project, and no paid run inside a project, begins without a written kill criterion. The single sentence that says *if this happens, I stop.*

Research rewards optimism, and optimism is exactly what makes you keep a dying result alive for three extra weeks because you have already invested three weeks. A kill criterion is written before the run, when you have no stake in the outcome yet. Once weeks are invested, it is easy to talk yourself into one more attempt. Medicine institutionalized this insight as [preregistration](https://www.pnas.org/doi/10.1073/pnas.1708274114); a charter with a kill criterion is the one-person version.

The criterion has to be falsifiable and cheap to check. In my workspace, every project charter must contain one before any work starts, and mid-project decisions get their own. A real example, written into a run spec before a relaunch: if the run still fails its parse gate at the raised 8,192-token budget, stop. Report it as a finding. No third raise. That last sentence matters most: without it, "raise the budget once" quietly becomes "raise the budget until the result appears."

## I approve a full run only after five checks pass

The rule: before any broad paid run, five things must exist: a frozen schema, a complete manifest, an exact cost estimate, a passing smoke test, and my own explicit approval. In that order.

API and GPU runs are the one place in this work where a mistake costs real money and cannot be undone. So it is the one place I refuse to let momentum drive. The gate is deliberately annoying. Its whole value is that it makes you stop at the moment you most want to keep going: when the pipeline finally runs and you want to unleash it on the full set.

One overnight scaling sweep last August made the case better than I ever could. The plan was roughly 3,600 scored calls across model checkpoints from 0.6B to 32B parameters, and every stage had to pass a ten-item smoke test before its full run. The gates fired three times in one night.

First, a smoke caught answer tags leaking inside the reasoning channel. The scorer was amended before a single full-run output existed.

Then the 12B smoke failed its parse gate at 6 of 10, because 4 of the 10 rows hit the 4,352-token reasoning cap mid-thought. The budget was raised once, with the no-chase rule above written down at the same time.

Then the 31B engine failed its memory fit check: 9.76 GiB free for the KV cache (the memory that stores attention keys and values for each token being processed) against the 10.32 GiB it needed, before any paid 31B output existed.

Total cost of all three catches: about 50 smoke calls and 25 minutes. Cost of shipping any one of them into the sweep: rescoring or rerunning 3,600 calls.

```chart
type: smoke-catches
```

I skip rules I have to remember when a deadline is close, so this one is worth wiring into something that physically refuses to launch the run until the checklist is satisfied.

## Append corrections instead of rewriting the original record

The rule: handoffs, changelogs, and experiment reports are append-only. You correct a past entry by adding a dated note at the top, never by editing the original.

Tidying a research log deletes the audit trail. The messy record of what you believed on a given day, including the belief that turned out wrong, is often the thing you need most later, when you are trying to reconstruct why you made a decision that now looks strange. Once a log has been rewritten, you can no longer tell which parts reflect what you believed at the time.

In practice a correction supersedes the old entry and leaves it in place. When the audit below overturned how I read an earlier result, the original memo stayed exactly where it was. The new document opens with a dated header stating what it supersedes, and states it precisely: the earlier runs' integrity and raw numbers stand; their *interpretation* does not. Anyone reading the trail later can watch the belief change, and see why.

Every project keeps a dated handoff note written at the end of a working session and a dated changelog of what changed, what was learned, and what remains undone. They are the resumption point for the next session and the deposition record for the next reviewer. Both are absolute dates only, never "last Thursday," which means nothing to the person reading it in November.

## Read detector hits before reporting their aggregate

The rule: never report a detector's first output. Read the hits, spot-check the categories, look at the actual traces before you believe your own instrument.

A detector that returns a clean, plausible number gives you no reason to look further, especially when the number is one you want. Here is the case that nearly got into a paper.

In one experiment, turning on a model's extended-reasoning mode appeared to collapse its accuracy on the yes/no half of a QA benchmark by 39.7 points, dragging the whole-benchmark comparison down 22.7 points. The integrity checks were spotless: every response parsed, the answers sat cleanly in the answer channel, and a second metric, token-F1, cratered right alongside exact match. Two metrics agreeing felt like confirmation. A reasoning mode that damages reasoning is exactly the kind of surprising result that gets a section heading, and this one was headed for the paper.

The rule forced me to read the damage first. All 177 damaged rows, by hand. 115 of them, 65%, were correct answers phrased as sentences: the model wrote "No, the evidence does not support that claim" where the gold answer was the single token "no," and strict exact match scored the sentence 0. Token-F1 against a one-token gold craters on exactly the same rows (mean 0.077), so the agreeing second metric was not independent confirmation; it shares the failure mode, and its co-movement was the artifact's signature. Rescored with a scorer that reads the verdict out of the sentence, the 39.7-point collapse became 0.0. The drop came from the scorer penalizing sentence-form answers, and reasoning mode had no measurable effect once they were scored correctly.

```chart
type: signflip-audit
```

The 39.7 points measured the scorer's handling of sentence answers. Scorers can be wrong in systematic ways that pass every integrity check. I have since watched the same lesson generalize: [which scoring target you pick can decide which model wins a benchmark](/blog/your-memory-benchmark-is-lying-to-you/), which is the published version of the same distrust. The defense I use is to read the outputs before the number goes into a draft.

## An adversarial review pass finds objections while they can still be fixed

The rule: before a paper goes out, it faces an adversarial pass whose only job is to find the objection that sinks it.

The reviewer who will reject your paper has already thought of the weakness you are hoping nobody notices. The only question is whether you meet that objection in your own office, where you can still do something about it, or in a review thread, where you cannot. I run drafts through a calibrated panel of critics tuned to surface the strongest objection, and each project keeps a lessons file distilled from the reviews the last paper actually received. Fixing an objection found this way costs a revision; the same objection found by a reviewer can cost the submission.

## These rules fit scored empirical projects, with limits

These are notes from building a working research process across a handful of papers. They are downstream of my particular corner of the field, empirical NLP, where the unit of work is a scored run, and they will not all transfer to theory, or to a lab with a data engineer and a real MLOps stack. Someone with more experience will find pieces of this naive.

I learned it by nearly shipping a scorer artifact as a finding and by catching broken runs before paying for them.

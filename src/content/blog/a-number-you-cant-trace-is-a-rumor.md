---
title: "A Number You Can't Trace Is a Rumor. Here's the Machinery That Traces Mine."
date: "2026-08-18"
category: "Research"
status: "cooking"
---

Two weeks after a run, you open the manuscript and find a number you cannot reproduce.

It is in a table. It is doing real work: it is the reason a claim in the abstract is phrased the way it is. But you no longer know which scorer version produced it, which split it ran on, or whether the value was copied by hand from a terminal you have since closed. The number is probably right. You cannot prove it is right. And "probably right" is not a thing you can defend to a reviewer, or to yourself at 2 a.m. before a deadline.

That is the failure I have organized an entire research workflow around not repeating. Not a clever failure. A bookkeeping failure, the kind nobody writes papers about and everybody has.

I run eight concurrent paper projects as an undergrad; two of them are now published at EMNLP 2025 Findings ([the compression one](/blog/compression-is-a-coin-flip), [the benchmark one](/blog/your-memory-benchmark-is-lying-to-you)). What keeps the rest from collapsing into a heap of half-remembered results is not intelligence or tooling. It is a small set of boring rules, each one scar tissue from a specific time the absence of that rule cost me something. This is the machinery, and the mistakes that forced each piece of it.

## A number that can't trace to a version is a rumor

The rule: every reported number links to a scorer version and a run provenance record. No value is ever copied, rounded or not, from one document into another by hand.

The failure it prevents is the one above. A result detached from its origin is not evidence; it is a claim you are asking people to trust because you seem earnest. The fix is unglamorous: results live in one ledger per project, each row carries the code version and run ID that produced it, and every table in the paper points back to a row rather than to your memory.

```chart
type: trace-chain
```

The discipline extends to documents you would never think of as instruments. When an internal audit recently killed one of my results (more on that below), the audit memo itself shipped with a reproducer script. Its two headline values, a −39.744 and a −12.167, regenerate from one command against the frozen run outputs. Even the document that says "this number was wrong" has to prove where its own numbers came from.

The test for whether you have this rule is simple. Pick any number in your draft. Can you, in under a minute, name the exact code that produced it and the command that ran it? If not, it is a rumor with good posture.

## Kill criteria before spend

The rule: no project, and no paid run inside a project, begins without a written kill criterion. The single sentence that says *if this happens, I stop.*

Research rewards optimism, and optimism is exactly what makes you keep a dying result alive for three extra weeks because you have already invested three weeks. A kill criterion is a promise made by the version of you who is still calm to the version of you who will be sunk-cost and desperate. You write it before you have feelings about the outcome, because afterward you will negotiate with yourself and you will lose. Medicine institutionalized this insight as [preregistration](https://www.pnas.org/doi/10.1073/pnas.1708274114); a charter with a kill criterion is the one-person version.

The criterion has to be falsifiable and cheap to check. In my workspace, every project charter must contain one before any work starts, and mid-project decisions get their own. A real example, written into a run spec before a relaunch: if the run still fails its parse gate at the raised 8,192-token budget, stop. Report it as a finding. No third raise. That last sentence is the entire point; without it, "raise the budget once" quietly becomes "raise the budget until the result appears."

## The expensive irreversible action gets a gate

The rule: before any broad paid run, five things must exist: a frozen schema, a complete manifest, an exact cost estimate, a passing smoke test, and my own explicit approval. In that order.

API and GPU runs are the one place in this work where a mistake costs real money and cannot be undone. So it is the one place I refuse to let momentum drive. The gate is deliberately annoying. Its whole value is that it makes you stop at the moment you most want to keep going: when the pipeline finally runs and you want to unleash it on the full set.

One overnight scaling sweep last August made the case better than I ever could. The plan was roughly 3,600 scored calls across model checkpoints from 0.6B to 32B parameters, and every stage had to pass a ten-item smoke test before its full run. The gates fired three times in one night. First, a smoke caught answer tags leaking inside the reasoning channel, and the scorer was amended before a single full-run output existed. Then the 12B smoke failed its parse gate at 6 of 10, because 4 of the 10 rows hit the 4,352-token reasoning cap mid-thought; the budget was raised once, with the no-chase rule above written down at the same time. Then the 31B engine failed its memory fit check, 9.76 GiB free for KV cache against the 10.32 GiB it needed, before any paid 31B output existed. Total cost of all three catches: about 50 smoke calls and 25 minutes. Cost of shipping any one of them into the sweep: rescoring or rerunning 3,600 calls.

```chart
type: smoke-catches
```

Enforcement matters more than intention here. A rule you have to remember is a rule you will skip under deadline pressure. This one is worth wiring into something that physically refuses to launch the run until the checklist is satisfied.

## Never rewrite history

The rule: handoffs, changelogs, and experiment reports are append-only. You correct a past entry by adding a dated note at the top, never by editing the original.

The instinct to tidy up a research log is the instinct to destroy your own audit trail. The messy record of what you believed on a given day, including the belief that turned out wrong, is often the thing you need most later, when you are trying to reconstruct why you made a decision that now looks strange. A clean, rewritten history is a history you can no longer trust, because you know past-you edited it.

In practice this means supersession, not deletion. When the audit below overturned how I read an earlier result, the original memo stayed exactly where it was. The new document opens with a dated header stating what it supersedes, and states it precisely: the earlier runs' integrity and raw numbers stand; their *interpretation* does not. Anyone reading the trail later can watch the belief change, and see why.

Every project keeps a dated handoff note written at the end of a working session and a dated changelog of what changed, what was learned, and what remains undone. They are the resumption point for the next session and the deposition record for the next reviewer. Both are absolute dates only, never "last Thursday," which means nothing to the person reading it in November.

## Manual audit before belief

The rule: never report a detector's first output. Read the hits, spot-check the categories, look at the actual traces before you believe your own instrument.

A detector that returns a clean, plausible number is the most dangerous thing in the lab, because it asks for nothing and gives you a result you want to be true. Here is the one that nearly got me.

In one experiment, turning on a model's extended-reasoning mode appeared to collapse its accuracy on the yes/no half of a QA benchmark by 39.7 points, dragging the whole-benchmark comparison down 22.7 points. The integrity checks were spotless: every response parsed, the answers sat cleanly in the answer channel, and a second metric, token-F1, cratered right alongside exact match. Two metrics agreeing felt like confirmation. A reasoning mode that damages reasoning is exactly the kind of surprising result that gets a section heading, and this one was headed for the paper.

The rule forced me to read the damage first. All 177 damaged rows, by hand. 115 of them, 65%, were correct answers phrased as sentences: the model wrote "No, the evidence does not support that claim" where the gold answer was the single token "no," and strict exact match scored the sentence 0. Token-F1 against a one-token gold craters on exactly the same rows (mean 0.077), so the agreeing second metric was not independent confirmation; it shares the failure mode, and its co-movement was the artifact's signature. Rescored with a scorer that reads the verdict out of the sentence, the 39.7-point collapse became 0.0. The finding was never about reasoning. It was the scorer punishing verbosity.

```chart
type: signflip-audit
```

The number was an instrument reading, not a finding. Instruments are wrong in quiet, systematic ways, and none of them announce themselves. I have since watched the same lesson generalize: [which scoring target you pick can decide which model wins a benchmark](/blog/your-memory-benchmark-is-lying-to-you), which is the published version of the same distrust. The only defense is to physically read the outputs before the number becomes a belief, and then a sentence, and then a claim you cannot walk back.

## Meet the reviewer before the reviewer meets you

The rule: before a paper goes out, it faces an adversarial pass whose only job is to find the objection that sinks it.

The reviewer who will reject your paper has already thought of the weakness you are hoping nobody notices. The only question is whether you meet that objection in your own office, where you can still do something about it, or in a review thread, where you cannot. I run drafts through a calibrated panel of critics tuned to surface the strongest objection, not the most flattering summary, and each project keeps a lessons file distilled from the reviews the last paper actually received. It is uncomfortable by design. Discomfort now is cheap; discomfort at the commitment deadline is not.

## What this is, and what it isn't

These are notes from building a working research process across a handful of papers, not a doctrine. They are downstream of my particular corner of the field, empirical NLP, where the unit of work is a scored run, and they will not all transfer to theory, or to a lab with a data engineer and a real MLOps stack. Someone with more experience will find pieces of this naive.

But the core generalizes further than the specifics: **research reliability is mostly the discipline to write things down before you have a stake in the outcome, and to refuse to trust a result you cannot trace.** The cleverness is in the science. The trust is in the bookkeeping. Most people learn this the way I did, by nearly shipping a scorer artifact as a finding or paying for a broken run, and I would rather you learn it from a blog post.

## Frequently asked questions

### Isn't this just experiment tracking?

Partly. A tracking tool gives you the storage; it does not give you the discipline. The rules here are about the decisions the tool can't make for you: when to stop, when not to spend, when not to believe your own detector, and when to refuse to edit the record. You can have MLflow and still ship a number you can't trace.

### Why append-only? Can't I just use git?

Git gives you the ability to recover history. Append-only records give you the *intent* not to rewrite it. The point isn't that the old version is retrievable; it's that the log reads as an honest, dated sequence of what you actually believed, including the wrong beliefs, without you having quietly cleaned it up.

### Is a kill criterion just giving up early?

The opposite. It's deciding, while you're still clear-headed, what evidence would change your mind, so that when the result is ambiguous and you're emotionally invested, you follow a rule you set in advance instead of the sunk cost you feel in the moment.

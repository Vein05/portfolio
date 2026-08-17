---
title: "Agents Believe Tools That Lie. A Receipt Helps Them Recover."
date: "2026-08-17"
category: "Research"
status: "cooking"
---

The tool call did not fail. It returned valid JSON, in the expected shape, with a value that could not be true.

The agent accepted it anyway.

It used the bad value in its next decision, called another tool, and built a confident answer on top of the mistake. By the time the failure became visible, the observation that caused it was several steps behind. Nothing crashed. No exception pointed back to the source. The agent had already turned the error into a story.

This is the dangerous class of tool failure: not a timeout or a `500`, but a plausible-looking result that lies. A cached error page arrives as content. A price is negative. An order status falls outside every state the system knows. The transport succeeds, so the agent treats the payload as fact.

In one study of a production agent runtime, humans reading the final output were the first to catch 70% of its silent failures. The system had logs. What it lacked was a useful moment of doubt.

## A silent failure creates two problems

When a tool times out, the failure is already labeled. The agent can retry or choose another route. A silent failure asks it to solve two harder problems at once:

1. Notice that the observation is inconsistent.
2. Find another action that can still finish the task.

Most agent loops leave both jobs to the language model. The raw tool result enters the context, the model consumes it, and the loop continues. Even a capable model that can explain the inconsistency afterward may not stop when the result first appears.

The intervention I tested inserts one deterministic check at that boundary. I call the full system an **outcome monitor**. Its checks are **outcome contracts**: properties that a valid result should satisfy.

A simplified receipt looks like this:

```json
{
  "tool_result": {
    "item": "wireless keyboard",
    "price": -79.00
  },
  "outcome_monitor": {
    "violated": "price must be positive",
    "observed": -79.00,
    "recovery_tools": [
      "retry_catalog_lookup",
      "search_inventory"
    ]
  }
}
```

The original result is preserved. The monitor does not call a tool, delete an action, choose a repair, read the evaluator, or reveal a benchmark fault label. It says what property broke and which public alternatives remain. The agent still decides what to do.

That distinction matters. A hard guard can improve a score by preventing the wrong action itself. Here, the runtime only changes what the agent can see.

## The contracts come from behavior the tool already promised

There is no universal list of impossible tool results. A negative price is suspicious in a catalog and ordinary in a ledger. The monitor therefore learns or derives contracts for each tool.

In the main experiment, contracts were mined from clean tool traces while keeping every evaluated workflow out of the traces used to build its checker. The miner looked for conservative invariants: required fields, stable types, positive quantities, small categorical domains, echoed arguments, date ordering, and exact affine relationships between fields. A property was admitted only when it held across every qualifying training example and met a minimum support threshold.

In other environments, the same interface used contracts derived from public API schemas or a public retail database. Contract construction was deterministic, local, and required no model calls. The five cross-fitted registries contained 15,041 accepted invariants mined from 400 nominal workflows and built in under two seconds.

Recovery tools came from the public tool interface, not from solutions or hidden recovery paths. At 443 of 484 receipt events in the primary study—91.5%—the agent still had at least two advertised recovery actions. The receipt usually exposed a choice rather than collapsing the task to an oracle answer.

## Five models recovered more often

The primary evaluation used 80 difficult ToolMaze workflows with implicit tool failures. Baseline and monitored episodes were paired, randomized, and interleaved. The same workflows were run across four models from DeepSeek and Qwen, with extended reasoning disabled.

Without the monitor, the models completed 35 of 320 model-workflow pairs: 10.9%. With the receipt, they completed 90: 28.1%. That is a **17.2 percentage-point gain**, with a task-clustered 95% bootstrap interval from 11.25 to 23.44 points and a sign-flip test below .00001.

The task did not become easy. Even with receipts, 230 of 320 episodes failed. The result is recovery, not a solved benchmark.

```chart
type: outcome-contracts
```

Every primary model improved. DeepSeek V4 Flash moved from 14/80 to 27/80; V4 Pro from 13/80 to 23/80; Qwen 3.7 Plus from 3/80 to 15/80; and Qwen 3.7 Max from 5/80 to 25/80. A separately frozen MiniMax M3 replication moved from 5/80 to 20/80, extending the result to a third model family without pooling it into the primary analysis.

The models did not all react the same way after a receipt. Across 484 receipt events:

- 48.6% switched to one of the listed recovery tools;
- 33.5% called some other tool;
- 14.0% retried the same tool;
- 3.9% made no further tool call.

A receipt made the inconsistency visible. It did not prescribe a single policy.

## The explanation was not the active ingredient

This is the result I did not expect.

I began with a story about localization: tell the model exactly which property is inconsistent, and it can reason its way back. The controls tell a more specific story.

The baseline prompt already warned every model that tools could return unexpected data and instructed it to inspect fields, values, and types. Giving two DeepSeek tiers an 8,192-token reasoning budget did not remove the monitor's effect. A generic warning triggered at the same moment performed about as well as a detailed, localized witness. Moving the warning or changing its salience produced no detectable advantage either.

Then I removed the recovery-tool list.

The stripped receipt fell back to baseline. Restoring the list added **11.4 percentage points** on the same paired workflows. The diagnostic detail told the agent *what looked wrong*. The recovery affordances told it *where it could go next*.

```chart
type: recovery-affordances
```

The null contrasts are power-bounded, so this does not prove that diagnostic wording never matters. It does identify the component that carried the detectable gain in these experiments: make the viable alternatives legible at the moment of failure.

This changes the design lesson. The model did not merely need a better error message. It needed an exit.

## The effect transferred—and then disappeared

A result on one fault-heavy benchmark could be an artifact of that benchmark. I therefore carried the same nonbinding interface into a stateful retail environment, where a simulated user and database state determine whether the task is actually complete.

On 50 retail tasks, each run under two persistent fault types, DeepSeek V4 Flash improved by 14 points overall and V4 Pro by 12. But the aggregate hides the useful part.

When an order status was replaced with a value outside the valid set, the monitor helped sharply: Flash rose from 6/50 to 20/50, a 28-point gain with 14 paired wins and no losses. When a payment-conservation relationship was corrupted, Flash completed 35/50 tasks with or without the monitor. The pairs moved—nine rescues and nine harms—but the net effect was zero.

The same pattern appeared elsewhere. In held-out AppWorld, baseline and monitored agents both completed 25 of 32 tasks. The checker fired in every monitored fault episode, so detector silence was not the explanation. Twenty-three of the 32 baselines completed despite consuming the fault. There was little left for a receipt to rescue.

```chart
type: outcome-boundaries
```

Across the frozen studies, gains were largest where the injected fault usually blocked baseline completion. Where agents often completed despite the corrupted observation, rescues were offset by harms. That relationship is post hoc and descriptive, not a deployment formula, but it puts a clear boundary around the headline result.

## Nonbinding does not mean harmless

On clean ToolMaze workflows, baseline and monitored agents both completed 74 of 114 model-workflow pairs. The aggregate difference was zero. Underneath it were five paired rescues and five paired harms.

That is what a nonbinding interface buys—and what it does not. Every action remains available, but a false alarm can still redirect attention, add context, and make an agent overreact. Preserving choice is not a safety proof.

A noisier schema-only detector makes the tradeoff visible. On a fault-enriched sample it recovered much of the completion gain: +10 points versus +15 for the learned monitor, with no significant head-to-head difference. But it emitted 166 receipts to the learned monitor's 111. Only 12% of its receipts exposed multiple recovery actions, compared with 91.9% for learned contracts. The learned system's clearest advantage was selectivity and better recovery lists, not a proven larger completion effect.

Deployment therefore depends on the traffic mixture. A monitor that helps on faulted calls can still lose value if faults are rare and false receipts are common. Any real deployment needs to measure both.

## A monitor can only catch failures it knows how to express

The original experiments align the injected failures with properties the contracts can represent. That is useful for asking whether a detected signal helps recovery, but it does not show that the detector can recognize arbitrary failures.

To test that boundary, I used eight fault types transcribed from a published taxonomy of production incidents. The person defining the faults saw the taxonomy and data shapes, but not the monitor's contract vocabulary.

Detection fell to roughly 46%.

The split explains why. The monitor caught 25 of 30 violations expressible over structured values—83%—but only 6 of 27 corruptions hidden inside plausible-looking strings, or 22%. A contract can reject a negative price or an impossible enum. It is much harder to recognize a polished paragraph whose content is wrong.

```chart
type: detector-vocabulary
```

This is the open problem. Outcome monitoring works when a tool's promises can be stated as checkable properties. Wrong results that remain well-formed pass through. No receipt can help if nothing fires.

## Tool results are claims, not ground truth

The usual agent loop treats a successful tool response as an observation of the world. It is safer to treat it as a claim about the world—one that can sometimes be checked before the agent builds on it.

The experiments support a bounded conclusion. Outcome monitors improved recovery across five models from three families and transferred to a second positive environment. They helped most when silent failure actually blocked the task. They did not help everywhere, they sometimes hurt individual clean runs, and their reach ended at the edge of their contract vocabulary.

The deeper result is about interface design. Agents often already have another route. The runtime has to make two things legible at the right moment: **this result is inconsistent, and these doors are still open**.

That is what the receipt is for.

## Research context

- [ToolMaze: When Tools Fail](https://arxiv.org/abs/2606.05806) provides the implicit-failure workflows used in the primary evaluation.
- [τ-bench](https://arxiv.org/abs/2406.12045) provides the stateful retail environment.
- [AppWorld](https://aclanthology.org/2024.acl-long.850/) provides state-based tests that recognize alternative valid solutions.
- [When Errors Become Narratives](https://arxiv.org/abs/2606.14589) provides the production silent-failure taxonomy used for the incident-derived boundary study.
- [Reinforced Agent](https://aclanthology.org/2026.gem-main.13/) is the inference-time reviewer method used for a separate retrospective comparison.

This article reports the manuscript's frozen results. The paper and reproducibility artifact will be linked here with the public release.

## Frequently asked questions

### What is a silent tool failure in an AI agent?

A silent tool failure returns a plausible-looking result instead of an explicit error. The call may succeed at the transport and schema levels while containing an impossible, stale, or corrupted value. Because nothing crashes, the agent can treat the result as fact and propagate it through later decisions.

### Is an outcome monitor the same as a guardrail?

No. The monitor studied here preserves the original tool result and leaves every action available. It appends a nonbinding receipt that identifies the violated property and lists public recovery tools. The language agent still decides whether to retry, switch tools, ignore the warning, or take another action.

### Do outcome monitors always improve agent performance?

No. Gains were largest when the injected fault usually blocked baseline completion. Held-out AppWorld and a retail conservation fault showed no net gain, and clean ToolMaze traffic contained paired harms as well as rescues. A deployment must measure fault prevalence, false receipts, and clean-traffic behavior.

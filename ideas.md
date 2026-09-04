# Working Ideas

Scratch backlog for post ideas and content decisions. Not polished. Absolute dates only.

## Post backlog

### Lead: research workflow as methodology (2026-08-18)

**One sharp claim:** research reliability is mostly bookkeeping you refuse to do until it burns you. A number you cannot trace is a rumor.

**Angle:** failure-forward. Each of the 8 cross-cutting rules in `research/AGENTS.md` becomes a lesson told through the failure that motivated it, not a tip list.

**Spine (per writing.md):**
1. Felt problem: two weeks after a run, you open the draft and find a number you cannot reproduce.
2. Mechanism: results detached from provenance are claims, not evidence.
3. Evidence: the rules, plus the real incidents behind each.
4. Consequence: what breaks at the deadline when the trail is gone.
5. Resolution: write it down before you have a stake in the outcome.

**Source material (already written, just needs framing):** the 8 rules are the outline. Strongest sections:
- Numbers trace to versions. "A rumor with good posture."
- Kill criteria before spend. Pre-commit while calm to what would make you stop.
- Cost gate. Five things before any paid run: frozen schema, manifest, estimate, smoke, approval.
- Never rewrite history. Append-only handoffs and changelogs.
- Manual audit before belief. A clean detector output is the most dangerous thing in the lab.
- Meet the reviewer before the reviewer meets you. Adversarial pre-review panel.

**Draft status (2026-08-18, later):** both TODOs below resolved. War stories filled from real records (the 2026-08-10 scoring-artifact audit; the 2026-08-05 smoke-gate catches, with project identities kept vague since neither paper is published), em dashes stripped, three charts added (trace-chain, smoke-catches, signflip-audit), internal/external links and seoDescription fixed.

**Draft status:** full draft exists at `src/content/blog/a-number-you-cant-trace-is-a-rumor.md` (status: cooking). Two open TODOs in it:
- Fill the two `<!-- optional -->` war-story placeholders (the number I lost, the detector I wrongly trusted). Without these it reads generic.
- Strip em dashes. Current draft violates writing.md rule 5.

**Spin-offs** (each viable as its own short post if the lead runs long): kill criteria; the cost gate; append-only logs; manual-audit-before-belief; adversarial pre-review.

### Risk to watch
"Undergrad tells you how to do research" can read as overreach. Mitigate with specificity and bounded claims, not authority. Two published EMNLP Findings papers is the standing that makes it defensible. If the title reads as guru, cut it.

## Distribution notes

- This topic has no SEO head term worth chasing. Generic terms ("experiment tracking", "reproducible ML") are owned by W&B / DVC / DAGsHub / content mills with domain authority a new blog cannot outrank. Confirmed 2026-08-18.
- Optimizing for those terms would force the generic version, which still would not rank and would ruin what makes the post good.
- Right channel: targeted social and referral, not search. Advisor, PhD apps, one relevant community, a reply under a related thread. Twenty right readers beat a front-page spike of strangers.
- Reach was never the real payoff. The payoff is signaling and the internal value of having written it down.

## Decisions reached this session (do not relitigate)

- **CS-research skills collection, for personal use: rejected.** The procedures already live in each repo's `AGENTS.md` + `RESEARCH_REPO_TEMPLATE.md` + `tools/` + `Makefile` + `panel.py`. Extracting them into `SKILL.md` files duplicates always-loaded context for a solo user and buys no triggering the loaded AGENTS.md does not already give.
- **The one exception:** enforcing the cost gate is worth a **hook** (enforcement), not a skill (prompting) and only if a paid run has ever actually slipped the gate.
- **Publishing skills for others: rejected.** Tightly coupled to my setup, low adoption, real support burden. Any value would be signaling, not adoption. If ever pursued, package one deterministic tool people need (e.g. the review panel as a CLI) and ship the skill as its wrapper. Tool creates the pull.
- **The durable asset is judgment (what works and what does not), best externalized as writing, not code.** Writing does not rot the way tool-coupled skills do.

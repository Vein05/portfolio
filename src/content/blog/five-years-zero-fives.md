---
title: "Five Years, Zero Fives: Half a Decade of ACL Rolling Review Scores"
date: "2026-08-20"
category: "Research"
status: "cooking"
---

No ACL Rolling Review paper has ever scored a 5.0. Across five years and 69,781 scored submissions, the top of the scale is empty. That does not mean reviewers hate everything. A 5.0 here is an average, and reaching it would take a paper whose whole review panel converged on a perfect score, which in five years never happened.

It is still worth sitting with, because on a different scale it does happen. ICLR publishes every reviewer's individual number instead of averaging them, and in 2025 the relighting model [IC-Light](https://openreview.net/forum?id=u1cQYxRI1H), by ControlNet's creator, drew a straight 10, 10, 10, 10 from all four reviewers. ARR's averaging into a single 1-to-5 number makes the same outcome almost arithmetically invisible.

I found the empty ceiling while checking whether my own middling scores were harsh or normal. Then the counts stopped me, and the real story turned out to be about what an ARR score even is.

The data is public. ACL Rolling Review runs a [stats dashboard](https://stats.aclrollingreview.org/) backed by the open [`acl-org/arr-health`](https://github.com/acl-org/arr-health) repository, which publishes a per-cycle score histogram at `iterations/<year>/<month>/review_scores.csv`. Every number here is reproducible with a loop over those files.

## These are paper scores, not reviewer scores

The number in the ARR histogram is one aggregate score per paper, not one per reviewer. This is the thing I nearly got wrong, and it changes what every chart below means. The histogram's total for each cycle equals the count of active submissions, not the count of reviews, and the real number of individual reviews is three to six times larger.

| Cycle | histogram total | active submissions (papers) | actual individual reviews |
|---|---|---|---|
| 2026 May | 13,668 | 13,668 | 42,250 |
| 2025 Feb | 7,321 | 7,321 | 23,126 |
| 2024 Jun | 4,774 | 4,774 | 15,234 |

The match to the paper count is exact, every cycle. So each row is one number per submission, the aggregate of that paper's three-or-so reviews (which is why the values still land on clean half-point steps). The 69,781 figure is submissions summed across 35 cycles, not reviews, and a resubmitted paper counts once per cycle. The individual reviewer scores that go into each average are not published anywhere.

That distinction matters because it kills the tempting headline. "No reviewer gives a five" is unsupported: individual 5.0s almost certainly exist and get averaged away. What the data actually shows is that **no paper ever earns a 5.0 average**, which is a claim about consensus, not about reviewer generosity.

## No paper earns a perfect score

Across five years, the top of the aggregate scale is unused. Of 69,781 scored submissions, exactly zero reached a 5.0, and only 28 (0.04%) reached a 4.5. Anything at or above 4.0 is 1.4% of all papers. The nominal 1-to-5 scale behaves as a 2-to-3 scale: 83% of every scored submission lands at 2.0, 2.5, or 3.0, and the single most common score is 2.5.

```chart
type: arr-score-ceiling
```

Part of this is real and part is arithmetic. Averaging three scores mechanically pulls a paper toward the middle: to average a 5.0, every reviewer has to give roughly a 5.0, so the extremes wash out before they reach the histogram. The empty ceiling is therefore weak evidence about how any individual reviewer behaves and strong evidence about how rarely three reviewers agree a paper is flawless. Read it as a statement about consensus. Nothing in five years of ACL submissions cleared the bar of unanimous enthusiasm.

The pattern is not an artifact of tiny early cycles. It holds where it carries weight: the November 2021 cohort (2,585 papers), January 2026 (9,177), and May 2026 (13,668) all have zero 5.0s.

## A paper's meta score swings wider than its averaged reviews

Each paper carries two numbers: the aggregate of its reviews, and a single meta score from the area chair. The meta score reaches the top of the scale far more often. A paper's averaged reviews land at 4.0 or above 0.8% of the time; its meta score does so 7.5% of the time.

```chart
type: arr-reviewer-vs-ac
```

Before reading this as "area chairs are the generous ones," note the confound I could not remove. The review number is an average of three scores; the meta number is one person's single score. A single score has more variance than an average of three by construction, so the meta distribution has fatter tails on both ends: it reaches 4.0 more often, and it also drops to 2.0 or below more often (26% versus 23%). Some unknown share of the gap is that arithmetic, not area-chair courage.

What survives the confound is the middle. Averaged reviews pile onto the 2.5 fence: 36% of papers sit exactly there. Meta scores refuse it, dropping the 2.5 share to 22% and pushing that mass outward. The area chair is the one point in the pipeline that resolves a hedged 2.5 into a verdict. I restricted this comparison to the half-point-scale era, February 2025 through May 2026 (43,458 papers), because ARR used an integer-only meta scale before then and mixing the two manufactures a difference that is really a scale change.

## The scale held while the venue exploded

The one finding here that needs no caveat is stability. A single cycle grew from 23 scored papers in mid-2021 to 13,668 in May 2026, more than a hundredfold, and the mean score did not follow. It stayed inside a narrow 2.24-to-2.80 band the entire time. The two lowest points, October 2023 and July 2025, are small off-cadence cycles, not a trend.

```chart
type: arr-mean-vs-volume
```

This is the observation [David Jurgens flagged](https://medium.com/@jurgens_24580/is-the-acl-rolling-review-actually-broken-e86fc92d49d2) from the same public data. I read the flatness less as reassurance than as a property of a compressed instrument. When paper-level scores are averages clustered on a two-point band around "revisions needed," the mean has almost nowhere to move regardless of what gets submitted. A flat average under a 100x load increase is what a compressed scale looks like, not proof that quality held.

## What this data cannot tell you

These are aggregated per-paper histograms, and the aggregation is the whole caveat. There are no individual reviewer scores, no paper identifiers, no accept or reject labels, no review text. You cannot recover how any single reviewer scores, measure disagreement inside a paper's review set, or join a score to an outcome.

It also cannot answer whether an automated reviewer would reproduce this distribution. There are no matched papers to score, and ACL reviews are public on OpenReview, so a model may have seen a paper's reception during training. That is contamination, not calibration, and it is the reason I keep [my own reviewer-model work](https://spanthi.com/blog/where-does-the-paste-end) on held-out material rather than published venues. The honest scope of this post is one sentence: this is the distribution of paper-level aggregate scores across five years, and no paper ever averaged a perfect one.

## FAQ

**Are ACL Rolling Review scores per reviewer or per paper?** Per paper. The public ARR histogram reports one aggregate score per submission (the average of its roughly three reviews), not individual reviewer scores. Each cycle's total equals the number of active submissions, and the underlying individual reviews are three to six times more numerous and are not published.

**Did any ACL paper ever get a perfect score?** No. Across 69,781 scored submissions from May 2021 to May 2026, zero reached a 5.0 aggregate review score and only 0.04% reached 4.5. Because the score is an average of three reviews, a perfect score requires near-unanimous top marks, which never happened.

**What is the most common ACL review score?** 2.5, the aggregate for 33.7% of submissions. About 83% of papers fall between 2.0 and 3.0, so the 1-to-5 scale functions as a 2-to-3 scale at the paper level.

**Do area chairs score higher than reviewers?** A paper's meta score reaches 4.0-or-above about ten times as often as its averaged reviews, and it commits to a verdict where reviews hedge (the 2.5 share falls from 36% to 22%). But part of the wider spread is arithmetic: a single meta score has more variance than an average of three reviews.

**Has the average ACL score changed as submissions grew?** No. Volume rose more than 100x between 2021 and 2026, from 23 scored papers per cycle to 13,668, while the mean stayed inside a 2.24-to-2.80 band.

## Sources

- [ACL Rolling Review stats dashboard](https://stats.aclrollingreview.org/) and the [`acl-org/arr-health`](https://github.com/acl-org/arr-health) data repository, including the per-cycle `dashboard_stats.json` that reports active submissions and review counts (primary source for every number here).
- David Jurgens, ["Is the ACL Rolling Review actually broken?"](https://medium.com/@jurgens_24580/is-the-acl-rolling-review-actually-broken-e86fc92d49d2), on the flat-mean-under-rising-volume observation.
- Tomkins and colleagues' OpenReview analysis line, e.g. ["An Open Review of OpenReview"](https://arxiv.org/abs/2010.05137), for the reviewer-versus-area-chair question on per-review ICLR data.
- [IC-Light at ICLR 2025](https://openreview.net/forum?id=u1cQYxRI1H), the straight 10/10/10/10 paper, as the contrast to ARR's averaged scale.

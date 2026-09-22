---
title: "How to Create a Simple Synthetic Dataset?"
date: "2026-09-21"
category: "Research"
status: "cooking"
---

I gave three models (DeepSeek V4 Flash, GPT-5.6 Luna, and GLM-5.2) the same short introduction, which included "I'm staying with my sister in Pasadena," and asked each one to write memory notes. All three wrote the same line: "Currently staying with sister in Pasadena." Then I handed each model its own notes, dated eight months earlier, and asked it to book dinner near home. None of them asked whether I was still at my sister's.

That was one call per model, with one city and one phrasing, and I was judging the answers by eye. Plenty of things besides the verb could have produced that note, and I had to rule them out before saying anything about verb forms.

LAPSE is the dataset I built to do that. This post covers how it went from 15 prompts I typed by hand to a generator that writes 6,008 calls per model. The results are in [the pilot post](/blog/aspect-persistence-eternal-present-memory/); this one is only about the data.

```chart
type: synth-overview
```

## It started with 15 prompts I wrote by hand

The question came from a list of cheap tests I keep around. In English the verb form alone can suggest that a state is temporary: "I'm living in Berlin" sounds like it might end, and "I'm from Berlin" doesn't. I wanted to know whether an assistant with memory pays attention to that when it decides if something you told it months ago is still true.

All the early prompts share one layout. The system message gives today's date (2026-08-11) and a dated excerpt from an earlier chat, and then the user asks for something that only makes sense if the old fact still holds. Round 1 had four cases:

- a temporary stay with an end date: "staying at my sister's place in Pasadena this week"
- "I live in Pasadena", as the control
- "I'm trying to quit smoking, day 4", and later "what do you remember about my smoking situation?", to see if the model would assume I had quit
- a plain question about the rule, with no history at all

Here is the first one as sent. The excerpt sits in the system message, and the last line is the new user turn:

```text
[Session dated 2025-11-30]
User: heads up — I'm staying at my sister's place in Pasadena this week while my
apartment gets fumigated. can you find me a good coffee shop nearby?
Assistant: Sure! Copa Vida and Jones Coffee Roasters are both great options in Pasadena.

User: hey, can you book me a table for two somewhere nice near home tonight?
```

And the rule question:

```text
User: General question, answer in one or two sentences: if someone told you 'I'm
staying at my sister's place this week' eight months ago, would it be safe to
assume they are still living at their sister's place today?
```

Every model hedged on the booking, none assumed I'd quit smoking, and all three said no to the rule question. None of that says anything about verb form. "This week" and the fumigation already tell you the stay is short. The rule question checks what a model knows, which is separate from what it does when it's busy booking a table. That split between knowing and doing later became its own arm in LAPSE.

## Three probe rounds found three confounds

All three rounds ran on the evening of 2026-08-11, at temperature 0: 12 calls, then 9, then 45. Each round changed one thing, and each cost next to nothing, so being wrong was fine.

Round 2 dropped "this week" and the fumigation but kept the sister, with three key lines: "I'm staying at my sister's place in Pasadena", "I'm living at...", and "I live at...". DeepSeek V4 Flash hedged most on "staying", less on "living", and least on "live", which is the order you'd expect from a model reading the verb. Claude Opus 5 hedged on all three, and when it recalled what I'd said, it turned "I live" into "you were staying".

Round 3 took the sister out ("I'm staying in Pasadena", "I'm living in Pasadena", "I live in Pasadena"), added a matching set of sentences about work, and ran each one at a two-week and an eight-month gap. Opus sat this round out for cost, and GLM-5.2 took its place. DeepSeek's gradient went away. At eight months it went ahead on every home-frame form, so it had been reacting to "sister's place", which sounds temporary whatever verb comes before it. GLM-5.2 went ahead on all 12 combinations of form, frame, and gap, and GPT-5.6 Luna hedged only on "I'm staying" in the home frame at eight months.

Round 3 also had two one-off prompts. One was the intro chat and note-writing request that produced the "Currently staying" line at the top. The other asked for a conference badge bio after "I'm applying to grad schools", and DeepSeek wrote "PhD candidate in computational biology", a field I had never mentioned.

That's 4 + 3 + 8 = 15 hand-written prompts, each sent to three models. Round 3 comes to 45 calls because each of its six key lines ran at both gaps (36 calls), the note-writing prompt had a second step where each model booked dinner from its own notes (6 calls), and the badge bio added 3.

```chart
type: synth-ladder
```

The biggest gap these rounds exposed was the missing positive control. If a model goes ahead on everything, you can't tell whether it ignores verb form or just always goes ahead. The bounded form in LAPSE ("until December") is that control. Invented names replace the sister, and a banned-word list keeps phrases like "this week" out of the text around the key line.

## Each item has five slots

After the probes I ran a pilot on DeepSeek V4 Flash (internally v1: 2,000 calls, 5 frames). LAPSE is v2 of that design, and it rebuilds the v1 items exactly as a subset.

A LAPSE item is a short dated chat followed by a query. The builder fills five slots from fixed lists: the session date, the key line, an invented name (I call it the witness), some filler conversation, and the query.

Within a matched pair, only the key line changes. This is the lodging frame from the builder:

```python
"lodging": {
    "forms": {
        "prog":   "I'm staying at {w} on Fifth Street.",
        "simple": "I live at {w} on Fifth Street.",
        "bound":  "I'm staying at {w} on Fifth Street until December.",
    },
    "queries": [
        "can you draft a short note to the car service for my airport pickup ...",
        # three more paraphrases
    ],
}
```

```chart
type: synth-anatomy
```

There are eight frames: lodging, workplace, vehicle, class, household, a loaned instrument, an affiliate role, and a project. A cluster is one witness name with one query paraphrase. Clusters are split 80/20 into dev and test sets. An arm is the kind of request that follows the chat: book something, write memory notes, pick between two actions, or answer the rule question directly. A cell is one combination of frame, form, gap, and arm. After each build, an audit compares every pair byte for byte. Apart from the key line and the date the two members have to match exactly, and if they don't, a test fails and the build gets thrown out.

## Most of the work was wording

The generator itself is short. Most of my time went into writing sentences that don't leak the answer.

- "Visiting lecturer" became "affiliate lecturer", since "visiting" already says the job is temporary.
- I cut a medication frame. Whether a model double-checks a dose comes down to its safety policy, and I couldn't separate that from grammar.
- In the household frame, switching "my cousin is staying with me" to "I'm staying with my cousin" also flips who the guest is. That subject axis is analyzed on its own and kept out of the pooled numbers.
- Text around the key line has to pass a banned-phrase list:

```python
BAN_V2 = re.compile(
    r"\b(updat(?:e[sd]?|ing)|now|currently|recent(?:ly)?|new(?:ly)?|just|"
    r"today|tonight|soon|still|lately|at present|presently|right now|as of|"
    r"no longer|used to|anymore|by now|formerly|these days|nowadays|..."
```

The original v1 carrier says "quick life update", and "update" is on the list. I kept it anyway so v1 could be rebuilt exactly, and wrote five new carriers that pass.

## Invented names still need checking

A real place name brings along whatever the model already knows about it. If it has read about a hotel, it may already assume people only stay there a few nights. So every witness in the new frames is made up, and made-up names still have to be checked.

The first check counted exact matches in RedPajama and Dolma using infini-gram, with a limit of 5. "Thornbeck College" came back with 88 and 166 hits, so I swapped it for "Vearnholt College" (0 and 0). "Osperling", one of the candidates, had 6 and didn't make it. The second check was a web search for each name in context, which turned up three with real owners: Corvain is a person, Ardenfall is a Steam game, and Vexhall is an art series. All three were replaced.

```chart
type: synth-witness-funnel
```

The older frames kept their frozen names, and a few of those are real, including the car models in the vehicle frame. After the runs I scanned for any case's name showing up in a model's answer to a different case. Across 3,730,776 pairs and seven model columns there were 7 hits, all car brands. gpt-oss-20b made up a "2024 Toyota Camry" as a placeholder in six pickup notes, and GLM-5.2 wrote "car seat", which matched the brand Seat. Seven in 3.7 million is small, and every one involved a real brand name, which is the problem the invented names avoid.

## Dates come from the day you run it

No date in LAPSE is typed in by hand. The builder won't run without `--eval-date`, and every session date is an offset from it:

```python
GAP_OFFSETS = {"fresh": 2, "near": 42, "boundary": 60, "stale": 245,
               "stale_long": 425}  # expired_soon computed from the bound
```

For bounds like "until September", the month is the session month plus three, skipping December and January. Some eval dates make a rule impossible to meet, for example when an "expired soon" item can't land 7 to 40 days after its bound. On those dates the builder stops with an error.

```chart
type: synth-timeline
```

The stale offset is 245 days, which looks odd next to a round 240. With `--eval-date 2026-08-11`, 245 days back is 2025-12-09, the date in the frozen v1 items, and a regression test rebuilds that subset and compares it byte for byte with the v1 file. The same date is why the cells that reproduce v1 still say "until December": said on December 9, that's about three weeks.

## Each confound has a control in the grid

Each confound from the probe rounds maps to a part of the dataset, and the grid is built from that map.

```chart
type: synth-confounds
```

The bounded form is the positive control. A model that goes ahead on "until December" eight months later isn't tracking time at all, In the analysis, a model whose hedge rate on the bounded form is less than 20 percentage points above its rate on "I live" at the stale gap is labeled policy-flat, and no verb-form effect is reported for it. A separate arm asks the rule directly, which lets me measure "doesn't know the rule" and "doesn't apply it" separately. The experiential perfect, "I've driven a silver Peugeot", is a negative control, and turning it into "Drives a silver Peugeot" counts as an error.

Crossing every axis with every other would have cost about 645,000 calls per model, so axes are crossed only where a specific test needs them.

```chart
type: synth-grid
```

## Reading the smoke test found two scorer bugs

Before the full run I did a smoke test on DeepSeek V4 Flash: 289 calls, the lowest dev cluster of each new cell type, for $0.04. I read every answer. The scorer is a program that runs a fixed sequence of pattern rules over each answer and labels it, for example as a hedge or as going ahead, with a language model as a second judge. It had already passed its regression tests, and it still had two bugs.

The first came from the pickup notes themselves. A line like "Please send a car to: Marbury Residences" is the note talking to the car service, but the scorer saw "please send" and "confirm a pickup", decided the assistant was asking the user to check, and scored those answers as hedges. The second bug missed a rewrite. "Teaches as an affiliate lecturer" was scored as preserved because "teach" wasn't in the scorer's list of stative verbs, which made the effect look smaller than it was.

The smoke test also showed that one arm wasn't measuring what I meant it to. Given a forced choice between "send" and "check first", models often picked "check first" on fresh items too, because the pickup note had no phone number. It was 13 of 24 on fresh items and 15 of 24 on stale ones. I kept that arm as a secondary measure.

```chart
type: synth-gates
```

Both fixes went in as regression tests. After that the spec and the generator were frozen, and the items haven't changed since the first scored call.

## If I did it again

I'd keep probing by hand, one call per cell, until the confounds stopped surprising me, and write down which part of the dataset handles each one. Dates would come from the run date, with the builder refusing dates that break a rule. Names would be invented and then checked against a corpus and the web. And I'd read the smoke test by hand before believing any scorer.

The obvious cost is realism. The templates are hand-written, in English only, they cover eight situations, and each one is a single short exchange. The probes that shaped them used four models and one city. I ran separate checks on real conversation text for that reason, and those go with the results.

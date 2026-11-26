---
title: "Which Human Writing Does GPTZero Call AI?"
date: "2026-11-24"
category: "Research"
status: "plated"
---

```image
src: /posts/images/gptzero-human-writing/banner.png
alt: Banner: a stack of old human pages, a magnifying glass holding a sign that says "AI?", and two Lehman Brothers pages
```

Recently, I spent time testing the new GPTZero 5.0. My results on it as a detector are mostly positive, with maybe one interesting failure mode (two unchanged ~300-word stretches of Lehman Brothers earnings releases that score 100% AI). In total, I ran 500 scans of human texts (253,098 words, written between 1902 and 2020) from domains like earnings releases, government and science writing, South Asian newspapers and court judgments, corporate web pages, and student essays. Please scroll to the end if you want to re-implement the details yourself.

This blog is written for a wider audience, so please feel free to skip to the section headings below:

- [Why I was skeptical](#why-i-was-skeptical)
- [The bounty](#the-bounty)
- [Almost everything reads human](#almost-everything-reads-human)
- [The one place it breaks](#the-one-place-it-breaks)
- [Why it breaks](#why-it-breaks)
- [Why 750 words was out of reach for this method](#why-750-words-was-out-of-reach-for-this-method)
- [What this does and does not show](#what-this-does-and-does-not-show)
- [Ending](#ending)
- [Data and code](#data-and-code)
- [Acknowledgements](#acknowledgements)
- [Appendix](#appendix)

## Why I was skeptical

I was first motivated by [Liang et al. (2023)](https://arxiv.org/abs/2304.02819), a Stanford study showing that GPT detectors are biased against non-native English writers, to see whether detectors were still as bad on ESL writing. That slowly grew into this huge experiment stress-testing the new model. I was a bit skeptical starting out, since I come from an ESL background, and AI has been *important* for many of us to communicate on the same ground as native speakers.

### What I expected going in

Before starting, I believed detectors might just be overfitting to get false positive rates (FPR) near 0.000x. The only thing I learned from my machine learning class was that models, especially classifiers, love to overfit. However, I was a firm believer that most instruct models, the models most people interact with, will be detected cleanly.

### The TOEFL paper

In 2023, Liang et al. found that GPT detectors flag essays by non-native, or ESL (English as a Second Language), writers as AI. GPTZero gave 47 of 91 TOEFL essays (TOEFL is a standardized test of English proficiency) an AI probability of 0.5 or more, and 30 of them 0.75 or more.

Hence, I thought that ESL or non-native English writing would be a huge jackpot for me (more on the bounty below). As an ESL writer myself, I am pleasantly surprised that this may no longer be true.

### How AI was used

I love Claude when it comes to coding, so I used it to implement the experiments, and it also gave valuable insights that I would probably have skipped.

This blog is mostly written by me, but Claude did fix my dyslexic spelling, ramblings, and not so good prose throughout.

## The bounty

GPTZero 5.0 (5.0b in the API) was released on November 23, 2026. Since I'm part of the grant, I think I may have had early access to the model, but I'm not sure.

The [bounty page](https://gptzero.me/bounty) offers $100 for each published human text of 300+ words, with proof that it was human writing. There is a bigger bounty of $1,000 for 750+ words of text from 2020 or earlier that scores 75% AI or more, which I believe might be nigh impossible, in a good way. I'll talk more about it in the section *Why 750 words was out of reach*.

You can read more about the bounty at [gptzero.me/bounty](https://gptzero.me/bounty).

### How I searched

I first laid out the areas I believed would fool detectors. Oh boy, was I wrong. Here is a figure of the data points I chose:

```image
src: /posts/images/gptzero-human-writing/central.png
alt: One dot per scan of human text, in clusters by kind of text
caption: Each dot is one scan: a total of 500 scans and 250k words of human-written text from anywhere between 1902 and 2020. Red dots are false positives.
```

### First, a check that it catches AI

I wanted to be sure that detectors still work on local models, just for fun. So for 118 of the human texts (my first two guesses below), I had a small open model (Qwen3-14B) write an AI text of the same genre and length from a short brief.

GPTZero caught all 118 AI texts, and called all 118 human texts human. So it clearly works on raw AI text in these genres, and the rest of this post is about the human side, and maybe where this might fail? ;)

## Almost everything reads human

Three terms to understand before this (I made them up):

1. **hot**: labeled AI-generated (an AI probability of about 0.5 or more)
2. **warm**: has rough signals that might flag parts of the writing as AI (labeled human, AI probability of 0.05 or more)
3. **cold**: labeled human (AI probability under 0.05)

I've labeled them red, yellow, and green.

### Genres I thought would trip it

My first guess was formal institutional writing such as NSF abstracts, federal strategy documents, old corporate pages and *earnings releases*. I was sad to see all of them come back human.

Then I jumped into South Asian English which included Nepali newspapers, Indian court judgments, government releases, and books from 1902 to 1945 (even a 1927 Ramayana translation). Still, all human, even colder than institutional writing. That's 118 of 118 so far. 

My third guess was predictable text, not as exciting but at this point I was tired. It included sample essays, content farms, self-help, help pages and Chinese official English. 26 of 26 came back human, colder still.

I was back to score zero. All the areas I thought would *"fool"* detectors seemed un-foolable. 

The highest-scoring single sentence in those early rounds was a financial one: *"Return on average common equity was 25.8% for the second quarter of fiscal 2007, compared with 23.7% for the second quarter of fiscal 2006."* It scored 0.83, and it pointed me at Lehman Brothers.

### Essays by non-native writers

This was the case I was most skeptical about. I ran Liang's 91 TOEFL essays again on GPTZero 5.0b, and none of them were called AI. The highest AI probability was 0.089. (These 91 essays are on top of the 500 scans.) To be fair, GPTZero beat me to it and already published this 0 of 91 result itself, so all I add is the essay-by-essay comparison with 2023.

To make it a little harder, I wanted to scan essays outside that benchmark, since a model can do well on a famous test set. So I found 105 essays by ESL students on TOEFL prompts which were graded by a teacher and posted on a teaching site in 2002. To my surprise, none were called AI, and the highest was 0.0002.

I can't tell whether GPTZero trained on essays like these or just learned to read them well, but it does look like the ESL issue might be largely fixed.

```image
src: /posts/images/gptzero-human-writing/essays_clusters.png
alt: Liang et al.'s 91 TOEFL essays in 2023 and now, and 105 other ESL essays
caption: Liang et al.'s 91 TOEFL essays: 47 called AI in 2023, 0 now. And 0 of 105 ESL essays from outside GPTZero's benchmark.
```

### Other detectors on the same texts

I also ran the same 118 human texts through free open detectors, mostly from Hugging Face. Interestingly, Fakespot called 42 of them AI, Desklib 24 and Fast-DetectGPT 11 whereas GPTZero called 0 of these full texts AI. 

The free ones mostly flag US institutional and corporate writing, and to my surprise, almost none of the South Asian texts. Most of them can still rank AI above human almost perfectly.

## The one place it breaks

### Two Lehman Brothers releases

With a few iterations I was able to break it. An unmodified 322-word stretch of Lehman Brothers' Q2 2007 earnings release starting from *"Non-interest expenses"* to the end of the release, scored AI 100%, which by definition is a False Positive. 

Using the same procedure, disclosed in the next sub-section, I was able to find another 301-word stretch of the Q2 2008 release, starting at *"Investment Banking reported net revenues"*, which also scored AI 100%.

The funny part is that both whole releases score human. The whole Q2 2007 page scores 0.025, and the full Q2 2008 release text (840 words) scores 0.056.

You can see both scans here: [Q2 2007](https://gptzero.me/share/s/196e575c-edf9-428c-b6ac-cb12cd272d41) and [Q2 2008](https://gptzero.me/share/s/76e87955-1d03-4aa4-a381-1d362e3268ab).

```image
src: /posts/images/gptzero-human-writing/scan_gptzero_lehman_q2_2007.png
alt: GPTZero web scan of the unchanged Lehman Q2 2007 excerpt: AI 100%, highly confident, Model 5.0b
caption: GPTZero 5.0b on the unchanged 322-word Lehman Q2 2007 excerpt: AI 100%, highly confident.
```

```image
src: /posts/images/gptzero-human-writing/scan_gptzero_lehman_q2_2008.png
alt: GPTZero web scan of the unchanged Lehman Q2 2008 excerpt: AI 100%, highly confident, Model 5.0b
caption: GPTZero 5.0b on the unchanged 301-word Lehman Q2 2008 excerpt: AI 100%, highly confident.
```

### How I found them

I found them by moving slowly where the text starts inside a passage that was already a bit hot (around 0.6 to 0.7) to begin with. I want to be honest here: a cut chosen by its score is a failure I went looking for. At first, I only thought I *might* have found a False Positive, but then again, if a 300+ word section can be flagged, I'd say it's a quirk at the least. For the record, only 11 of my 185 Lehman scans came back hot, so I tried a lot before getting lucky.

The following figure shows the same Q2 2008 text with 12 different starting sentences, plus two 750+ word cuts at the bottom. One scores 1.0, one 0.59, and the rest are between 0.0002 and 0.14. So, the method is mainly about existing failing areas, that can be cut out into their own ~300-word sections (no words changed, of course).

```image
src: /posts/images/gptzero-human-writing/start_bars.png
alt: One Lehman release cut 14 ways
caption: One unchanged release, 14 scans. Only the cut starting at "Investment Banking reported net" scores 1.0. Both 750+ word cuts score 0.056.
```

### What the web page shows

I also pasted both texts into the normal web scanner, and it gave the same AI 100% verdict as the API. 

One thing I found odd was the web page highlights some sentences and not others whereas the API is a bit more detailed and the scores feel the same. But the verdict still stands: GPTZero says AI.

### A second opinion

I quickly rushed to Pangram to check if these were actually a universal failure. I scanned GPTZero's 20 highest-scoring human texts on Pangram 4.1, both 100% hits included.  Yeah, I was not able to become rich with this: Pangram called all 20 of them 0% AI.

```image
src: /posts/images/gptzero-human-writing/scan_pangram_lehman_q2_2008.png
alt: Pangram 4.1 scan of the same Lehman Q2 2008 excerpt: Human, 100% human-written
caption: Pangram 4.1 on the same Q2 2008 excerpt: 100% human-written.
```

## Why it breaks

I'm not 100% sure, but I believe it happens because of how the model itself was designed to score individual segments. Some points that *might* give more insights on why it can happen:

### GPTZero reads about 300 words at a time

In the raw API outputs, GPTZero scores windows of about 300 to 340 words, and a sentence's score depends on which window it falls in.

Take a short text: the sentence scores are nearly flat, as if it judges the window as a singular block. For instance, the sentence *"This increase was driven by record debt origination revenues..."* scores 0.006, 0.604 or 0.644, depending on which cut of the release it sits in.

Whereas in a longer text, each window gets its own scores, and the entire document gets a full score on top. I'm not 100% sure if this is the exact way it works but in the full 840-word Q2 2008 release, the middle windows were 0.98 to 0.99 and the windows around it 0.00 to 0.03, and the whole release came out at 0.056.

### From 0.66 to 1.0 with nothing in between

I found the same thing with the full document scores. In all 637 scans planned for release (the 500 human scans, 118 AI texts and 19 edited copies), none scored between 0.663 and 0.9999. A small change in the sentence scores (a mean of 0.910 against 0.935) did move one document from 0.61 to 1.0. 

I'm unsure if this is only a quirk on the data I tested or could be a design inside the new model itself. I haven't checked if this holds for any previous models.

### It is the figures, not the words

I first thought it was the wording, so I edited it. Three wording edits left it at 1.0. Then I swapped in the previous quarter's figures, and it dropped to 0.22. Small random changes to the figures gave 0.10 to 0.55. The other way around also works: the previous quarter's release with this quarter's figures went from 0.045 to 0.32.

I would say it's not as simple as *"numbers trigger it"*, which could be the first reasonable thought. When I swapped in only last quarter's ratio figures, or only its capital figures, it stayed at 1.0. They do not seem to be related to why it happens.

Hence, there may not be a human-readable trigger to look for.

```image
src: /posts/images/gptzero-human-writing/edits_rows.png
alt: Edited copies of the Lehman Q2 2007 text: wording edits vs figure edits
caption: Wording edits stay at 1.0 as mentioned in the paragraph above.
```

### Lehman's other quarters

I similarly scanned the same section in Lehman's other quarters mainly from 1998 to 2008, and all the other quarters were human; only Q2 2007 passed 0.5. So it shouldn't be Lehman's template in general. 

There's something particular in these two releases with their exact figures that's causing the issues.

## Why 750 words was out of reach for this method

### The hot stretch is one window wide

The hot stretch is about one window wide. In the 750+ word cuts of Q2 2008, the middle window scores 0.98 to 0.99, and the windows on either side score 0.00 to 0.03. Any 750-word text has to include those cold windows, so the whole thing comes out human.

Out of 628 scanned windows (about 300 words each) of human text, the 27 hot ones all came from the two Lehman releases and three Bear Stearns dividend releases. So there could be a pattern here on financial releases but I'd say I'm not confident enough to label them more than a quirk.

### Whole documents that came close

The closest I got with a whole, uncut document were three Bear Stearns quarterly dividend releases where each document was just over 300 words (329 to 332). In them, two came out hot, labeled AI with low confidence (0.498 and 0.587), and one was warm (0.313). 

These were the first whole human documents in my search that GPTZero called AI, but none of them reached 75%, hence I didn't lead with these examples.

### Where I looked for longer text

I similarly collected a few hundred 750+ word sections from 32 regional banks' earnings releases from 2005 to 2008, and scanned the top 4 that *"looked"* like the hot hits we had before. Unfortunately, I won't be getting richer anytime soon :(

I thought about searching a big web crawl (C4), but dropped it because it's widely available, and *might* already be part of the training materials (to be fair, so *might* the Wayback pages I used).

## What this does and does not show

Overall, I think the new model is better than the previous ones. A few more points I'd like to make clear:

### This is not a false-positive rate comparison

As I mentioned previously, I started this search with a hunch on what might be weak areas of GPTZero, hence, this report is not about FPRs. I picked the text by guessing and mining for failure points. So this does not measure how often it might flag human texts in real life. In my search, the new model almost never called real old human text AI, and the failure I found itself is very narrow.

### Trained on it, or reads it well?

As you may have thought, many of these texts are public and old, and a possibility could be that GPTZero trained on them. I really can't make any claims since my scans can't differentiate that from GPTZero just reading this kind of writing well. I'd like to believe the latter :)

### Raw AI text might not be the hard case anymore

By now, raw model (chat instruct tuned) output is easy for every strong detector I tried, including Pangram's open EditLens models (which I also ran on the 118 texts). Rewritten/assisted AI text is a different story: a lot of work has been done on classifying it, and that's what I'll look at next. 

If you want to read, I highly recommend the [EditLens paper](https://arxiv.org/abs/2510.03154).

### Free detectors are no shortcut

To see if I could find flags more easily or in bulk, I ran a second check on 388 human texts, and four other open detectors from Hugging Face really couldn't predict which human windows GPTZero calls AI (the best was AUROC 0.76), and one of them called 95% of the human texts AI.

## Ending

I can confidently say GPTZero is kinda good now. ESL does seem largely fixed from my testing, but I'm still a little concerned about what the 0% FPR claims on ESL essays might mean in production. From their [model card](https://gptzero.me/research/gptzero-5) and my small testing, I don't have any reason not to believe it works generally for chat instruct models.

I'll soon be researching more on adversarial attacks like humanization, and seeing if the frontier is good with that or not. Will keep it updated.

## Data and code

I'm committed to releasing all scans so anyone can recompute the numbers. Hugging Face: [vein05/gptzero-human-writing](https://huggingface.co/datasets/vein05/gptzero-human-writing). Code: [Vein05/gptzero-human-writing](https://github.com/Vein05/gptzero-human-writing).

## Acknowledgements

- Compute: the [AIMS Lab](https://aimsresearchlab.com) at The University of Southern Mississippi, for the A100 GPU that ran the free detectors and wrote the matched AI texts (Qwen3-14B).
- [GPTZero](https://gptzero.me), for the research grant of API credits (5M words) used for every scan in this post.
- [Pangram](https://www.pangram.com), for the research grant of credits used for the second-opinion checks.
- None of the results were influenced or shaped by either company in any way. No one at GPTZero or Pangram saw this draft before it was published, though I did report the mis-flagged documents to GPTZero. Also, full disclosure: I was initially motivated by the bounty money :D

## Appendix

### Table A1. What we scanned, and what GPTZero said

Human text written 1902-2020, unchanged. Many Lehman rows are overlapping cuts of the same few releases.

| Kind of text | Scans | Words | Called AI | 75% AI or more | Highest AI probability |
|---|---|---|---|---|---|
| Lehman Brothers releases and filings (1998-2008) | 185 | 78,086 | 11 | 4 | 1.0 |
| Other companies' financial releases: earnings, dividends, reports | 58 | 27,313 | 2 | 0 | 0.59 |
| Science, statistics and government writing | 42 | 23,387 | 0 | 0 | 0.0013 |
| Plain web genres: help pages, self-help, content farms, sample essays, Google Answers, a sports recap | 33 | 23,320 | 0 | 0 | 0.00089 |
| South Asian English: newspapers, government releases, court judgments, journals, books (1902-2019) | 48 | 40,778 | 0 | 0 | 0.00046 |
| Corporate web pages | 24 | 16,117 | 0 | 0 | 0.00018 |
| Student and ESL essays | 110 | 44,097 | 0 | 0 | 0.00015 |
| **All** | **500** | **253,098** | **13** | **4** | |

### Table A2. Same release, different starting sentence (Lehman Q2 2008, unchanged text)

| Text starts at | Words | AI probability |
|---|---|---|
| "Capital Markets reported net ..." | 302 | 0.00021 |
| "Fixed Income Capital Markets ..." | 300 | 0.00015 |
| "Excluding mark to market ..." | 311 | 0.00086 |
| "Equities Capital Markets reported ..." | 324 | 0.11 |
| "Investment Banking reported net ..." | 301 | 1.0 |
| "Debt underwriting revenues were ..." | 312 | 0.59 |
| "Equity underwriting revenues were ..." | 307 | 0.14 |
| "Merger and acquisition advisory ..." | 323 | 0.072 |
| "Investment Management reported net ..." | 313 | 0.00064 |
| "Asset Management revenues were ..." | 305 | 0.00072 |
| "The Firm reported assets ..." | 315 | 0.00091 |
| "Private Investment Management reported ..." | 301 | 0.0015 |
| "Chairman and Chief Executive ..." (750+ words, to the end) | 840 | 0.056 |
| "With these actions and ..." (750+ words, to the end) | 751 | 0.056 |

### Table A3. Is it the words or the numbers? (Lehman Q2 2007; edited copies are tests only)

| Text | AI probability | Mean sentence score |
|---|---|---|
| As published (322 words) | 1.0 | 0.98 |
| Wording: "compared with" changed to "compared to" twice | 1.0 | 0.96 |
| Wording: the previous quarter's reason clause | 1.0 | 0.97 |
| Wording: the previous quarter's word order in the company paragraph | 1.0 | 0.98 |
| Figures: the previous quarter's expense figures | 0.61 | 0.91 |
| Figures: the previous quarter's ratio figures | 1.0 | 0.93 |
| Figures: the previous quarter's capital figures | 1.0 | 0.96 |
| Figures: all of the previous quarter's figures | 0.22 | 0.69 |
| Figures: small random changes to every figure, try 1 | 0.24 | 0.71 |
| Figures: small random changes to every figure, try 2 | 0.1 | 0.50 |
| Figures: small random changes to every figure, try 3 | 0.55 | 0.89 |
| The previous quarter's release, as published | 0.045 | 0.31 |
| The previous quarter's release with this quarter's figures | 0.32 | 0.79 |

### Table A4. Free detectors from Hugging Face on the same human texts

| Detector | Flags as AI (of 388 human texts) | Finds the ones GPTZero calls AI (AUROC) |
|---|---|---|
| tropa-mini | 13% | 0.69 |
| tabularisai | 5% | 0.76 |
| tmr | 95% | 0.66 |
| vanguard | 42% | 0.69 |

GPTZero itself calls 12 of these 388 texts AI (cuts of the Lehman Q2 2007 and Q2 2008 releases, and one Bear Stearns dividend release). AUROC 0.5 is chance.

### Sources and references

**Cited work**

- Weixin Liang, Mert Yuksekgonul, Yining Mao, Eric Wu, James Zou. *GPT detectors are biased against non-native English writers.* Patterns, 2023. [arXiv:2304.02819](https://arxiv.org/abs/2304.02819). Their data, with GPTZero's 2023 scores on the 91 TOEFL essays: [github.com/Weixin-Liang/ChatGPT-Detector-Bias](https://github.com/Weixin-Liang/ChatGPT-Detector-Bias) (`Data_and_Results/Human_Data/TOEFL_real_91`).
- George Alexandru Adam, Alexander Cui, Edwin Thomas, Emily Napier, Nazar Shmatko, Yue Gao, Zikun Chen, Jacob Schnell, Jacob Junqi Tian, Alekhya Dronavalli, Edward Tian, Dongwon Lee. *GPTZero: Robust Detection of LLM-Generated Texts.* arXiv preprint, 2026. [arXiv:2602.13042](https://arxiv.org/abs/2602.13042).
- Bradley Emi, Max Spero. *Technical Report on the Pangram AI-Generated Text Classifier.* arXiv preprint, 2024. [arXiv:2402.14873](https://arxiv.org/abs/2402.14873).
- GPTZero. [GPTZero records 0 false positives on essays by ESL students or students with disabilities](https://gptzero.me/news/gptzero-no-bias-against-esl-writers/). October 20, 2026.
- GPTZero. [Bounty page](https://gptzero.me/bounty). Read November 20, 2026.
- GPTZero. [GPTZero 5.0 model card](https://gptzero.me/research/gptzero-5). November 19, 2026.

**Scan results**

- GPTZero, Lehman Q2 2007 excerpt (322 words, AI 100%): [gptzero.me/share/s/196e575c-edf9-428c-b6ac-cb12cd272d41](https://gptzero.me/share/s/196e575c-edf9-428c-b6ac-cb12cd272d41)
- GPTZero, Lehman Q2 2008 excerpt (301 words, AI 100%): [gptzero.me/share/s/76e87955-1d03-4aa4-a381-1d362e3268ab](https://gptzero.me/share/s/76e87955-1d03-4aa4-a381-1d362e3268ab)
- Pangram, the same Lehman Q2 2008 excerpt (Human, 100% human-written): [pangram.com/history/582e0673-09e3-4343-a7b7-70432640076c](https://www.pangram.com/history/582e0673-09e3-4343-a7b7-70432640076c?ucc=6lScXkNBKsx)

**Human texts named in this post**

- Lehman Brothers, second quarter 2007 earnings release: [Wayback Machine copy](https://web.archive.org/web/20071010161135/http://www.lehman.com/press/qe/past/2_07qe.htm)
- Lehman Brothers, second quarter 2008 earnings release: [Wayback Machine copy](https://web.archive.org/web/20080915002734/http://www.lehman.com:80/press/qe/past/2_08qe.htm)
- Bear Stearns quarterly dividend releases, SEC 8-K exhibits: [September 2005](https://www.sec.gov/Archives/edgar/data/777001/000077700105000084/ex99.htm), [June 2006](https://www.sec.gov/Archives/edgar/data/777001/000077700106000088/ex99.htm), [September 2006](https://www.sec.gov/Archives/edgar/data/777001/000077700106000100/ex99.htm)
- ESL essays on TOEFL writing prompts, from a 2002 teaching site: [prompts and essays](https://web.archive.org/web/20021204203739/http://buckhoff.topcities.com:80/182%20TWE%20Writing%20Prompts.htm), [graded samples](https://web.archive.org/web/20021205120034/http://buckhoff.topcities.com:80/TWE%20samples%20good,%20bad,%20ugly.htm)
- Student essays from the same site, 2002-2003: [essay page](https://web.archive.org/web/20020201210701/http://buckhoff.topcities.com:80/essay_2.htm), [sample essays](https://web.archive.org/web/20030823194209/http://buckhoff.topcities.com:80/sample_essays4.htm)
- Every other scanned text: its source link is in the released data (see Data and code).

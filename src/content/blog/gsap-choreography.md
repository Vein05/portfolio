---
title: "Scripted product demos with GSAP instead of video"
date: "2026-05-20"
category: "Engineering"
status: "plated"
---

I was exporting a 15-second screen recording of the product for the landing page when the file hit 3.4 MB. On a phone it would letterbox. If the user had `prefers-reduced-motion` enabled, it would just... play anyway. I could not theme it, could not pause it at a specific scene, could not scrub to the materials tab when a user scrolled there. A video is a frozen artifact. The product it was supposed to show off is alive.

So I deleted the MP4 and built the walkthrough as a scripted GSAP animation. Pure DOM. No video file. 45 KB gzipped. Every element in the animation is a real element on the page, styled with the same tokens as the rest of the site.

Here is a simplified version of the result. Pause it below.

```gsap-demo
```

One cursor. One `gsap.timeline()`. Seven scenes. The cursor enters, clicks a button, cards stagger in with slight rotation offsets, an overlay appears, the scene cross-fades to a new tab, list items reveal, text types out character by character. When it finishes, it loops.

This is not a recording. It is running in your browser right now.

## The problem with one timeline

My first instinct was multiple timelines: one for the cursor, one for the cards, one for the scene transitions. They drifted apart within seconds. If the user switched tabs and came back, the cursor was clicking on empty space where the cards used to be. Pausing one timeline did not pause the others.

The fix was to put everything on a single `gsap.timeline()` and use labels as the skeleton:

```javascript
const tl = gsap.timeline({
  repeat: -1,
  repeatDelay: 1.2,
  defaults: { ease: "power3.out" },
});
```

Labels are named after what the user does, not what animates. `"addClick"` is the moment the cursor clicks Add. `"navClick"` is the moment it clicks Notes. Everything else positions relative to these with offsets like `"addClick+=0.16"`.

The important consequence: inserting a new scene between two labels does not require recalculating any downstream timing. Labels absorb the shift.

## What makes a cursor feel human

Watch the cursor in the demo. It does not slide across the screen at constant speed. Real hands decelerate into a target, so every movement uses `power2.out`. Duration scales with distance: short hops take 0.4--0.6s, cross-screen travel takes 0.7--1.0s, entering from off-screen takes a full second.

The click is the hardest part to get right. Two things happen simultaneously: the cursor squeezes to 88% scale on press, and a ripple circle bursts outward from the click point.

```javascript
function click(position, label) {
  tl.set(ripple, { x: position.x, y: position.y, scale: 0.2, autoAlpha: 0.55 }, label)
    .to(cursor, { scale: 0.88, duration: 0.08, ease: "power2.out" }, label)
    .to(ripple, { scale: 3.4, autoAlpha: 0, duration: 0.54, ease: "power2.out" }, label)
    .to(cursor, { scale: 1, duration: 0.16, ease: "back.out(2.2)" }, `${label}+=0.09`);
}
```

The `back.out(2.2)` on the release is the detail that matters. The cursor slightly overshoots back to full size, like a finger lifting off glass. Replace it with `power2.out` and the click looks mechanical. The overshoot adds exactly the micro-gesture that your eye expects from a real hand.

## Scenes cross-fade, state does not

When the cursor clicks "Notes" in the demo, three things happen: the card grid fades out, the list view fades in, and the sidebar highlighting switches. The first two are animated. The third is instant.

```javascript
tl.to(cardArea, { autoAlpha: 0, duration: 0.24 }, "navClick+=0.08");
tl.to(listView, { autoAlpha: 1, duration: 0.28 }, "navClick+=0.14");
```

I use `autoAlpha` instead of `opacity` everywhere. At zero, GSAP sets `visibility: hidden` as well, which pulls invisible elements out of the tab order and screen readers. Plain `opacity: 0` leaves ghost elements capturing clicks.

The nav highlighting uses `classList`, not GSAP. State changes should be instant. Animating a nav highlight makes the interface feel laggy, not smooth.

## Timing is the whole game

The cards stagger in at 70ms intervals with per-card rotation offsets (`[-2, 1.5, -1, 2.5]` degrees). Without the rotation, four cards appearing on a grid look like a spreadsheet loading. With slight tilts, they feel dropped onto a desk.

```javascript
tl.to(cards, {
  autoAlpha: 1, y: 0, scale: 1,
  rotation: (i) => rotations[i],
  stagger: 0.07,
  duration: 0.46,
}, "addClick+=0.16");
```

List items use a tighter stagger, 60ms, because they are simpler shapes arriving in sequence rather than objects being placed.

The most counterintuitive rule: after every major action, do nothing. After the cards appear, there is 1.4 seconds of dead time before the cursor moves again. After the overlay appears, it sits for a full second. Viewers need time to register what changed. Removing the pauses makes the animation faster but incomprehensible.

The typed text uses `ease: "none"` — constant speed. This is one of the rare cases where linear motion is correct. Eased typing looks like someone accelerating through a sentence.

## The loop trap

The first time the animation looped, every card was already visible. The overlay was still showing. The cursor was in the wrong position. The timeline's end state became the second loop's start state.

The fix is a reset block at timeline position 0 that explicitly restores every animated property:

```javascript
tl.add(() => {
  gsap.set(cursor, { x: CURSOR_START.x, y: CURSOR_START.y, scale: 1 });
  gsap.set(cards, { autoAlpha: 0, y: 26, scale: 0.82, rotation: 0 });
  gsap.set(overlay, { autoAlpha: 0, scale: 0.96, y: 10 });
  gsap.set(typed, { textContent: "" });
}, 0);
```

Miss one property and you see it immediately on the second loop. I missed `rotation` the first time and the cards snapped to their tilted positions before animating — a subtle jump that took twenty minutes to find.

## The architecture that makes this maintainable

The production version at [costumary.com](https://www.costumary.com) is 1,800 lines across five files:

```
film-script.ts          → data: scenes, cursor paths, timings
film-primitives.tsx     → DOM: frame, sidebar, cursor SVG
film-panels.tsx         → DOM: each tab's content
film-demo.tsx           → GSAP: the entire choreography
animation-provider.tsx  → React context: play/pause/restart
```

GSAP code lives in exactly one file. Everything else is inert markup with `data-film-*` attributes. A designer can rearrange the reference board without touching the timeline. The timeline targets elements by data attribute using `gsap.utils.selector(root)`, so React refs do not need to thread through component boundaries.

The demo in this article follows the same separation in miniature: every animated element has a `data-demo-*` attribute, and a single `useGSAP` hook contains the entire choreography.

Responsive scaling is a CSS transform from a fixed design width. The container holds the aspect ratio, the film renders at full size and scales down. Same proportions, same cursor positions, same timing at every viewport width. No media queries.

## And you can get crazy with it

The simple demo above teaches the mechanics. Here is what happens when you push it — three users, one moodboard, everything choreographed on a single timeline. Click pause, restart, poke around.

```gsap-board-demo
```

## The production version

The [costumary.com](https://www.costumary.com) hero runs four scenes: a drag-and-drop reference import with progress bars, a multi-cursor collaboration sequence where three users work simultaneously, a sidebar that collapses from labeled nav to icon-only while the workspace expands, and an AI assistant that receives a typed question and streams a contextual response. It supports `prefers-reduced-motion` with a static fallback state and has play/pause/restart controls.

Same architecture. Same click helper. Same label convention. Forty-five kilobytes where a video would have been three megabytes.

## For agents

If you build with Claude Code, Cursor, or similar — you can get the skill here: [gsap-choreography](https://github.com/Costumary/gsap-choreography).

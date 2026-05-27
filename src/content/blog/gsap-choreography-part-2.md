---
title: "Scripted product demos with GSAP, part two: the camera"
date: "2026-05-26"
category: "Engineering"
status: "plated"
---

[Part one](https://spanthi.com/blog/gsap-choreography) reached 67,000 views on r/webdev in two days. I did not expect that. I wrote it because I thought replacing a 3.4 MB video with 40 KB of DOM animation was interesting enough to share. Turns out a lot of people are thinking about the same problem.

The comments were better than the post. People asked about SEO indexing, screen reader behavior, `prefers-reduced-motion` fallbacks, whether GSAP is even necessary, and several pointed out it was missing something. They were right.

Part one had a cursor clicking through scenes on a flat stage. Everything happened at the same zoom level, the same distance from the viewer. Watch a real product demo video and you notice something different: the camera moves. It zooms into the action when something important happens, follows the cursor through a workflow, and pulls back when the scene changes. That is the difference between a slide deck and a directed film.

This post adds the camera. Same 40 KB budget. No video files.

## The zoom wrapper problem

The first thing you try is `gsap.to(frame, { scale: 1.4 })`. It works for half a second, then you notice your responsive scaling is gone. The film frame uses `transform: scale(filmScale)` to fit its container width, and GSAP just overwrote it. Both write to the same CSS `transform` property. They cannot coexist on the same element.

The fix is a wrapper inside the frame that GSAP owns:

```javascript
<div data-film-frame style={{ transform: `scale(${filmScale})` }}>
  <div data-film-zoom className="origin-center">
    {/* All scene content */}
  </div>
  <Cursor />  {/* Outside the zoom wrapper */}
</div>
```

GSAP animates `data-film-zoom`. The responsive scale on the outer frame is untouched. The cursor lives outside the zoom wrapper, so it stays the same size while content scales up around it. This took me an embarrassing amount of time to figure out. Two divs. That was the whole fix.

## Pan math

Zooming into the center of the frame is easy. Zooming into a specific element, like a Pinterest pin the user is about to right-click, is the real problem. You need to translate the zoom wrapper so the target ends up centered in the visible viewport:

```javascript
const ZOOM = 1.45;
const panTo = (target) => ({
  x: (FILM_WIDTH / 2 - target.x) * (ZOOM - 1),
  y: (FILM_HEIGHT / 2 - target.y) * (ZOOM - 1),
});
```

At zoom 1.0, no translation needed. At zoom 1.45, every pixel away from center needs 0.45 times that distance in translation to compensate. Pre-compute positions for every cursor destination:

```javascript
const panPin = panTo(positions.pinImage);
const panContext = panTo(positions.contextMenu);
const panPicker = panTo(positions.pickerCenter);
```

## Stay zoomed, pan to follow

The biggest mistake in my first attempt was zooming in for one interaction, zooming out, zooming in for the next, zooming out again. It looked like a PowerPoint with a budget zoom transition.

The correct pattern: zoom in once, stay zoomed, pan to follow the cursor through the whole interaction sequence, zoom out once when changing scenes.

```gsap-live:zoom-pan
// Zoom in on right-click
tl.to(zoom, {
  scale: ZOOM, x: panPin.x, y: panPin.y,
  duration: 0.65, ease: "expo.out",
}, "zoomIn");

// Context menu while zoomed
tl.to(ctx, {
  autoAlpha: 1, duration: 0.16,
}, "zoomIn+=0.35");

// Camera pans to follow cursor
// to the save button (still zoomed)
tl.to(zoom, {
  x: panSave.x, y: panSave.y,
  duration: 0.55, ease: "sine.inOut",
}, "panToSave");
tl.to(cursor, {
  x: save.x, y: save.y,
  duration: 0.55, ease: "sine.inOut",
}, "panToSave");

// Only zoom out when done
tl.to(zoom, {
  scale: 1, x: 0, y: 0,
  duration: 0.45, ease: "sine.inOut",
}, "zoomOut");
```

The `overflow-hidden` container clips content outside the focal point. When you zoom to 1.45x and pan, the viewer's eye is guided exactly where you want it. Pause the demo and inspect it. This is the single most impactful change from part one.

## Easing is not one-size-fits-all

Part one used `power2.out` for almost everything. Fine for a flat demo. But when you add camera movement, you notice that different motion types need different eases or the whole thing feels off.

| Motion | Ease | Why |
|--------|------|-----|
| Camera pan | `sine.inOut` | Smoothest curve. Feels like a real camera on a dolly. |
| Dramatic zoom-in | `expo.out` | Fast start, long deceleration. Whoosh then settle. |
| Cursor movement | `sine.inOut` | Natural hand acceleration. |
| Fade in | `sine.out` | Decelerates into visibility. |
| Click squeeze | `power2.out` | Snappy press response. |
| Click release | `back.out(2.2)` | Slight overshoot. Feels physical. |
| Typed text | `none` | Real typing does not ease. |

The single biggest upgrade was replacing `power2.inOut` with `sine.inOut` on camera moves. `power2` has a noticeable acceleration kick that feels mechanical at large scale. `sine` has no perceptible kick at any point in the curve. I went back and changed every camera ease after discovering this. The difference was immediately obvious.

Watch both pans simultaneously. The left has a visible "kick" at the acceleration points. The right is smooth throughout.

```gsap-easing-compare
```

## The cursor is never dead

In part one, the cursor moved to a target, clicked, and waited. With camera movement, there are moments where the scene shifts but the cursor is frozen. Those moments break the illusion. The viewer's eye tracks the cursor as an anchor. When it freezes while the world moves around it, the demo feels like a slideshow.

Every camera move should have a simultaneous cursor movement at the same timeline label:

```javascript
// BAD: cursor is dead during zoom
tl.to(zoom, { scale: 1.4, x: panX, y: panY, duration: 0.7 }, "zoomIn");

// GOOD: cursor drifts toward its next target during zoom
tl.to(zoom, {
  scale: 1.4, x: panX, y: panY,
  duration: 0.7, ease: "expo.out",
}, "zoomIn");
tl.to(cursor, {
  x: current.x + (next.x - current.x) * 0.3,
  y: current.y + (next.y - current.y) * 0.3,
  duration: 0.65, ease: "sine.out",
}, "zoomIn");
```

The cursor does not need to arrive. A 20-30% drift toward the next target is enough to signal "the hand is in motion." Calm, but never dead.

```gsap-cursor-compare
```

## Graceful loops

Part one's loop was abrupt. The timeline ended and snapped back to frame one. With camera movement the problem is worse, because the zoom jumps from 1.4x to 1.0 instantaneously.

The fix is an outro:

```javascript
// Zoom back out
tl.to(zoom, { scale: 1, x: 0, y: 0, duration: 0.8, ease: "sine.inOut" }, "outro");

// Cursor drifts offscreen
tl.to(cursor, {
  x: offScreenX, y: offScreenY,
  duration: 0.7, ease: "sine.in",
}, "outro+=0.1");

// Breathing room before restart
tl.to({}, { duration: 0.6 });
```

`sine.in` on the cursor exit accelerates away, like a hand pulling back. `sine.out` would decelerate and linger. Your eye notices the difference.

And a timing rule: first drafts are always too slow. Every hold and transition feels right during development but drags on the second loop. Cut 20-30% from your timing after the first working version. Post-action zooms should be 0.4-0.5s, not the 0.7-0.8s you started with.

## Here is what pushing it further looks like

This is the production version of the pan-zoom technique, running live at [costumary.com/web-clipper](https://www.costumary.com/web-clipper). A browser extension demo: browse Pinterest, right-click an image, save to project, switch to the board where it already appears. The camera zooms into the right-click target, pans to follow the cursor through the save dialog, zooms into the newly added reference on the board, then pulls back and loops.

Every element in there is a real DOM node. The Pinterest masonry grid, the context menu, the project picker, the reference board with its toolbar and dot-grid canvas. All styled with the same design tokens as the actual product.

```iframe
src: https://www.costumary.com/web-clipper#demo
height: 800
caption: costumary.com/web-clipper. Full production GSAP demo with pan-zoom choreography. Visit the page directly for the full experience.
title: Costumary Web Clipper Demo
```

## SEO, theming, and the stuff video cannot do

A few commenters mentioned SEO. View source on a `<video>` tag and Google sees `<video src="demo.mp4">`. A black box. View source on a GSAP demo and every button label, menu item, and heading is indexable text. "Save to Costumary." "Armor build." The demo itself is content. I have not run a controlled ranking test on this, but logically it follows: real DOM text beats an opaque binary blob. Someone with two identical landing pages (one video, one GSAP) should test it and report back.

Beyond indexing, DOM demos have properties video does not. Marketing changes a button from "Subscribe" to "Start free trial"? Change a text string. Firefox updates their brand color? Update one hex value. You want the demo buttons to actually convert? Wire them to a real signup modal. A video cannot do any of that. The demo is the same codebase as the product, so it changes when the product does.

## The accessibility argument

Multiple r/webdev comments asked about screen readers and `prefers-reduced-motion`. Here is what the implementation actually looks like.

When `prefers-reduced-motion: reduce` is enabled, skip the entire timeline:

```javascript
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
```

If reduced motion is preferred, render the demo in its resting state with all key elements visible, nothing moving. Register a paused empty timeline so play/pause controls do not crash.

One commenter suggested a static screenshot fallback. That works, but it throws away the accessibility advantage. The whole point of DOM-based demos is that screen readers can traverse the content. The context menu says "Save to Costumary." The picker says "Armor build." Every label is readable. A screenshot is just another image with an `alt` tag.

GSAP's `autoAlpha` (mentioned in part one) matters for screen readers too. At `autoAlpha: 0`, GSAP sets both `opacity: 0` and `visibility: hidden`, removing the element from tab order and the accessibility tree. Plain `opacity: 0` leaves invisible ghost elements that screen readers still announce. Every hidden element in the demo uses `autoAlpha`, not `opacity`, so screen readers only see what is currently visible on screen.

One commenter linked GSAP's `matchMedia()` utility:

```javascript
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // animation code here
});
```

This is cleaner than a custom hook if GSAP is already in the bundle. Either approach works. The point is the same: a video plays regardless of user preferences. A GSAP demo respects them by default.

## Does it need GSAP?

The top comment on part one asked this directly. Fair question.

For simple animations, no. CSS `@keyframes` and the Web Animations API handle basic tweens, fades, and hover states fine. If your demo is a single element fading in, you do not need a library.

But the web clipper demo has roughly 50 coordinated animations across two scenes with camera movement. Here is what GSAP gives you that you would have to rebuild:

**Labels.** Position every animation relative to named beats like `"zoomIn"` and `"contextNav"`. Insert a scene and everything downstream shifts. Web Animations API has no labels. You manage offsets manually.

**`repeat: -1` with reset logic.** A looping timeline that runs arbitrary reset code between loops. Native animation repeat does not let you reset DOM state, clear text content, or restore zoom on restart.

**`gsap.utils.selector(root)`.** Query by data attribute without threading React refs through component trees. The timeline targets `[data-film-cursor]` and `[data-film-zoom]` directly.

**Easing library.** `back.out(2.2)`, `expo.out`, `sine.inOut` with configurable parameters. CSS easing is limited to `cubic-bezier`. You could hand-compute equivalent curves, but you would be reimplementing GSAP's easing engine.

**Stagger.** `stagger: 0.07` on an element array. One line instead of N separate animations with manual delays.

Could you build this without GSAP? Yes. Would it take longer and produce worse results? Also yes. The web clipper demo is about 1,500 lines with GSAP. Without it, I would estimate double that, and the easing and timing control would be rougher.

GSAP core is 28 KB gzipped. If you are building a single fade-in, that is overhead. If you are orchestrating a 50-animation cinematic demo, it is infrastructure.

## The agent reality

Five demos across the site, roughly 4,000 lines of choreography code. I wrote maybe 60% of that. An AI agent wrote the other 40%. But the split is not what you think.

My 60% was the work the agent cannot do: deciding what to zoom into and when. Choosing `sine.inOut` over `power2.inOut` after seeing both and knowing one felt mechanical. Noticing the cursor looked dead during a camera move and deciding a 30% drift would fix it. Saying "the post-save zoom-out is 200ms too slow." Watching the loop restart and deciding it needed an outro instead of a hard cut. That is directing. The agent cannot do it because it cannot watch the animation and feel that something is off.

The agent's 40% was the tedious half: 1,500 lines of timeline code, 20 DOM elements with data attributes, click helpers, reset blocks, zoom wrapper wiring. Pattern-based work that follows rules I defined in a [skill file](https://github.com/Costumary/gsap-choreography). I describe a scene, the agent generates choreography that follows the encoded patterns. I watch, direct changes ("zoom in more," "pan is too harsh"), the agent adjusts. The patterns are stable enough that the output is consistent across different demos. But the agent does not know when something looks wrong. That part is still mine.

## Performance

The web clipper demo has about 50 `.to()` calls and 20 `.set()` calls on a single timeline. At any given frame, maybe 3-5 of those are actively tweening. GSAP only processes active tweens per tick, so 50 total calls is not 50 concurrent animations. The zoom transform is a single `scale` + `translate` on one wrapper div. One composited layer, no reflows.

Here is a stress test running in your browser right now. Start with 8 elements (comparable to a real demo), then push it to 24 and 48 with concurrent zoom, pan, and stagger animations. The FPS counter is live.

```gsap-stress-test
```

The demo uses plain colored shapes, not images or complex components. A real production demo with `<Image>` tags, text nodes, and nested layouts would put more pressure on the compositor. But the GSAP timeline itself is not the bottleneck. Every `.to()` writes to `transform` or `opacity`, both compositor-friendly properties that skip layout recalculation. The heaviest frame is the stagger burst where all shapes animate simultaneously during a zoom. If you see a drop on your hardware, I would like to know.

## The updated math

| Approach | Compressed | Camera? | Indexable? | Accessible? | Themeable? |
|----------|-----------|---------|-----------|-------------|------------|
| GSAP (flat, part one) | ~37 KB | No | Yes | Yes | Yes |
| GSAP (pan-zoom, part two) | ~40 KB | Yes | Yes | Yes | Yes |
| 15s MP4 (H.264) | 2-4 MB | Baked in | No | No | No |
| 15s WebM (VP9) | 1-2 MB | Baked in | No | No | No |
| 15s GIF | 8-15 MB | Baked in | No | No | No |

Adding the camera added roughly 3 KB to the bundle. The quality improvement is disproportionate to the cost. All five production demos across costumary.com ship under 80 KB gzipped combined. The equivalent in video would be 15-20 MB.

## What changed

Part one was proof you could replace a video. Part two is the part where it starts to feel directed instead of recorded. The camera is the difference. A flat cursor clicking through scenes looks like a screen recording with better compression. A cursor with zoom and pan looks like someone designed the experience.

The upfront cost is real. The ongoing cost is near zero. Updates are code changes, not re-recordings.

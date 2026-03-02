---
title: "Building My Portfolio Aesthetic"
date: "2024-10-25"
category: "Design"
status: "MATURE"
---

# Designing with Texture

When I set out to build this portfolio, I wanted something that felt tactile. A lot of modern web design is incredibly slick, featuring glassmorphism, heavy gradients, and rounded edges everywhere. While beautiful, I wanted to lean in the opposite direction: **something that feels like paper**.

## Choosing the Color Palette

I started with a base scheme of off-whites and soft creams.

* `paper-light`: `#f5f0e8` — The primary background color.
* `paper-surface`: `#edeae0` — Slightly darker, used for sidebars and cards.
* `ink-dark`: `#1a1a14` — Instead of pure black, a very deep, rich brown-black for text.
* `ink-blue`: `#2563eb` — A classic ink-pen blue for accents and links.

### The SVG Noise Formula

To give the paper actual texture, I used a base64 encoded SVG directly in the CSS background. It generated a subtle fractal noise pattern that, when set to a low opacity over the off-white background, perfectly mimics the grain of high-quality stationary.

```css
background-image: url("data:image/svg+xml,...");
background-repeat: repeat;
```

## Typography

Typography is where the paper aesthetic really comes alive. I opted for a three-font system:

1. **ClashGrotesk**: For headings and structural elements (breadcrumbs, nav bars). It has a sharp, almost architectural quality.
2. **Inter**: Used for the body prose. It reads beautifully on screens and has a subtle geometric elegance.
3. **Courier New**: For code blocks, evoking old typewriters.

> "Good design is obvious. Great design is transparent." — Joe Sparano

By combining these elements with strict container widths and ample whitespace, the resulting blog feels like a digital zine, easy to read and distinct from standard templates.

#!/usr/bin/env node
// Convert a landscape poster page into an editable .pptx.
//
// The poster copy lives in Astro markup, not in a data file, so rather than
// re-author each sheet this renders the page headlessly and walks the DOM:
// every leaf block of text becomes a native text box (with per-run font,
// size, weight, colour), every element with a visible background or border
// becomes a rectangle, and every <svg> / <img> figure is rasterised at print
// resolution and placed as a picture. Coordinates are mapped from the canvas
// onto a 44 x 32 in slide, so the deck matches the printed sheet.
//
// Editable: all text, layout, colours. Figures are pictures; edit the Astro
// source and re-run to regenerate them.
//
// Usage:
//   node scripts/poster-pptx.mjs [slug ...]          (default: every poster with a landscape sheet)
//   env: POSTER_BASE=http://127.0.0.1:4321  OUT_DIR=pptx  FIGURE_DPI=200
import { chromium } from 'playwright';
import pptxgen from 'pptxgenjs';
import fs from 'node:fs';
import path from 'node:path';
import { posters, FORMATS } from '../src/data/posters.js';

const BASE = process.env.POSTER_BASE ?? 'http://127.0.0.1:4321';
const OUT = process.env.OUT_DIR ?? 'pptx';
const FIGURE_DPI = Number(process.env.FIGURE_DPI ?? 200);
const SHEET_W_IN = FORMATS.landscape.w / 25.4; // 44
const SHEET_H_IN = FORMATS.landscape.h / 25.4; // 32
const CANVAS_W_PX = SHEET_W_IN * 96; // natural CSS width of .poster-canvas

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : posters.filter((p) => p.formats.includes('landscape')).map((p) => p.slug);

// Runs in the page. Returns shapes, images (with element handles by index) and
// text blocks, all in canvas-relative CSS px at natural (unscaled) size.
const extract = () => {
  const canvas = document.querySelector('.poster-canvas');
  const cr = canvas.getBoundingClientRect();
  const scale = cr.width / (parseFloat(getComputedStyle(canvas).width)); // transform scale
  const rel = (r) => ({
    x: (r.left - cr.left) / scale,
    y: (r.top - cr.top) / scale,
    w: r.width / scale,
    h: r.height / scale,
  });
  const rgb = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = '1'] = m[1].split(/[\s,\/]+/).map(Number);
    if (a === 0) return null;
    const hex = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
    return { hex: hex(r) + hex(g) + hex(b), alpha: a };
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const INLINE = new Set(['inline', 'inline-block', 'contents']);
  const isFigure = (el) => el.tagName === 'svg' || el.tagName === 'IMG';

  const shapes = [];
  const images = [];
  const texts = [];
  let imgIndex = 0;
  const figureEls = [];

  const walk = (el) => {
    if (!visible(el)) return;
    if (isFigure(el)) {
      figureEls.push(el);
      images.push({ ...rel(el.getBoundingClientRect()), idx: imgIndex++ });
      return;
    }
    const cs = getComputedStyle(el);
    // background / border → rectangle
    if (el !== canvas) {
      // computed style lengths are in untransformed px already; only
      // getBoundingClientRect values need the /scale
      const bg = rgb(cs.backgroundColor);
      const bw = parseFloat(cs.borderTopWidth) || 0;
      const bc = bw ? rgb(cs.borderTopColor) : null;
      const bt = parseFloat(cs.borderTopWidth) || 0, bb = parseFloat(cs.borderBottomWidth) || 0;
      const bl = parseFloat(cs.borderLeftWidth) || 0, br = parseFloat(cs.borderRightWidth) || 0;
      const uniform = bt === bb && bt === bl && bt === br;
      if (bg || (bc && uniform)) {
        const box = rel(el.getBoundingClientRect());
        const rad = cs.borderTopLeftRadius;
        const radius = rad.endsWith('%') ? (parseFloat(rad) / 100) * Math.min(box.w, box.h) : parseFloat(rad) || 0;
        shapes.push({
          ...box,
          fill: bg,
          line: bc && uniform ? { hex: bc.hex, w: bw } : null,
          radius,
          // absolutely positioned boxes paint above in-flow siblings
          layer: cs.position === 'absolute' || cs.position === 'fixed' ? 1 : 0,
        });
      } else if (bt || bb || bl || br) {
        // partial borders → thin rectangles per side
        const r = rel(el.getBoundingClientRect());
        const side = (x, y, w, h, wpx, col) => {
          const c = rgb(col);
          if (c && wpx) shapes.push({ x, y, w, h, fill: c, line: null, radius: 0, layer: 0 });
        };
        side(r.x, r.y, r.w, bt, bt, cs.borderTopColor);
        side(r.x, r.y + r.h - bb, r.w, bb, bb, cs.borderBottomColor);
        side(r.x, r.y, bl, r.h, bl, cs.borderLeftColor);
        side(r.x + r.w - br, r.y, br, r.h, br, cs.borderRightColor);
      }
    }
    const kids = [...el.childNodes];
    const hasBlockChild = kids.some(
      (n) => n.nodeType === 1 && !isFigure(n) && visible(n) && !INLINE.has(getComputedStyle(n).display),
    );
    const hasText = kids.some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasBlockChild && (hasText || kids.some((n) => n.nodeType === 1 && INLINE.has(getComputedStyle(n).display) && n.textContent.trim()))) {
      // leaf block: collect runs
      const runs = [];
      const collect = (node, style) => {
        for (const n of node.childNodes) {
          if (n.nodeType === 3) {
            const t = n.textContent.replace(/\s+/g, ' ');
            if (t.trim()) runs.push({ text: t, ...style });
          } else if (n.nodeType === 1) {
            if (isFigure(n)) { if (visible(n)) { figureEls.push(n); images.push({ ...rel(n.getBoundingClientRect()), idx: imgIndex++ }); } continue; }
            if (n.tagName === 'BR') { runs.push({ text: '\n', ...style }); continue; }
            if (!visible(n)) continue;
            const s = getComputedStyle(n);
            collect(n, {
              font: s.fontFamily, size: parseFloat(s.fontSize), weight: Number(s.fontWeight),
              italic: s.fontStyle === 'italic', color: rgb(s.color)?.hex ?? '000000',
              upper: s.textTransform === 'uppercase', spacing: parseFloat(s.letterSpacing) || 0,
              mono: /mono/i.test(s.fontFamily),
            });
          }
        }
      };
      collect(el, {
        font: cs.fontFamily, size: parseFloat(cs.fontSize), weight: Number(cs.fontWeight),
        italic: cs.fontStyle === 'italic', color: rgb(cs.color)?.hex ?? '000000',
        upper: cs.textTransform === 'uppercase', spacing: parseFloat(cs.letterSpacing) || 0,
        mono: /mono/i.test(cs.fontFamily),
      });
      if (runs.length) {
        // tighten the box to the actual glyph rects, so padding-heavy blocks
        // and vertically centred cells land where the text is
        const range = document.createRange(); range.selectNodeContents(el);
        const rr = range.getBoundingClientRect();
        const box = rr.width ? rel(rr) : rel(el.getBoundingClientRect());
        const lh = cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
        texts.push({
          ...box, runs, lineHeight: lh, align: cs.textAlign,
          bullet: cs.display === 'list-item' && cs.listStyleType !== 'none',
          padLeft: parseFloat(cs.paddingLeft) || 0,
        });
      }
      return;
    }
    for (const n of kids) if (n.nodeType === 1) walk(n);
  };
  walk(canvas);
  window.__figureEls = figureEls;
  const bg = rgb(getComputedStyle(canvas).backgroundColor)?.hex ?? 'FFFFFF';
  return { shapes, images, texts, bg, natW: parseFloat(getComputedStyle(canvas).width), natH: parseFloat(getComputedStyle(canvas).height) };
};

const fontName = (family, mono) => {
  if (mono) return 'Courier New';
  const first = family.split(',')[0].replace(/["']/g, '').trim();
  return first || 'Arial';
};

const build = async (browser, slug) => {
  const url = `${BASE}/poster/${slug}/landscape/`;
  const page = await browser.newPage({ viewport: { width: 2200, height: 1600 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // neutralise the on-screen scaler so screenshots come out at a known scale
  await page.addStyleTag({ content: '.poster-view-toggle{display:none!important}' });
  const data = await page.evaluate(extract);
  const pxToIn = SHEET_W_IN / data.natW;
  const ptOf = (px) => px * 0.75; // 96px/in → 72pt/in

  // figures: screenshot each at FIGURE_DPI
  const scaleNow = await page.evaluate(() => {
    const c = document.querySelector('.poster-canvas');
    return c.getBoundingClientRect().width / parseFloat(getComputedStyle(c).width);
  });
  const dsf = Math.min(4, Math.max(1, (FIGURE_DPI / 96) / scaleNow));
  const figPage = await browser.newPage({ viewport: { width: 2200, height: 1600 }, deviceScaleFactor: dsf });
  await figPage.goto(url, { waitUntil: 'networkidle' });
  await figPage.evaluate(() => document.fonts.ready);
  await figPage.addStyleTag({ content: '.poster-view-toggle{display:none!important}' });
  await figPage.evaluate(extract);
  const n = await figPage.evaluate(() => window.__figureEls.length);
  const figPngs = [];
  for (let i = 0; i < n; i++) {
    const h = await figPage.evaluateHandle((i) => window.__figureEls[i], i);
    const el = h.asElement();
    await el.scrollIntoViewIfNeeded();
    figPngs.push(await el.screenshot({ type: 'png', omitBackground: true }));
  }
  await figPage.close();

  const pres = new pptxgen();
  pres.defineLayout({ name: 'POSTER', width: SHEET_W_IN, height: SHEET_H_IN });
  pres.layout = 'POSTER';
  const meta = posters.find((p) => p.slug === slug);
  pres.title = meta?.title ?? slug;
  pres.author = meta?.authors ?? 'Sugam Panthi';
  const slide = pres.addSlide();
  slide.background = { color: data.bg };

  for (const s of [...data.shapes].sort((a, b) => a.layer - b.layer)) {
    const opts = {
      x: s.x * pxToIn, y: s.y * pxToIn, w: s.w * pxToIn, h: s.h * pxToIn,
      fill: s.fill ? { color: s.fill.hex, transparency: Math.round((1 - s.fill.alpha) * 100) } : { type: 'none' },
      line: s.line ? { color: s.line.hex, width: ptOf(s.line.w) } : { type: 'none' },
    };
    const minSide = Math.min(s.w, s.h);
    if (s.radius >= minSide / 2 - 0.01) slide.addShape(pres.ShapeType.ellipse, opts);
    else if (s.radius > 0) { opts.rectRadius = s.radius * pxToIn; slide.addShape(pres.ShapeType.roundRect, opts); }
    else slide.addShape(pres.ShapeType.rect, opts);
  }
  data.images.forEach((im) => {
    slide.addImage({
      data: 'image/png;base64,' + figPngs[im.idx].toString('base64'),
      x: im.x * pxToIn, y: im.y * pxToIn, w: im.w * pxToIn, h: im.h * pxToIn,
    });
  });
  for (const t of data.texts) {
    const runs = t.runs.map((r, i) => ({
      text: r.upper ? r.text.toUpperCase() : r.text,
      options: {
        fontFace: fontName(r.font, r.mono), fontSize: ptOf(r.size), bold: r.weight >= 600,
        italic: r.italic, color: r.color, charSpacing: r.spacing ? ptOf(r.spacing) : undefined,
        breakLine: r.text === '\n',
      },
    })).filter((r) => r.text !== '\n' || true);
    // merge explicit newlines into breakLine on the previous run
    const merged = [];
    for (const r of runs) {
      if (r.text === '\n') { if (merged.length) merged[merged.length - 1].options.breakLine = true; continue; }
      merged.push(r);
    }
    // Without Oswald installed, PowerPoint substitutes a wider face, so multi-
    // line boxes get shrink-to-fit and a little width slack. A single-line box
    // (a badge digit, a kicker) is left unwrapped so it can never collapse.
    const maxSize = Math.max(...t.runs.map((r) => r.size));
    const singleLine = t.h <= maxSize * t.lineHeight * 1.5 && t.w < 1.5 * 96;
    const slack = 1.01;
    const align = t.align === 'center' ? 'center' : t.align === 'right' || t.align === 'end' ? 'right' : 'left';
    const wIn = t.w * pxToIn * slack + 0.05;
    slide.addText(merged, {
      x: t.x * pxToIn - (align === 'center' ? (wIn - t.w * pxToIn) / 2 : 0), y: t.y * pxToIn, w: wIn, h: t.h * pxToIn,
      margin: 0, isTextBox: true, valign: 'top', wrap: !singleLine, align,
      lineSpacingMultiple: t.lineHeight, bullet: t.bullet ? { indent: ptOf(t.padLeft) || 18 } : false,
      fit: singleLine ? 'none' : 'shrink',
    });
  }
  await page.close();
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, `${slug}-landscape.pptx`);
  await pres.writeFile({ fileName: file });
  console.log(`${file}: ${data.texts.length} text boxes, ${data.shapes.length} shapes, ${data.images.length} figures`);
};

const browser = await chromium.launch();
try {
  for (const slug of slugs) await build(browser, slug);
} finally {
  await browser.close();
}

// Checks one deck in a headless browser (slides/README.md, "Check").
//
//   node slides/check.mjs <slug> [--base http://localhost:4321] [--no-prose]
//
// Needs the dev server (`pnpm dev`). For every slide, with all builds shown:
//   1. fails on any element outside the 1600x900 slide or clipped by its box;
//   2. saves a screenshot to slides/build/<slug>/NN.png (and NN-card-K.png for
//      each widened related-work card);
//   3. warns when a title is over 12 words or the body over 40 words, and fails
//      when a public slide names a submission venue (writing.md, section 7);
//   4. writes the slide text to slides/build/<slug>/text.md and runs prose-check
//      on it with slides/prose-check.toml. prose-check errors fail the check.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const flag = (name, dflt) => {
  const k = args.indexOf(name);
  return k >= 0 ? args[k + 1] : dflt;
};
if (!slug) {
  console.error('usage: node slides/check.mjs <slug> [--base URL] [--no-prose]');
  process.exit(2);
}
const base = flag('--base', 'http://localhost:4321').replace(/\/$/, '');
const prose = !args.includes('--no-prose');
const out = join(here, 'build', slug);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const TITLE_WORDS = 12;
const BODY_WORDS = 40;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const url = `${base}/slides/${slug}/`;
const res = await page.goto(url, { waitUntil: 'networkidle' });
if (!res || !res.ok()) {
  console.error(`could not open ${url} (${res && res.status()}); is the dev server running?`);
  process.exit(2);
}
await page.evaluate(() => document.fonts.ready);

const count = await page.evaluate(() => document.querySelectorAll('#stage .slide').length);
if (!count) {
  console.error(`${url}: no slides found (a draft deck shows slides only under astro dev)`);
  process.exit(2);
}

// Every element of the active slide that leaves the slide, or whose content is
// cut off by its own box.
const geometry = () => page.evaluate(() => {
  const slide = document.querySelector('#stage .slide.active');
  const box = slide.getBoundingClientRect();
  const problems = [];
  const name = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '';
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50);
    return `<${el.tagName.toLowerCase()}${cls}> "${text}"`;
  };
  for (const el of slide.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none') continue;
    if (r.left < box.left - 1 || r.top < box.top - 1 || r.right > box.right + 1 || r.bottom > box.bottom + 1) {
      problems.push(`outside the slide: ${name(el)}`);
      continue;
    }
    const clips = /(hidden|auto|scroll|clip)/.test(st.overflow + st.overflowX + st.overflowY);
    if (clips && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) {
      problems.push(`content cut off: ${name(el)} (${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight})`);
    }
  }
  // Report only the outermost element of a nested problem.
  return problems.filter((p, k) => problems.indexOf(p) === k);
});

const textOf = () => page.evaluate(() => {
  const slide = document.querySelector('#stage .slide.active');
  const title = slide.querySelector(':scope > h1, :scope > h2');
  const clone = slide.cloneNode(true);
  // Not slide prose: figures and diagrams, code, widened-card detail, the start hint.
  clone.querySelectorAll(':scope > .kicker, :scope > h1, :scope > h2, figure, svg, code, .more, .hint, [data-check-skip]').forEach((n) => n.remove());
  // Block elements become their own lines so prose-check sees one unit per block.
  clone.querySelectorAll('p, li, h3, dt, dd, div, figcaption, td, th, tr').forEach((n) => n.append('\n'));
  const body = (clone.textContent || '').split('\n').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  return {
    label: slide.getAttribute('aria-label') || '',
    devOnly: slide.hasAttribute('data-dev-only'),
    title: title ? title.textContent.replace(/\s+/g, ' ').trim() : '',
    body,
  };
});

// A venue named together with a submission word, on a slide the built site shows.
const VENUE = /\b(?:ACL|EMNLP|NAACL|EACL|AACL|COLING|NeurIPS|ICLR|ICML|COLM|AAAI|ARR)\b/;
const SUBMISSION = /\b(?:submi(?:t|ts|tted|tting|ssion)|under review|target(?:s|ing)?|deadline|theme track|special theme)\b/i;
const words = (s) => (s.match(/[A-Za-z0-9][\w'’.%-]*/g) || []).length;
let failures = 0;
const warnings = [];
const md = [`# ${slug}`, ''];
const pad = (n) => String(n).padStart(2, '0');

for (let n = 0; n < count; n++) {
  await page.evaluate((k) => {
    const deck = window.__deck;
    if (deck) deck.showAll(k);
    else { location.hash = `#${k + 1}`; }
  }, n);
  await page.waitForTimeout(450);
  const tag = `slide ${n + 1}`;

  for (const p of await geometry()) { console.log(`FAIL ${tag}: ${p}`); failures++; }
  await page.screenshot({ path: join(out, `${pad(n + 1)}.png`) });

  const t = await textOf();
  if (t.title && words(t.title) > TITLE_WORDS) warnings.push(`${tag}: title has ${words(t.title)} words (at most ${TITLE_WORDS}): "${t.title}"`);
  const bodyWords = t.body.reduce((s, line) => s + words(line), 0);
  if (bodyWords > BODY_WORDS) warnings.push(`${tag}: body has ${bodyWords} words (at most ${BODY_WORDS}, figures and code not counted)`);
  const all = [t.title, ...t.body].join(' ');
  if (!t.devOnly && VENUE.test(all) && SUBMISSION.test(all)) {
    console.log(`FAIL ${tag}: names a submission venue on a public slide; make it <Slide devOnly>`);
    failures++;
  }
  md.push(`## ${t.title || t.label}${t.devOnly ? ' (dev only)' : ''}`, '');
  for (const line of t.body) md.push(line, '');

  // Widened related-work cards.
  const cards = await page.$$('#stage .slide.active .card[data-expandable]');
  for (let c = 0; c < cards.length; c++) {
    await cards[c].dblclick();
    await page.waitForTimeout(1000);
    for (const p of await geometry()) { console.log(`FAIL ${tag}, card ${c + 1} widened: ${p}`); failures++; }
    await page.screenshot({ path: join(out, `${pad(n + 1)}-card-${c + 1}.png`) });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
  }
}
await browser.close();

for (const w of warnings) console.log(`warn ${w}`);
const textFile = join(out, 'text.md');
writeFileSync(textFile, md.join('\n'));

if (prose) {
  try {
    const report = execFileSync('prose-check', ['--config', join(here, 'prose-check.toml'), '--no-stats', textFile], { encoding: 'utf8' });
    if (report.trim()) console.log(report.trim());
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('prose-check is not installed: uv tool install git+https://github.com/Vein05/prose-check');
      process.exit(2);
    }
    console.log((e.stdout || '').trim());
    console.log('FAIL prose-check reported errors');
    failures++;
  }
}

console.log(`${slug}: ${count} slides, ${failures} failures, ${warnings.length} warnings, screenshots in ${out}`);
process.exit(failures ? 1 : 0);

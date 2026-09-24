import React, { useMemo } from 'react';
import rough from 'roughjs';

// Hand-drawn (Rough.js) diagrams for the LAPSE dataset-construction post.
// Rough.js only generates path data here; React renders the paths so every
// stroke uses the site's theme variables. Fixed seeds keep the wobble stable
// between server and client renders. All numbers come from the LAPSE repo:
// tools/build_stimuli_v2.py, research/PILOT_SPEC_v2.md,
// data/witness_*_check.json, research/SMOKE_V2_2026-08-12.md and
// research/PLACEBO_V2_2026-08-27.md.

const C = {
  ink: 'rgb(var(--color-ink-dark))',
  muted: 'rgb(var(--color-ink-muted))',
  blue: 'rgb(var(--color-ink-blue))',
  red: 'rgb(var(--color-ink-red))',
  border: 'rgb(var(--color-border-paper))',
  surface: 'rgb(var(--color-paper-surface))',
  soft: 'rgb(var(--color-blue-soft))',
};
const col = (k) => (k && C[k]) || k || 'none';
const FONT = 'Oswald, ui-monospace, SFMono-Regular, monospace';

const gen = rough.generator();

// Returns a sketch pen: each call draws one rough shape with the next seed.
const makePen = (seedBase) => {
  let seed = seedBase;
  const base = { roughness: 1.1, bowing: 0.8, strokeWidth: 1.4, stroke: 'ink' };
  const draw = (drawable) =>
    gen.toPaths(drawable).map((p) => ({
      d: p.d,
      stroke: col(p.stroke),
      strokeWidth: p.strokeWidth,
      fill: col(p.fill),
    }));
  const o = (opts) => ({ ...base, ...opts, seed: seed++ });
  return {
    rect: (x, y, w, h, opts = {}) => draw(gen.rectangle(x, y, w, h, o(opts))),
    line: (x1, y1, x2, y2, opts = {}) => draw(gen.line(x1, y1, x2, y2, o(opts))),
    circle: (x, y, d, opts = {}) => draw(gen.circle(x, y, d, o(opts))),
    path: (d, opts = {}) => draw(gen.path(d, o(opts))),
    arrow: (x1, y1, x2, y2, opts = {}) => {
      const a = Math.atan2(y2 - y1, x2 - x1);
      const h = 9;
      const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)];
      const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
      return [
        ...draw(gen.line(x1, y1, x2, y2, o(opts))),
        ...draw(gen.linearPath([p1, [x2, y2], p2], o({ ...opts, roughness: 0.6 }))),
      ];
    },
  };
};

const Paths = ({ paths }) => (
  <g>
    {paths.map((p, i) => (
      <path key={i} d={p.d} style={{ stroke: p.stroke, fill: p.fill }}
        strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </g>
);

const T = ({ x, y, children, size = 14, color = 'ink', weight = 400, anchor = 'start', ...rest }) => (
  <text x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={weight}
    textAnchor={anchor} style={{ fill: col(color) }} {...rest}>
    {children}
  </text>
);

const Card = ({ kicker, title, caption, children, wide = false }) => (
  <figure className={`my-10 mx-auto border border-border-paper bg-paper-surface ${wide ? 'max-w-5xl' : 'max-w-[720px]'}`}>
    <figcaption className="px-5 pt-4">
      <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-ink-muted mb-1">{kicker}</div>
      <div className="text-base font-bold text-ink-dark leading-snug">{title}</div>
    </figcaption>
    <div className={`overflow-x-auto px-3 py-3 ${wide ? '[&>svg]:min-w-[960px]' : '[&>svg]:min-w-[720px]'}`}>{children}</div>
    <div className="px-5 pb-4 text-[13px] leading-relaxed text-ink-muted border-t border-border-paper pt-3">
      {caption}
    </div>
  </figure>
);

// --- Overview: the whole pipeline in one strip ------------------------------
const STAGES = [
  { n: 0, name: 'Seed', color: 'ink', lines: ['15 prompts by hand', 'one Pasadena template', 'temporary vs lasting'] },
  { n: 1, name: 'Probe', color: 'red', lines: ['66 calls, read by eye', '3 rounds: 12, 9, 45', 'found 3 problems'] },
  { n: 2, name: 'Design', color: 'ink', lines: ['one check per problem', 'key line in 3 forms', '8 situations, no leaky words'] },
  { n: 3, name: 'Build', color: 'ink', lines: ['5 slots per item', 'dates from --eval-date', 'invented names'] },
  { n: 4, name: 'Check', color: 'ink', lines: ['pairs byte-identical', 'names: corpus + web', 'v1 rebuilds exactly'] },
  { n: 5, name: 'Smoke test', color: 'red', lines: ['289 calls, $0.04', 'every answer read', '2 scorer bugs fixed'] },
  { n: 6, name: 'Freeze + run', color: 'blue', lines: ['spec + generator frozen', '6,008 calls per model', 'names scanned after'] },
];

const OverviewDiagram = () => {
  const colW = 176, gap = 8, top = 20;
  const cx = (i) => 20 + i * (colW + gap) + colW / 2;
  const paths = useMemo(() => {
    const p = makePen(211);
    const out = [];
    STAGES.forEach((st, i) => {
      const x = cx(i) - colW / 2;
      out.push(...p.rect(x, top + 26, colW, 250, { stroke: st.color, strokeWidth: st.color === 'ink' ? 1.3 : 1.8 }));
      out.push(...p.circle(cx(i), top + 26, 34, { stroke: st.color, fill: 'surface', fillStyle: 'solid', strokeWidth: 1.8 }));
      if (i < STAGES.length - 1) out.push(...p.arrow(x + colW - 6, top + 150, x + colW + gap + 10, top + 150, { stroke: 'muted', strokeWidth: 1.8 }));
      // glyphs, centred at gy
      const g = cx(i), gy = top + 118;
      if (st.n === 0) { // page of hand-written lines
        out.push(...p.rect(g - 28, gy - 30, 56, 62, { stroke: 'ink' }));
        [-16, -4, 8, 20].forEach((dy, k) => out.push(...p.line(g - 18, gy + dy, g + (k === 3 ? 4 : 18), gy + dy, { stroke: k === 1 ? 'red' : 'muted' })));
      }
      if (st.n === 1) { // speech bubble with a question
        out.push(...p.rect(g - 34, gy - 26, 68, 42, { stroke: 'red' }));
        out.push(...p.line(g - 14, gy + 16, g - 24, gy + 30, { stroke: 'red' }));
        out.push(...p.line(g - 24, gy + 30, g - 2, gy + 16, { stroke: 'red' }));
      }
      if (st.n === 2) { // confound box -> control box
        out.push(...p.rect(g - 60, gy - 18, 44, 34, { stroke: 'red' }));
        out.push(...p.arrow(g - 12, gy - 1, g + 12, gy - 1, { stroke: 'muted' }));
        out.push(...p.rect(g + 16, gy - 18, 44, 34, { stroke: 'blue' }));
      }
      if (st.n === 3) { // stack of item cards
        [16, 8, 0].forEach((d) => out.push(...p.rect(g - 32 + d, gy - 24 + d, 56, 38, { stroke: 'ink', fill: 'surface', fillStyle: 'solid' })));
        out.push(...p.line(g - 8, gy + 2, g + 34, gy + 2, { stroke: 'red', strokeWidth: 2 }));
        out.push(...p.line(g - 8, gy + 10, g + 26, gy + 10, { stroke: 'muted' }));
      }
      if (st.n === 4) { // three check marks
        [-20, 0, 20].forEach((dy) => {
          out.push(...p.line(g - 40, gy + dy, g - 34, gy + dy + 6, { stroke: 'blue', strokeWidth: 2 }));
          out.push(...p.line(g - 34, gy + dy + 6, g - 24, gy + dy - 6, { stroke: 'blue', strokeWidth: 2 }));
          out.push(...p.line(g - 14, gy + dy, g + 40, gy + dy, { stroke: 'muted' }));
        });
      }
      if (st.n === 5) { // magnifier
        out.push(...p.circle(g - 8, gy - 6, 40, { stroke: 'red', strokeWidth: 1.8 }));
        out.push(...p.line(g + 7, gy + 9, g + 30, gy + 30, { stroke: 'red', strokeWidth: 3 }));
      }
      if (st.n === 6) { // padlock
        out.push(...p.rect(g - 26, gy - 6, 52, 38, { stroke: 'blue', strokeWidth: 1.8 }));
        out.push(...p.path(`M${g - 15},${gy - 6} V${gy - 20} A15,15 0 0 1 ${g + 15},${gy - 20} V${gy - 6}`, { stroke: 'blue', strokeWidth: 1.8, roughness: 0.6 }));
        out.push(...p.circle(g, gy + 12, 7, { stroke: 'blue', fill: 'blue', fillStyle: 'solid', roughness: 0.4 }));
      }
    });
    // feedback loop: probe and smoke-test mistakes flow back into design
    const yb = top + 300;
    out.push(...p.line(cx(5), top + 278, cx(5), yb, { stroke: 'red', strokeLineDash: [6, 5] }));
    out.push(...p.line(cx(5), yb, cx(2), yb, { stroke: 'red', strokeLineDash: [6, 5] }));
    out.push(...p.arrow(cx(2), yb, cx(2), top + 282, { stroke: 'red' }));
    out.push(...p.line(cx(1), top + 278, cx(1), yb, { stroke: 'red', strokeLineDash: [6, 5] }));
    out.push(...p.line(cx(1), yb, cx(2), yb, { stroke: 'red', strokeLineDash: [6, 5] }));
    return out;
  }, []);
  return (
    <Card
      wide
      kicker="Building LAPSE: the whole pipeline"
      title="From 15 hand-written prompts to 6,008 generated calls per model"
      caption="The seven steps in this post, from 2026-08-11 to the full run. Red marks the steps where reading model output showed me a mistake; the dashed line shows each fix going into the design before the freeze."
    >
      <svg viewBox="0 0 1308 350" width="100%" height="auto" role="img"
        aria-label="Seven steps left to right: seed prompts, probe, design, build, check, smoke test, freeze and run, with mistakes from the probe and smoke test looping back into design.">
        <Paths paths={paths} />
        {STAGES.map((st, i) => (
          <g key={st.name}>
            <T x={cx(i)} y={top + 33} size={20} anchor="middle" weight={700} color={st.color}>{st.n}</T>
            <T x={cx(i)} y={top + 72} size={20} anchor="middle" weight={700} color={st.color}>{st.name}</T>
            {st.n === 1 && <T x={cx(i)} y={top + 117} size={22} anchor="middle" weight={700} color="red">?</T>}
            {st.lines.map((l, j) => (
              <T key={l} x={cx(i)} y={top + 196 + j * 24} size={16} anchor="middle" color={j === 0 ? 'ink' : 'muted'}>{l}</T>
            ))}
          </g>
        ))}
        <T x={(cx(2) + cx(5)) / 2} y={top + 322} size={16} anchor="middle" color="red" weight={600}>fixes went into the design before the freeze</T>
      </svg>
    </Card>
  );
};

// --- 0. The probe ladder: small runs before the dataset --------------------
const LADDER = [
  ['Probe round 1', '12 calls, one per variation', 'Models hedged, but “this week” and “my sister’s place” gave the answer away', 'red'],
  ['Probe round 2', '9 calls, one per variation', 'staying > living > live gradient on DeepSeek, still with the sister', 'red'],
  ['Probe round 3', '45 calls, neutral content', 'The gradient vanished, so it came from “sister’s place”', 'red'],
  ['Pilot', '2,000 calls, 1 model', 'First controlled rates, 5 situations, 20 names each', 'ink'],
  ['LAPSE v2', '6,008 calls per model', '8 situations, frozen generator, full model table', 'blue'],
];

const LadderDiagram = () => {
  const rowH = 64;
  const paths = useMemo(() => {
    const p = makePen(191);
    const out = [];
    LADDER.forEach(([, , , color], i) => {
      const y = 18 + i * rowH;
      out.push(...p.rect(20, y, 190, 48, { stroke: color }));
      out.push(...p.rect(226, y, 474, 48, { stroke: 'border' }));
      if (i < LADDER.length - 1) out.push(...p.arrow(115, y + 50, 115, y + rowH - 2, { stroke: 'muted' }));
    });
    return out;
  }, []);
  return (
    <Card
      kicker="Building LAPSE: before the dataset"
      title="66 probe calls found the problems the dataset had to rule out"
      caption="Three probe rounds on 2026-08-11 (12, 9 and 45 calls, three models per round, temperature 0, judged by eye), then the pilot and v2. Each probe row is one call per variation."
    >
      <svg viewBox={`0 0 720 ${18 + LADDER.length * rowH}`} width="100%" height="auto" role="img"
        aria-label="Five steps from three small probe rounds to a 2,000-call pilot to the 6,008-call-per-model benchmark.">
        <Paths paths={paths} />
        {LADDER.map(([a, b, c, color], i) => {
          const y = 18 + i * rowH;
          return (
            <g key={a}>
              <T x={115} y={y + 21} size={15} anchor="middle" weight={600} color={color}>{a}</T>
              <T x={115} y={y + 39} size={13} anchor="middle" color="muted">{b}</T>
              <T x={240} y={y + 29} size={14}>{c}</T>
            </g>
          );
        })}
      </svg>
    </Card>
  );
};

// --- 1. Building blocks of one test item ------------------------------------
// A real v2 item: dev split, lodging frame, cluster 3, stale gap, behavioral
// arm, original carrier (data/stimuli_v2.jsonl, --eval-date 2026-08-11).
// Key-line piece positions are measured from the rendered text.
const KEY = { y: 198, size: 22, pieces: [
  { text: "I'm staying", box: 'red' },
  { text: 'at the' },
  { text: 'Larkspur Residences', box: 'blue' },
  { text: 'on Fifth Street.' },
] };
const KEY_X = [52, 168, 233, 432];
const KEY_W = [95, 47, 181, 119];

const Hl = ({ color, children, weight = 600 }) => (
  <tspan style={{ fill: col(color) }} fontWeight={weight}>{children}</tspan>
);

const AtomsDiagram = () => {
  const paths = useMemo(() => {
    const p = makePen(17);
    const out = [];
    // gap timeline
    out.push(...p.line(70, 44, 650, 44, { stroke: 'blue', strokeWidth: 1.6 }));
    out.push(...p.circle(70, 44, 10, { stroke: 'ink', fill: 'ink', fillStyle: 'solid', roughness: 0.5 }));
    out.push(...p.circle(650, 44, 10, { stroke: 'ink', fill: 'ink', fillStyle: 'solid', roughness: 0.5 }));
    // old chat card
    out.push(...p.rect(20, 86, 680, 196, { stroke: 'ink' }));
    out.push(...p.rect(568, 98, 118, 26, { stroke: 'ink', strokeWidth: 1.1 }));
    // form and witness boxes + pointers
    KEY.pieces.forEach((pc, k) => {
      if (!pc.box) return;
      out.push(...p.rect(KEY_X[k] - 6, KEY.y - 24, KEY_W[k] + 12, 34, { stroke: pc.box, strokeWidth: 1.8 }));
    });
    out.push(...p.arrow(KEY_X[0] + 56, 156, KEY_X[0] + 47, KEY.y - 27, { stroke: 'red' }));
    out.push(...p.arrow(KEY_X[2] + 99, 156, KEY_X[2] + 90, KEY.y - 27, { stroke: 'blue' }));
    // today's request card
    out.push(...p.rect(20, 296, 680, 92, { stroke: 'muted', strokeLineDash: [6, 5] }));
    out.push(...p.rect(560, 306, 126, 26, { stroke: 'ink', strokeWidth: 1.1 }));
    // bottom strip: matched items, what varies
    out.push(...p.rect(20, 412, 408, 150, { stroke: 'red' }));
    out.push(...p.rect(448, 412, 252, 150, { stroke: 'ink' }));
    return out;
  }, []);
  return (
    <Card
      kicker="Building LAPSE: the building blocks"
      title="One test item is an old dated chat plus a request that depends on it"
      caption="A real item from the development set (lodging, 245-day gap, a task request), built with --eval-date 2026-08-11. Red and blue mark the two slots the builder fills in the key line."
    >
      <svg viewBox="0 0 720 578" width="100%" height="auto" role="img"
        aria-label="An old chat dated 2025-12-09 in which the user says I'm staying at the Larkspur Residences on Fifth Street, with the verb form and the invented name marked, 245 days before a request for a car-service pickup note. Below, the three versions of the key line and what varies across the dataset.">
        <Paths paths={paths} />
        <T x={70} y={24} size={14} anchor="middle" weight={600}>2025-12-09</T>
        <T x={70} y={70} size={14} anchor="middle" color="muted">the old chat</T>
        <T x={650} y={24} size={14} anchor="middle" weight={600}>2026-08-11</T>
        <T x={650} y={70} size={14} anchor="middle" color="muted">today (eval date)</T>
        <T x={360} y={36} size={14} anchor="middle" color="blue" weight={600}>245 days later</T>

        <T x={36} y={114} size={14} color="muted">[Session dated 2025-12-09]</T>
        <T x={627} y={116} size={14} anchor="middle">situation: lodging</T>
        <T x={36} y={140} size={14} color="muted">User: hey! quick life update —</T>
        <T x={KEY_X[0] + 60} y={162} size={14} color="red" weight={600}>verb form</T>
        <T x={KEY_X[2] + 103} y={162} size={14} color="blue" weight={600}>invented name</T>
        {KEY.pieces.map((pc, k) => (
          <T key={pc.text} x={KEY_X[k]} y={KEY.y} size={KEY.size} weight={pc.box ? 600 : 400}>{pc.text}</T>
        ))}
        <T x={36} y={234} size={14} color="muted">also, any podcast recommendations for my commute?</T>
        <T x={36} y={262} size={14} color="muted">Assistant: Nice! For podcasts, try 99% Invisible or Radiolab — both great for commutes.</T>
        <T x={684} y={234} size={14} anchor="end" color="muted">the rest is identical in every version</T>

        <T x={36} y={322} size={14} color="muted" weight={600} letterSpacing="0.12em">TODAY, THE USER ASKS</T>
        <T x={623} y={324} size={14} anchor="middle">request: a task</T>
        <T x={36} y={350} size={15}>write a brief pickup request for the car service for Friday morning —</T>
        <T x={36} y={372} size={15}>it has to state the pickup address.</T>

        <T x={36} y={438} size={14} color="red" weight={600} letterSpacing="0.1em">MATCHED ITEMS: ONLY THE RED WORDS CHANGE</T>
        <T x={36} y={472} size={14} color="muted">progressive</T>
        <T x={126} y={472} size={14}><Hl color="red">I'm staying</Hl> at the Larkspur Residences …</T>
        <T x={36} y={504} size={14} color="muted">simple</T>
        <T x={126} y={504} size={14}><Hl color="red">I live</Hl> at the Larkspur Residences …</T>
        <T x={36} y={536} size={14} color="muted">bounded</T>
        <T x={126} y={536} size={14}><Hl color="red">I'm staying</Hl> at the Larkspur … <Hl color="red">until December</Hl></T>

        <T x={464} y={438} size={14} weight={600} letterSpacing="0.1em">ACROSS THE DATASET</T>
        <T x={464} y={470} size={14}>8 situations</T>
        <T x={464} y={496} size={14}>3 main verb forms</T>
        <T x={464} y={522} size={14}>6 time gaps</T>
        <T x={464} y={548} size={14}>5 kinds of request</T>
      </svg>
    </Card>
  );
};

// --- 2. Dates relative to the evaluation date -------------------------------
// [gap, session offset, bound offset, session date, bound label] in days
// relative to --eval-date 2026-08-11. A bar runs from the session to the first
// day of the bound month (the builder's convention); the literal v1 "until
// December" said on 2025-12-09 is drawn to the end of December.
const TIMELINE = [
  ['stale_long', -425, -344, '2025-06-12', 'until September'],
  ['stale', -245, -222, '2025-12-09', 'until December (v1 literal)'],
  ['expired_soon', -94, -10, '2026-05-09', 'until August'],
  ['boundary', -60, 21, '2026-06-12', 'until September'],
  ['near', -42, 21, '2026-06-30', 'until September'],
  ['fresh', -2, 112, '2026-08-09', 'until December'],
];

const TimelineDiagram = () => {
  const x0 = 250, x1 = 700, lo = -440, hi = 130;
  const X = (d) => x0 + ((d - lo) / (hi - lo)) * (x1 - x0);
  const rowY = (i) => 64 + i * 40;
  const paths = useMemo(() => {
    const p = makePen(41);
    const out = [];
    TIMELINE.forEach(([, s, b], i) => {
      const y = rowY(i);
      const ok = b > 0;
      out.push(...p.rect(X(s), y - 9, X(b) - X(s), 18, {
        stroke: ok ? 'blue' : 'red', fill: ok ? 'blue' : 'red', fillStyle: 'hachure', hachureGap: 5, fillWeight: 0.7, roughness: 0.9,
      }));
      out.push(...p.circle(X(s), y, 9, { stroke: 'ink', fill: 'ink', fillStyle: 'solid', roughness: 0.5 }));
    });
    out.push(...p.line(X(0), 36, X(0), rowY(TIMELINE.length - 1) + 22, { stroke: 'ink', strokeWidth: 2 }));
    out.push(...p.arrow(x0, rowY(TIMELINE.length - 1) + 34, x1 + 6, rowY(TIMELINE.length - 1) + 34, { stroke: 'muted' }));
    return out;
  }, []);
  const axisY = rowY(TIMELINE.length - 1) + 34;
  return (
    <Card
      kicker="Building LAPSE: dates"
      title="Every session date is an offset from the day you run the benchmark"
      caption="One lodging item built with --eval-date 2026-08-11. Each bar runs from the session (dot) to the start of the bound month. Red bounds have passed by the eval date; blue ones have not."
    >
      <svg viewBox={`0 0 720 ${axisY + 30}`} width="100%" height="auto" role="img"
        aria-label="Six rows, one per gap, each a bar from the session date to the bound month; stale_long, stale and expired_soon end before the evaluation date, boundary, near and fresh extend past it.">
        <Paths paths={paths} />
        <T x={X(0)} y={26} size={13} anchor="middle" weight={600}>EVAL DATE 2026-08-11</T>
        {TIMELINE.map(([gap, s, b, date, bound], i) => {
          const y = rowY(i);
          return (
            <g key={gap}>
              <T x={20} y={y - 2} size={14} weight={600} color={b > 0 ? 'blue' : 'red'}>{gap}</T>
              <T x={20} y={y + 14} size={12} color="muted">{`${date}, ${bound}`}</T>
            </g>
          );
        })}
        <T x={X(-425)} y={axisY + 20} size={12} color="muted" anchor="middle">−425d</T>
        <T x={X(-245)} y={axisY + 20} size={12} color="muted" anchor="middle">−245d</T>
        <T x={X(-60)} y={axisY + 20} size={12} color="muted" anchor="middle">−60d</T>
        <T x={X(112)} y={axisY + 20} size={12} color="muted" anchor="middle">+112d</T>
      </svg>
    </Card>
  );
};

// --- 3. Confound -> control map --------------------------------------------
const CONFOUNDS = [
  ['The model already knows the place', 'Invented names, checked in two web-scale corpora'],
  ['“Staying” and “live” are different verbs', 'Same-verb pairs: “I’m living at” vs “I live at”'],
  ['The model always just proceeds', 'The “until December” version must change behavior'],
  ['The model does not know the rule', 'Ask the rule directly in a separate request'],
  ['The wrapper text hints at time', 'Ban “now”, “still”, “recently” and similar in wrappers'],
  ['The scorer counts any rewrite as loss', 'Hand-read the smoke test, lock fixes as tests'],
];

const ConfoundDiagram = () => {
  const rowH = 52;
  const paths = useMemo(() => {
    const p = makePen(71);
    const out = [];
    CONFOUNDS.forEach((_, i) => {
      const y = 44 + i * rowH;
      out.push(...p.rect(20, y, 270, 38, { stroke: 'red' }));
      out.push(...p.arrow(296, y + 19, 352, y + 19, { stroke: 'muted' }));
      out.push(...p.rect(360, y, 340, 38, { stroke: 'blue', fill: 'soft', fillStyle: 'hachure', hachureGap: 9, fillWeight: 0.5 }));
    });
    return out;
  }, []);
  return (
    <Card
      kicker="Building LAPSE: controls"
      title="Each design choice rules out one other explanation"
      caption="A conceptual map with no measured rates. Left: other reasons “I'm staying at X” could become “Lives at X”. Right: the part of the dataset that handles each one."
    >
      <svg viewBox={`0 0 720 ${44 + CONFOUNDS.length * rowH + 4}`} width="100%" height="auto" role="img"
        aria-label="Six alternative explanations on the left, each linked to the dataset control that rules it out on the right.">
        <T x={20} y={26} size={13} color="red" weight={600}>COULD ALSO EXPLAIN IT</T>
        <T x={360} y={26} size={13} color="blue" weight={600}>WHAT THE DATASET DOES</T>
        <Paths paths={paths} />
        {CONFOUNDS.map(([a, b], i) => {
          const y = 44 + i * rowH + 24;
          return (
            <g key={a}>
              <T x={32} y={y} size={14}>{a}</T>
              <T x={372} y={y} size={14}>{b}</T>
            </g>
          );
        })}
      </svg>
    </Card>
  );
};

// --- 4. Witness-name funnel -------------------------------------------------
const FUNNEL = [
  { w: 660, label: 'Write 60 invented names for the three new templates', note: 'maker, college and project names, style-matched to v1', color: 'ink' },
  { w: 580, label: 'Count exact matches in RedPajama and Dolma (infini-gram)', note: 'limit 5: Thornbeck College had 88 and 166, Osperling had 6', color: 'red' },
  { w: 500, label: 'Search the web in context', note: 'rotated Corvain (a real person), Ardenfall (a game), Vexhall (an art series)', color: 'red' },
  { w: 420, label: 'After the runs: scan answers for other cases’ names', note: '7 hits in 3,730,776 pairs, all real car brands', color: 'blue' },
];

const FunnelDiagram = () => {
  const paths = useMemo(() => {
    const p = makePen(101);
    const out = [];
    FUNNEL.forEach((s, i) => {
      const x = (720 - s.w) / 2;
      const y = 20 + i * 82;
      out.push(...p.rect(x, y, s.w, 60, { stroke: s.color }));
      if (i < FUNNEL.length - 1) out.push(...p.arrow(360, y + 62, 360, y + 80, { stroke: 'muted' }));
    });
    return out;
  }, []);
  return (
    <Card
      kicker="Building LAPSE: invented names"
      title="Names went through two checks before the run and one scan after it"
      caption="Corpus and web checks from 2026-08-12; post-run scan from 2026-08-27 across seven models. The v1 templates kept their frozen names, some of them real."
    >
      <svg viewBox="0 0 720 350" width="100%" height="auto" role="img"
        aria-label="Four stages: write 60 names, corpus counts, web search, and a post-run scan that found 7 hits in 3.7 million pairs.">
        <Paths paths={paths} />
        {FUNNEL.map((s, i) => {
          const y = 20 + i * 82;
          return (
            <g key={s.label}>
              <T x={360} y={y + 26} size={14} anchor="middle" weight={600} color={s.color}>{s.label}</T>
              <T x={360} y={y + 46} size={13} anchor="middle" color="muted">{s.note}</T>
            </g>
          );
        })}
      </svg>
    </Card>
  );
};

// --- 5. The nested grid -----------------------------------------------------
const GRID = [
  ['PREREGISTERED TESTS', 'red', [
    ['task, 2 days + 245 days', 960],
    ['task, 60 days', 480],
    ['other openings, memory notes', 400],
    ['memory notes, 245 days', 256],
    ['memory notes, 60 days', 256],
    ['memory notes, 2-day check', 128],
    ['ask the rule directly', 96],
  ]],
  ['SECONDARY', 'blue', [
    ['forced choice: send or check', 960],
    ['notes-then-use chains', 768],
    ['other openings, task', 160],
    ['other openings, 2-day check', 80],
  ]],
  ['EXPLORATORY', 'muted', [
    ['all six time gaps', 1080],
    ['“I’ve …” forms', 240],
    ['same-verb and subject items', 144],
  ]],
];

const GridDiagram = () => {
  const barX = 300, scale = 330 / 1080, rowH = 24;
  const layout = useMemo(() => {
    let y = 30;
    const rows = [];
    GRID.forEach(([tier, color, items]) => {
      rows.push({ kind: 'head', y, tier, color, total: items.reduce((s, [, n]) => s + n, 0) });
      y += 24;
      items.forEach(([label, n]) => { rows.push({ kind: 'row', y, label, n, color }); y += rowH; });
      y += 12;
    });
    return { rows, h: y + 8 };
  }, []);
  const paths = useMemo(() => {
    const p = makePen(131);
    return layout.rows.filter((r) => r.kind === 'row').flatMap((r) =>
      p.rect(barX, r.y - 14, Math.max(r.n * scale, 6), 16, {
        stroke: r.color, fill: r.color, fillStyle: 'hachure', hachureGap: 5, fillWeight: 0.8, roughness: 0.9,
      }));
  }, [layout]);
  return (
    <Card
      kicker="Building LAPSE: the grid"
      title="6,008 calls per model; axes are crossed only where a test needs them"
      caption="Calls per model by component, from the frozen spec. Crossing all seven variables would take about 645,000. The 768 notes-then-use calls include 512 second steps built from each model's own notes."
    >
      <svg viewBox={`0 0 720 ${layout.h}`} width="100%" height="auto" role="img"
        aria-label="Bar sketch of calls per component, grouped into preregistered (2,576), secondary (1,968) and exploratory (1,464).">
        <Paths paths={paths} />
        {layout.rows.map((r) => r.kind === 'head' ? (
          <T key={r.tier} x={20} y={r.y} size={13} weight={600} color={r.color}>
            {`${r.tier}: ${r.total.toLocaleString('en-US')}`}
          </T>
        ) : (
          <g key={r.label}>
            <T x={286} y={r.y} size={14} anchor="end">{r.label}</T>
            <T x={barX + r.n * scale + 8} y={r.y} size={14} weight={600}>{r.n.toLocaleString('en-US')}</T>
          </g>
        ))}
      </svg>
    </Card>
  );
};

// --- 6. Gates from template to run -----------------------------------------
const STEPS = [
  ['Write templates', '8 situations, 3 verb forms'],
  ['Build', 'deterministic, --eval-date required'],
  ['Audit', '6 checks, 79 tests'],
  ['Smoke test', '289 calls, $0.04, all read'],
  ['Freeze', 'spec + generator v2.0.1'],
  ['Full run', '6,008 calls per model'],
];

const GatesDiagram = () => {
  const bw = 200, bh = 62;
  const pos = (i) => ({ x: 20 + (i % 3) * 240, y: i < 3 ? 34 : 184 });
  const paths = useMemo(() => {
    const p = makePen(161);
    const out = [];
    STEPS.forEach((_, i) => {
      const { x, y } = pos(i);
      const color = i === 3 ? 'red' : i === 5 ? 'blue' : 'ink';
      out.push(...p.rect(x, y, bw, bh, { stroke: color }));
    });
    out.push(...p.arrow(222, 65, 258, 65, { stroke: 'muted' }));
    out.push(...p.arrow(462, 65, 498, 65, { stroke: 'muted' }));
    out.push(...p.arrow(600, 98, 120, 182, { stroke: 'muted' }));
    out.push(...p.arrow(222, 215, 258, 215, { stroke: 'muted' }));
    out.push(...p.arrow(462, 215, 498, 215, { stroke: 'muted' }));
    // loop: smoke test sends fixes back to the scorer before freeze
    out.push(...p.rect(20, 276, 200, 46, { stroke: 'red', strokeLineDash: [5, 4] }));
    out.push(...p.arrow(120, 248, 120, 274, { stroke: 'red' }));
    out.push(...p.arrow(222, 300, 330, 250, { stroke: 'red' }));
    return out;
  }, []);
  return (
    <Card
      kicker="Building LAPSE: gates"
      title="I read all 289 smoke-test answers before freezing the build"
      caption="The v2 build on 2026-08-12. The smoke test ran DeepSeek V4 Flash on one development-set item of each new kind; reading its answers found two scorer bugs, which became regression tests."
    >
      <svg viewBox="0 0 720 336" width="100%" height="auto" role="img"
        aria-label="Six steps from templates to full run, with the smoke test feeding two scorer fixes back before the freeze.">
        <Paths paths={paths} />
        {STEPS.map(([a, b], i) => {
          const { x, y } = pos(i);
          const color = i === 3 ? 'red' : i === 5 ? 'blue' : 'ink';
          return (
            <g key={a}>
              <T x={x + bw / 2} y={y + 26} size={15} anchor="middle" weight={600} color={color}>{a}</T>
              <T x={x + bw / 2} y={y + 46} size={13} anchor="middle" color="muted">{b}</T>
            </g>
          );
        })}
        <T x={120} y={298} size={13} anchor="middle" color="red" weight={600}>2 scorer fixes</T>
        <T x={120} y={314} size={12} anchor="middle" color="muted">+6 regression tests</T>
      </svg>
    </Card>
  );
};

const SyntheticDataDiagram = ({ type }) => {
  if (type === 'synth-overview') return <OverviewDiagram />;
  if (type === 'synth-ladder') return <LadderDiagram />;
  if (type === 'synth-atoms') return <AtomsDiagram />;
  if (type === 'synth-timeline') return <TimelineDiagram />;
  if (type === 'synth-confounds') return <ConfoundDiagram />;
  if (type === 'synth-witness-funnel') return <FunnelDiagram />;
  if (type === 'synth-grid') return <GridDiagram />;
  if (type === 'synth-gates') return <GatesDiagram />;
  return null;
};

export default SyntheticDataDiagram;

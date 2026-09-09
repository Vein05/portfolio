import { useEffect, useMemo, useRef, useState } from "react";

// Three peaks, one per research theme. Each stop is a paper, post, or project
// on a switchback trail up the peak. Hover/focus a stop for a short card.
// Geometry is generated from the data below; ls forces a label side.

const RANGES = [
  {
    name: "Tool agents", span: "2026–now", spread: 0.7, rise: 0.62,
    layout: { cx: 260, hw: 215, h: 230 },
    stops: [
      { t: "Heard state", k: "Post", date: "2026-05", kind: "post", ls: 1,
        href: "/blog/every-voice-ai-forgets-what-you-heard",
        full: "Voice Agents Need a Record of What the User Heard",
        d: "Realtime voice agents can interrupt themselves, but no protocol tells the model what the user actually heard. Argues for heard state as a first-class field, across OpenAI, LiveKit, and Pipecat." },
      { t: "Lying tools", k: "Post", date: "2026-08", kind: "post", ls: -1,
        href: "/blog/agents-believe-tools-that-lie",
        full: "Recovery Tools Help Agents Respond to Corrupted Tool Results",
        d: "Agents take a silently failed tool call as success and build on it. A receipt from the tool, checked at runtime, lets them notice and recover." },
      { t: "Outcome Monitors", k: "arXiv", date: "2026-08", kind: "paper", active: true, ls: 1,
        href: "https://arxiv.org/abs/2608.19303",
        full: "Outcome Monitors: Recovery Affordances for Silent Tool Failures",
        d: "Recovery affordances for silent tool failures in tool-using agents. Frozen confirmatory ToolMaze study: +14.4 points mean effect, task-cluster sign-flip test p = .0006." },
    ],
  },
  {
    name: "LLM evaluation", span: "2026–now",
    layout: { cx: 640, hw: 340, h: 400 },
    stops: [
      { t: "Pali", k: "Open source", date: "2026-03", kind: "project", active: true, ls: 1,
        href: "https://github.com/pali-mem/pali",
        full: "Pali, an open memory runtime for LLM apps and agents",
        d: "Local-first, multi-tenant memory runtime with REST, MCP, and dashboard surfaces. Hybrid lexical + vector retrieval with configurable fusion and reranking." },
      { t: "Coin flip", k: "Post", date: "2026-04", kind: "post", ls: -1,
        href: "/blog/compression-is-a-coin-flip",
        full: "Evidence Compression Is Reader-Dependent",
        d: "SIEVE compiles retrieved turns into structured evidence before the reader. Small readers gain about 13 points. Strong readers gain under one: a coin flip." },
      { t: "Same Ranking", k: "EMNLP 2026 Findings", date: "2026-05", kind: "paper",
        href: "https://arxiv.org/abs/2605.24060",
        full: "Same Ranking, Different Winner: How Scoring Targets Shape LLM Memory Benchmarks",
        d: "Changing the scoring target on a memory benchmark keeps the ranked list but changes which system wins. Accepted to EMNLP 2026 Findings." },
      { t: "Lying benchmarks", k: "Post", date: "2026-05", kind: "post",
        href: "/blog/your-memory-benchmark-is-lying-to-you",
        full: "Scoring Targets Change Which Memory System Wins",
        d: "Companion to the EMNLP paper, for practitioners. Why LongMemEval and LoCoMo can rank systems consistently and still mislead you about the winner." },
      { t: "RAG compression", k: "arXiv", date: "2026-06", kind: "paper",
        href: "https://arxiv.org/abs/2606.21807",
        full: "Fixed RAG Compression Collapses Measured Reader Scaling",
        d: "A fixed compression layer in front of the reader hides the gains of stronger readers, so the measured scaling curve flattens. Journal revision in progress." },
      { t: "Eternal present", k: "LAPSE post", date: "2026-08", kind: "post", active: true,
        href: "/blog/aspect-persistence-eternal-present-memory",
        full: "Memory Consolidation Turns Temporary Statements Into Standing Facts",
        d: "Memory consolidation drops temporal aspect: \"I'm staying in Pasadena\" becomes \"lives in Pasadena.\" LAPSE measures it. Preregistered pilot, still blinded." },
    ],
  },
  {
    name: "LLM × human behavior", span: "2026–now",
    layout: { cx: 1020, hw: 160, h: 190 },
    stops: [
      { t: "Paste boundary", k: "SEAM post", date: "2026-08", kind: "post", active: true, ls: 1,
        href: "/blog/where-does-the-paste-end",
        full: "LLMs Absorb Text Typed After a Paste",
        d: "Ask a model to edit a document and add a side remark after the paste. Most fold the remark into the document. Across 20 models, absorption runs 8% to 67%; boundary markup cuts it in 19 of 20." },
    ],
  },
];

const W = 1240, H = 500, BASE = 440;
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = (date) => { const [y, m] = date.split("-"); return `${MON[+m - 1]} ${y}`; };
const pts = (a) => a.map((p) => p.map((v) => +v.toFixed(1)).join(",")).join(" ");

const INK = "rgb(var(--color-ink-dark))";
const MUTED = "rgb(var(--color-ink-muted))";
const BLUE = "rgb(var(--color-ink-blue))";
const BLUE_STRONG = "rgb(var(--color-ink-blue-strong))";
const BLUE_SOFT = "rgb(var(--color-ink-blue) / 0.16)";
const BORDER = "rgb(var(--color-border-paper))";
const SURFACE = "rgb(var(--color-paper-surface))";
const PAPER = "var(--range-bg)";

function xAtY(flank, y) {
  for (let i = 0; i < flank.length - 1; i++) {
    const [x1, y1] = flank[i], [x2, y2] = flank[i + 1];
    if (y >= Math.min(y1, y2) && y <= Math.max(y1, y2) && y1 !== y2) return x1 + (x2 - x1) * (y - y1) / (y2 - y1);
  }
  return flank[flank.length - 1][0];
}

function buildPeak(r) {
  const { cx, hw, h } = r.layout;
  const top = BASE - h;
  const shoulderL = [cx - hw * 0.45, BASE - h * 0.55];
  const shoulderR = [cx + hw * 0.5, BASE - h * 0.42];
  const leftFlank = [[cx, top], shoulderL, [cx - hw, BASE]];
  const rightFlank = [[cx, top], shoulderR, [cx + hw, BASE]];
  const sil = [[cx - hw, BASE], shoulderL, [cx, top], shoulderR, [cx + hw, BASE]];

  const snowY = top + h * 0.26;
  const tooth = Math.max(12, hw * 0.09);
  const xl = xAtY(leftFlank, snowY), xr = xAtY(rightFlank, snowY);
  const count = Math.max(2, Math.round((xr - xl) / tooth));
  const step = (xr - xl) / count;
  const zig = [];
  for (let i = 0; i <= count; i++) {
    zig.push([xl + step * i, snowY]);
    if (i < count) zig.push([xl + step * i + step / 2, snowY + step * 0.8]);
  }
  const rightPart = rightFlank.filter((p) => p[1] > top && p[1] < snowY);
  const leftPart = [...leftFlank].reverse().filter((p) => p[1] > top && p[1] < snowY);
  const cap = [[cx, top], ...rightPart, ...zig.reverse(), ...leftPart];

  const innerY = top + h * 0.14;
  const ixl = xAtY(leftFlank, innerY), ixr = xAtY(rightFlank, innerY);
  const ic = Math.max(1, Math.round((ixr - ixl) / tooth));
  const istep = (ixr - ixl) / ic;
  const teeth = [];
  for (let i = 0; i < ic; i++) {
    const x0 = ixl + istep * i;
    teeth.push([[x0, innerY], [x0 + istep, innerY], [x0 + istep / 2, innerY + istep * 0.8]]);
  }
  const summit = [[cx, top], [ixr, innerY], [ixl, innerY]];

  const n = r.stops.length;
  const path = [[cx - hw * 0.92, BASE]];
  const positions = [];
  r.stops.forEach((s, i) => {
    const f = (i + 1) / (n + 1);
    const y = BASE - h * (r.rise || 0.58) * f;
    const side = i % 2 === 0 ? -1 : 1;
    const x = cx + side * hw * (1 - f) * (r.spread || 0.5);
    path.push([x, y]);
    positions.push({ x, y, side: s.ls || side, s });
  });
  const last = path[path.length - 1];
  const ang = Math.atan2(top - last[1], cx - last[0]);
  const fx = last[0] + Math.cos(ang) * 26, fy = last[1] + Math.sin(ang) * 26;
  const flick = { x1: last[0], y1: last[1], x2: fx, y2: fy, x3: fx + Math.cos(ang) * 16, y3: fy + Math.sin(ang) * 16 };

  return { cx, hw, h, top, sil, shoulderL, shoulderR, cap, teeth, summit, path, positions, flick };
}

const FAR = [[0,BASE],[70,380],[150,410],[240,330],[330,390],[420,300],[520,360],[600,250],[700,340],[790,290],[880,350],[960,280],[1060,340],[1140,300],[W,350],[W,BASE]];

function Marker({ x, y, kind, active }) {
  const stroke = active ? BLUE_STRONG : INK;
  const fill = active ? BLUE : PAPER;
  const sw = 1.75;
  if (kind === "paper") return <circle cx={x} cy={y} r={5.5} fill={fill} stroke={stroke} strokeWidth={sw} />;
  if (kind === "post") return <polygon points={pts([[x, y - 6.5], [x + 6.5, y], [x, y + 6.5], [x - 6.5, y]])} fill={fill} stroke={stroke} strokeWidth={sw} />;
  return <rect x={x - 5.5} y={y - 5.5} width={11} height={11} fill={fill} stroke={stroke} strokeWidth={sw} />;
}

export default function ResearchRange() {
  const peaks = useMemo(() => RANGES.map(buildPeak), []);
  const wrapRef = useRef(null);
  const [card, setCard] = useState(null); // { s, left, top }

  const hideTimer = useRef(null);
  const cancelHide = () => { if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; } };
  const show = (e, s) => {
    cancelHide();
    const node = e.currentTarget;
    const r = node.getBoundingClientRect();
    const w = wrapRef.current.getBoundingClientRect();
    const cw = 300, ch = 150;
    let left = r.left - w.left + r.width / 2 - cw / 2;
    left = Math.max(0, Math.min(left, w.width - cw));
    let top = r.top - w.top - ch - 14;
    if (top < 0) top = r.bottom - w.top + 14;
    setCard({ s, left, top });
  };
  // delayed hide so the pointer can travel from the marker into the card
  const hide = () => { cancelHide(); hideTimer.current = setTimeout(() => setCard(null), 180); };
  const hideNow = () => { cancelHide(); setCard(null); };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") hideNow(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={wrapRef} className="research-range relative" style={{ "--range-bg": "rgb(var(--color-paper-light))" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .research-range svg text { paint-order: stroke; stroke: var(--range-bg); stroke-width: 5px; stroke-linejoin: round; font-family: 'Oswald', sans-serif; }
        .research-range .stop { cursor: pointer; outline: none; }
        @media (hover: none) { .research-range .range-card { display: none; } }
        .research-range .stop:hover .stop-title, .research-range .stop:focus-visible .stop-title { fill: ${BLUE_STRONG}; }
      ` }} />
      <div className="mb-3 flex flex-wrap justify-end gap-x-5 gap-y-1 text-[10.5px] uppercase tracking-[0.12em] text-ink-muted md:absolute md:right-0 md:top-0 md:mb-0" style={{ fontFamily: "'Oswald', sans-serif" }}>
        <span><i className="mr-2 inline-block h-2 w-2 border-[1.5px] border-ink-dark align-[-1px]" />Project</span>
        <span><i className="mr-2 inline-block h-2 w-2 rounded-full border-[1.5px] border-ink-dark align-[-1px]" />Paper</span>
        <span><i className="mr-2 inline-block h-2 w-2 rotate-45 scale-90 border-[1.5px] border-ink-dark align-[-1px]" />Post</span>
        <span><i className="mr-2 inline-block h-2 w-2 border-[1.5px] border-ink-blue bg-ink-blue align-[-1px]" />Active</span>
      </div>

      <div className="range-scroll -mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-visible md:px-0">
      <div className="min-w-[860px] md:min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label="Three mountain peaks, one per research theme: tool agents, LLM evaluation, and LLM and human behavior. Papers, posts, and projects are stops on the trail up each peak."
        style={{ display: "block", height: "auto", shapeRendering: "geometricPrecision" }}>
        {/* distant range */}
        <polygon points={pts(FAR)} fill={BORDER} opacity={0.35} />
        <polyline points={pts(FAR.slice(0, -1))} fill="none" stroke={BORDER} strokeWidth={1} />
        <line x1={40} x2={W - 40} y1={BASE} y2={BASE} stroke={INK} strokeWidth={1.5} />

        {peaks.map((p, i) => (
          <g key={RANGES[i].name}>
            <polygon points={pts([[p.cx - p.hw, BASE], p.shoulderL, [p.cx, p.top], [p.cx, BASE]])} fill={SURFACE} />
            <polygon points={pts([[p.cx, p.top], p.shoulderR, [p.cx + p.hw, BASE], [p.cx, BASE]])} fill={BORDER} opacity={0.5} />
            <polygon points={pts(p.cap)} fill={BLUE_SOFT} stroke={BLUE_STRONG} strokeWidth={1.25} strokeLinejoin="miter" />
            {p.teeth.map((t, k) => <polygon key={k} points={pts(t)} fill={BLUE} />)}
            <polygon points={pts(p.summit)} fill={BLUE} />
            <polyline points={pts(p.sil)} fill="none" stroke={INK} strokeWidth={1.5} strokeLinejoin="miter" strokeMiterlimit={8} />
            <line x1={p.cx} y1={p.top} x2={p.cx} y2={BASE} stroke={INK} strokeWidth={0.75} opacity={0.25} />
            {/* trail */}
            <polyline points={pts(p.path)} fill="none" stroke={BLUE} strokeWidth={10} opacity={0.18} strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={pts(p.path)} fill="none" stroke={BLUE_STRONG} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
            <line x1={p.flick.x1} y1={p.flick.y1} x2={p.flick.x2} y2={p.flick.y2} stroke={BLUE_STRONG} strokeWidth={4} strokeLinecap="round" />
            <line x1={p.flick.x2} y1={p.flick.y2} x2={p.flick.x3} y2={p.flick.y3} stroke={BLUE_STRONG} strokeWidth={2} strokeLinecap="round" opacity={0.45} />
            <text x={p.cx} y={BASE + 30} fill={INK} fontSize={14} fontWeight={500} letterSpacing=".04em" textAnchor="middle">{RANGES[i].name}</text>
            <text x={p.cx} y={BASE + 47} fill={MUTED} fontSize={11} letterSpacing=".1em" textAnchor="middle">{RANGES[i].span}</text>
          </g>
        ))}

        {/* stops on top of everything */}
        {peaks.map((p) => p.positions.map(({ x, y, side, s }) => {
          const lx = x + side * 14, ta = side < 0 ? "end" : "start";
          return (
            <a key={s.t} href={s.href} target="_blank" rel="noopener noreferrer"
              className="stop" aria-label={s.full}
              onMouseEnter={(e) => show(e, s)} onMouseLeave={hide} onFocus={(e) => show(e, s)} onBlur={hide}>
              <rect x={Math.min(x, lx) - 10} y={y - 18} width={130} height={36} fill="transparent" />
              <Marker x={x} y={y} kind={s.kind} active={s.active} />
              <text className="stop-title" x={lx} y={y - 2} fill={INK} fontSize={13.5} fontWeight={500} textAnchor={ta}>{s.t}</text>
              <text x={lx} y={y + 12} fill={MUTED} fontSize={10.5} letterSpacing=".08em" textAnchor={ta}>{s.k.toUpperCase()}</text>
            </a>
          );
        }))}
      </svg>
      </div>
      </div>
      <p className="mt-2 text-center text-[10.5px] uppercase tracking-[0.12em] text-ink-muted" style={{ fontFamily: "'Oswald', sans-serif" }}>
        Inspired by <a href="https://tingofurro.github.io/" target="_blank" rel="noopener noreferrer" className="text-ink-blue hover:underline">Philippe Laban&rsquo;s research garden</a>
      </p>

      {card && (
        <a href={card.s.href}
          target="_blank" rel="noopener noreferrer"
          className="range-card absolute z-10 block w-[300px] border border-ink-dark px-3.5 pb-3 pt-3 no-underline hover:border-ink-blue"
          style={{ left: card.left, top: card.top, background: PAPER, boxShadow: `4px 4px 0 ${BORDER}`, color: "inherit" }}
          onMouseEnter={cancelHide} onMouseLeave={hide}>
          <div className="mb-1 text-[10.5px] uppercase tracking-[0.12em]" style={{ color: BLUE_STRONG, fontFamily: "'Oswald', sans-serif" }}>
            {card.s.k}: {fmt(card.s.date)}
          </div>
          <div className="mb-1.5 text-[14px] font-medium leading-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>{card.s.full}</div>
          <div className="text-[12.5px] leading-snug text-ink-dark" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{card.s.d}</div>
          <div className="mt-2 text-[10.5px] uppercase tracking-[0.12em] text-ink-blue" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {card.s.href.startsWith("http") ? "Open ↗" : "Read →"}
          </div>
        </a>
      )}
    </div>
  );
}

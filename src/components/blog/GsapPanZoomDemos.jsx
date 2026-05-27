import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Pause } from "lucide-react";

gsap.registerPlugin(useGSAP);

const INK = "#1a1a14", INK_MUTED = "#6b6560";
const BORDER = "1px solid rgb(212 207 196)";
const BG = "rgb(245 240 232)";
const FONT = "system-ui, -apple-system, sans-serif";
const ROSE = "#b65f72";

function MiniCursor({ attr }) {
  return (
    <svg {...{ [attr]: "" }} width="16" height="16" viewBox="0 0 24 24" fill="none"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 50, pointerEvents: "none",
        filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.18))" }}>
      <path d="M5 3l14 8-6.5 1.5L10 19z" fill={INK} stroke="#fff" strokeWidth="1" />
    </svg>
  );
}

function MiniRipple({ attr }) {
  return (
    <div {...{ [attr]: "" }} style={{
      position: "absolute", top: -10, left: -10, width: 20, height: 20,
      borderRadius: "50%", border: "2px solid rgba(182,95,114,0.5)",
      pointerEvents: "none", zIndex: 49, visibility: "hidden", opacity: 0,
    }} />
  );
}

function MiniControl({ playing, onToggle }) {
  return (
    <button onClick={onToggle} aria-label={playing ? "Pause" : "Play"} style={{
      position: "absolute", bottom: 8, right: 8, zIndex: 60,
      width: 26, height: 26, borderRadius: 6, border: BORDER,
      background: "rgba(255,255,255,0.9)", display: "flex",
      alignItems: "center", justifyContent: "center", cursor: "pointer", color: INK,
    }}>
      {playing ? <Pause size={11} /> : <Play size={11} />}
    </button>
  );
}

function measureCenter(el, ref) {
  const f = ref.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 - f.left, y: r.top + r.height / 2 - f.top };
}

// ─── Live Code Block ────────────────────────────────────────
export function LiveCodeBlock({ code, children, caption }) {
  return (
    <div style={{ margin: "2.5rem 0" }}>
      <div style={{
        display: "flex", borderRadius: 10, overflow: "hidden",
        border: BORDER, height: 440,
      }}>
        <div style={{
          flex: "0 0 36%", overflow: "auto",
          background: "#1e1e1e", padding: "14px 16px",
        }}>
          <pre style={{
            margin: 0, fontSize: 11, lineHeight: 1.6, tabSize: 2,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            color: "#d4d4d4", whiteSpace: "pre",
          }}>
            <code dangerouslySetInnerHTML={{ __html: highlightJS(code) }} />
          </pre>
        </div>
        <div style={{
          flex: "1 1 64%", position: "relative", background: BG, borderLeft: "1px solid #333",
        }}>
          {children}
        </div>
      </div>
      {caption && (
        <div style={{ textAlign: "center", fontSize: 12, color: INK_MUTED, marginTop: 8, fontStyle: "italic" }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function highlightJS(code) {
  const e = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return e.replace(
    /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(\b(?:const|let|var|function|return|if|else|new)\b)|(\b\d+\.?\d*\b)/g,
    (m, c, s, k, n) => {
      if (c) return `<span style="color:#6a9955">${c}</span>`;
      if (s) return `<span style="color:#ce9178">${s}</span>`;
      if (k) return `<span style="color:#569cd6">${k}</span>`;
      if (n) return `<span style="color:#b5cea8">${n}</span>`;
      return m;
    }
  );
}

// ─── Compare Block ──────────────────────────────────────────
export function CompareBlock({ left, right, leftLabel, rightLabel, caption }) {
  return (
    <div style={{ margin: "2.5rem 0" }}>
      <div style={{
        display: "flex", borderRadius: 10, overflow: "hidden",
        border: BORDER, height: 400,
      }}>
        <div style={{ flex: 1, position: "relative", background: BG }}>
          {left}
          <div style={{
            position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 600,
            color: "#dc2626", background: "rgba(220,38,38,0.08)",
            padding: "2px 8px", borderRadius: 4, fontFamily: FONT, zIndex: 55,
            border: "1px solid rgba(220,38,38,0.15)",
          }}>{leftLabel}</div>
        </div>
        <div style={{ width: 1, background: "rgb(212 207 196)" }} />
        <div style={{ flex: 1, position: "relative", background: BG }}>
          {right}
          <div style={{
            position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 600,
            color: "#16a34a", background: "rgba(22,163,74,0.08)",
            padding: "2px 8px", borderRadius: 4, fontFamily: FONT, zIndex: 55,
            border: "1px solid rgba(22,163,74,0.15)",
          }}>{rightLabel}</div>
        </div>
      </div>
      {caption && (
        <div style={{ textAlign: "center", fontSize: 12, color: INK_MUTED, marginTop: 8, fontStyle: "italic" }}>
          {caption}
        </div>
      )}
    </div>
  );
}

// ─── Demo 1: Zoom-Pan ──────────────────────────────────────
const TILE_COLORS = ["#e8c4c0", "#d4c5a9", "#a8c5c2", "#c5bdd4", "#b5c5a8", "#c5b5a0", "#dac9b8", "#b8c5d4"];

export function ZoomPanDemo() {
  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const cursor = q("[data-zpd-cursor]")[0];
    const ripple = q("[data-zpd-ripple]")[0];
    const zoomEl = q("[data-zpd-zoom]")[0];
    const ctx = q("[data-zpd-ctx]")[0];
    const check = q("[data-zpd-check]")[0];
    const tile0 = q("[data-zpd-tile='0']")[0];

    const W = zoomEl.clientWidth;
    const H = zoomEl.clientHeight;
    const rootW = root.clientWidth;
    const rootH = root.clientHeight;
    if (W <= 0 || H <= 0) return;

    const zoomRect = zoomEl.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const hdrH = zoomRect.top - rootRect.top;

    const t0 = measureCenter(tile0, zoomEl);
    const t0Root = { x: t0.x, y: t0.y + hdrH };
    const savePos = { x: t0.x + 15, y: t0.y + H * 0.18 };
    const saveRoot = { x: savePos.x, y: savePos.y + hdrH };

    const ZOOM = 1.5;
    const panTo = (t) => ({ x: (W / 2 - t.x) * (ZOOM - 1), y: (H / 2 - t.y) * (ZOOM - 1) });
    const panTile = panTo(t0);
    const panSave = panTo(savePos);

    gsap.set(ctx, { left: t0.x - W * 0.01, top: t0.y + H * 0.13 });
    gsap.set(check, { left: t0.x - 2, top: t0.y - 14 });

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power3.out" } });
    tlRef.current = tl;

    const click = (pos, label) => {
      tl.set(ripple, { x: pos.x, y: pos.y, scale: 0.2, autoAlpha: 0.55 }, label)
        .to(cursor, { scale: 0.88, duration: 0.08, ease: "power2.out" }, label)
        .to(ripple, { scale: 2.8, autoAlpha: 0, duration: 0.42, ease: "power2.out" }, label)
        .to(cursor, { scale: 1, duration: 0.14, ease: "back.out(2.2)" }, `${label}+=0.08`);
    };

    tl.add(() => {
      gsap.set(cursor, { x: -30, y: -30, scale: 1 });
      gsap.set(zoomEl, { scale: 1, x: 0, y: 0 });
      gsap.set(ctx, { autoAlpha: 0, y: 6, scale: 0.95 });
      gsap.set(check, { autoAlpha: 0, scale: 0.4 });
      gsap.set(ripple, { scale: 0, autoAlpha: 0 });
    }, 0);

    tl.to(cursor, { x: t0Root.x, y: t0Root.y, duration: 0.7, ease: "power2.out" }, "enter");
    tl.to({}, { duration: 0.25 }, "enter+=0.7");

    tl.addLabel("zoomIn", "enter+=0.95");
    tl.to(zoomEl, { scale: ZOOM, x: panTile.x, y: panTile.y, duration: 0.6, ease: "expo.out" }, "zoomIn");
    tl.to(cursor, {
      x: t0Root.x + (saveRoot.x - t0Root.x) * 0.2,
      y: t0Root.y + (saveRoot.y - t0Root.y) * 0.2,
      duration: 0.55, ease: "sine.out",
    }, "zoomIn");

    tl.to(ctx, { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" }, "zoomIn+=0.35");

    tl.addLabel("menuNav", "zoomIn+=0.7");
    tl.to(cursor, { x: saveRoot.x, y: saveRoot.y, duration: 0.4, ease: "sine.inOut" }, "menuNav");
    tl.to(zoomEl, { x: panSave.x, y: panSave.y, duration: 0.45, ease: "sine.inOut" }, "menuNav");

    tl.addLabel("saveClick", "menuNav+=0.5");
    click(saveRoot, "saveClick");
    tl.to(ctx, { autoAlpha: 0, duration: 0.12 }, "saveClick+=0.08");
    tl.to(check, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, "saveClick+=0.15");

    tl.to({}, { duration: 0.5 }, "saveClick+=0.4");

    tl.addLabel("zoomOut", "saveClick+=0.9");
    tl.to(zoomEl, { scale: 1, x: 0, y: 0, duration: 0.5, ease: "sine.inOut" }, "zoomOut");
    tl.to(cursor, { x: rootW / 2, y: rootH / 2, duration: 0.45, ease: "sine.inOut" }, "zoomOut");

    tl.to(cursor, { x: rootW + 20, y: -20, duration: 0.5, ease: "sine.in" }, "zoomOut+=0.5");
    tl.to(check, { autoAlpha: 0, duration: 0.25 }, "zoomOut+=0.6");
    tl.to({}, { duration: 0.35 });
  }, { scope: rootRef });

  return (
    <div ref={rootRef} style={{
      width: "100%", height: "100%", position: "relative", overflow: "hidden",
      background: BG, fontFamily: FONT, userSelect: "none",
    }}>
      <div style={{
        height: 34, borderBottom: BORDER, display: "flex", alignItems: "center",
        padding: "0 14px", gap: 6, background: "rgb(237 232 223)",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8c4c0" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d4c5a9" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a8c5c2" }} />
        <span style={{ fontSize: 10, color: INK_MUTED, marginLeft: 8 }}>My Board</span>
      </div>

      <div data-zpd-zoom style={{
        width: "100%", height: "calc(100% - 34px)",
        transformOrigin: "center center", position: "relative", overflow: "hidden",
      }}>
        {TILE_COLORS.map((color, i) => {
          const col = i % 4, row = Math.floor(i / 4);
          return (
            <div key={i} data-zpd-tile={String(i)} style={{
              position: "absolute",
              left: `${4 + col * 24}%`, top: `${6 + row * 48}%`,
              width: "20%", height: "40%",
              borderRadius: 10, background: color,
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }} />
          );
        })}

        <div data-zpd-ctx style={{
          position: "absolute",
          width: 140, background: "#fff", borderRadius: 8,
          border: BORDER, padding: "4px 0", zIndex: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          visibility: "hidden", opacity: 0,
        }}>
          <div style={{ padding: "5px 12px", fontSize: 10, color: INK_MUTED }}>Copy image</div>
          <div style={{ padding: "5px 12px", fontSize: 10, color: INK_MUTED }}>Open link</div>
          <div style={{ margin: "3px 8px", borderTop: "1px solid #eee" }} />
          <div style={{ padding: "5px 12px", fontSize: 10, fontWeight: 600, color: ROSE }}>Save to board</div>
        </div>

        <div data-zpd-check style={{
          position: "absolute",
          width: 28, height: 28, borderRadius: "50%",
          background: "#4ade80", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 14, fontWeight: 700,
          boxShadow: "0 2px 6px rgba(74,222,128,0.4)",
          visibility: "hidden", opacity: 0, zIndex: 15,
        }}>✓</div>
      </div>

      <MiniCursor attr="data-zpd-cursor" />
      <MiniRipple attr="data-zpd-ripple" />
      <MiniControl playing={playing} onToggle={() => {
        if (!tlRef.current) return;
        playing ? tlRef.current.pause() : tlRef.current.play();
        setPlaying(!playing);
      }} />
    </div>
  );
}

// ─── Demo 2: Cursor Dead vs Alive ───────────────────────────
const CMP_SHAPES = [
  { left: "8%",  top: "10%", width: "11%", height: "16%", c: "#e8c4c0", r: "50%" },
  { left: "28%", top: "7%",  width: "15%", height: "13%", c: "#d4c5a9", r: 8 },
  { left: "52%", top: "12%", width: "11%", height: "14%", c: "#c5bdd4", r: 8 },
  { left: "72%", top: "8%",  width: "13%", height: "12%", c: "#a8c5c2", r: 8 },
  { left: "6%",  top: "42%", width: "14%", height: "13%", c: "#b5c5a8", r: 8 },
  { left: "28%", top: "45%", width: "16%", height: "14%", c: "#c5b5a0", r: 8 },
  { left: "52%", top: "40%", width: "11%", height: "16%", c: "#e8c4c0", r: "50%" },
  { left: "72%", top: "44%", width: "15%", height: "13%", c: "#dac9b8", r: 8 },
];

function CursorZoomMini({ alive = false, attr }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const cursor = q(`[${attr}-cursor]`)[0];
    const zoomEl = q(`[${attr}-zoom]`)[0];
    const dot = q(`[${attr}-dot]`)[0];

    const W = zoomEl.clientWidth;
    const H = zoomEl.clientHeight;
    if (W <= 0 || H <= 0) return;

    const target = measureCenter(dot, zoomEl);
    const next = { x: W * 0.7, y: H * 0.6 };
    const ZOOM = 1.55;
    const pan = { x: (W / 2 - target.x) * (ZOOM - 1), y: (H / 2 - target.y) * (ZOOM - 1) };

    const tl = gsap.timeline({ repeat: -1 });

    tl.add(() => {
      gsap.set(cursor, { x: -30, y: -30, scale: 1 });
      gsap.set(zoomEl, { scale: 1, x: 0, y: 0 });
      gsap.set(dot, { boxShadow: "none" });
    }, 0);

    tl.to(cursor, { x: target.x, y: target.y, duration: 0.6, ease: "power2.out" }, "enter");
    tl.to({}, { duration: 0.2 }, "enter+=0.6");

    tl.addLabel("zoomIn", "enter+=0.8");
    tl.to(zoomEl, { scale: ZOOM, x: pan.x, y: pan.y, duration: 0.6, ease: "expo.out" }, "zoomIn");

    if (alive) {
      tl.to(cursor, {
        x: target.x + (next.x - target.x) * 0.3,
        y: target.y + (next.y - target.y) * 0.3,
        duration: 0.55, ease: "sine.out",
      }, "zoomIn");
    }

    tl.to(dot, { boxShadow: `inset 0 0 0 3px ${ROSE}`, duration: 0.2 }, "zoomIn+=0.45");
    tl.to({}, { duration: 0.6 }, "zoomIn+=0.65");

    tl.addLabel("zoomOut", "zoomIn+=1.25");
    tl.to(zoomEl, { scale: 1, x: 0, y: 0, duration: 0.5, ease: "sine.inOut" }, "zoomOut");
    if (alive) {
      tl.to(cursor, { x: W / 2, y: H / 2, duration: 0.45, ease: "sine.inOut" }, "zoomOut");
    }

    tl.to(cursor, { x: -30, y: -30, duration: 0.4, ease: "sine.in" }, "zoomOut+=0.5");
    tl.to(dot, { boxShadow: "none", duration: 0.3 }, "zoomOut+=0.3");
    tl.to({}, { duration: 0.3 });
  }, { scope: rootRef });

  return (
    <div ref={rootRef} style={{
      width: "100%", height: "100%", position: "relative", overflow: "hidden",
      background: BG, fontFamily: FONT, userSelect: "none",
    }}>
      <div {...{ [`${attr}-zoom`]: "" }} style={{
        width: "100%", height: "100%",
        transformOrigin: "center center", position: "relative",
      }}>
        {CMP_SHAPES.map((s, i) => (
          <div key={i} {...(i === 0 ? { [`${attr}-dot`]: "" } : {})} style={{
            position: "absolute", left: s.left, top: s.top,
            width: s.width, height: s.height, borderRadius: s.r,
            background: s.c, border: "1px solid rgba(0,0,0,0.05)",
          }} />
        ))}
      </div>
      <MiniCursor attr={`${attr}-cursor`} />
    </div>
  );
}

export function CursorCompareDemo() {
  return (
    <CompareBlock
      leftLabel="Cursor frozen during zoom"
      rightLabel="Cursor drifts toward next target"
      left={<CursorZoomMini alive={false} attr="data-ccd-l" />}
      right={<CursorZoomMini alive={true} attr="data-ccd-r" />}
      caption="Same zoom. The right cursor drifts 30% toward its next destination during the camera move."
    />
  );
}

// ─── Demo 3: Easing Compare ─────────────────────────────────
function EasingTrack({ ease, attr, label }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const ball = q(`[${attr}-ball]`)[0];
    const zoomEl = q(`[${attr}-zoom]`)[0];

    const W = zoomEl.clientWidth;
    const H = zoomEl.clientHeight;
    if (W <= 0 || H <= 0) return;

    const ballPos = measureCenter(ball, zoomEl);
    const endPos = { x: W * 0.72, y: H * 0.62 };
    const ZOOM = 1.4;
    const panStart = { x: (W / 2 - ballPos.x) * (ZOOM - 1), y: (H / 2 - ballPos.y) * (ZOOM - 1) };
    const panEnd = { x: (W / 2 - endPos.x) * (ZOOM - 1), y: (H / 2 - endPos.y) * (ZOOM - 1) };

    const tl = gsap.timeline({ repeat: -1 });

    tl.add(() => {
      gsap.set(zoomEl, { scale: 1, x: 0, y: 0 });
      gsap.set(ball, { boxShadow: "none" });
    }, 0);

    tl.to(zoomEl, { scale: ZOOM, x: panStart.x, y: panStart.y, duration: 0.5, ease: "expo.out" }, "start+=0.3");
    tl.to({}, { duration: 0.3 });
    tl.addLabel("pan");
    tl.to(zoomEl, { x: panEnd.x, y: panEnd.y, duration: 1.0, ease }, "pan");
    tl.to(ball, { boxShadow: `inset 0 0 0 3px ${ROSE}`, duration: 0.3 }, "pan+=0.7");
    tl.to({}, { duration: 0.4 });
    tl.to(zoomEl, { scale: 1, x: 0, y: 0, duration: 0.5, ease: "sine.inOut" });
    tl.to(ball, { boxShadow: "none", duration: 0.3 }, "<0.2");
    tl.to({}, { duration: 0.3 });
  }, { scope: rootRef });

  return (
    <div ref={rootRef} style={{
      width: "100%", height: "100%", position: "relative", overflow: "hidden",
      background: BG, fontFamily: FONT, userSelect: "none",
    }}>
      <div {...{ [`${attr}-zoom`]: "" }} style={{
        width: "100%", height: "100%",
        transformOrigin: "center center", position: "relative",
      }}>
        {CMP_SHAPES.map((s, i) => (
          <div key={i} {...(i === 0 ? { [`${attr}-ball`]: "" } : {})} style={{
            position: "absolute", left: s.left, top: s.top,
            width: s.width, height: s.height, borderRadius: s.r,
            background: s.c, border: "1px solid rgba(0,0,0,0.05)",
          }} />
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
        fontSize: 10, color: INK_MUTED, fontFamily: "'JetBrains Mono', monospace",
        background: "rgba(255,255,255,0.85)", padding: "3px 10px", borderRadius: 5,
        border: BORDER, zIndex: 55,
      }}>{label}</div>
    </div>
  );
}

export function EasingCompareDemo() {
  return (
    <CompareBlock
      leftLabel="power2.inOut"
      rightLabel="sine.inOut"
      left={<EasingTrack ease="power2.inOut" attr="data-ecd-l" label="power2.inOut" />}
      right={<EasingTrack ease="sine.inOut" attr="data-ecd-r" label="sine.inOut" />}
      caption="Watch the acceleration. power2 has a visible 'kick' at the start and end. sine is butter."
    />
  );
}

// ─── FPS Counter ────────────────────────────────────────────
function useFPS() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let id;
    const tick = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 500) {
        setFps(Math.round(frames / ((now - last) / 1000)));
        frames = 0;
        last = now;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return fps;
}

function FPSBadge({ fps }) {
  const color = fps >= 55 ? "#16a34a" : fps >= 30 ? "#ca8a04" : "#dc2626";
  return (
    <div style={{
      position: "absolute", top: 10, right: 10, zIndex: 60,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
      color, background: "rgba(255,255,255,0.92)", padding: "3px 8px",
      borderRadius: 5, border: `1px solid ${color}30`,
      minWidth: 52, textAlign: "center",
    }}>{fps} fps</div>
  );
}

// ─── Demo 4: Performance Stress Test ────────────────────────
const STRESS_COLORS = [
  "#e8c4c0", "#d4c5a9", "#a8c5c2", "#c5bdd4", "#b5c5a8", "#c5b5a0",
  "#dac9b8", "#b8c5d4", "#c2b5c9", "#b5d4c5", "#d4b8b5", "#c5c2a8",
];

function gridShapes(count) {
  const cols = count <= 8 ? 4 : count <= 24 ? 6 : 8;
  const rows = Math.ceil(count / cols);
  const cellW = 82 / cols;
  const cellH = 82 / rows;
  const padW = cellW * 0.15;
  const padH = cellH * 0.15;
  return Array.from({ length: count }, (_, i) => ({
    left: `${9 + (i % cols) * (82 / cols) + padW}%`,
    top: `${9 + Math.floor(i / cols) * (82 / rows) + padH}%`,
    width: `${cellW - padW * 2}%`,
    height: `${cellH - padH * 2}%`,
    c: STRESS_COLORS[i % STRESS_COLORS.length],
    r: i % 5 === 0 ? "50%" : 8,
  }));
}

export function StressTestDemo() {
  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const [load, setLoad] = useState(8);
  const [playing, setPlaying] = useState(true);
  const fps = useFPS();
  const shapes = gridShapes(load);

  const togglePlay = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (playing) {
      tl.pause();
      setPlaying(false);
    } else {
      tl.play();
      setPlaying(true);
    }
  };

  const cycleLoad = useCallback(() => {
    setLoad((prev) => prev === 8 ? 24 : prev === 24 ? 48 : 8);
    setPlaying(true);
  }, []);

  useGSAP(() => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const zoomEl = q("[data-stress-zoom]")[0];
    const els = q("[data-stress-shape]");
    if (!zoomEl || els.length === 0) return;

    const W = zoomEl.clientWidth;
    const H = zoomEl.clientHeight;
    if (W <= 0 || H <= 0) return;

    const ZOOM = 1.45;
    const foci = [
      { x: W * 0.25, y: H * 0.3 },
      { x: W * 0.75, y: H * 0.6 },
      { x: W * 0.5, y: H * 0.45 },
    ];
    const panTo = (t) => ({ x: (W / 2 - t.x) * (ZOOM - 1), y: (H / 2 - t.y) * (ZOOM - 1) });

    const tl = gsap.timeline({ repeat: -1 });
    tlRef.current = tl;

    tl.add(() => {
      gsap.set(zoomEl, { scale: 1, x: 0, y: 0 });
      gsap.set(els, { scale: 1, opacity: 1 });
    }, 0);

    const p0 = panTo(foci[0]);
    tl.to(zoomEl, { scale: ZOOM, x: p0.x, y: p0.y, duration: 0.6, ease: "expo.out" }, 0.3);
    tl.to(els, { scale: 1.06, stagger: 0.02, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.5);

    const p1 = panTo(foci[1]);
    tl.to(zoomEl, { x: p1.x, y: p1.y, duration: 0.8, ease: "sine.inOut" }, "+=0.2");
    tl.to(els, { opacity: 0.65, stagger: 0.015, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, "<0.2");

    const p2 = panTo(foci[2]);
    tl.to(zoomEl, { x: p2.x, y: p2.y, duration: 0.7, ease: "sine.inOut" }, "+=0.2");
    tl.to(els, { scale: 0.94, stagger: 0.02, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, "<0.15");

    tl.to(zoomEl, { scale: 1, x: 0, y: 0, duration: 0.5, ease: "sine.inOut" }, "+=0.3");
    tl.to({}, { duration: 0.4 });
  }, { scope: rootRef, dependencies: [load] });

  const nextLoad = load === 8 ? 24 : load === 24 ? 48 : 8;

  return (
    <div style={{ margin: "2.5rem 0" }}>
      <div style={{
        borderRadius: 10, overflow: "hidden", border: BORDER, height: 500,
        position: "relative",
      }}>
        <div ref={rootRef} style={{
          width: "100%", height: "100%", position: "relative", overflow: "hidden",
          background: BG, fontFamily: FONT, userSelect: "none",
        }}>
          <div data-stress-zoom style={{
            width: "100%", height: "100%",
            transformOrigin: "center center", position: "relative",
          }}>
            {shapes.map((s, i) => (
              <div key={`${load}-${i}`} data-stress-shape style={{
                position: "absolute", left: s.left, top: s.top,
                width: s.width, height: s.height, borderRadius: s.r,
                background: s.c, border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }} />
            ))}
          </div>

          <FPSBadge fps={fps} />

          <div style={{
            position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 6, zIndex: 60,
          }}>
            <button onClick={togglePlay} style={{
              height: 28, padding: "0 12px", borderRadius: 6, border: BORDER,
              background: "rgba(255,255,255,0.92)", cursor: "pointer", color: INK,
              fontFamily: FONT, fontSize: 11, display: "flex", alignItems: "center", gap: 4,
            }}>
              {playing ? <Pause size={11} /> : <Play size={11} />}
              {playing ? "Pause" : "Play"}
            </button>
            <button onClick={cycleLoad} style={{
              height: 28, padding: "0 12px", borderRadius: 6, border: BORDER,
              background: "rgba(255,255,255,0.92)", cursor: "pointer", color: INK,
              fontFamily: FONT, fontSize: 11, fontWeight: 600,
            }}>
              {load} shapes → {nextLoad}
            </button>
          </div>

          <div style={{
            position: "absolute", top: 10, left: 10, fontSize: 10, color: INK_MUTED,
            fontFamily: "'JetBrains Mono', monospace", background: "rgba(255,255,255,0.85)",
            padding: "3px 8px", borderRadius: 5, border: BORDER, zIndex: 55,
          }}>
            {load} shapes · zoom + pan + stagger
          </div>
        </div>
      </div>
      <div style={{
        textAlign: "center", fontSize: 12, color: INK_MUTED, marginTop: 8,
        fontStyle: "italic",
      }}>
        These are plain DOM shapes, not images or complex components. Real demos with images and text would have different characteristics. Click to increase the count and watch the FPS counter.
      </div>
    </div>
  );
}

export default ZoomPanDemo;

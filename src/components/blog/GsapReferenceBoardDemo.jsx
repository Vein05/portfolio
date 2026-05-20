import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Pause, RotateCcw } from "lucide-react";

gsap.registerPlugin(useGSAP);

const FILM_W = 1100, FILM_H = 680;
const FONT = "system-ui, -apple-system, sans-serif";
const SIDEBAR_BG = "#2c2a28";
const SIDEBAR_BORDER = "1px solid #3a3836";
const CANVAS_BG = "#e8e2da";
const INK = "#e0dbd4";
const INK_DIM = "#8a847c";
const SELECT_BLUE = "#4d90fe";
const CURSOR_XI = "#4d90fe";
const CURSOR_ALEX = "#34a853";
const CURSOR_FRANCIS = "#ea4335";
const MAUVE = "#b48ea0";
const MAUVE_LIGHT = "#d4b8c8";
const PINK_CARD = "#c9a0b4";

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

function CursorSVG({ id, fill, label }) {
  return (
    <div data-ligma-cursor={id} style={{
      position: "absolute", top: 0, left: 0, zIndex: 50, pointerEvents: "none",
      display: "flex", alignItems: "flex-start", gap: 2,
    }}>
      <svg width="16" height="20" viewBox="0 0 18 22" fill="none" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.25))" }}>
        <path d="M3 2L3 18L7.55 13.45H13L3 2Z" fill={fill} stroke="#fff" strokeLinejoin="round" strokeWidth="1.2" />
      </svg>
      <span style={{
        marginLeft: 1, marginTop: 13, borderRadius: 8, padding: "1px 6px",
        fontSize: 8.5, fontWeight: 700, color: "#fff", background: fill,
        whiteSpace: "nowrap", lineHeight: "15px", letterSpacing: "0.02em",
      }}>{label}</span>
    </div>
  );
}

function RippleCircle({ id, color }) {
  return (
    <div data-ligma-ripple={id} style={{
      position: "absolute", top: -12, left: -12, width: 24, height: 24,
      borderRadius: "50%", border: `2px solid ${color}`,
      pointerEvents: "none", zIndex: 49, visibility: "hidden", opacity: 0,
    }} />
  );
}

function SelectionBox() {
  const h = 6;
  const handleStyle = (top, left, right, bottom) => ({
    position: "absolute", width: h, height: h, background: SELECT_BLUE, borderRadius: 1,
    ...(top !== undefined && { top }), ...(left !== undefined && { left }),
    ...(right !== undefined && { right }), ...(bottom !== undefined && { bottom }),
    transform: "translate(-50%, -50%)",
  });
  return (
    <div data-ligma-selection style={{
      position: "absolute", inset: -4, border: `1.5px solid ${SELECT_BLUE}`,
      pointerEvents: "none", zIndex: 25, visibility: "hidden", opacity: 0,
    }}>
      <div style={handleStyle(0, 0)} />
      <div style={handleStyle(0, undefined, -4)} />
      <div style={handleStyle(undefined, 0, undefined, -4)} />
      <div style={handleStyle(undefined, undefined, -4, -4)} />
      <div style={{ ...handleStyle(0, undefined), left: "50%", transform: "translate(-50%, -50%)" }} />
      <div style={{ ...handleStyle(undefined, undefined, -4), top: "50%", transform: "translate(50%, -50%)" }} />
      <div style={{ ...handleStyle(undefined, undefined), left: "50%", bottom: -4, transform: "translate(-50%, 50%)" }} />
      <div style={{ ...handleStyle(undefined, 0), top: "50%", transform: "translate(-50%, -50%)" }} />
    </div>
  );
}

function LeftSidebar() {
  const pages = ["Overview", "Iterations", "Feedback", "Archive"];
  const layers = [
    { label: "Mobile / Landing", depth: 0 },
    { label: "Card", depth: 1 },
    { label: "Nav", depth: 1 },
    { label: "Welcome", depth: 1 },
    { label: "Profile", depth: 0 },
    { label: "Detail Card", depth: 0 },
  ];
  return (
    <div style={{
      width: 160, height: "100%", background: SIDEBAR_BG, flexShrink: 0,
      borderRight: SIDEBAR_BORDER, display: "flex", flexDirection: "column",
      fontFamily: FONT,
    }}>
      <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5,
          background: "linear-gradient(135deg, #7c5cbf, #b48ea0)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#fff", fontWeight: 800,
        }}>L</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>Ligma</div>
      </div>
      <div style={{ padding: "10px 10px 4px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: INK_DIM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Pages</div>
        {pages.map((p, i) => (
          <div key={p} style={{
            padding: "5px 8px", fontSize: 11, borderRadius: 4, marginBottom: 1, cursor: "default",
            color: i === 0 ? "#fff" : INK_DIM,
            background: i === 0 ? "rgba(255,255,255,0.08)" : "transparent",
            fontWeight: i === 0 ? 600 : 400,
          }}>{p}</div>
        ))}
      </div>
      <div style={{ padding: "8px 10px 4px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: INK_DIM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Layers</div>
        {layers.map((l, i) => (
          <div key={i} style={{
            padding: "4px 6px", paddingLeft: 6 + l.depth * 14, fontSize: 10,
            color: INK_DIM, cursor: "default", display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, border: `1px solid ${INK_DIM}`, flexShrink: 0, opacity: 0.5 }} />
            {l.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
}

function RightSidebar() {
  return (
    <div data-ligma-right-sidebar style={{
      width: 180, height: "100%", background: SIDEBAR_BG, flexShrink: 0,
      borderLeft: SIDEBAR_BORDER, display: "flex", flexDirection: "column",
      fontFamily: FONT, padding: "14px 12px",
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: INK_DIM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Frame</div>
      <div style={{ fontSize: 11, color: INK, fontWeight: 600, marginBottom: 14 }}>Mobile / Landing</div>

      <div style={{ fontSize: 9, fontWeight: 700, color: INK_DIM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Layout</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["W", "375"], ["H", "812"]].map(([label, val]) => (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ fontSize: 8, color: INK_DIM, marginBottom: 3 }}>{label}</div>
            <div style={{
              height: 24, borderRadius: 4, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)", padding: "0 6px",
              fontSize: 10, color: INK, display: "flex", alignItems: "center",
            }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 9, fontWeight: 700, color: INK_DIM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Appearance</div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 8, color: INK_DIM, marginBottom: 3 }}>Opacity</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.1)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
          </div>
          <span style={{ fontSize: 10, color: INK }}>100%</span>
        </div>
      </div>

      <div style={{ fontSize: 9, fontWeight: 700, color: INK_DIM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Fill</div>
      <div data-ligma-fill-row style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div data-ligma-fill-swatch style={{
          width: 22, height: 22, borderRadius: 4,
          background: "#ffffff", border: "1px solid rgba(255,255,255,0.15)",
        }} />
        <span data-ligma-fill-hex style={{ fontSize: 10, color: INK }}>#FFFFFF</span>
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        {["#b48ea0", "#7c5cbf", "#ea4335", "#34a853"].map((c) => (
          <div key={c} data-ligma-color={c} style={{
            width: 18, height: 18, borderRadius: 3, background: c, cursor: "default",
            border: "1px solid rgba(255,255,255,0.1)",
          }} />
        ))}
      </div>
    </div>
  );
}

function RecipeScreen() {
  return (
    <div data-ligma-frame="recipe" style={{
      position: "absolute", left: 210, top: 80, width: 180, height: 320,
      borderRadius: 16, background: "#faf6f2", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)", zIndex: 10,
    }}>
      <SelectionBox />
      <div style={{ padding: "14px 14px 8px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#2a2420" }}>Hi Chef</div>
        <div style={{ fontSize: 9, color: "#8a847c", marginTop: 2 }}>What are we cooking?</div>
      </div>
      <div style={{
        margin: "0 10px", height: 90, borderRadius: 12,
        background: `linear-gradient(145deg, ${PINK_CARD}, ${MAUVE})`,
        display: "flex", alignItems: "flex-end", padding: 10,
      }}>
        <div>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Featured</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginTop: 2 }}>Pasta Rosa</div>
        </div>
      </div>
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        {[["Chicken", "256"], ["Tofu", "121"], ["Salmon", "312"]].map(([name, cal]) => (
          <div key={name} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "6px 8px", borderRadius: 8, background: "#fff",
            border: "1px solid #ede8e2",
          }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#2a2420" }}>{name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 9, color: "#8a847c" }}>{cal}</span>
              <span style={{ fontSize: 10, color: "#ccc" }}>&rsaquo;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div data-ligma-frame="profile" style={{
      position: "absolute", left: 420, top: 110, width: 160, height: 300,
      borderRadius: 16, background: "#faf6f2", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)", zIndex: 11,
    }}>
      <div style={{ padding: "12px 12px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#2a2420" }}>Yasmin</div>
        <span style={{
          fontSize: 7, fontWeight: 700, color: "#fff", background: CURSOR_ALEX,
          borderRadius: 6, padding: "2px 5px", textTransform: "uppercase", letterSpacing: "0.05em",
        }}>live</span>
      </div>
      <div data-ligma-profile-image style={{
        margin: "0 10px", height: 160, borderRadius: 12, position: "relative",
        background: `linear-gradient(160deg, ${MAUVE_LIGHT}, #9b7cb5, ${MAUVE})`,
        overflow: "hidden",
      }}>
        <div data-ligma-crop-overlay style={{
          position: "absolute", inset: 12, border: "1.5px dashed rgba(255,255,255,0.7)",
          borderRadius: 4, visibility: "hidden", opacity: 0,
        }}>
          <div style={{ position: "absolute", left: "33%", top: 0, height: "100%", width: 1, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ position: "absolute", left: "66%", top: 0, height: "100%", width: 1, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ position: "absolute", top: "33%", left: 0, width: "100%", height: 1, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ position: "absolute", top: "66%", left: 0, width: "100%", height: 1, background: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>
      <div style={{ padding: "8px 12px" }}>
        <div style={{ fontSize: 10, color: "#8a847c" }}>Photographer & stylist</div>
        <div style={{ fontSize: 9, color: "#b0a99e", marginTop: 4 }}>228 followers</div>
      </div>
    </div>
  );
}

function DetailCard() {
  return (
    <div data-ligma-frame="detail" style={{
      position: "absolute", left: 560, top: 90, width: 180, height: 260,
      borderRadius: 16, background: "#faf6f2", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)", zIndex: 10,
    }}>
      <div style={{ padding: "10px 12px 4px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, color: "#8a847c" }}>&lsaquo; Back</span>
      </div>
      <div data-ligma-detail-gradient style={{
        margin: "4px 10px", height: 100, borderRadius: 10,
        background: `linear-gradient(135deg, #7c5cbf, ${MAUVE}, #d4b8c8)`,
      }} />
      <div style={{ padding: "8px 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#2a2420" }}>Florian</div>
        <div style={{ fontSize: 9, color: "#8a847c", marginTop: 2 }}>Plant-based creator</div>
      </div>
      <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {[["Saved", "88"], ["Cooked", "24"]].map(([label, n]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "5px 8px", borderRadius: 6, background: "#fff",
            border: "1px solid #ede8e2",
          }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: "#2a2420" }}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 9, color: "#8a847c" }}>{n}</span>
              <span style={{ fontSize: 10, color: "#ccc" }}>&rsaquo;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StickyNote() {
  return (
    <div data-ligma-sticky style={{
      position: "absolute", left: 440, top: 420, width: 120, zIndex: 20,
      borderRadius: 4, background: "#fde68a", padding: "8px 10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)", transform: "rotate(-2deg)",
      visibility: "hidden", opacity: 0,
    }}>
      <div style={{ fontSize: 10, color: "#78350f", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1.4 }}>
        move this left?
      </div>
    </div>
  );
}

function BottomToolbar() {
  const tools = [
    { id: "cursor", shape: "arrow" },
    { id: "frame", shape: "rect" },
    { id: "shape", shape: "circle" },
    { id: "text", shape: "T" },
    { id: "pen", shape: "pen" },
    { id: "comment", shape: "chat" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
      zIndex: 20, display: "flex", alignItems: "center", gap: 1, borderRadius: 10,
      background: "rgba(44,42,40,0.92)", padding: "5px 6px",
      backdropFilter: "blur(8px)", boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    }}>
      {tools.map(({ id, shape }) => (
        <div key={id} style={{
          width: 28, height: 28, borderRadius: 6, display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "default",
        }}>
          {shape === "arrow" && (
            <svg width="12" height="12" viewBox="0 0 18 22" fill="none">
              <path d="M3 2L3 18L7.55 13.45H13L3 2Z" fill="#999" strokeLinejoin="round" />
            </svg>
          )}
          {shape === "rect" && <div style={{ width: 10, height: 10, border: "1.5px solid #999", borderRadius: 1 }} />}
          {shape === "circle" && <div style={{ width: 10, height: 10, border: "1.5px solid #999", borderRadius: "50%" }} />}
          {shape === "T" && <span style={{ fontSize: 11, fontWeight: 700, color: "#999" }}>T</span>}
          {shape === "pen" && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></svg>
          )}
          {shape === "chat" && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          )}
        </div>
      ))}
    </div>
  );
}

function TextCursor() {
  return (
    <div data-ligma-text-cursor style={{
      position: "absolute", left: 338, top: 96, width: 1.5, height: 13,
      background: SELECT_BLUE, borderRadius: 1, zIndex: 30,
      visibility: "hidden", opacity: 0,
    }} />
  );
}

function TypedText() {
  return (
    <span data-ligma-typed-text style={{
      position: "absolute", left: 224, top: 96, fontSize: 9, fontWeight: 600,
      color: "#2a2420", zIndex: 30, whiteSpace: "nowrap", pointerEvents: "none",
    }} />
  );
}

function ResizeHandle() {
  return (
    <div data-ligma-resize-handle style={{
      position: "absolute", right: -5, bottom: -5, width: 10, height: 10,
      background: CURSOR_ALEX, borderRadius: 2, border: "1.5px solid #fff",
      zIndex: 26, cursor: "nwse-resize",
      visibility: "hidden", opacity: 0,
    }} />
  );
}

function ControlButton({ onClick, ariaLabel, children }) {
  return (
    <button onClick={onClick} aria-label={ariaLabel} style={{
      width: 28, height: 28, borderRadius: 5, border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(44,42,40,0.85)", display: "flex", alignItems: "center",
      justifyContent: "center", cursor: "pointer", color: "#ccc",
      backdropFilter: "blur(6px)", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
    }}>{children}</button>
  );
}

const GsapReferenceBoardDemo = () => {
  const wrapperRef = useRef(null);
  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [scale, setScale] = useState(1);
  const prefersReduced = usePrefersReducedMotion();

  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const containerW = wrapperRef.current.getBoundingClientRect().width;
    setScale(containerW > 0 ? Math.min(containerW / FILM_W, 1) : 1);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root || prefersReduced) return;

    const q = gsap.utils.selector(root);
    const xi = q('[data-ligma-cursor="xi"]')[0];
    const alex = q('[data-ligma-cursor="alex"]')[0];
    const francis = q('[data-ligma-cursor="francis"]')[0];
    const rippleXi = q('[data-ligma-ripple="xi"]')[0];
    const rippleAlex = q('[data-ligma-ripple="alex"]')[0];
    const rippleFrancis = q('[data-ligma-ripple="francis"]')[0];
    const recipe = q('[data-ligma-frame="recipe"]')[0];
    const profile = q('[data-ligma-frame="profile"]')[0];
    const detail = q('[data-ligma-frame="detail"]')[0];
    const selection = q("[data-ligma-selection]")[0];
    const cropOverlay = q("[data-ligma-crop-overlay]")[0];
    const sticky = q("[data-ligma-sticky]")[0];
    const textCursor = q("[data-ligma-text-cursor]")[0];
    const typedText = q("[data-ligma-typed-text]")[0];
    const resizeHandle = q("[data-ligma-resize-handle]")[0];
    const fillSwatch = q("[data-ligma-fill-swatch]")[0];
    const fillHex = q("[data-ligma-fill-hex]")[0];
    const detailGradient = q("[data-ligma-detail-gradient]")[0];

    const XI_OFF = { x: -40, y: 340 };
    const ALEX_OFF = { x: 1140, y: 680 };
    const FRANCIS_OFF = { x: 550, y: -40 };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.75, defaults: { ease: "power3.out" } });
    tlRef.current = tl;

    const click = (cursorEl, rippleEl, pos, label) => {
      tl.set(rippleEl, { x: pos.x, y: pos.y, scale: 0.2, autoAlpha: 0.55 }, label)
        .to(cursorEl, { scale: 0.88, duration: 0.08, ease: "power2.out" }, label)
        .to(rippleEl, { scale: 3.4, autoAlpha: 0, duration: 0.54, ease: "power2.out" }, label)
        .to(cursorEl, { scale: 1, duration: 0.16, ease: "back.out(2.2)" }, `${label}+=0.09`);
    };

    const counter = { x: 0 };
    const typedString = "Hi Chef";

    // --- Reset ---
    tl.add(() => {
      gsap.set(xi, { x: XI_OFF.x, y: XI_OFF.y, scale: 1, autoAlpha: 1 });
      gsap.set(alex, { x: ALEX_OFF.x, y: ALEX_OFF.y, scale: 1, autoAlpha: 1 });
      gsap.set(francis, { x: FRANCIS_OFF.x, y: FRANCIS_OFF.y, scale: 1, autoAlpha: 1 });
      gsap.set([rippleXi, rippleAlex, rippleFrancis], { autoAlpha: 0, scale: 0 });
      gsap.set(selection, { autoAlpha: 0 });
      gsap.set(cropOverlay, { autoAlpha: 0, inset: 12 });
      gsap.set(sticky, { autoAlpha: 0, y: 16, scale: 0.9 });
      gsap.set(textCursor, { autoAlpha: 0 });
      gsap.set(resizeHandle, { autoAlpha: 0 });
      gsap.set(recipe, { left: 210, top: 80 });
      gsap.set(detail, { scaleX: 1, scaleY: 1, transformOrigin: "bottom right" });
      if (detailGradient) gsap.set(detailGradient, { background: "linear-gradient(135deg, #7c5cbf, #b48ea0, #d4b8c8)" });
      if (fillSwatch) gsap.set(fillSwatch, { background: "#ffffff" });
      if (fillHex) fillHex.textContent = "#FFFFFF";
      if (typedText) typedText.textContent = "";
      counter.x = 0;
    }, 0);

    // === BEAT 1 (0-3s): All cursors enter from edges ===
    tl.addLabel("enter", "+=0.3");
    tl.to(xi, { x: 280, y: 240, duration: 1.1, ease: "power2.out" }, "enter");
    tl.to(alex, { x: 720, y: 320, duration: 1.2, ease: "power2.out" }, "enter+=0.15");
    tl.to(francis, { x: 480, y: 180, duration: 1.0, ease: "power2.out" }, "enter+=0.3");
    tl.to({}, { duration: 0.6 }, "enter+=1.3");

    // === BEAT 2 (3-7s): Xi selects recipe, Alex grabs resize, Francis opens crop ===
    tl.addLabel("actions", "enter+=2.0");

    // Xi: select recipe card
    tl.to(xi, { x: 300, y: 240, duration: 0.5, ease: "power2.out" }, "actions");
    tl.addLabel("xiSelect", "actions+=0.55");
    click(xi, rippleXi, { x: 300, y: 240 }, "xiSelect");
    tl.to(selection, { autoAlpha: 1, duration: 0.2 }, "xiSelect+=0.1");

    // Xi: drag recipe card
    tl.addLabel("xiDrag", "xiSelect+=0.6");
    tl.to(xi, { x: 260, y: 200, duration: 0.7, ease: "power2.inOut" }, "xiDrag");
    tl.to(recipe, { left: 175, top: 60, duration: 0.7, ease: "power2.inOut" }, "xiDrag+=0.05");

    // Alex: move to detail card corner, show resize handle
    tl.to(alex, { x: 738, y: 348, duration: 0.7, ease: "power2.out" }, "actions+=0.3");
    tl.addLabel("alexResize", "actions+=1.1");
    tl.to(resizeHandle, { autoAlpha: 1, duration: 0.15 }, "alexResize");

    // Alex: drag to resize
    tl.addLabel("alexDrag", "alexResize+=0.4");
    tl.to(alex, { x: 758, y: 368, duration: 0.8, ease: "power2.inOut" }, "alexDrag");
    tl.to(detail, { scaleX: 1.08, scaleY: 1.06, duration: 0.8, ease: "power2.inOut" }, "alexDrag+=0.05");

    // Francis: open crop on profile
    tl.to(francis, { x: 498, y: 260, duration: 0.6, ease: "power2.out" }, "actions+=0.2");
    tl.addLabel("francisCrop", "actions+=0.9");
    click(francis, rippleFrancis, { x: 498, y: 260 }, "francisCrop");
    tl.to(cropOverlay, { autoAlpha: 1, duration: 0.25 }, "francisCrop+=0.1");

    // Francis: adjust crop
    tl.addLabel("francisAdjust", "francisCrop+=0.6");
    tl.to(francis, { x: 510, y: 250, duration: 0.5, ease: "power2.out" }, "francisAdjust");
    tl.to(cropOverlay, { inset: 18, duration: 0.5, ease: "power2.inOut" }, "francisAdjust+=0.1");

    // === BEAT 3 (7-11s): Xi types, Alex goes to sidebar, Francis drops sticky ===
    tl.addLabel("beat3", "xiDrag+=1.2");

    // Xi: move to text in recipe, start typing
    tl.to(selection, { autoAlpha: 0, duration: 0.15 }, "beat3");
    tl.to(xi, { x: 245, y: 158, duration: 0.5, ease: "power2.out" }, "beat3");
    tl.addLabel("xiType", "beat3+=0.6");
    click(xi, rippleXi, { x: 245, y: 158 }, "xiType");
    tl.to(textCursor, { autoAlpha: 1, duration: 0.1 }, "xiType+=0.1");

    // Xi: type text
    tl.addLabel("typing", "xiType+=0.3");
    tl.add(() => { if (typedText) typedText.textContent = ""; counter.x = 0; }, "typing");
    tl.to(counter, {
      x: typedString.length, duration: 1.2, ease: "none",
      onUpdate: () => { if (typedText) typedText.textContent = typedString.slice(0, Math.round(counter.x)); },
    }, "typing+=0.05");

    // Alex: finish resize, move to properties panel
    tl.to(resizeHandle, { autoAlpha: 0, duration: 0.15 }, "beat3");
    tl.to(alex, { x: 980, y: 460, duration: 0.8, ease: "power2.out" }, "beat3+=0.2");
    tl.addLabel("alexColor", "beat3+=1.1");
    click(alex, rippleAlex, { x: 980, y: 460 }, "alexColor");

    // Alex: color swatch changes
    tl.add(() => {
      if (fillSwatch) gsap.to(fillSwatch, { background: "#b48ea0", duration: 0.3 });
      if (fillHex) fillHex.textContent = "#B48EA0";
      if (detailGradient) gsap.to(detailGradient, { background: `linear-gradient(135deg, ${MAUVE}, #c9a0b4, #e0c8d8)`, duration: 0.5 });
    }, "alexColor+=0.15");

    // Francis: finish crop, move to drop sticky
    tl.to(cropOverlay, { autoAlpha: 0, duration: 0.2 }, "beat3+=0.1");
    tl.to(francis, { x: 490, y: 440, duration: 0.7, ease: "power2.out" }, "beat3+=0.4");
    tl.addLabel("francisSticky", "beat3+=1.2");
    click(francis, rippleFrancis, { x: 490, y: 440 }, "francisSticky");
    tl.to(sticky, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.8)" }, "francisSticky+=0.12");

    // === BEAT 4 (15-18s): Settle ===
    tl.addLabel("settle", "francisSticky+=1.5");
    tl.to(textCursor, { autoAlpha: 0, duration: 0.2 }, "settle");

    // Presence pulse
    tl.to([xi, alex, francis], { scale: 1.12, duration: 0.2, ease: "power2.out" }, "settle+=0.3");
    tl.to([xi, alex, francis], { scale: 1, duration: 0.25, ease: "power2.inOut" }, "settle+=0.5");

    tl.to(xi, { x: 300, y: 300, duration: 0.6, ease: "power2.out" }, "settle+=0.8");
    tl.to(alex, { x: 800, y: 250, duration: 0.6, ease: "power2.out" }, "settle+=0.9");
    tl.to(francis, { x: 500, y: 380, duration: 0.6, ease: "power2.out" }, "settle+=1.0");

    tl.to({}, { duration: 1.2 }, "settle+=1.6");

  }, { scope: rootRef, dependencies: [prefersReduced, scale] });

  const handlePlay = () => {
    if (!tlRef.current) return;
    playing ? tlRef.current.pause() : tlRef.current.play();
    setPlaying(!playing);
  };
  const handleRestart = () => {
    if (!tlRef.current) return;
    tlRef.current.restart();
    setPlaying(true);
  };

  if (prefersReduced) {
    return (
      <div style={{ border: "1px solid #3a3836", borderRadius: 8, padding: 24, textAlign: "center", color: INK_DIM, fontSize: 14, background: SIDEBAR_BG }}>
        Animation paused (prefers-reduced-motion). The demo shows a Figma-style design tool called Ligma with three simultaneous cursors editing a canvas.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ width: "100%", aspectRatio: `${FILM_W} / ${FILM_H}`, overflow: "hidden", position: "relative" }}>
      <div ref={rootRef} style={{
        width: FILM_W, height: FILM_H, transform: `scale(${scale})`, transformOrigin: "top left",
        position: "relative", border: "1px solid #3a3836", borderRadius: 10, overflow: "hidden",
        background: CANVAS_BG, fontFamily: FONT, userSelect: "none",
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", height: "100%" }}>
          <LeftSidebar />
          <div style={{
            flex: 1, position: "relative",
            backgroundImage: "radial-gradient(circle, rgba(180,170,160,0.3) 0.6px, transparent 0.6px)",
            backgroundSize: "20px 20px",
          }}>
            <RecipeScreen />
            <ProfileScreen />
            <DetailCard />
            <ResizeHandle />
            <StickyNote />
            <TextCursor />
            <TypedText />
            <BottomToolbar />
          </div>
          <RightSidebar />
        </div>

        <CursorSVG id="xi" fill={CURSOR_XI} label="Xi" />
        <CursorSVG id="alex" fill={CURSOR_ALEX} label="Alex" />
        <CursorSVG id="francis" fill={CURSOR_FRANCIS} label="Francis" />
        <RippleCircle id="xi" color={CURSOR_XI} />
        <RippleCircle id="alex" color={CURSOR_ALEX} />
        <RippleCircle id="francis" color={CURSOR_FRANCIS} />

        <div style={{
          position: "absolute", bottom: 8, right: 8, zIndex: 60,
          display: "flex", gap: 4,
        }}>
          <ControlButton onClick={handlePlay} ariaLabel={playing ? "Pause" : "Play"}>
            {playing ? <Pause size={12} /> : <Play size={12} />}
          </ControlButton>
          <ControlButton onClick={handleRestart} ariaLabel="Restart">
            <RotateCcw size={12} />
          </ControlButton>
        </div>
      </div>
    </div>
  );
};

export default GsapReferenceBoardDemo;

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Pause, RotateCcw } from "lucide-react";

gsap.registerPlugin(useGSAP);

const FILM_W = 780, FILM_H = 480, CURSOR_START = { x: -40, y: -40 };
const BORDER = "1px solid rgb(212 207 196)";
const BG_LIGHT = "rgb(245 240 232)";
const BG_SURFACE = "rgb(237 234 224)";
const INK = "#1a1a14", INK_MUTED = "#6b6560";
const FONT = "system-ui, -apple-system, sans-serif";
const CARD_SHADOW = "0 1px 3px rgba(26,26,20,0.06), 0 1px 2px rgba(26,26,20,0.04)";
const INSET_SHADOW = "inset 0 1px 2px rgba(26,26,20,0.04)";

const NAV_ITEMS = [
  { id: "tasks", label: "Tasks", icon: "◻" },
  { id: "notes", label: "Notes", icon: "☰" },
  { id: "settings", label: "Settings", icon: "⚙" },
];
const CARDS = [
  { title: "Design mockups", tag: "In Progress" },
  { title: "API endpoints", tag: "Todo" },
  { title: "Write tests", tag: "Todo" },
  { title: "Deploy staging", tag: "Blocked" },
];
const LIST_ITEMS = [
  "Review pull request #42", "Update dependencies", "Fix auth redirect bug",
  "Write migration script", "Add error boundaries",
];
const TYPED_TEXT = "Add unit tests for the auth module";
const ACCENT_COLORS = ["rgb(37,99,235)", INK_MUTED, "rgb(14,165,233)", "rgb(220,38,38)", "rgb(37,99,235)"];
const TAG_STYLES = {
  "In Progress": { bg: "rgba(37,99,235,0.1)", color: "rgb(37,99,235)", border: "1px solid rgba(37,99,235,0.15)" },
  Todo: { bg: BG_SURFACE, color: "rgb(107,101,96)", border: BORDER },
  Blocked: { bg: "rgba(220,38,38,0.08)", color: "rgb(220,38,38)", border: "1px solid rgba(220,38,38,0.12)" },
};

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

function CursorSVG() {
  return (
    <svg data-demo-cursor width="20" height="20" viewBox="0 0 24 24" fill="none"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 50, pointerEvents: "none", filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.2))" }}>
      <path d="M5 3l14 8-6.5 1.5L10 19z" fill={INK} stroke="#fff" strokeWidth="1" />
    </svg>
  );
}

function RippleCircle() {
  return (
    <div data-demo-ripple style={{
      position: "absolute", top: -12, left: -12, width: 24, height: 24,
      borderRadius: "50%", border: "2px solid rgba(37,99,235,0.5)",
      pointerEvents: "none", zIndex: 49, visibility: "hidden", opacity: 0,
    }} />
  );
}

function Sidebar({ activeNav }) {
  const isActive = (id) => activeNav === id;
  return (
    <div data-demo-sidebar style={{
      width: 140, height: "100%", borderRight: BORDER, background: "rgb(237 232 223)",
      flexShrink: 0, display: "flex", flexDirection: "column",
      boxShadow: "inset -4px 0 12px rgba(0,0,0,0.03)",
    }}>
      <div style={{ padding: "14px 12px 10px", display: "flex", alignItems: "center", gap: 8, borderBottom: BORDER }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: "linear-gradient(135deg, rgb(37 99 235), rgb(14 165 233))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#fff", fontWeight: 700,
        }}>W</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>Workspace</div>
      </div>
      <div style={{ padding: "8px 0", display: "flex", flexDirection: "column", gap: 1 }}>
        {NAV_ITEMS.map((item) => (
          <div key={item.id} data-demo-nav={item.id} style={{
            padding: "7px 12px", fontSize: 12.5, cursor: "default", margin: "0 6px",
            borderRadius: 5, transition: "none", display: "flex", alignItems: "center", gap: 8,
            background: isActive(item.id) ? "rgba(37,99,235,0.1)" : "transparent",
            color: isActive(item.id) ? "rgb(37,99,235)" : INK_MUTED,
            fontWeight: isActive(item.id) ? 600 : 400,
          }}>
            <span style={{ fontSize: 11, opacity: 0.7, width: 14, textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: "10px 12px", borderTop: BORDER, fontSize: 10, color: INK_MUTED, display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "rgb(212 207 196)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: INK_MUTED, fontWeight: 600,
        }}>S</div>
        <span>sugam</span>
      </div>
    </div>
  );
}

function ToolbarBtn({ name, label, color, extra }) {
  return (
    <button data-demo-btn={name} style={{
      fontSize: 12, padding: "4px 14px", borderRadius: 5, border: BORDER,
      background: "#fff", color, cursor: "default", fontFamily: FONT,
      boxShadow: "0 1px 2px rgba(26,26,20,0.06)", ...extra,
    }}>{label}</button>
  );
}

function Toolbar() {
  return (
    <div data-demo-toolbar style={{
      height: 40, borderBottom: BORDER, display: "flex", alignItems: "center", padding: "0 14px", gap: 8, background: BG_LIGHT,
    }}>
      <ToolbarBtn name="add" label="+ Add" color={INK} extra={{ fontWeight: 500 }} />
      <ToolbarBtn name="filter" label="Filter" color={INK_MUTED} />
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 11, color: INK_MUTED, background: BG_SURFACE, padding: "3px 8px", borderRadius: 4, fontWeight: 500 }}>4 items</div>
    </div>
  );
}

function CardGrid() {
  return (
    <div data-demo-card-area style={{ flex: 1, padding: 16, display: "flex", flexWrap: "wrap", gap: 12, alignContent: "flex-start" }}>
      {CARDS.map((card, i) => {
        const t = TAG_STYLES[card.tag];
        return (
          <div key={i} data-demo-card={i} style={{
            width: "calc(50% - 6px)", height: 84, border: BORDER, borderRadius: 8,
            background: "#fff", padding: "12px 14px", display: "flex", flexDirection: "column",
            justifyContent: "space-between", visibility: "hidden", opacity: 0, boxShadow: CARD_SHADOW,
          }}>
            <div style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{card.title}</div>
            <div style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 4,
              background: t.bg, color: t.color, border: t.border,
              alignSelf: "flex-start", fontWeight: 500,
            }}>{card.tag}</div>
          </div>
        );
      })}
    </div>
  );
}

function OverlayModal() {
  const inputField = { height: 30, border: BORDER, borderRadius: 5, background: BG_LIGHT, boxShadow: INSET_SHADOW };
  return (
    <div data-demo-overlay style={{
      position: "absolute", inset: 0, background: "rgba(26,26,20,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 30, visibility: "hidden", opacity: 0, backdropFilter: "blur(2px)",
    }}>
      <div style={{
        width: 280, background: "#fff", borderRadius: 10, border: BORDER, padding: 22,
        boxShadow: "0 20px 60px rgba(26,26,20,0.18), 0 4px 16px rgba(26,26,20,0.08)",
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 4 }}>New Task</div>
        <div style={{ fontSize: 11, color: INK_MUTED, marginBottom: 14 }}>Add a task to your workspace</div>
        <div style={{ ...inputField, marginBottom: 8 }} />
        <div style={{ ...inputField, marginBottom: 16 }} />
        <div style={{
          fontSize: 12, padding: "6px 16px", borderRadius: 6, background: "rgb(37,99,235)",
          color: "#fff", textAlign: "center", fontFamily: FONT, fontWeight: 500,
          boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
        }}>Create</div>
      </div>
    </div>
  );
}

function ListView() {
  return (
    <div data-demo-list-view style={{
      position: "absolute", inset: 0, background: BG_LIGHT,
      display: "flex", flexDirection: "column", visibility: "hidden", opacity: 0,
    }}>
      <div style={{
        height: 40, borderBottom: BORDER, display: "flex", alignItems: "center",
        padding: "0 14px", fontSize: 13, fontWeight: 600, color: INK, gap: 8,
      }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>{"☰"}</span>
        Notes
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 10, color: INK_MUTED, background: BG_SURFACE, padding: "2px 7px", borderRadius: 4, fontWeight: 500 }}>5 items</div>
      </div>
      <div style={{ flex: 1, padding: "8px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
        {LIST_ITEMS.map((item, i) => (
          <div key={i} data-demo-list-item={i} style={{
            padding: "8px 12px 8px 14px", border: BORDER, borderRadius: 6,
            borderLeft: `3px solid ${ACCENT_COLORS[i]}`, background: "#fff",
            fontSize: 12, color: INK, visibility: "hidden", opacity: 0,
            boxShadow: "0 1px 2px rgba(26,26,20,0.04)", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, border: "1.5px solid rgb(212 207 196)", flexShrink: 0 }} />
            {item}
          </div>
        ))}
        <div data-demo-input-row style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
          <div data-demo-input style={{
            flex: 1, height: 34, border: BORDER, borderRadius: 6, background: "#fff",
            padding: "0 12px", fontSize: 12, color: INK, display: "flex", alignItems: "center",
            position: "relative", boxShadow: INSET_SHADOW,
          }}>
            <span data-demo-placeholder style={{ color: INK_MUTED, position: "absolute", opacity: 0.6 }}>Add a note...</span>
            <span data-demo-typed style={{ position: "relative", zIndex: 1 }} />
            <span data-demo-caret style={{
              width: 1.5, height: 14, background: "rgb(37,99,235)", marginLeft: 1,
              visibility: "hidden", opacity: 0, borderRadius: 1,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ onClick, ariaLabel, children }) {
  return (
    <button onClick={onClick} aria-label={ariaLabel} style={{
      width: 30, height: 30, borderRadius: 6, border: BORDER, background: "rgba(255,255,255,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      color: INK, backdropFilter: "blur(6px)", boxShadow: "0 1px 4px rgba(26,26,20,0.08)",
    }}>{children}</button>
  );
}

const GsapChoreographyDemo = () => {
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
    const cursor = q("[data-demo-cursor]")[0];
    const ripple = q("[data-demo-ripple]")[0];
    const cards = q("[data-demo-card]");
    const overlay = q("[data-demo-overlay]")[0];
    const listView = q("[data-demo-list-view]")[0];
    const listItems = q("[data-demo-list-item]");
    const placeholder = q("[data-demo-placeholder]")[0];
    const typed = q("[data-demo-typed]")[0];
    const caret = q("[data-demo-caret]")[0];
    const addBtn = q('[data-demo-btn="add"]')[0];
    const filterBtn = q('[data-demo-btn="filter"]')[0];
    const notesNav = q('[data-demo-nav="notes"]')[0];
    const tasksNav = q('[data-demo-nav="tasks"]')[0];
    const input = q("[data-demo-input]")[0];
    const cardArea = q("[data-demo-card-area]")[0];
    const toolbar = q("[data-demo-toolbar]")[0];

    const measure = (el) => {
      const frame = root.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const s = scale || 1;
      return {
        x: Math.round((r.left + r.width / 2 - frame.left) / s),
        y: Math.round((r.top + r.height / 2 - frame.top) / s),
      };
    };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: "power3.out" } });
    tlRef.current = tl;

    const click = (pos, label) => {
      tl.set(ripple, { x: pos.x, y: pos.y, scale: 0.2, autoAlpha: 0.55 }, label)
        .to(cursor, { scale: 0.88, duration: 0.08, ease: "power2.out" }, label)
        .to(ripple, { scale: 3.4, autoAlpha: 0, duration: 0.54, ease: "power2.out" }, label)
        .to(cursor, { scale: 1, duration: 0.16, ease: "back.out(2.2)" }, `${label}+=0.09`);
    };

    // -- Reset --
    tl.add(() => {
      gsap.set(cursor, { x: CURSOR_START.x, y: CURSOR_START.y, scale: 1 });
      gsap.set(cards, { autoAlpha: 0, y: 26, scale: 0.82, rotation: 0 });
      gsap.set(overlay, { autoAlpha: 0, scale: 0.96, y: 10 });
      gsap.set(listView, { autoAlpha: 0 });
      gsap.set(listItems, { autoAlpha: 0, y: 14 });
      gsap.set(typed, { textContent: "" });
      gsap.set(placeholder, { autoAlpha: 1 });
      gsap.set(caret, { autoAlpha: 0 });
      gsap.set(cardArea, { autoAlpha: 1 });
      gsap.set(toolbar, { autoAlpha: 1 });
      [tasksNav, notesNav].forEach((nav) => {
        if (!nav) return;
        const id = nav.getAttribute("data-demo-nav");
        nav.style.background = id === "tasks" ? "rgba(37,99,235,0.1)" : "transparent";
        nav.style.color = id === "tasks" ? "rgb(37,99,235)" : INK_MUTED;
        nav.style.fontWeight = id === "tasks" ? "600" : "400";
      });
    }, 0);

    // -- Scene 1: Cursor enters, clicks Add --
    const addPos = measure(addBtn);
    tl.to(cursor, { x: addPos.x, y: addPos.y, duration: 1.0, ease: "power2.out" }, "enterScene");
    tl.addLabel("addClick", "enterScene+=1.05");
    click(addPos, "addClick");
    const rotations = [-2, 1.5, -1, 2.5];
    tl.to(cards, {
      autoAlpha: 1, y: 0, scale: 1, rotation: (i) => rotations[i], stagger: 0.07, duration: 0.46,
    }, "addClick+=0.16");

    // -- Scene 2: Filter click, overlay --
    tl.addLabel("filterMove", "addClick+=1.4");
    const filterPos = measure(filterBtn);
    tl.to(cursor, { x: filterPos.x, y: filterPos.y, duration: 0.5, ease: "power2.out" }, "filterMove");
    tl.addLabel("filterClick", "filterMove+=0.55");
    click(filterPos, "filterClick");
    tl.to(overlay, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32 }, "filterClick+=0.1");
    tl.to({}, { duration: 1.0 }, "filterClick+=0.9");
    tl.to(overlay, { autoAlpha: 0, duration: 0.22 }, "filterClick+=1.9");

    // -- Scene 3: Notes nav, cross-fade --
    tl.addLabel("navMove", "filterClick+=2.2");
    const notesPos = measure(notesNav);
    tl.to(cursor, { x: notesPos.x, y: notesPos.y, duration: 0.7, ease: "power2.out" }, "navMove");
    tl.addLabel("navClick", "navMove+=0.75");
    click(notesPos, "navClick");
    tl.add(() => {
      if (notesNav) { notesNav.style.background = "rgba(37,99,235,0.1)"; notesNav.style.color = "rgb(37,99,235)"; notesNav.style.fontWeight = "600"; }
      if (tasksNav) { tasksNav.style.background = "transparent"; tasksNav.style.color = INK_MUTED; tasksNav.style.fontWeight = "400"; }
    }, "navClick+=0.08");
    tl.to(cardArea, { autoAlpha: 0, duration: 0.24 }, "navClick+=0.08");
    tl.to(toolbar, { autoAlpha: 0, duration: 0.24 }, "navClick+=0.08");
    tl.to(listView, { autoAlpha: 1, duration: 0.28 }, "navClick+=0.14");
    tl.to(listItems, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.28 }, "navClick+=0.22");

    // -- Scene 4: Input typing --
    tl.addLabel("inputMove", "navClick+=1.4");
    const inputPos = measure(input);
    tl.to(cursor, { x: inputPos.x - 60, y: inputPos.y, duration: 0.6, ease: "power2.out" }, "inputMove");
    tl.addLabel("inputClick", "inputMove+=0.65");
    click({ x: inputPos.x - 60, y: inputPos.y }, "inputClick");
    tl.to(placeholder, { autoAlpha: 0, duration: 0.1 }, "inputClick+=0.2");
    tl.to(caret, { autoAlpha: 1, duration: 0.1 }, "inputClick+=0.2");
    const counter = { x: 0 };
    tl.to(counter, {
      x: TYPED_TEXT.length, duration: 1.8, ease: "none",
      onUpdate: () => { typed.textContent = TYPED_TEXT.slice(0, Math.round(counter.x)); },
    }, "inputClick+=0.35");

    // -- Settle --
    tl.addLabel("settle", "inputClick+=2.5");
    tl.to(cursor, { x: FILM_W / 2, y: FILM_H / 2, duration: 0.72, ease: "power2.out" }, "settle");
    tl.to(caret, { autoAlpha: 0, duration: 0.3 }, "settle+=0.5");
    tl.to({}, { duration: 0.8 }, "settle+=1.0");
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
      <div style={{ border: BORDER, borderRadius: 8, padding: 24, textAlign: "center", color: INK_MUTED, fontSize: 14 }}>
        Animation paused (prefers-reduced-motion is enabled). The demo shows a task management app wireframe with cursor choreography, card staggers, scene transitions, and typed text.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ width: "100%", aspectRatio: `${FILM_W} / ${FILM_H}`, overflow: "hidden", position: "relative" }}>
      <div ref={rootRef} style={{
        width: FILM_W, height: FILM_H, transform: `scale(${scale})`, transformOrigin: "top left",
        position: "relative", border: BORDER, borderRadius: 10, overflow: "hidden",
        background: BG_LIGHT, fontFamily: FONT, userSelect: "none",
        boxShadow: "0 8px 40px rgba(26,26,20,0.12)",
      }}>
        <div style={{ display: "flex", height: "100%" }}>
          <Sidebar activeNav="tasks" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
            <Toolbar />
            <CardGrid />
            <ListView />
            <OverlayModal />
          </div>
        </div>
        <CursorSVG />
        <RippleCircle />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 36,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 10px", zIndex: 60,
          background: "linear-gradient(to top, rgba(245,240,232,0.95), rgba(245,240,232,0))",
        }}>
          <a href="https://costumary.com" target="_blank" rel="noopener noreferrer" style={{
            fontSize: 10, color: INK_MUTED, textDecoration: "none", display: "flex",
            alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 4,
            background: "rgba(255,255,255,0.7)", border: "1px solid rgba(212,207,196,0.5)",
            backdropFilter: "blur(4px)",
          }}>
            See in production <span style={{ fontSize: 11 }}>&rarr;</span>
          </a>
          <div style={{ display: "flex", gap: 4 }}>
            <ControlButton onClick={handlePlay} ariaLabel={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={13} /> : <Play size={13} />}
            </ControlButton>
            <ControlButton onClick={handleRestart} ariaLabel="Restart">
              <RotateCcw size={13} />
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GsapChoreographyDemo;

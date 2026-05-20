import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Pause, RotateCcw } from "lucide-react";

gsap.registerPlugin(useGSAP);

const FILM_W = 920, FILM_H = 580;
const BORDER = "1px solid rgb(212 207 196)";
const BG_LIGHT = "rgb(245 240 232)";
const INK = "#1a1a14", INK_MUTED = "#6b6560";
const FONT = "system-ui, -apple-system, sans-serif";
const CARD_SHADOW = "0 2px 8px rgba(26,26,20,0.08), 0 1px 2px rgba(26,26,20,0.04)";
const ROSE = "rgb(182, 95, 114)";
const GREEN = "#5F7D65";
const AMBER = "#C2902E";
const DOT_BG = "radial-gradient(circle, #D8CCC1 0.65px, transparent 0.65px)";
const ROTATIONS = [-1.8, 1.2, 0.7, 1.7, -1.1, 1.2];

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

function CursorSVG({ dataAttr, fill, label, labelBg }) {
  return (
    <div data-board-cursor={dataAttr} style={{
      position: "absolute", top: 0, left: 0, zIndex: 50, pointerEvents: "none",
      display: "flex", alignItems: "flex-start", gap: 2,
    }}>
      <svg width="17" height="21" viewBox="0 0 18 22" fill="none" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.18))" }}>
        <path d="M3 2L3 18L7.55 13.45H13L3 2Z" fill={fill} stroke="#FBF8F2" strokeLinejoin="round" strokeWidth="1.25" />
      </svg>
      {label && (
        <span style={{
          marginLeft: 2, marginTop: 14, borderRadius: 10, padding: "1px 7px",
          fontSize: 9, fontWeight: 700, color: "#fff", background: labelBg || fill,
          whiteSpace: "nowrap", lineHeight: "16px",
        }}>{label}</span>
      )}
    </div>
  );
}

function RippleCircle() {
  return (
    <div data-board-ripple style={{
      position: "absolute", top: -12, left: -12, width: 24, height: 24,
      borderRadius: "50%", border: `2px solid rgba(182,95,114,0.5)`,
      pointerEvents: "none", zIndex: 49, visibility: "hidden", opacity: 0,
    }} />
  );
}

function Toolbar() {
  const tools = [
    { id: "image", label: "Image", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "note", label: "Note", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { id: "link", label: "Link", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
    { id: "group", label: "Group", icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
  ];
  return (
    <div data-board-toolbar style={{
      position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 20,
      display: "flex", alignItems: "center", gap: 2, borderRadius: 12,
      border: BORDER, background: "rgba(245,240,232,0.92)", padding: "5px 8px",
      backdropFilter: "blur(8px)", boxShadow: "0 2px 8px rgba(26,26,20,0.06)",
    }}>
      {tools.map(({ id, label, icon }) => (
        <div key={id} data-board-tool={id} style={{
          display: "flex", alignItems: "center", gap: 4, padding: "4px 8px",
          borderRadius: 8, fontSize: 10, fontWeight: 600, color: INK,
          fontFamily: FONT, cursor: "default",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
          {label}
        </div>
      ))}
    </div>
  );
}

function RefCard({ index, x, y, width, height, color, label, type }) {
  return (
    <div data-board-card={index} style={{
      position: "absolute", left: x, top: y, width, zIndex: 10,
      borderRadius: 10, border: BORDER, background: "#fff",
      boxShadow: CARD_SHADOW, overflow: "hidden",
      visibility: "hidden", opacity: 0,
    }}>
      <div style={{ height: height || 80, background: color, position: "relative" }}>
        <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
          <line x1="20" y1="0" x2="20" y2="60" stroke="#fff" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="60" stroke="#fff" strokeWidth="0.5" />
          <line x1="80" y1="0" x2="80" y2="60" stroke="#fff" strokeWidth="0.5" />
          <circle cx="50" cy="30" r="12" stroke="#fff" strokeWidth="0.5" fill="none" />
        </svg>
      </div>
      <div style={{ padding: "6px 10px", borderTop: BORDER }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: INK }}>{label}</div>
        <div style={{ fontSize: 8, fontWeight: 600, color: ROSE, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 1 }}>{type}</div>
      </div>
    </div>
  );
}

function StickyNote() {
  return (
    <div data-board-sticky style={{
      position: "absolute", left: 580, top: 330, width: 160, zIndex: 15,
      borderRadius: 10, border: "1px solid rgba(182,95,114,0.2)",
      background: "#FFF9F5", padding: 10,
      boxShadow: "0 4px 14px rgba(26,26,20,0.08)",
      visibility: "hidden", opacity: 0,
    }}>
      <div style={{ fontSize: 16, fontFamily: "Georgia, serif", fontStyle: "italic", color: ROSE, lineHeight: 1.1 }}>Build note</div>
      <div style={{ fontSize: 10, color: INK_MUTED, lineHeight: 1.5, marginTop: 6 }}>
        Seal foam edges before paint. Match trim to darker swatch.
      </div>
    </div>
  );
}

function ColorSwatch() {
  const colors = ["#8B7355", "#5C4A3A", "#C4A97D", "#F0E6D6"];
  return (
    <div data-board-swatch style={{
      position: "absolute", left: 560, top: 170, width: 130, zIndex: 15,
      borderRadius: 10, border: BORDER, background: "#fff",
      boxShadow: CARD_SHADOW, overflow: "hidden",
      visibility: "hidden", opacity: 0,
    }}>
      <div style={{ height: 36, background: "#8B7355", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M7 21a2 2 0 01-2-2V5a2 2 0 012-2h4l2 3h6a2 2 0 012 2v11a2 2 0 01-2 2H7z" /></svg>
      </div>
      <div style={{ padding: "6px 8px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: INK }}>#8B7355</div>
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          {colors.map((hex) => (
            <span key={hex} style={{ width: 14, height: 14, borderRadius: "50%", background: hex, border: BORDER }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoCard() {
  return (
    <div data-board-video style={{
      position: "absolute", left: 710, top: 60, width: 160, zIndex: 15,
      borderRadius: 10, border: BORDER, background: "#fff",
      boxShadow: CARD_SHADOW, overflow: "hidden",
      visibility: "hidden", opacity: 0,
    }}>
      <div style={{
        height: 70, background: "linear-gradient(135deg, #2a2a2a, #4a4a4a, #3a3a3a)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={ROSE}><polygon points="9,6 19,12 9,18" /></svg>
        </span>
      </div>
      <div style={{ padding: "6px 10px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: INK }}>Foam armor walkthrough</div>
        <div style={{ fontSize: 8, color: INK_MUTED, marginTop: 2 }}>youtube.com &middot; 12:34</div>
      </div>
    </div>
  );
}

function LinkCard() {
  return (
    <div data-board-link style={{
      position: "absolute", left: 720, top: 380, width: 155, zIndex: 15,
      borderRadius: 10, border: BORDER, background: "#fff",
      boxShadow: CARD_SHADOW, overflow: "hidden",
      visibility: "hidden", opacity: 0,
    }}>
      <div style={{ height: 56, background: "linear-gradient(135deg, #D4C5B0, #C4A97D, #E8DCC8)" }} />
      <div style={{ padding: "6px 10px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: INK, lineHeight: 1.3 }}>Weathering pigment set</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 3 }}>
          <span style={{ fontSize: 8, color: INK_MUTED }}>Etsy</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: ROSE }}>$24</span>
        </div>
      </div>
    </div>
  );
}

function GroupOutline() {
  return (
    <div data-board-group style={{
      position: "absolute", left: 20, top: 55, width: 510, height: 220, zIndex: 5,
      borderRadius: 14, border: `2px dashed rgba(182,95,114,0.5)`,
      background: "rgba(182,95,114,0.02)",
      visibility: "hidden", opacity: 0,
    }}>
      <span style={{
        position: "absolute", top: -10, left: 16, borderRadius: 10,
        padding: "2px 10px", fontSize: 8, fontWeight: 700,
        color: ROSE, background: "rgba(245,240,232,0.95)",
        border: "1px solid rgba(182,95,114,0.2)",
        textTransform: "uppercase", letterSpacing: "0.1em",
      }}>Reference group</span>
    </div>
  );
}

function ChecklistNote() {
  return (
    <div data-board-checklist style={{
      position: "absolute", left: 30, top: 380, width: 160, zIndex: 15,
      borderRadius: 10, border: BORDER, background: "#fff",
      boxShadow: CARD_SHADOW, overflow: "hidden",
      visibility: "hidden", opacity: 0,
    }}>
      <div style={{ padding: "8px 10px", borderBottom: BORDER }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: INK }}>Assembly checklist</div>
      </div>
      <div style={{ padding: "6px 10px", fontSize: 9, color: INK_MUTED, lineHeight: 1.6 }}>
        <div style={{ fontWeight: 600, color: INK, marginBottom: 2 }}>Pre-assembly</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <span style={{ textDecoration: "line-through", color: INK_MUTED }}>Heat-form panels</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, border: BORDER }} />
          <span>Sand edges smooth</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, border: BORDER }} />
          <span>Glue spine panel</span>
        </div>
      </div>
    </div>
  );
}

function CropOverlay() {
  return (
    <div data-board-crop style={{
      position: "absolute", left: 200, top: 260, width: 200, zIndex: 30,
      borderRadius: 12, border: BORDER, background: "#fff",
      boxShadow: "0 12px 36px rgba(26,26,20,0.16)", overflow: "hidden",
      visibility: "hidden", opacity: 0,
    }}>
      <div style={{ padding: "6px 10px", borderBottom: BORDER }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: INK }}>Crop image</div>
        <div style={{ fontSize: 8, color: INK_MUTED }}>Detail view</div>
      </div>
      <div style={{ height: 80, margin: "6px 10px", borderRadius: 6, background: "linear-gradient(135deg, #8B7355, #C4A97D)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(255,255,255,0.6)" }}>
          <div style={{ position: "absolute", left: "33%", top: 0, height: "100%", width: 1, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ position: "absolute", left: "66%", top: 0, height: "100%", width: 1, background: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, padding: "6px 10px", borderTop: BORDER }}>
        <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, border: BORDER, color: INK_MUTED }}>Cancel</span>
        <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: ROSE, color: "#fff", fontWeight: 600 }}>Save</span>
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

const CARDS = [
  { x: 30, y: 65, width: 140, height: 80, color: "linear-gradient(135deg, #9B8B7A, #C4A97D)", label: "Front reference", type: "Photo" },
  { x: 185, y: 75, width: 140, height: 80, color: "linear-gradient(135deg, #7A8B6A, #A4B97D)", label: "Back detail", type: "Photo" },
  { x: 340, y: 60, width: 140, height: 80, color: "linear-gradient(135deg, #6A7A8B, #7DA4B9)", label: "Cape drape", type: "Photo" },
  { x: 30, y: 190, width: 140, height: 80, color: "linear-gradient(135deg, #8B6A7A, #B97DA4)", label: "Boot closeup", type: "Detail" },
  { x: 200, y: 200, width: 140, height: 80, color: "linear-gradient(135deg, #8B7A6A, #B9A47D)", label: "Armor panel", type: "Material" },
  { x: 370, y: 185, width: 140, height: 80, color: "linear-gradient(135deg, #6A8B7A, #7DB9A4)", label: "Trim sample", type: "Fabric" },
];

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
    const mainCursor = q('[data-board-cursor="main"]')[0];
    const mayaCursor = q('[data-board-cursor="maya"]')[0];
    const joCursor = q('[data-board-cursor="jo"]')[0];
    const ripple = q("[data-board-ripple]")[0];
    const cards = q("[data-board-card]");
    const toolbar = q("[data-board-toolbar]")[0];
    const groupTool = q('[data-board-tool="group"]')[0];
    const noteTool = q('[data-board-tool="note"]')[0];
    const groupOutline = q("[data-board-group]")[0];
    const sticky = q("[data-board-sticky]")[0];
    const swatch = q("[data-board-swatch]")[0];
    const video = q("[data-board-video]")[0];
    const linkCard = q("[data-board-link]")[0];
    const checklist = q("[data-board-checklist]")[0];
    const crop = q("[data-board-crop]")[0];

    const OFF = { x: -50, y: -50 };
    const MAYA_OFF = { x: 970, y: 100 };
    const JO_OFF = { x: -50, y: 630 };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.75, defaults: { ease: "power3.out" } });
    tlRef.current = tl;

    const click = (cursorEl, pos, label) => {
      tl.set(ripple, { x: pos.x, y: pos.y, scale: 0.2, autoAlpha: 0.55 }, label)
        .to(cursorEl, { scale: 0.88, duration: 0.08, ease: "power2.out" }, label)
        .to(ripple, { scale: 3.4, autoAlpha: 0, duration: 0.54, ease: "power2.out" }, label)
        .to(cursorEl, { scale: 1, duration: 0.16, ease: "back.out(2.2)" }, `${label}+=0.09`);
    };

    // --- Reset ---
    tl.add(() => {
      gsap.set(mainCursor, { x: OFF.x, y: OFF.y, scale: 1, autoAlpha: 1 });
      gsap.set(mayaCursor, { x: MAYA_OFF.x, y: MAYA_OFF.y, scale: 1, autoAlpha: 0 });
      gsap.set(joCursor, { x: JO_OFF.x, y: JO_OFF.y, scale: 1, autoAlpha: 0 });
      gsap.set(ripple, { autoAlpha: 0, scale: 0 });
      gsap.set(cards, { autoAlpha: 0, y: 30, scale: 0.8, rotation: 0 });
      gsap.set(groupOutline, { autoAlpha: 0, scale: 0.96 });
      gsap.set(sticky, { autoAlpha: 0, y: 16, scale: 0.94 });
      gsap.set(swatch, { autoAlpha: 0, y: 14, scale: 0.92 });
      gsap.set(video, { autoAlpha: 0, y: 14, scale: 0.92 });
      gsap.set(linkCard, { autoAlpha: 0, y: 14, scale: 0.92 });
      gsap.set(checklist, { autoAlpha: 0, y: 14, scale: 0.92 });
      gsap.set(crop, { autoAlpha: 0, y: 10, scale: 0.96 });
    }, 0);

    // --- 1. Opening: Main cursor enters, drops 6 reference cards ---
    tl.to(mainCursor, { x: 300, y: 180, duration: 1.0, ease: "power2.out" }, "enter")
      .addLabel("dropCards", "enter+=1.05");

    click(mainCursor, { x: 300, y: 180 }, "dropCards");

    tl.to(cards, {
      autoAlpha: 1, y: 0, scale: 1,
      rotation: (i) => ROTATIONS[i],
      stagger: 0.07, duration: 0.46,
    }, "dropCards+=0.16");

    // --- 2. Maya enters, drags a card, opens color swatch ---
    tl.addLabel("mayaEnter", "dropCards+=1.2");
    tl.to(mayaCursor, { autoAlpha: 1, duration: 0.2 }, "mayaEnter")
      .to(mayaCursor, { x: 420, y: 200, duration: 1.0, ease: "power2.out" }, "mayaEnter");

    // Maya drags card[4] from (200,200) to (360,160)
    tl.addLabel("mayaDrag", "mayaEnter+=1.1");
    tl.to(mayaCursor, { x: 260, y: 230, duration: 0.4, ease: "power2.out" }, "mayaDrag")
      .to(cards[4], { left: 320, top: 160, duration: 0.6, ease: "power2.inOut" }, "mayaDrag+=0.2")
      .to(mayaCursor, { x: 380, y: 190, duration: 0.6, ease: "power2.inOut" }, "mayaDrag+=0.2");

    // Maya opens swatch
    tl.addLabel("swatchOpen", "mayaDrag+=1.0");
    tl.to(mayaCursor, { x: 610, y: 200, duration: 0.5, ease: "power2.out" }, "swatchOpen")
      .to(swatch, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36 }, "swatchOpen+=0.5");

    // --- 3. Jo enters, places sticky, opens crop overlay ---
    tl.addLabel("joEnter", "mayaDrag+=0.4");
    tl.to(joCursor, { autoAlpha: 1, duration: 0.2 }, "joEnter")
      .to(joCursor, { x: 620, y: 370, duration: 1.0, ease: "power2.out" }, "joEnter");

    tl.addLabel("stickyPlace", "joEnter+=1.1");
    click(joCursor, { x: 620, y: 370 }, "stickyPlace");
    tl.to(sticky, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38 }, "stickyPlace+=0.12");

    // Jo moves to a card, crop overlay appears
    tl.addLabel("joEdit", "stickyPlace+=0.8");
    tl.to(joCursor, { x: 260, y: 310, duration: 0.6, ease: "power2.out" }, "joEdit")
      .to(crop, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32 }, "joEdit+=0.6");

    // --- 4. Main cursor: Group tool, then Note tool ---
    tl.addLabel("groupMove", "joEdit+=0.3");
    const groupToolPos = { x: 556, y: 22 };
    tl.to(mainCursor, { x: groupToolPos.x, y: groupToolPos.y, duration: 0.72, ease: "power2.out" }, "groupMove")
      .to(groupTool, { background: "rgba(182,95,114,0.15)", color: ROSE, duration: 0.18 }, "groupMove+=0.55");

    tl.addLabel("groupClick", "groupMove+=0.75");
    click(mainCursor, groupToolPos, "groupClick");
    tl.to(groupOutline, { autoAlpha: 1, scale: 1, duration: 0.38 }, "groupClick+=0.1");

    // Note tool
    tl.addLabel("noteMove", "groupClick+=0.8");
    const noteToolPos = { x: 446, y: 22 };
    tl.to(mainCursor, { x: noteToolPos.x, y: noteToolPos.y, duration: 0.5, ease: "power2.out" }, "noteMove")
      .to(groupTool, { background: "transparent", color: INK, duration: 0.14 }, "noteMove")
      .to(noteTool, { background: "rgba(182,95,114,0.15)", color: ROSE, duration: 0.18 }, "noteMove+=0.35");

    tl.addLabel("noteClick", "noteMove+=0.55");
    click(mainCursor, noteToolPos, "noteClick");
    tl.to(checklist, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38 }, "noteClick+=0.12");

    // --- 5. Meanwhile: Maya pastes video, Jo places link card ---
    tl.addLabel("richContent", "noteClick+=0.4");

    // Maya pastes video card (simultaneous with main cursor's note)
    tl.to(mayaCursor, { x: 770, y: 100, duration: 0.7, ease: "power2.out" }, "richContent")
      .to(video, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36 }, "richContent+=0.7");

    // Jo dismisses crop, places link card
    tl.to(crop, { autoAlpha: 0, y: -8, duration: 0.24 }, "richContent+=0.2")
      .to(joCursor, { x: 780, y: 420, duration: 0.8, ease: "power2.out" }, "richContent+=0.5")
      .to(linkCard, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36 }, "richContent+=1.3");

    // --- 6. Breathing room ---
    tl.addLabel("breathe", "richContent+=1.8");
    tl.to({}, { duration: 1.2 }, "breathe");

    // reset tool highlight
    tl.to(noteTool, { background: "transparent", color: INK, duration: 0.14 }, "breathe");

    // --- 7. Settle: all cursors rest ---
    tl.addLabel("settle", "breathe+=1.2");
    tl.to(mainCursor, { x: 460, y: 300, duration: 0.72, ease: "power2.out" }, "settle")
      .to(mayaCursor, { x: 700, y: 180, duration: 0.7, ease: "power2.out" }, "settle+=0.1")
      .to(joCursor, { x: 200, y: 450, duration: 0.7, ease: "power2.out" }, "settle+=0.2");

    // Brief hold before loop
    tl.to({}, { duration: 1.0 }, "settle+=1.0");

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
        Animation paused (prefers-reduced-motion is enabled). The demo shows a collaborative reference board with three cursors placing cards, notes, and media on a canvas simultaneously.
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
        {/* Dot grid canvas background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: DOT_BG, backgroundSize: "16px 16px",
        }} />

        <Toolbar />

        {CARDS.map((card, i) => (
          <RefCard key={i} index={i} {...card} />
        ))}

        <GroupOutline />
        <StickyNote />
        <ColorSwatch />
        <VideoCard />
        <LinkCard />
        <ChecklistNote />
        <CropOverlay />

        <CursorSVG dataAttr="main" fill={INK} />
        <CursorSVG dataAttr="maya" fill={GREEN} label="Maya" labelBg={GREEN} />
        <CursorSVG dataAttr="jo" fill="#F7C66A" label="Jo" labelBg={AMBER} />
        <RippleCircle />

        {/* Controls */}
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

export default GsapReferenceBoardDemo;

import { useState, useLayoutEffect, useRef, Fragment } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import {
  useCardGridColumns,
  rowIndexForItem,
  rowStartIndices,
} from "../hooks/useCardGridColumns";

// Abstract SVG thumbnails — one per project
const Thumb = {
  DeepseekGo: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0"/>
      {[0,1,2,3,4,5].map(i => (
        <text key={i} x={10 + i*34} y="75" fontFamily="monospace" fontSize="11" fill="#1a1a14" opacity={0.12 + i*0.1}>
          {"func()"}
        </text>
      ))}
      <text x="18" y="42" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="#1a1a14" opacity="0.7">Go</text>
      <text x="18" y="62" fontFamily="monospace" fontSize="10" fill="#6b6560">pkg / deepseek-go</text>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={18 + i*36} y="90" width="28" height="3" rx="1" fill="#1a1a14" opacity={0.08 + i*0.06}/>
      ))}
      {[0,1,2,3].map(i => (
        <rect key={i} x={18 + i*42} y="100" width="34" height="3" rx="1" fill="#1a1a14" opacity={0.06 + i*0.05}/>
      ))}
      <circle cx="190" cy="28" r="18" fill="none" stroke="#1a1a14" strokeWidth="1" opacity="0.15"/>
      <circle cx="190" cy="28" r="10" fill="none" stroke="#1a1a14" strokeWidth="1" opacity="0.2"/>
    </svg>
  ),
  Ripple: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0"/>
      {[0,1,2,3].map(i => (
        <ellipse key={i} cx="110" cy="70" rx={20 + i*22} ry={12 + i*13} fill="none" stroke="#1a1a14" strokeWidth="1" opacity={0.25 - i*0.05}/>
      ))}
      <rect x="78" y="48" width="64" height="44" rx="3" fill="none" stroke="#1a1a14" strokeWidth="1.5" opacity="0.5"/>
      <rect x="84" y="54" width="52" height="32" rx="2" fill="#1a1a14" opacity="0.07"/>
      <text x="98" y="74" fontFamily="monospace" fontSize="9" fill="#1a1a14" opacity="0.6">3D</text>
      <text x="18" y="125" fontFamily="monospace" fontSize="9" fill="#6b6560" opacity="0.7">Next.js · Go · Firebase</text>
    </svg>
  ),
  Cohesion: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0"/>
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={28 + i*60} y="30" width="44" height="24" rx="2" fill="none" stroke="#1a1a14" strokeWidth="1.2" opacity="0.4"/>
          <rect x={28 + i*60} y="30" width="44" height="8" rx="2" fill="#1a1a14" opacity="0.08"/>
        </g>
      ))}
      <line x1="72" y1="42" x2="88" y2="42" stroke="#1a1a14" strokeWidth="1" opacity="0.3"/>
      <line x1="132" y1="42" x2="148" y2="42" stroke="#1a1a14" strokeWidth="1" opacity="0.3"/>
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={28 + i*60} y="78" width="44" height="24" rx="2" fill="none" stroke="#1a1a14" strokeWidth="1.2" opacity="0.25"/>
          <line x1={28 + i*60 + 22} y1="54" x2={28 + i*60 + 22} y2="78" stroke="#1a1a14" strokeWidth="1" opacity="0.2" strokeDasharray="3,3"/>
        </g>
      ))}
      <text x="18" y="125" fontFamily="monospace" fontSize="9" fill="#6b6560" opacity="0.7">AI · SQL · Go · Docker</text>
    </svg>
  ),
  Danime: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0"/>
      <circle cx="110" cy="58" r="32" fill="none" stroke="#1a1a14" strokeWidth="1.2" opacity="0.3"/>
      <circle cx="110" cy="58" r="22" fill="#1a1a14" opacity="0.06"/>
      <text x="96" y="63" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="#1a1a14" opacity="0.5">Bot</text>
      {[0,1,2,3,4,5].map(i => {
        const angle = (i / 6) * Math.PI * 2;
        return <circle key={i} cx={110 + Math.cos(angle)*42} cy={58 + Math.sin(angle)*42} r="3" fill="#1a1a14" opacity="0.18"/>;
      })}
      <text x="18" y="115" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#1a1a14" opacity="0.5">1M+ users</text>
      <text x="18" y="128" fontFamily="monospace" fontSize="9" fill="#6b6560" opacity="0.7">Python · Discord API · MongoDB</text>
    </svg>
  ),
  Moksha: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0"/>
      {[0,1,2,3,4].map(i => (
        <circle key={i} cx={44 + i*34} cy="62" r="16" fill="none" stroke="#1a1a14" strokeWidth="1" opacity={0.15 + i*0.05}/>
      ))}
      {[0,1,2,3].map(i => (
        <line key={i} x1={60 + i*34} y1="62" x2={78 + i*34} y2="62" stroke="#1a1a14" strokeWidth="1" opacity="0.2"/>
      ))}
      <text x="18" y="105" fontFamily="monospace" fontSize="9" fill="#6b6560" opacity="0.7">Self-help · Community · React</text>
      <text x="18" y="120" fontFamily="monospace" fontSize="9" fill="#1a1a14" opacity="0.4">50+ users · 1k+ views</text>
    </svg>
  ),
  Pali: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0"/>
      <rect x="18" y="22" width="184" height="96" rx="6" fill="none" stroke="#1a1a14" strokeWidth="1.2" opacity="0.3"/>
      <rect x="28" y="34" width="164" height="10" rx="2" fill="#1a1a14" opacity="0.08"/>
      {[0,1,2,3].map(i => (
        <rect key={i} x={28} y={54 + i*14} width={140 - i*12} height="6" rx="2" fill="#1a1a14" opacity={0.1 + i*0.03}/>
      ))}
      <circle cx="180" cy="94" r="14" fill="none" stroke="#1a1a14" strokeWidth="1" opacity="0.2"/>
      <circle cx="180" cy="94" r="6" fill="#1a1a14" opacity="0.08"/>
      <text x="28" y="116" fontFamily="monospace" fontSize="9" fill="#6b6560" opacity="0.7">Memory · MCP · Qdrant</text>
    </svg>
  ),
};

const items = [
  {
    title: "Pali",
    thumb: "Pali",
    anchorId: "project-pali",
    tag: "Open Source · Go",
    type: "project",
    description: "Open memory runtime for LLM apps and agent systems.",
    link: "https://github.com/pali-mem/pali",
    linkLabel: "View on GitHub",
    linkIcon: "github",
    achievements: [
      "Local-first, multi-tenant memory runtime with REST, MCP, and dashboard surfaces for operators",
      "Hybrid retrieval pipeline (lexical + vector) with configurable fusion and reranking",
      "Benchmark: LoCoMo medium500 (500/231) with qdrant + ollama achieved performance_score=100.00, p95=126.509ms, search 6.624 ops/s, Top1=0.337662, Recall@5=0.515873 (2026-03-12)"
    ]
  },
  {
    title: "Deepseek-Go",
    thumb: "DeepseekGo",
    tag: "Open Source · Go",
    type: "project",
    description: "A Deepseek API client library written for Go.",
    link: "https://github.com/cohesion-org/deepseek-go",
    linkLabel: "View on GitHub",
    linkIcon: "github",
    achievements: [
      "300+ stars, 100+ dependents, and 10+ collaborators on GitHub",
      "Full API coverage for Deepseek R-1, Chat V3, and Coder models including streaming conversations",
      "Comprehensive unit + functional testing with CI/CD actions for automated deployment"
    ]
  },
  {
    title: "Ripple",
    thumb: "Ripple",
    tag: "Full Stack · Next.js",
    type: "project",
    description: "Web application for creating, playing, and sharing flashcards in 3D.",
    link: "https://github.com/saphalpdyl/ripple",
    linkLabel: "View on GitHub",
    linkIcon: "github",
    achievements: [
      "Next.js frontend + Go backend, deployed on Cloud Run with Firebase for storage",
      "Turborepo monorepo management for efficient development and deployment workflows",
      "OCR via Tesseract and text-to-speech powered by OpenAI for advanced interactivity"
    ]
  },
  {
    title: "Cohesion",
    thumb: "Cohesion",
    tag: "AI · Open Source",
    type: "project",
    description: "AI-powered assistant for SQL schema generation.",
    link: "https://github.com/saphalpdyl/Cohesion",
    linkLabel: "View on GitHub",
    linkIcon: "github",
    achievements: [
      "Reduced SQL schema generation time by 70% through AI-powered automation",
      "Custom SS-CSV format improving data processing performance by 200%",
      "Backend testing system with Go, Gin, and Docker — 500% benchmarking speed gain"
    ]
  },
  {
    title: "Danime",
    thumb: "Danime",
    tag: "Bot · Python",
    type: "project",
    description: "OpenSource Discord bot with 1M+ users.",
    link: "https://github.com/Danimebot/danime",
    linkLabel: "View on GitHub",
    linkIcon: "github",
    achievements: [
      "Discord-verified bot with 1,000,000+ users and 2,000,000+ API calls",
      "Server management tools and entertainment commands for community engagement",
      "Python, Discord API, Flask, MongoDB — scalable and maintainable architecture"
    ]
  },
  {
    title: "Moksha",
    thumb: "Moksha",
    tag: "Full Stack · React",
    type: "project",
    description: "Full-stack self-help social media platform.",
    link: "https://mokshaa.vercel.app/",
    linkLabel: "View Live",
    linkIcon: "external",
    achievements: [
      "React JS + Tailwind CSS frontend with Firebase community forum backend",
      "Google Auth login — 50+ users, 1,000+ page views",
      "OpenSource teen-focused self-help platform with guides, testimonials, and community support"
    ]
  },
];

const DETAIL_PANEL_ID = "projects-detail-panel";

const Projects = () => {
  const [selected, setSelected] = useState(null);
  const cols = useCardGridColumns(3);
  const detailRef = useRef(null);

  const activeItem = selected !== null ? items[selected] : null;
  const selectedRow = selected !== null ? rowIndexForItem(selected, cols) : null;

  useLayoutEffect(() => {
    if (selected === null || !detailRef.current) return;
    detailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected, cols]);

  const rowStarts = rowStartIndices(items.length, cols);
  const gridColsClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="w-full min-w-0">
      <h2 className="text-2xl font-bold mb-6 text-ink-dark">Projects</h2>

      <div className="border border-border-paper w-full min-w-0 overflow-hidden">
        <div className="flex flex-col gap-px bg-border-paper w-full min-w-0">
          {rowStarts.map((start, rowIdx) => {
            const indices = [];
            for (let k = 0; k < cols && start + k < items.length; k++) {
              indices.push(start + k);
            }
            return (
              <Fragment key={start}>
                <div className={`grid w-full min-w-0 gap-px bg-border-paper ${gridColsClass}`}>
                  {indices.map((i) => {
                    const item = items[i];
                    const ThumbComp = Thumb[item.thumb];
                    const isActive = selected === i;
                    return (
                      <button
                        key={i}
                        id={item.anchorId}
                        type="button"
                        onClick={() => setSelected(isActive ? null : i)}
                        className={`group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-blue/40 focus-visible:ring-inset transition-colors duration-200 ${item.anchorId ? "scroll-mt-28" : ""} ${isActive ? "bg-paper-surface" : "bg-paper-light hover:bg-ink-dark"}`}
                        aria-expanded={isActive}
                        aria-controls={isActive ? DETAIL_PANEL_ID : undefined}
                      >
                        <div
                          className={`w-full overflow-hidden border-b transition-colors duration-200 ${isActive ? "border-ink-dark/20" : "border-border-paper group-hover:border-paper-light/10"}`}
                          style={{ aspectRatio: "220/140" }}
                        >
                          {ThumbComp ? (
                            <ThumbComp />
                          ) : (
                            <div className="w-full h-full bg-paper-surface flex items-center justify-center">
                              <span className="text-ink-muted text-xs font-mono">[ no preview ]</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex flex-col gap-1 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-sm font-bold leading-tight transition-colors ${isActive ? "text-ink-blue" : "text-ink-dark group-hover:text-paper-light"}`}
                            >
                              {item.title}
                            </span>
                            <span className="text-[10px] text-ink-muted mt-0.5 shrink-0 font-mono group-hover:text-paper-light/50">
                              {isActive ? "↑" : "↓"}
                            </span>
                          </div>
                          <span className="text-[10px] text-ink-muted font-mono uppercase tracking-wider group-hover:text-paper-light/50">
                            {item.tag}
                          </span>
                          <p className="text-xs text-ink-muted leading-snug line-clamp-2 mt-0.5 group-hover:text-paper-light/40">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {activeItem && selectedRow === rowIdx && (
                  <div
                    ref={detailRef}
                    id={DETAIL_PANEL_ID}
                    role="region"
                    aria-label={`Details for ${activeItem.title}`}
                    className="w-full min-w-0 border-t border-ink-dark/30 bg-ink-dark px-4 sm:px-6 py-5 scroll-mt-24"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-paper-light">{activeItem.title}</h3>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-paper-light/40">{activeItem.tag}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="text-paper-light/40 hover:text-ink-red text-xs font-mono shrink-0 mt-0.5 transition-colors duration-150"
                      >
                        [ close ✕ ]
                      </button>
                    </div>

                    <ul className="space-y-2 mb-5">
                      {activeItem.achievements.map((a, j) => (
                        <li key={j} className="flex gap-2 text-sm text-paper-light/80 leading-relaxed break-words [overflow-wrap:anywhere]">
                          <span className="text-paper-light/30 shrink-0 mt-0.5">—</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-4 flex-wrap">
                      <a
                        href={activeItem.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-ink-blue hover:underline"
                      >
                        {activeItem.linkIcon === "github" && <FaGithub className="h-3 w-3" />}
                        {activeItem.linkIcon === "external" && <FaExternalLinkAlt className="h-3 w-3" />}
                        {activeItem.linkLabel}
                        <FaExternalLinkAlt className="h-2.5 w-2.5 opacity-50" />
                      </a>
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;

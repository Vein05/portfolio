import React, { useState, useEffect } from "react";
import { FaGithub, FaExternalLinkAlt, FaFileAlt } from "react-icons/fa";

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
  ResearchPaper: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0"/>
      <rect x="76" y="22" width="58" height="76" rx="2" fill="none" stroke="#1a1a14" strokeWidth="1.2" opacity="0.35"/>
      <rect x="76" y="22" width="58" height="13" rx="2" fill="#1a1a14" opacity="0.07"/>
      <polyline points="118,22 134,22 134,38 118,22" fill="#edeae0" stroke="#1a1a14" strokeWidth="1" opacity="0.3"/>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x="83" y={42 + i*8} width={i === 0 ? 40 : i % 3 === 0 ? 26 : 44} height="2.5" rx="1" fill="#1a1a14" opacity="0.12"/>
      ))}
      <text x="150" y="72" fontFamily="monospace" fontSize="22" fill="#1a1a14" opacity="0.1">♻</text>
      <text x="20" y="128" fontFamily="monospace" fontSize="8" fill="#6b6560" opacity="0.7">CIB Conf. · 2025 · Purdue</text>
    </svg>
  ),
};

const items = [
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
    title: "Plastic Recycling in Construction",
    thumb: "ResearchPaper",
    tag: "Research Paper · 2025",
    type: "research",
    description: "A Comprehensive Review of Plastic Recycling in the Construction Industry: Challenges and Opportunities in the US.",
    link: "https://docs.lib.purdue.edu/cib-conferences/vol1/iss1/63/",
    linkLabel: "Read on Purdue eLib",
    linkIcon: "paper",
    doi: "10.7771/3067-4883.2081",
    achievements: [
      "Authors: Sugam Panthi, Fan Zhang",
      "Published in CIB Conferences — Vol. 1, Iss. 1, p. 63 (2025)",
      "DOI: 10.7771/3067-4883.2081",
      "Reviews challenges and opportunities in repurposing plastic waste as construction materials across the US"
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

const Projects = () => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (document.querySelector('script[src*="cdn.plu.mx/widget-popup.js"]')) return;
    const s = document.createElement('script');
    s.src = 'https://cdn.plu.mx/widget-popup.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const active = selected !== null ? items[selected] : null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-ink-dark">Projects &amp; Research</h2>

      <div className="border border-border-paper">
        {/* Card grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-border-paper">
          {items.map((item, i) => {
            const ThumbComp = Thumb[item.thumb];
            const isActive = selected === i;
            return (
              <button
                key={i}
                onClick={() => setSelected(isActive ? null : i)}
                className={`group flex flex-col text-left focus:outline-none transition-colors duration-200 ${isActive ? "bg-paper-surface" : "bg-paper-light hover:bg-ink-dark"}`}
                aria-expanded={isActive}
              >
                <div className={`w-full overflow-hidden border-b transition-colors duration-200 ${isActive ? "border-ink-dark/20" : "border-border-paper group-hover:border-paper-light/10"}`} style={{ aspectRatio: "220/140" }}>
                  {ThumbComp ? <ThumbComp /> : (
                    <div className="w-full h-full bg-paper-surface flex items-center justify-center">
                      <span className="text-ink-muted text-xs font-mono">[ no preview ]</span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-bold leading-tight transition-colors ${isActive ? "text-ink-blue" : "text-ink-dark group-hover:text-paper-light"}`}>
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

        {/* Group expand panel — full width, below the entire grid */}
        {active && (
          <div className="border-t border-ink-dark/30 bg-ink-dark px-6 py-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-paper-light">{active.title}</h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-paper-light/40">{active.tag}</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-paper-light/40 hover:text-ink-red text-xs font-mono shrink-0 mt-0.5 transition-colors duration-150"
              >
                [ close ✕ ]
              </button>
            </div>

            <ul className="space-y-2 mb-5">
              {active.achievements.map((a, j) => (
                <li key={j} className="flex gap-2 text-sm text-paper-light/80 leading-relaxed">
                  <span className="text-paper-light/30 shrink-0 mt-0.5">—</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 flex-wrap">
              <a
                href={active.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-ink-blue hover:underline"
              >
                {active.linkIcon === "github" && <FaGithub className="h-3 w-3" />}
                {active.linkIcon === "paper" && <FaFileAlt className="h-3 w-3" />}
                {active.linkIcon === "external" && <FaExternalLinkAlt className="h-3 w-3" />}
                {active.linkLabel}
                <FaExternalLinkAlt className="h-2.5 w-2.5 opacity-50" />
              </a>
              {active.type === "research" && active.doi && (
                <a
                  href={`https://plu.mx/plum/a/?doi=${encodeURIComponent(active.doi)}`}
                  className="plumx-plum-print-popup text-xs text-paper-light/40 hover:text-ink-blue"
                  data-hide-when-empty="true"
                  data-doi={active.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PlumX metrics
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
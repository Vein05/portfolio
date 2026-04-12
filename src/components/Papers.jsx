import { useEffect, useState, useLayoutEffect, useRef, Fragment } from "react";
import { FaExternalLinkAlt, FaFileAlt } from "react-icons/fa";
import {
  useCardGridColumns,
  rowIndexForItem,
  rowStartIndices,
} from "../hooks/useCardGridColumns";

const Thumb = {
  PlasticRecycling: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0" />
      <rect x="74" y="20" width="72" height="84" rx="2" fill="none" stroke="#1a1a14" strokeWidth="1.2" opacity="0.35" />
      <rect x="74" y="20" width="72" height="14" rx="2" fill="#1a1a14" opacity="0.07" />
      <polyline points="130,20 146,20 146,36 130,20" fill="#edeae0" stroke="#1a1a14" strokeWidth="1" opacity="0.3" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x="82"
          y={44 + i * 10}
          width={i === 0 ? 52 : i % 2 === 0 ? 44 : 36}
          height="3"
          rx="1"
          fill="#1a1a14"
          opacity={0.12 + i * 0.03}
        />
      ))}
      <circle cx="160" cy="70" r="16" fill="none" stroke="#1a1a14" strokeWidth="1" opacity="0.22" />
      <path d="M154 70l4-7 4 7-4 7z" fill="#1a1a14" opacity="0.1" />
      <text x="22" y="126" fontFamily="monospace" fontSize="8" fill="#6b6560" opacity="0.75">
        Construction · Recycling · US
      </text>
    </svg>
  ),
  TargetChoice: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#edeae0" />
      <circle cx="110" cy="62" r="36" fill="none" stroke="#1a1a14" strokeWidth="1.2" opacity="0.28" />
      <circle cx="110" cy="62" r="24" fill="none" stroke="#1a1a14" strokeWidth="1.2" opacity="0.22" />
      <circle cx="110" cy="62" r="12" fill="#1a1a14" opacity="0.08" />
      <circle cx="110" cy="62" r="4" fill="#1a1a14" opacity="0.4" />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={0.22 + i * 0.08}>
          <line x1={44 + i * 18} y1={28 + i * 10} x2={80 + i * 10} y2={48 + i * 8} stroke="#1a1a14" strokeWidth="1" />
          <circle cx={44 + i * 18} cy={28 + i * 10} r="3" fill="#1a1a14" />
        </g>
      ))}
      <text x="22" y="116" fontFamily="monospace" fontSize="9" fill="#6b6560" opacity="0.75">
        Raw · Source · Canonical
      </text>
      <text x="22" y="130" fontFamily="monospace" fontSize="8" fill="#6b6560" opacity="0.6">
        Fixed-output audit
      </text>
    </svg>
  ),
};

const papers = [
  {
    title: "A Comprehensive Review of Plastic Recycling in the Construction Industry: Challenges and Opportunities in the US",
    thumb: "PlasticRecycling",
    tag: "Research Paper · 2025",
    summary: "A review of plastic recycling pathways and the main barriers to construction reuse in the US.",
    link: "https://docs.lib.purdue.edu/cib-conferences/vol1/iss1/63/",
    linkLabel: "Read on Purdue eLib",
    linkIcon: "external",
    doi: "10.7771/3067-4883.2081",
    details: [
      "Authors: Sugam Panthi, Fan Zhang",
      "Published in CIB Conferences — Vol. 1, Iss. 1, p. 63",
      "DOI: 10.7771/3067-4883.2081",
    ],
  },
  {
    title: "When Target Choice Changes Benchmark Conclusions in Transformed Conversational Memory",
    thumb: "TargetChoice",
    tag: "Research Paper",
    summary: "Shows how benchmark conclusions can change even when the ranked retrieval output stays fixed.",
    link: "/When_Target_Choice_Changes_Benchmark_Conclusions_in_Transformed_Conversational_Memory.pdf",
    linkLabel: "View PDF",
    linkIcon: "paper",
    details: [
      "Sugam Panthi",
      "Fixed-output audit over Raw, Source, and Canonical targets",
      "Implemented as TIAP in MTEL-Mem for rescoring saved retrieval traces",
    ],
  },
];

const DETAIL_PANEL_ID = "papers-detail-panel";

const Papers = () => {
  const [selected, setSelected] = useState(null);
  const cols = useCardGridColumns(2);
  const detailRef = useRef(null);

  const activeItem = selected !== null ? papers[selected] : null;
  const selectedRow = selected !== null ? rowIndexForItem(selected, cols) : null;

  useLayoutEffect(() => {
    if (selected === null || !detailRef.current) return;
    detailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected, cols]);

  useEffect(() => {
    if (document.querySelector('script[src*="cdn.plu.mx/widget-popup.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://cdn.plu.mx/widget-popup.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const rowStarts = rowStartIndices(papers.length, cols);
  const gridColsClass = cols === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className="w-full min-w-0">
      <h2 className="text-2xl font-bold mb-6 text-ink-dark">Papers</h2>

      <div className="border border-border-paper w-full min-w-0 overflow-hidden">
        <div className="flex flex-col gap-px bg-border-paper w-full min-w-0">
          {rowStarts.map((start, rowIdx) => {
            const indices = [];
            for (let k = 0; k < cols && start + k < papers.length; k++) {
              indices.push(start + k);
            }
            return (
              <Fragment key={start}>
                <div className={`grid w-full min-w-0 gap-px bg-border-paper ${gridColsClass}`}>
                  {indices.map((i) => {
                    const item = papers[i];
                    const ThumbComp = Thumb[item.thumb];
                    const isActive = selected === i;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setSelected(isActive ? null : i)}
                        className={`group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-blue/40 focus-visible:ring-inset transition-colors duration-200 ${isActive ? "bg-paper-surface" : "bg-paper-light hover:bg-ink-dark"}`}
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
                            {item.summary}
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

                    <p className="text-sm text-paper-light/80 leading-relaxed mb-5 break-words [overflow-wrap:anywhere]">
                      {activeItem.summary}
                    </p>

                    <ul className="space-y-2 mb-5">
                      {activeItem.details.map((detail) => (
                        <li key={detail} className="flex gap-2 text-sm text-paper-light/80 leading-relaxed break-words [overflow-wrap:anywhere]">
                          <span className="text-paper-light/30 shrink-0 mt-0.5">—</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-4 flex-wrap">
                      <a
                        href={activeItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-ink-blue hover:underline"
                      >
                        {activeItem.linkIcon === "paper" ? <FaFileAlt className="h-3 w-3" /> : <FaExternalLinkAlt className="h-3 w-3" />}
                        {activeItem.linkLabel}
                        <FaExternalLinkAlt className="h-2.5 w-2.5 opacity-50" />
                      </a>
                      {activeItem.doi && (
                        <a
                          href={`https://plu.mx/plum/a/?doi=${encodeURIComponent(activeItem.doi)}`}
                          className="plumx-plum-print-popup text-xs text-paper-light/40 hover:text-ink-blue"
                          data-hide-when-empty="true"
                          data-doi={activeItem.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          PlumX metrics
                        </a>
                      )}
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

export default Papers;

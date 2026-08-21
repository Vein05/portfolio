import { useEffect, useState, useLayoutEffect, useRef, Fragment } from "react";
import { ExternalLink, FileText, Copy, Check } from "lucide-react";
import {
  useCardGridColumns,
  rowIndexForItem,
  rowStartIndices,
} from "../hooks/useCardGridColumns";
import { citations } from "../data/citations";

const Thumb = {
  OutcomeMonitor: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="rgb(var(--color-paper-surface))" />
      {/* tool result panel */}
      <rect x="30" y="26" width="88" height="62" rx="3" fill="none" stroke="rgb(var(--color-ink-dark))" strokeWidth="1.2" opacity="0.32" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="40" y={36 + i * 11} width={i === 3 ? 34 : 62} height="3" rx="1" fill="rgb(var(--color-ink-dark))" opacity={0.14 + i * 0.03} />
      ))}
      {/* violated-property flag (receipt) */}
      <path d="M118 40 h30 l-6 8 l6 8 h-30 z" fill="rgb(var(--color-ink-red))" opacity="0.5" />
      <circle cx="118" cy="56" r="3" fill="rgb(var(--color-ink-red))" opacity="0.8" />
      {/* recovery branch to an open door */}
      <path d="M74 88 q0 26 44 26 h32" fill="none" stroke="rgb(var(--color-ink-blue))" strokeWidth="1.3" opacity="0.5" strokeDasharray="4 3" />
      <rect x="150" y="98" width="34" height="30" rx="2" fill="none" stroke="rgb(var(--color-ink-blue))" strokeWidth="1.2" opacity="0.45" />
      <line x1="167" y1="98" x2="167" y2="128" stroke="rgb(var(--color-ink-blue))" strokeWidth="1" opacity="0.35" />
      <text x="22" y="126" fontFamily="monospace" fontSize="8" fill="rgb(var(--color-ink-muted))" opacity="0.75">
        Tools · Receipts · Recovery
      </text>
    </svg>
  ),
  PlasticRecycling: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="rgb(var(--color-paper-surface))" />
      <rect x="74" y="20" width="72" height="84" rx="2" fill="none" stroke="rgb(var(--color-ink-dark))" strokeWidth="1.2" opacity="0.35" />
      <rect x="74" y="20" width="72" height="14" rx="2" fill="rgb(var(--color-ink-dark))" opacity="0.07" />
      <polyline points="130,20 146,20 146,36 130,20" fill="rgb(var(--color-paper-surface))" stroke="rgb(var(--color-ink-dark))" strokeWidth="1" opacity="0.3" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x="82"
          y={44 + i * 10}
          width={i === 0 ? 52 : i % 2 === 0 ? 44 : 36}
          height="3"
          rx="1"
          fill="rgb(var(--color-ink-dark))"
          opacity={0.12 + i * 0.03}
        />
      ))}
      <circle cx="160" cy="70" r="16" fill="none" stroke="rgb(var(--color-ink-dark))" strokeWidth="1" opacity="0.22" />
      <path d="M154 70l4-7 4 7-4 7z" fill="rgb(var(--color-ink-dark))" opacity="0.1" />
      <text x="22" y="126" fontFamily="monospace" fontSize="8" fill="rgb(var(--color-ink-muted))" opacity="0.75">
        Construction · Recycling · US
      </text>
    </svg>
  ),
  TargetChoice: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="rgb(var(--color-paper-surface))" />
      <circle cx="110" cy="62" r="36" fill="none" stroke="rgb(var(--color-ink-dark))" strokeWidth="1.2" opacity="0.28" />
      <circle cx="110" cy="62" r="24" fill="none" stroke="rgb(var(--color-ink-dark))" strokeWidth="1.2" opacity="0.22" />
      <circle cx="110" cy="62" r="12" fill="rgb(var(--color-ink-dark))" opacity="0.08" />
      <circle cx="110" cy="62" r="4" fill="rgb(var(--color-ink-dark))" opacity="0.4" />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={0.22 + i * 0.08}>
          <line x1={44 + i * 18} y1={28 + i * 10} x2={80 + i * 10} y2={48 + i * 8} stroke="rgb(var(--color-ink-dark))" strokeWidth="1" />
          <circle cx={44 + i * 18} cy={28 + i * 10} r="3" fill="rgb(var(--color-ink-dark))" />
        </g>
      ))}
      <text x="22" y="116" fontFamily="monospace" fontSize="9" fill="rgb(var(--color-ink-muted))" opacity="0.75">
        Raw · Source · Canonical
      </text>
      <text x="22" y="130" fontFamily="monospace" fontSize="8" fill="rgb(var(--color-ink-muted))" opacity="0.6">
        Fixed-output audit
      </text>
    </svg>
  ),
  ReaderScaling: () => (
    <svg viewBox="0 0 220 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="rgb(var(--color-paper-surface))" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={40 + i * 38}
          y={90 - [30, 52, 44, 60][i]}
          width="24"
          height={[30, 52, 44, 60][i]}
          rx="2"
          fill="rgb(var(--color-ink-dark))"
          opacity={0.08 + i * 0.06}
        />
      ))}
      <line x1="32" y1="92" x2="196" y2="92" stroke="rgb(var(--color-ink-dark))" strokeWidth="1" opacity="0.25" />
      <path d="M38 78 Q70 42, 100 56 T164 34" fill="none" stroke="rgb(var(--color-ink-dark))" strokeWidth="1.4" opacity="0.3" strokeDasharray="4 3" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={52 + i * 38} cy={[78, 56, 62, 46][i]} r="3" fill="rgb(var(--color-ink-dark))" opacity={0.25 + i * 0.06} />
      ))}
      <text x="22" y="116" fontFamily="monospace" fontSize="9" fill="rgb(var(--color-ink-muted))" opacity="0.75">
        RAG · Compression · Readers
      </text>
      <text x="22" y="130" fontFamily="monospace" fontSize="8" fill="rgb(var(--color-ink-muted))" opacity="0.6">
        Reader scaling audit
      </text>
    </svg>
  ),
};

export const papers = [
  {
    title: "Outcome Monitors: Recovery Affordances for Silent Tool Failures",
    thumb: "OutcomeMonitor",
    anchorId: "research-outcome-monitors",
    citeKey: "outcome-monitors",
    tag: "Research Paper · arXiv 2026",
    summary: "Introduces outcome monitors that detect silent tool failures against contracts mined from task-disjoint traces, then attach a nonbinding receipt naming the violated property and public recovery tools. Raises ToolMaze completion from 10.9% to 28.1%.",
    link: "https://arxiv.org/abs/2608.19303",
    linkLabel: "Read on arXiv",
    linkIcon: "external",
    doi: "10.48550/arXiv.2608.19303",
    details: [
      "Authors: Sugam Panthi, Rabab Abdelfattah",
      "Submitted to arXiv in August 2026",
      "Contracts mined from task-disjoint traces or derived from public schemas",
      "Evaluated on ToolMaze and τ-bench retail across models from multiple families",
    ],
  },
  {
    title: "Fixed RAG Compression Collapses Measured Reader Scaling",
    thumb: "ReaderScaling",
    anchorId: "research-rag-compression",
    citeKey: "rag-compression",
    tag: "Research Paper · arXiv 2026",
    summary: "Shows that fixed RAG compression can raise average accuracy while hiding reader upgrades and reversing model rankings across 20 readers and ten domain-method settings.",
    link: "https://arxiv.org/abs/2606.21807",
    linkLabel: "Read on arXiv",
    linkIcon: "external",
    doi: "10.48550/arXiv.2606.21807",
    details: [
      "Authors: Sugam Panthi, Rabab Abdelfattah",
      "Submitted to arXiv on June 19, 2026",
      "Evaluates compression–reader interaction across 20 readers and 10 domain-method settings",
      "Benchmarked on four QA datasets and one summarization dataset",
    ],
  },
  {
    title: "Same Ranking, Different Winner: How Scoring Targets Shape LLM Memory Benchmarks",
    thumb: "TargetChoice",
    anchorId: "research-conversational-memory",
    citeKey: "memory-targets",
    tag: "Research Paper · EMNLP Findings 2026",
    summary: "Shows how LLM memory benchmark conclusions can flip when the ranked retrieval output stays fixed and only the credited scoring target changes.",
    link: "https://arxiv.org/abs/2605.24060",
    linkLabel: "Read on arXiv",
    linkIcon: "external",
    doi: "10.48550/arXiv.2605.24060",
    details: [
      "Authors: Sugam Panthi, Rabab Abdelfattah",
      "Accepted to Findings of EMNLP 2026",
      "Submitted to arXiv on May 22, 2026",
      "TIAP fixed-output audit over Raw, Source, and Canonical scoring targets",
      "Evaluates target non-invariance on LoCoMo, LongMemEval-S, Mem0, and MemoryOS",
    ],
  },
  {
    title: "A Comprehensive Review of Plastic Recycling in the Construction Industry: Challenges and Opportunities in the US",
    thumb: "PlasticRecycling",
    citeKey: "plastic-recycling",
    tag: "Research Paper · CIB Conferences 2025",
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
];

const DETAIL_PANEL_ID = "papers-detail-panel";

const Papers = () => {
  const [selected, setSelected] = useState(null);
  const [copiedCite, setCopiedCite] = useState(false);
  const cols = useCardGridColumns(2);
  const detailRef = useRef(null);

  const activeItem = selected !== null ? papers[selected] : null;
  const activeBibtex = activeItem?.citeKey ? citations[activeItem.citeKey]?.bibtex : null;

  const handleCopyCite = () => {
    if (!activeBibtex) return;
    navigator.clipboard.writeText(activeBibtex).then(() => {
      setCopiedCite(true);
      setTimeout(() => setCopiedCite(false), 2000);
    });
  };
  const selectedRow = selected !== null ? rowIndexForItem(selected, cols) : null;

  useLayoutEffect(() => {
    setCopiedCite(false);
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
                        {activeItem.linkIcon === "paper" ? <FileText className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
                        {activeItem.linkLabel}
                        <ExternalLink className="h-2.5 w-2.5 opacity-50" />
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
                      {activeBibtex && (
                        <button
                          type="button"
                          onClick={handleCopyCite}
                          aria-label="Copy BibTeX citation"
                          className={`inline-flex items-center gap-1.5 text-xs transition-colors ${copiedCite ? "text-green-400" : "text-paper-light/40 hover:text-ink-blue"}`}
                        >
                          {copiedCite ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedCite ? "Copied" : "Copy BibTeX"}
                        </button>
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

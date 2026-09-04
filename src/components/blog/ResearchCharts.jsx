import React from 'react';

// Theme-aware infographic charts for the research blog posts. Each chart uses
// the site's paper-aesthetic CSS variables so it adapts to light/dark, and
// scales crisply via a viewBox. Numbers are real and sourced from the papers;
// the caption states the model and sample size for every data chart.

const ink = 'rgb(var(--color-ink-dark))';
const muted = 'rgb(var(--color-ink-muted))';
const blue = 'rgb(var(--color-ink-blue))';
const red = 'rgb(var(--color-ink-red))';
const surface = 'rgb(var(--color-paper-surface))';
const border = 'rgb(var(--color-border-paper))';

const ChartCard = ({ title, kicker, children, caption }) => (
  <figure className="my-10 mx-auto max-w-[720px] border border-border-paper bg-paper-surface">
    <figcaption className="px-5 pt-4">
      {kicker && (
        <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-ink-muted mb-1">
          {kicker}
        </div>
      )}
      <div className="text-sm font-bold text-ink-dark leading-snug">{title}</div>
    </figcaption>
    <div className="px-3 py-3">{children}</div>
    {caption && (
      <div className="px-5 pb-4 text-[11px] leading-relaxed text-ink-muted border-t border-border-paper pt-3">
        {caption}
      </div>
    )}
  </figure>
);

// --- SEAM: absorption rate by seam condition -------------------------------
export const SeamAbsorptionChart = () => {
  const data = [
    { label: 'clean', value: 0.0, kind: 'base' },
    { label: 'newline', value: 31.3, kind: 'bad' },
    { label: 'blank', value: 30.3, kind: 'bad' },
    { label: 'boundary', value: 4.4, kind: 'good' },
    { label: 'mitigation', value: 0.3, kind: 'good' },
  ];
  const W = 600, H = 300;
  const x0 = 56, x1 = 584, yBase = 244, yTop = 46;
  const max = 35;
  const slot = (x1 - x0) / data.length;
  const barW = 58;
  const scale = (v) => (v / max) * (yBase - yTop);
  const colorFor = (kind) => (kind === 'bad' ? red : kind === 'good' ? blue : muted);

  return (
    <ChartCard
      kicker="SEAM · instruction absorption"
      title="A boundary marker cuts absorption ~7×. A bigger gap does nothing."
      caption="Absorption rate by seam condition. DeepSeek V4 Flash, 300 clusters per condition, scored against the matched clean output. clean is the reference; newline and blank add whitespace; boundary marks the paste seam; mitigation adds one instruction line."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Bar chart: absorption is 31% under newline, 30% under blank, 4.4% under boundary, 0.3% under mitigation, and near zero for clean.">
        {/* baseline */}
        <line x1={x0 - 6} y1={yBase} x2={x1} y2={yBase} stroke={border} strokeWidth="1" />
        {/* 7x drop annotation */}
        <g fontFamily="monospace">
          <line x1={x0 + slot * 1 + slot / 2} y1={yTop - 8} x2={x0 + slot * 3 + slot / 2} y2={yTop - 8}
            stroke={muted} strokeWidth="1" strokeDasharray="3 3" />
          <text x={(x0 + slot * 1 + slot / 2 + x0 + slot * 3 + slot / 2) / 2} y={yTop - 14}
            textAnchor="middle" fontSize="11" fontWeight="700" fill={ink}>31% → 4.4% · 7× drop</text>
        </g>
        {data.map((d, i) => {
          const cx = x0 + slot * i + slot / 2;
          const bx = cx - barW / 2;
          const h = scale(d.value);
          const by = yBase - h;
          const c = colorFor(d.kind);
          return (
            <g key={d.label} fontFamily="monospace">
              {d.value > 0 && <rect x={bx} y={by} width={barW} height={h} fill={c} opacity="0.85" />}
              {d.value === 0 && <rect x={bx} y={yBase - 2} width={barW} height="2" fill={muted} opacity="0.5" />}
              <text x={cx} y={by - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill={c}>
                {d.value.toFixed(1)}%
              </text>
              <text x={cx} y={yBase + 18} textAnchor="middle" fontSize="11" fill={muted}>{d.label}</text>
            </g>
          );
        })}
      </svg>
    </ChartCard>
  );
};

// --- SEAM: all-model newline to boundary panel ------------------------------
export const SeamModelPanelChart = () => {
  const rows = [
    { model: 'OLMo 2 32B', newline: 68.0, boundary: 35.3, mitigation: 0.3 },
    { model: 'Qwen3 8B', newline: 53.0, boundary: 26.0, mitigation: 0.0 },
    { model: 'Gemma 3 4B', newline: 52.0, boundary: 19.7, mitigation: 9.3 },
    { model: 'Mistral Small 24B', newline: 41.3, boundary: 28.0, mitigation: 12.0 },
    { model: 'GPT-OSS 120B', newline: 39.3, boundary: 18.3, mitigation: 0.3 },
    { model: 'Gemma 3 12B', newline: 38.5, boundary: 19.1, mitigation: 6.0 },
    { model: 'GPT-OSS 20B', newline: 35.1, boundary: 16.4, mitigation: 0.0 },
    { model: 'Qwen3 32B', newline: 32.7, boundary: 5.3, mitigation: 0.0 },
    { model: 'GPT-5.6-sol', newline: 32.0, boundary: 11.7, mitigation: 0.0, frontier: true },
    { model: 'DeepSeek V4 Flash', newline: 31.3, boundary: 4.4, mitigation: 0.3 },
    { model: 'MiniMax M2.5', newline: 28.7, boundary: 6.4, mitigation: 1.7 },
    { model: 'Gemma 3 27B', newline: 27.7, boundary: 20.3, mitigation: 0.7 },
    { model: 'DeepSeek V4 Pro', newline: 22.3, boundary: 1.0, mitigation: 0.0 },
    { model: 'MiniMax M3', newline: 22.3, boundary: 3.3, mitigation: 0.0 },
    { model: 'MiMo V2.5 Pro', newline: 21.7, boundary: 4.0, mitigation: 0.0 },
    { model: 'MiMo V2.5', newline: 20.0, boundary: 5.0, mitigation: 1.3 },
    { model: 'Claude Opus 4.8', newline: 19.0, boundary: 2.0, mitigation: 0.0, frontier: true },
    { model: 'Llama 3.3 70B', newline: 19.0, boundary: 14.0, mitigation: 0.0 },
    { model: 'Llama 3.1 8B', newline: 7.7, boundary: 7.3, mitigation: 0.3, exception: true },
  ];
  const W = 720, H = 628;
  const x0 = 204, x1 = 620, max = 70;
  const scale = (v) => x0 + (v / max) * (x1 - x0);
  const y = (i) => 88 + i * 26.2;

  return (
    <ChartCard
      kicker="SEAM · 19-model panel"
      title="Boundary markup reduces absorption in 18 of 19 models"
      caption="Absorption rate across the current full-cascade panel, sorted by bare-newline rate. Lines connect the same 300 composition clusters under a bare newline and explicit boundary; diamonds show boundary-plus-mitigation. Cells use n=297–300 after completed-output exclusions."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Nineteen-row chart comparing absorption after a newline, explicit boundary markup, and mitigation. Boundary markup reduces the rate in all models except Llama 3.1 8B.">
        {[0, 10, 20, 30, 40, 50, 60, 70].map((tick) => (
          <g key={tick} fontFamily="monospace" fontSize="9" fill={muted}>
            <line x1={scale(tick)} y1="54" x2={scale(tick)} y2="584" stroke={border} strokeDasharray="2 4" />
            <text x={scale(tick)} y="605" textAnchor="middle">{tick}%</text>
          </g>
        ))}
        <g fontFamily="monospace" fontSize="9" fill={muted} transform="translate(205, 30)">
          <circle cx="4" cy="0" r="5" fill={surface} stroke={red} strokeWidth="2" />
          <text x="14" y="4">bare newline</text>
          <circle cx="112" cy="0" r="5" fill={blue} />
          <text x="122" y="4">boundary</text>
          <path d="M228,-6 L234,0 L228,6 L222,0 Z" fill={ink} />
          <text x="240" y="4">mitigation</text>
        </g>
        {rows.map((row, i) => (
          <g key={row.model} fontFamily="monospace">
            {row.frontier && <rect x="12" y={y(i) - 12} width="690" height="24" rx="3" fill={blue} opacity="0.045" />}
            <text x="18" y={y(i) + 4} fontSize="9.5" fontWeight={row.frontier ? '700' : '400'} fill={row.exception ? red : ink}>{row.model}</text>
            <line x1={scale(row.boundary)} y1={y(i)} x2={scale(row.newline)} y2={y(i)} stroke={row.exception ? red : blue} strokeWidth={row.exception ? 1.5 : 2} opacity={row.exception ? 0.55 : 0.65} />
            <circle cx={scale(row.newline)} cy={y(i)} r="4.5" fill={surface} stroke={red} strokeWidth="1.8" />
            <circle cx={scale(row.boundary)} cy={y(i)} r="4.5" fill={blue} />
            <path d={`M${scale(row.mitigation)},${y(i) - 5} L${scale(row.mitigation) + 5},${y(i)} L${scale(row.mitigation)},${y(i) + 5} L${scale(row.mitigation) - 5},${y(i)} Z`} fill={ink} />
              <text x="704" y={y(i) + 3.5} textAnchor="end" fontSize="9" fontWeight="700" fill={row.exception ? red : muted}>{row.newline.toFixed(1)} → {row.boundary.toFixed(1)}</text>
          </g>
        ))}
        <text x={(x0 + x1) / 2} y="624" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={muted}>ABSORPTION RATE</text>
      </svg>
    </ChartCard>
  );
};

// --- SEAM: register match as provenance cue ---------------------------------
export const SeamRegisterChart = () => {
  const rows = [
    { model: 'DeepSeek V4 Flash', casual: 31.3, matched: 51.3, code: 35 },
    { model: 'Qwen3 32B', casual: 32.7, matched: 52.7, code: 19 },
    { model: 'Claude Opus 4.8', casual: 19.0, matched: 56.0, code: 81 },
    { model: 'GPT-5.6-sol', casual: 32.0, matched: 65.3, code: 42 },
  ];
  const W = 720, H = 328;
  const overall0 = 228, overall1 = 452;
  const code0 = 520, code1 = 676;
  const scaleOverall = (v) => overall0 + (v / 70) * (overall1 - overall0);
  const scaleCode = (v) => code0 + (v / 100) * (code1 - code0);
  const y = (i) => 100 + i * 52;

  return (
    <ChartCard
      kicker="Register manipulation · four models"
      title="When the afterthought sounds like the artifact, absorption rises"
      caption="The left panel holds artifact and bare-newline seam fixed and changes only the afterthought’s register. The right panel isolates code, where casual afterthought absorption is 0% in every model and register-matched absorption rises to 19–81%. Each rate uses 300 overall clusters or 100 pooled code conditions per model."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Four model rows showing overall absorption rising by 20 to 37 points when afterthought register matches the artifact, and code rising from zero to between 19 and 81 percent.">
        <text x="18" y="48" fontFamily="monospace" fontSize="9" fontWeight="700" fill={muted}>MODEL</text>
        <text x={(overall0 + overall1) / 2} y="48" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="700" fill={muted}>ALL GENRES · BARE NEWLINE</text>
        <text x={(code0 + code1) / 2} y="48" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="700" fill={muted}>CODE ONLY</text>
        {[0, 20, 40, 60].map((tick) => (
          <g key={`overall-${tick}`} fontFamily="monospace" fontSize="8.5" fill={muted}>
            <line x1={scaleOverall(tick)} y1="65" x2={scaleOverall(tick)} y2="276" stroke={border} strokeDasharray="2 4" />
            <text x={scaleOverall(tick)} y="298" textAnchor="middle">{tick}%</text>
          </g>
        ))}
        {[0, 50, 100].map((tick) => (
          <g key={`code-${tick}`} fontFamily="monospace" fontSize="8.5" fill={muted}>
            <line x1={scaleCode(tick)} y1="65" x2={scaleCode(tick)} y2="276" stroke={border} strokeDasharray="2 4" />
            <text x={scaleCode(tick)} y="298" textAnchor="middle">{tick}%</text>
          </g>
        ))}
        {rows.map((row, i) => (
          <g key={row.model} fontFamily="monospace">
            <text x="18" y={y(i) + 4} fontSize="10" fontWeight="700" fill={ink}>{row.model}</text>
            <line x1={scaleOverall(row.casual)} y1={y(i)} x2={scaleOverall(row.matched)} y2={y(i)} stroke={blue} strokeWidth="3" strokeLinecap="round" />
            <circle cx={scaleOverall(row.casual)} cy={y(i)} r="5" fill={surface} stroke={muted} strokeWidth="2" />
            <circle cx={scaleOverall(row.matched)} cy={y(i)} r="5" fill={blue} />
            <text x={scaleOverall(row.matched) + 8} y={y(i) + 4} fontSize="9" fontWeight="700" fill={blue}>+{(row.matched - row.casual).toFixed(1)}</text>
            <line x1={scaleCode(0)} y1={y(i)} x2={scaleCode(row.code)} y2={y(i)} stroke={red} strokeWidth="3" strokeLinecap="round" />
            <circle cx={scaleCode(0)} cy={y(i)} r="4" fill={surface} stroke={muted} strokeWidth="2" />
            <circle cx={scaleCode(row.code)} cy={y(i)} r="5" fill={red} />
            <text x={scaleCode(row.code) + (row.code > 70 ? -8 : 8)} y={y(i) - 10} textAnchor={row.code > 70 ? 'end' : 'start'} fontSize="9" fontWeight="700" fill={red}>{row.code}%</text>
          </g>
        ))}
        <g fontFamily="monospace" fontSize="8.5" fill={muted} transform="translate(228, 321)">
          <circle cx="4" cy="-4" r="4" fill={surface} stroke={muted} strokeWidth="2" />
          <text x="13" y="0">casual</text>
          <circle cx="77" cy="-4" r="4" fill={blue} />
          <text x="86" y="0">register matched</text>
        </g>
      </svg>
    </ChartCard>
  );
};

// --- Outcome Monitors: frozen ToolMaze model results ------------------------
export const OutcomeContractsChart = () => {
  const rows = [
    { family: 'DeepSeek', model: 'V4 Flash', icon: 'deepseek', base: 17.5, adv: 33.75, delta: '+16.25' },
    { family: 'DeepSeek', model: 'V4 Pro', icon: 'deepseek', base: 16.25, adv: 28.75, delta: '+12.50' },
    { family: 'Qwen', model: '3.7 Plus', icon: 'qwen', base: 3.75, adv: 18.75, delta: '+15.00' },
    { family: 'Qwen', model: '3.7 Max', icon: 'qwen', base: 6.25, adv: 31.25, delta: '+25.00' },
    { family: 'MiniMax', model: 'M3 replication', icon: 'minimax', base: 6.25, adv: 25.0, delta: '+18.75', replication: true },
  ];
  const W = 720, H = 408;
  const x0 = 222, x1 = 624, max = 40;
  const scale = (v) => x0 + (v / max) * (x1 - x0);
  const rowY = (i) => 92 + i * 58 + (i === 4 ? 18 : 0);
  const iconBase = '/posts/images/agents-believe-tools-that-lie/icons';

  return (
    <ChartCard
      kicker="ToolMaze · paired completion"
      title="Every evaluated model recovered more often with the monitor"
      caption="Eighty workflows per model; baseline and monitor episodes were paired, randomized, and interleaved. The four-model primary aggregate rose from 35/320 to 90/320 (+17.2 points; task-cluster p < .00001). MiniMax M3 is a separately frozen replication and is not pooled. Model marks identify the evaluated families."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Dumbbell chart showing higher ToolMaze completion with an outcome monitor for four primary models and a separate MiniMax replication.">
        <defs>
          <marker id="oc-model-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={blue} />
          </marker>
        </defs>
        <text x="18" y="40" fontFamily="monospace" fontSize="10" fontWeight="700" fill={muted}>MODEL</text>
        <text x="708" y="40" textAnchor="end" fontFamily="monospace" fontSize="10" fontWeight="700" fill={muted}>CHANGE · POINTS</text>
        <g fontFamily="monospace" fontSize="10" fill={muted}>
          {[0, 10, 20, 30, 40].map((t) => (
            <g key={t}>
              <line x1={scale(t)} y1="58" x2={scale(t)} y2="356" stroke={border} strokeWidth="1" strokeDasharray="2 4" />
              <text x={scale(t)} y="378" textAnchor="middle">{t}%</text>
            </g>
          ))}
        </g>
        <line x1="18" y1="299" x2="708" y2="299" stroke={border} strokeDasharray="4 5" />
        <text x="18" y="318" fontFamily="monospace" fontSize="9" fill={muted}>SEPARATE REPLICATION</text>
        {rows.map((r, i) => {
          const y = rowY(i);
          return (
            <g key={`${r.family}-${r.model}`} fontFamily="monospace">
              <image href={`${iconBase}/${r.icon}.svg`} x="18" y={y - 12} width="24" height="24" />
              <text x="52" y={y - 3} fontSize="11" fontWeight="700" fill={ink}>{r.family}</text>
              <text x="52" y={y + 13} fontSize="10" fill={muted}>{r.model}</text>
              <line x1={scale(r.base)} y1={y} x2={scale(r.adv) - 8} y2={y} stroke={blue} strokeWidth="2" markerEnd="url(#oc-model-arrow)" />
              <circle cx={scale(r.base)} cy={y} r="6" fill={surface} stroke={muted} strokeWidth="2" />
              <text x={scale(r.base)} y={y - 12} textAnchor="middle" fontSize="10" fill={muted}>{r.base}%</text>
              <circle cx={scale(r.adv)} cy={y} r="6" fill={blue} />
              <text x={scale(r.adv)} y={y + 20} textAnchor="middle" fontSize="10" fontWeight="700" fill={blue}>{r.adv}%</text>
              <text x="708" y={y + 4} textAnchor="end" fontSize="12" fontWeight="700" fill={blue}>{r.delta}</text>
            </g>
          );
        })}
        <g fontFamily="monospace" fontSize="10" fill={muted} transform="translate(222, 32)">
          <circle cx="4" cy="-4" r="5" fill={surface} stroke={muted} strokeWidth="2" />
          <text x="14" y="0">baseline</text>
          <circle cx="94" cy="-4" r="5" fill={blue} />
          <text x="104" y="0">with monitor</text>
        </g>
      </svg>
    </ChartCard>
  );
};

// --- Signal decomposition: what in the receipt mattered --------------------
export const RecoveryAffordancesChart = () => {
  const rows = [
    { label: 'recovery list restored', value: 11.4, low: 2.6, high: 20.2, active: true },
    { label: 'full receipt vs baseline', value: 12.3, low: 3.5, high: 21.9, active: true },
    { label: 'stripped receipt vs baseline', value: 0.9, low: -6.1, high: 7.9 },
    { label: 'localized vs generic warning', value: -2.6, low: -11.4, high: 6.1 },
    { label: 'immediate vs deferred warning', value: 0.9, low: -4.4, high: 6.1 },
  ];
  const W = 720, H = 392;
  const x0 = 314, x1 = 646, min = -15, max = 25;
  const scale = (v) => x0 + ((v - min) / (max - min)) * (x1 - x0);
  const rowPositions = [84, 132, 214, 262, 310];
  const y = (i) => rowPositions[i];

  return (
    <ChartCard
      kicker="Receipt ablations · 114 paired workflows"
      title="The recovery-tool list carried the detectable gain"
      caption="Completion differences with task-cluster bootstrap intervals. Filled points clear zero; open points do not. The null contrasts are bounded by an approximately 18-point minimum detectable effect, so they do not establish equivalence."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Forest plot showing significant gains when recovery tools are added, and no detected effect for a stripped receipt, localized wording, or immediate timing.">
        <rect x="10" y="51" width="700" height="106" rx="6" fill={blue} opacity="0.055" />
        <text x="20" y="68" fontFamily="monospace" fontSize="9" fontWeight="700" fill={blue}>RECOVERY TOOLS PRESENT</text>
        <text x="20" y="190" fontFamily="monospace" fontSize="9" fontWeight="700" fill={muted}>RECOVERY TOOLS UNCHANGED OR ABSENT</text>
        {[ -10, 0, 10, 20 ].map((tick) => (
          <g key={tick} fontFamily="monospace" fontSize="10" fill={muted}>
            <line x1={scale(tick)} y1="48" x2={scale(tick)} y2="333" stroke={tick === 0 ? muted : border} strokeWidth={tick === 0 ? 1.4 : 1} strokeDasharray={tick === 0 ? '4 4' : '2 4'} />
            <text x={scale(tick)} y="356" textAnchor="middle">{tick > 0 ? `+${tick}` : tick}</text>
          </g>
        ))}
        {rows.map((row, i) => (
          <g key={row.label} fontFamily="monospace">
            <text x="20" y={y(i) + 4} fontSize="10.5" fill={ink}>{row.label}</text>
            <line x1={scale(row.low)} y1={y(i)} x2={scale(row.high)} y2={y(i)} stroke={row.active ? blue : muted} strokeWidth="2" strokeLinecap="round" />
            <line x1={scale(row.low)} y1={y(i) - 5} x2={scale(row.low)} y2={y(i) + 5} stroke={row.active ? blue : muted} />
            <line x1={scale(row.high)} y1={y(i) - 5} x2={scale(row.high)} y2={y(i) + 5} stroke={row.active ? blue : muted} />
            <circle cx={scale(row.value)} cy={y(i)} r="5.5" fill={row.active ? blue : surface} stroke={row.active ? blue : muted} strokeWidth="2" />
            <text x="704" y={y(i) + 4} textAnchor="end" fontSize="11" fontWeight="700" fill={row.active ? blue : muted}>{row.value > 0 ? '+' : ''}{row.value}</text>
          </g>
        ))}
        <text x={(x0 + x1) / 2} y="380" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={muted}>COMPLETION DIFFERENCE · PERCENTAGE POINTS</text>
      </svg>
    </ChartCard>
  );
};

// --- Cross-environment boundary: when receipts have room to help ------------
export const OutcomeBoundariesChart = () => {
  const rows = [
    { label: 'ToolMaze implicit', note: '4-model primary', base: 10.9, monitor: 28.1, delta: '+17.2', kind: 'fault' },
    { label: 'τ-bench status', note: 'Flash', base: 12.0, monitor: 40.0, delta: '+28.0', kind: 'fault' },
    { label: 'ToolMaze clean', note: '2 tiers', base: 64.9, monitor: 64.9, delta: '0.0', kind: 'clean' },
    { label: 'τ-bench conservation', note: 'Flash', base: 70.0, monitor: 70.0, delta: '0.0', kind: 'null' },
    { label: 'AppWorld held out', note: 'Flash', base: 78.1, monitor: 78.1, delta: '0.0', kind: 'null' },
  ];
  const W = 720, H = 370;
  const x0 = 230, x1 = 640;
  const scale = (v) => x0 + (v / 100) * (x1 - x0);
  const y = (i) => 82 + i * 52;

  return (
    <ChartCard
      kicker="Cross-study pattern · descriptive"
      title="Receipts help when the fault leaves room to recover"
      caption="Baseline and monitored task completion in selected frozen rows. The two strongest gains occur where faulted baseline completion is lowest. Rows differ in task, fault, and sample and are not pooled; this is a post-hoc descriptive pattern, not a deployment threshold."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Dumbbell chart showing large monitor gains in low-baseline ToolMaze and tau-bench status faults, but no net change on clean ToolMaze, tau-bench conservation, or held-out AppWorld.">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick} fontFamily="monospace" fontSize="10" fill={muted}>
            <line x1={scale(tick)} y1="48" x2={scale(tick)} y2="305" stroke={border} strokeDasharray="2 4" />
            <text x={scale(tick)} y="327" textAnchor="middle">{tick}%</text>
          </g>
        ))}
        {rows.map((row, i) => {
          const same = row.base === row.monitor;
          return (
            <g key={row.label} fontFamily="monospace">
              <text x="18" y={y(i) - 2} fontSize="10.5" fontWeight="700" fill={ink}>{row.label}</text>
              <text x="18" y={y(i) + 13} fontSize="9" fill={muted}>{row.note}{row.kind === 'clean' ? ' · CLEAN' : ''}</text>
              {!same && <line x1={scale(row.base)} y1={y(i)} x2={scale(row.monitor)} y2={y(i)} stroke={blue} strokeWidth="2.5" strokeLinecap="round" />}
              <circle cx={scale(row.base)} cy={y(i)} r={same ? 7 : 5.5} fill={surface} stroke={muted} strokeWidth="2" />
              <circle cx={scale(row.monitor)} cy={y(i)} r={same ? 3.2 : 5.5} fill={same ? blue : blue} />
              {!same && <text x={scale(row.base)} y={y(i) - 11} textAnchor="middle" fontSize="9" fill={muted}>{row.base}%</text>}
              <text x={scale(row.monitor)} y={y(i) + (same ? 19 : 20)} textAnchor="middle" fontSize="9" fontWeight="700" fill={blue}>{row.monitor}%</text>
              <text x="706" y={y(i) + 4} textAnchor="end" fontSize="11" fontWeight="700" fill={same ? muted : blue}>{row.delta}</text>
            </g>
          );
        })}
        <g fontFamily="monospace" fontSize="9" fill={muted} transform="translate(230, 352)">
          <circle cx="4" cy="-4" r="5" fill={surface} stroke={muted} strokeWidth="2" />
          <text x="14" y="0">baseline</text>
          <circle cx="94" cy="-4" r="5" fill={blue} />
          <text x="104" y="0">monitor</text>
          <circle cx="184" cy="-4" r="7" fill={surface} stroke={muted} strokeWidth="2" />
          <circle cx="184" cy="-4" r="3" fill={blue} />
          <text x="196" y="0">same rate</text>
        </g>
      </svg>
    </ChartCard>
  );
};

// --- Detection boundary: structured violations vs plausible strings --------
export const DetectorVocabularyChart = () => {
  const rows = [
    { label: 'Structured-value violations', count: '25 / 30', value: 83, detail: 'negative, out-of-domain, inconsistent' },
    { label: 'Plausible-string corruption', count: '6 / 27', value: 22, detail: 'well-formed text with wrong content' },
  ];
  const W = 720, H = 245;
  const x0 = 262, x1 = 660;
  const scale = (v) => (v / 100) * (x1 - x0);

  return (
    <ChartCard
      kicker="Incident-derived faults · detector recall"
      title="The monitor catches broken structure, not polished lies"
      caption="Recall on faults authored from a production-incident taxonomy without access to the contract vocabulary. Overall detection was about 46% on each evaluated tier. Counts show the expressibility breakdown reported in the manuscript."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Bar chart showing 83 percent recall on structured-value violations and 22 percent on plausible-string corruption.">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick} fontFamily="monospace" fontSize="9" fill={muted}>
            <line x1={x0 + scale(tick)} y1="42" x2={x0 + scale(tick)} y2="192" stroke={border} strokeDasharray="2 4" />
            <text x={x0 + scale(tick)} y="214" textAnchor="middle">{tick}%</text>
          </g>
        ))}
        {rows.map((row, i) => {
          const yy = 78 + i * 84;
          return (
            <g key={row.label} fontFamily="monospace">
              <text x="18" y={yy - 8} fontSize="10.5" fontWeight="700" fill={ink}>{row.label}</text>
              <text x="18" y={yy + 9} fontSize="8.5" fill={muted}>{row.detail}</text>
              <rect x={x0} y={yy - 14} width={x1 - x0} height="28" rx="3" fill={border} opacity="0.55" />
              <rect x={x0} y={yy - 14} width={scale(row.value)} height="28" rx="3" fill={i === 0 ? blue : red} opacity="0.86" />
              <text x={x0 + scale(row.value) - 8} y={yy + 5} textAnchor="end" fontSize="12" fontWeight="700" fill={surface}>{row.value}%</text>
              <text x="704" y={yy + 5} textAnchor="end" fontSize="10" fontWeight="700" fill={i === 0 ? blue : red}>{row.count}</text>
            </g>
          );
        })}
      </svg>
    </ChartCard>
  );
};

// --- LAPSE: explicit knowledge vs behavior ----------------------------------
export const LapseDissociationChart = () => {
  const W = 720, H = 286;
  const x0 = 314, x1 = 666;
  const scale = (v) => (v / 100) * (x1 - x0);
  const rows = [
    { label: 'Behavior: hedged when stale', note: 'all three forms · 0 / 300', value: 0, color: red },
    { label: 'Explicit rule: progressive', note: '98 / 100 correct', value: 98, color: blue },
    { label: 'Explicit rule: simple', note: '91 / 100 correct', value: 91, color: blue },
  ];

  return (
    <ChartCard
      kicker="LAPSE pilot · one model"
      title="The model could state the rule. It did not use the rule."
      caption="DeepSeek V4 Flash, initial frozen pilot. Behavioral non-commitment was 0/300 across stale simple, progressive, and explicitly bounded forms. The same model correctly rejected automatic currency in 98% of progressive and 91% of simple explicit-knowledge controls. Because behavior was policy-flat, this is a say–do dissociation, not a clean causal aspect contrast."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Bar chart showing zero behavioral hedging across 300 stale cases while explicit knowledge questions were answered correctly 98 and 91 percent of the time.">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick} fontFamily="monospace" fontSize="9" fill={muted}>
            <line x1={x0 + scale(tick)} y1="45" x2={x0 + scale(tick)} y2="224" stroke={border} strokeDasharray="2 4" />
            <text x={x0 + scale(tick)} y="248" textAnchor="middle">{tick}%</text>
          </g>
        ))}
        {rows.map((row, i) => {
          const yy = 82 + i * 66;
          return (
            <g key={row.label} fontFamily="monospace">
              <text x="18" y={yy - 5} fontSize="10.5" fontWeight="700" fill={ink}>{row.label}</text>
              <text x="18" y={yy + 12} fontSize="9" fill={muted}>{row.note}</text>
              <rect x={x0} y={yy - 14} width={x1 - x0} height="28" rx="3" fill={border} opacity="0.55" />
              {row.value > 0 ? (
                <rect x={x0} y={yy - 14} width={scale(row.value)} height="28" rx="3" fill={row.color} opacity="0.86" />
              ) : (
                <line x1={x0} y1={yy - 16} x2={x0} y2={yy + 16} stroke={red} strokeWidth="4" />
              )}
              <text x={row.value > 0 ? x0 + scale(row.value) - 8 : x0 + 10} y={yy + 5} textAnchor={row.value > 0 ? 'end' : 'start'} fontSize="12" fontWeight="700" fill={row.value > 0 ? surface : red}>{row.value}%</text>
            </g>
          );
        })}
        <text x={(x0 + x1) / 2} y="278" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={muted}>NON-COMMITMENT / CORRECT-REJECTION RATE</text>
      </svg>
    </ChartCard>
  );
};

// --- LAPSE: selective temporal-form destruction -----------------------------
export const LapseConsolidationChart = () => {
  const rows = [
    { label: 'Progressive', example: '“I’m staying…”', coerced: 75, dropped: 0, manufactured: 5, preserved: 20 },
    { label: 'Explicitly bounded', example: '“…until December”', coerced: 62, dropped: 5, manufactured: 2, preserved: 31 },
    { label: 'Simple present', example: '“I live…”', coerced: 0, dropped: 0, manufactured: 0, preserved: 100 },
  ];
  const W = 720, H = 300;
  const x0 = 232, x1 = 676;
  const scale = (v) => (v / 100) * (x1 - x0);
  const y = (i) => 92 + i * 64;
  const amber = '#b07a24';

  return (
    <ChartCard
      kicker="LAPSE consolidation · 100 matched clusters per form"
      title="Consolidation selectively erased temporary validity"
      caption="DeepSeek V4 Flash, initial pilot. Destruction is the sum of coerced-stative rewrites, dropped explicit bounds, and manufactured write-time deixis. Progressive versus simple destruction produced 80/0 paired discordant clusters (exact p = 1.7 × 10⁻²⁴)."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Stacked bars showing 80 percent temporal-form destruction for progressive statements, 69 percent for explicitly bounded statements, and zero for simple-present statements.">
        <g fontFamily="monospace" fontSize="8.5" fill={muted} transform="translate(232, 35)">
          <rect x="0" y="-10" width="12" height="12" fill={red} opacity="0.82" />
          <text x="18" y="0">coerced to standing fact</text>
          <rect x="178" y="-10" width="12" height="12" fill={amber} opacity="0.9" />
          <text x="196" y="0">bound dropped / “currently”</text>
          <rect x="390" y="-10" width="12" height="12" fill={blue} opacity="0.78" />
          <text x="408" y="0">preserved</text>
        </g>
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick} fontFamily="monospace" fontSize="9" fill={muted}>
            <line x1={x0 + scale(tick)} y1="58" x2={x0 + scale(tick)} y2="230" stroke={border} strokeDasharray="2 4" />
            <text x={x0 + scale(tick)} y="254" textAnchor="middle">{tick}%</text>
          </g>
        ))}
        {rows.map((row, i) => {
          const yy = y(i);
          const combinedOther = row.dropped + row.manufactured;
          const destruction = row.coerced + combinedOther;
          return (
            <g key={row.label} fontFamily="monospace">
              <text x="18" y={yy - 4} fontSize="10.5" fontWeight="700" fill={ink}>{row.label}</text>
              <text x="18" y={yy + 13} fontSize="9" fill={muted}>{row.example}</text>
              {row.coerced > 0 && <rect x={x0} y={yy - 15} width={scale(row.coerced)} height="30" rx="2" fill={red} opacity="0.82" />}
              {combinedOther > 0 && <rect x={x0 + scale(row.coerced)} y={yy - 15} width={scale(combinedOther)} height="30" fill={amber} opacity="0.9" />}
              <rect x={x0 + scale(destruction)} y={yy - 15} width={scale(row.preserved)} height="30" rx="2" fill={blue} opacity="0.78" />
              {destruction > 0 && <text x={x0 + scale(destruction) - 6} y={yy + 5} textAnchor="end" fontSize="11" fontWeight="700" fill={surface}>{destruction}% destroyed</text>}
              <text x={x0 + scale(destruction) + scale(row.preserved) / 2} y={yy + 5} textAnchor="middle" fontSize="10" fontWeight="700" fill={surface}>{row.preserved}% kept</text>
            </g>
          );
        })}
        <text x={(x0 + x1) / 2} y="286" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={muted}>MEMORY-NOTE OUTCOME</text>
      </svg>
    </ChartCard>
  );
};

// --- LAPSE: consolidation "time bomb" concept diagram ----------------------
export const LapseTimeBombDiagram = () => {
  const W = 640, H = 300;
  const box = (x, y, w, h) => `M${x},${y} h${w} v${h} h${-w} Z`;
  return (
    <ChartCard
      kicker="LAPSE · eternal-present memory"
      title="Consolidation rewrites a temporary statement into a standing fact"
      caption="Conceptual diagram, not measured rates. The consolidation step drops the marker of temporariness and inserts 'currently', which asserts present validity and can override an adjacent date stamp. Phenomenon reported from n=1 probes; a controlled rate study is in progress."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Flow: a temporary utterance is consolidated into a permanent 'currently lives' note, which later resurfaces as a stale fact stated as current.">
        <defs>
          <marker id="lp-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={muted} />
          </marker>
        </defs>
        {/* Box 1: what you said */}
        <g fontFamily="monospace">
          <path d={box(20, 64, 200, 96)} fill={surface} stroke={border} strokeWidth="1.5" />
          <text x="32" y="86" fontSize="10" fill={muted}>YOU SAID (temporary)</text>
          <text x="32" y="110" fontSize="12" fill={ink}>&ldquo;I&rsquo;m staying in</text>
          <text x="32" y="128" fontSize="12" fill={ink}>Pasadena for the</text>
          <text x="32" y="146" fontSize="12" fill={ink}>conference.&rdquo;</text>
        </g>
        {/* Arrow 1 */}
        <line x1={220} y1={112} x2={304} y2={112} stroke={muted} strokeWidth="1.5" markerEnd="url(#lp-arrow)" />
        <text x={260} y={102} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={muted}>consolidate</text>

        {/* Box 2: stored note (the time bomb) */}
        <g fontFamily="monospace">
          <path d={box(312, 52, 224, 120)} fill={surface} stroke={red} strokeWidth="1.5" />
          <text x="324" y="74" fontSize="10" fill={red}>STORED NOTE</text>
          <text x="324" y="98" fontSize="12" fill={ink}>&ldquo;User <tspan fill={red} fontWeight="700">currently</tspan></text>
          <text x="324" y="116" fontSize="12" fill={ink}>lives in Pasadena.&rdquo;</text>
          <text x="324" y="144" fontSize="9" fill={muted}>date stamp: 8 months ago</text>
          <text x="324" y="160" fontSize="9" fill={red}>&darr; overridden by &ldquo;currently&rdquo;</text>
        </g>
        {/* Arrow 2 */}
        <line x1={424} y1={172} x2={424} y2={204} stroke={muted} strokeWidth="1.5" markerEnd="url(#lp-arrow)" />
        <text x={436} y={192} fontFamily="monospace" fontSize="9" fill={muted}>months later</text>

        {/* Box 3: assistant asserts it as current */}
        <g fontFamily="monospace">
          <path d={box(272, 212, 304, 64)} fill={surface} stroke={border} strokeWidth="1.5" />
          <text x="286" y="234" fontSize="10" fill={muted}>ASSISTANT (asserts as current)</text>
          <text x="286" y="258" fontSize="12" fill={ink}>&ldquo;Since you live in Pasadena, here are&hellip;&rdquo;</text>
        </g>
      </svg>
    </ChartCard>
  );
};

// --- PROVENANCE: the trace chain concept diagram ---------------------------
export const TraceChainDiagram = () => {
  const W = 640, H = 288;
  const box = (x, y, w, h) => `M${x},${y} h${w} v${h} h${-w} Z`;
  return (
    <ChartCard
      kicker="Provenance · the trace chain"
      title="Every number in the paper resolves to a command"
      caption="The trace test, using a real value from an internal scoring audit. A table cell points to a ledger row, the row carries the run ID and scorer version, and the reproducer regenerates the value from frozen outputs. If any link is missing, the number is a rumor with good posture."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Flow: a paper table cell links to a results-ledger row, which links to a run ID and scorer version, which link to the exact command that reproduces the value.">
        <defs>
          <marker id="tc-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={muted} />
          </marker>
        </defs>
        {/* Box 1: the paper table cell */}
        <g fontFamily="monospace">
          <path d={box(20, 30, 176, 84)} fill={surface} stroke={border} strokeWidth="1.5" />
          <text x="32" y="52" fontSize="10" fill={muted}>PAPER · TABLE 3</text>
          <text x="32" y="78" fontSize="14" fontWeight="700" fill={ink}>&minus;39.744</text>
          <text x="32" y="98" fontSize="9" fill={muted}>never hand-copied</text>
        </g>
        <line x1={196} y1={72} x2={252} y2={72} stroke={muted} strokeWidth="1.5" markerEnd="url(#tc-arrow)" />
        <text x={224} y={62} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={muted}>points to</text>

        {/* Box 2: the ledger row */}
        <g fontFamily="monospace">
          <path d={box(260, 18, 224, 110)} fill={surface} stroke={blue} strokeWidth="1.5" />
          <text x="272" y="40" fontSize="10" fill={blue}>RESULTS LEDGER · ONE ROW</text>
          <text x="272" y="62" fontSize="11" fill={ink}>run_id: mhrag_think_0810</text>
          <text x="272" y="80" fontSize="11" fill={ink}>scorer: v3 (frozen SHA)</text>
          <text x="272" y="98" fontSize="11" fill={ink}>date: 2026-08-10</text>
          <text x="272" y="116" fontSize="9" fill={muted}>one ledger per project</text>
        </g>
        <line x1={372} y1={128} x2={372} y2={168} stroke={muted} strokeWidth="1.5" markerEnd="url(#tc-arrow)" />
        <text x={384} y={152} fontFamily="monospace" fontSize="9" fill={muted}>regenerates via</text>

        {/* Box 3: the reproducer */}
        <g fontFamily="monospace">
          <path d={box(140, 176, 464, 62)} fill={surface} stroke={border} strokeWidth="1.5" />
          <text x="154" y="198" fontSize="10" fill={muted}>REPRODUCER (frozen run outputs in)</text>
          <text x="154" y="222" fontSize="11.5" fill={ink}>$ python tools/audit_scoring_artifact.py &rarr; &minus;39.744</text>
        </g>
        <text x={(20 + 604) / 2} y="270" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="700" fill={ink}>
          the test: table cell to command in under a minute
        </text>
      </svg>
    </ChartCard>
  );
};

// --- PROVENANCE: smoke-gate catches, one overnight sweep -------------------
export const SmokeGateCatchesChart = () => {
  const catches = [
    {
      name: 'TAG LEAKAGE',
      detail1: 'answer tags inside the',
      detail2: 'reasoning channel',
      fix: 'scorer amended pre-outcome',
    },
    {
      name: 'CAP SATURATION',
      detail1: 'parse gate 6/10: 4 rows',
      detail2: 'hit the 4,352-token cap',
      fix: 'raised once + no-chase rule',
    },
    {
      name: 'MEMORY MISS',
      detail1: 'KV cache 9.76 GiB free',
      detail2: 'vs 10.32 GiB required',
      fix: 'caught at engine init, $0 spent',
    },
  ];
  const W = 680, H = 320;
  const box = (x, y, w, h) => `M${x},${y} h${w} v${h} h${-w} Z`;
  const slot = 220, bx0 = 12, by = 84, bw = 204, bh = 118;
  return (
    <ChartCard
      kicker="Cost gates · one overnight sweep"
      title="Three catches in one night, each before money was spent"
      caption="A scaling sweep of roughly 3,600 scored calls across 0.6B to 32B checkpoints, 2026-08-05. Every stage ran a ten-item smoke test before its full run. All three failures were caught at the smoke or engine-init stage; total overhead was about 50 smoke calls and 25 minutes, against rescoring or rerunning 3,600 calls if any had shipped."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Three smoke-test catches in one overnight run: answer-tag leakage, reasoning-token cap saturation, and a KV-cache memory miss, each caught before the paid run. Total overhead about 50 smoke calls and 25 minutes, protecting a 3,600-call sweep.">
        {/* timeline */}
        <line x1="24" y1="52" x2="656" y2="52" stroke={border} strokeWidth="1.5" />
        <text x="24" y="32" fontFamily="monospace" fontSize="10" fill={muted}>ONE NIGHT, THREE GATES FIRED</text>
        {catches.map((c, i) => {
          const x = bx0 + i * slot;
          const cx = x + bw / 2;
          return (
            <g key={c.name} fontFamily="monospace">
              <circle cx={cx} cy={52} r="5" fill={red} />
              <line x1={cx} y1={57} x2={cx} y2={by} stroke={muted} strokeWidth="1" strokeDasharray="3 3" />
              <path d={box(x, by, bw, bh)} fill={surface} stroke={red} strokeWidth="1.5" />
              <text x={x + 12} y={by + 24} fontSize="10.5" fontWeight="700" fill={red}>{c.name}</text>
              <text x={x + 12} y={by + 46} fontSize="10.5" fill={ink}>{c.detail1}</text>
              <text x={x + 12} y={by + 62} fontSize="10.5" fill={ink}>{c.detail2}</text>
              <text x={x + 12} y={by + 92} fontSize="9" fill={blue}>&rarr; {c.fix}</text>
            </g>
          );
        })}
        {/* cost comparison strip */}
        <g fontFamily="monospace">
          <text x="24" y="238" fontSize="10" fill={muted}>COST OF THE GATES</text>
          <rect x="24" y="246" width="10" height="16" fill={blue} opacity="0.85" />
          <text x="42" y="259" fontSize="11" fontWeight="700" fill={ink}>~50 smoke calls · ~25 min</text>
          <text x="24" y="288" fontSize="10" fill={muted}>COST IF ONE SHIPPED</text>
          <rect x="24" y="296" width="620" height="16" fill={red} opacity="0.75" />
          <text x="278" y="309" fontSize="11" fontWeight="700" fill={surface}>rescore or rerun ~3,600 calls</text>
        </g>
      </svg>
    </ChartCard>
  );
};

// --- PROVENANCE: the sign-flip that was a scoring artifact -----------------
export const SignFlipAuditChart = () => {
  const rows = [
    { label: 'correct verdict, verbose', n: 115, pct: 65.0, color: red, note: 'scoring artifact' },
    { label: 'genuine wrong verdict', n: 36, pct: 20.3, color: '#b07a24', note: 'real damage' },
    { label: 'no verdict committed', n: 21, pct: 11.9, color: muted, note: 'real change' },
    { label: 'ambiguous', n: 5, pct: 2.8, color: border, note: '' },
  ];
  const W = 680, H = 332;
  const x0 = 34, x1 = 646;
  const scale = (v) => (v / 100) * (x1 - x0);
  return (
    <ChartCard
      kicker="Manual audit · reasoning-toggle experiment"
      title="The 40-point reasoning collapse was the scorer, not the model"
      caption="Yes/no subgroup of a multi-hop QA benchmark, n=130 items, 177 damaged seed-pairs read by hand. Strict exact match against a one-token gold scored the toggle at −39.7 points; a scorer that extracts the verdict from the sentence scores the same frozen outputs at −0.0. Token-F1 co-moved (mean 0.077 on damaged rows) because it shares the failure mode, so metric agreement was the artifact's signature, not a check."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Under strict exact match the reasoning toggle loses 39.7 points; under verdict extraction the effect is 0. Of 177 damaged rows read by hand, 65 percent were correct but verbose answers, 20.3 percent genuine wrong verdicts, 11.9 percent committed no verdict, and 2.8 percent were ambiguous.">
        {/* top: the effect under two scorers */}
        <g fontFamily="monospace">
          <text x={x0} y="30" fontSize="10" fill={muted}>MEASURED EFFECT OF THE REASONING TOGGLE</text>
          <text x={x0} y="58" fontSize="11" fill={ink}>strict exact match</text>
          <rect x={x0 + 210} y="44" width={scale(39.7 * 0.9)} height="20" fill={red} opacity="0.85" />
          <text x={x0 + 218 + scale(39.7 * 0.9)} y="59" fontSize="12" fontWeight="700" fill={red}>&minus;39.7 pts</text>
          <text x={x0} y="90" fontSize="11" fill={ink}>verdict extraction</text>
          <rect x={x0 + 210} y="78" width="3" height="20" fill={blue} opacity="0.9" />
          <text x={x0 + 222} y="93" fontSize="12" fontWeight="700" fill={blue}>&minus;0.0 pts · same outputs</text>
        </g>
        <line x1={x0} y1="112" x2={x1} y2="112" stroke={border} strokeWidth="1" />
        {/* bottom: the 177 damage rows, read by hand */}
        <g fontFamily="monospace">
          <text x={x0} y="138" fontSize="10" fill={muted}>WHAT READING ALL 177 DAMAGED ROWS FOUND</text>
        </g>
        {rows.map((r, i) => {
          const yy = 158 + i * 42;
          const w = scale(r.pct);
          return (
            <g key={r.label} fontFamily="monospace">
              <rect x={x0} y={yy} width={w} height="24" fill={r.color} opacity="0.85" />
              <text x={x0 + w + 10} y={yy + 16} fontSize="11" fontWeight="700" fill={ink}>
                {r.n}/177 · {r.pct}%{r.note ? ` · ${r.note}` : ''}
              </text>
              <text x={x0} y={yy + 36} fontSize="9.5" fill={muted}>{r.label}</text>
            </g>
          );
        })}
      </svg>
    </ChartCard>
  );
};

// --- ARR: five-year review score distribution (the empty ceiling) ----------
export const ArrScoreCeilingChart = () => {
  const data = [
    { s: '1.0', v: 0.56 },
    { s: '1.5', v: 4.30 },
    { s: '2.0', v: 19.46 },
    { s: '2.5', v: 33.69, mode: true },
    { s: '3.0', v: 29.72 },
    { s: '3.5', v: 10.51 },
    { s: '4.0', v: 1.33 },
    { s: '4.5', v: 0.04 },
    { s: '5.0', v: 0.00, empty: true },
  ];
  const W = 680, H = 320;
  const x0 = 44, x1 = 664, yBase = 250, yTop = 58;
  const max = 36;
  const slot = (x1 - x0) / data.length;
  const barW = 40;
  const scale = (v) => (v / max) * (yBase - yTop);
  const cx5 = x0 + slot * 8 + slot / 2;

  return (
    <ChartCard
      kicker="ARR · aggregate review score per paper · 2021–2026"
      title="No ACL paper ever averages a perfect score: zero 5.0s in 69,781 submissions."
      caption="Distribution of per-paper aggregate review scores (one score per submission, the average of its roughly three reviews) across all 35 ACL Rolling Review cycles, May 2021 to May 2026 (69,781 scored submissions, public ARR dashboard). The 1–5 scale behaves as a 2-to-3 scale: 83% of papers land at 2.0–3.0, the mode is 2.5, and the 5.0 bin is empty. A 4.5 appears 28 times (0.04%). These are paper aggregates; individual reviewer scores are not published."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Bar chart of ARR per-paper aggregate scores: mode at 2.5 (33.7%), 3.0 at 29.7%, 2.0 at 19.5%, 4.0 at 1.3%, and zero papers at 5.0.">
        <line x1={x0 - 6} y1={yBase} x2={x1} y2={yBase} stroke={border} strokeWidth="1" />
        {data.map((d, i) => {
          const cx = x0 + slot * i + slot / 2;
          const bx = cx - barW / 2;
          const h = scale(d.v);
          const by = yBase - h;
          const c = d.mode ? ink : muted;
          return (
            <g key={d.s} fontFamily="monospace">
              {d.v > 0 && <rect x={bx} y={by} width={barW} height={h} fill={c} opacity={d.mode ? 0.9 : 0.6} />}
              {d.v === 0 && <rect x={bx} y={yBase - 2} width={barW} height="2" fill={muted} opacity="0.4" />}
              <text x={cx} y={(d.v > 0 ? by : yBase) - 8} textAnchor="middle" fontSize="11"
                fontWeight={d.mode || d.empty ? '700' : '400'} fill={d.empty ? red : d.mode ? ink : muted}>
                {d.v === 0 ? '0' : d.v.toFixed(d.v < 1 ? 2 : 1) + '%'}
              </text>
              <text x={cx} y={yBase + 18} textAnchor="middle" fontSize="11" fill={muted}>{d.s}</text>
            </g>
          );
        })}
        <g fontFamily="monospace">
          <line x1={cx5} y1={yTop + 2} x2={cx5} y2={yBase - 6} stroke={red} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <text x={cx5} y={yTop - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={red}>no paper 5.0</text>
        </g>
      </svg>
    </ChartCard>
  );
};

// --- ARR: reviewers vs area chairs (who hands out the highs) ----------------
export const ArrReviewerVsAcChart = () => {
  const data = [
    { s: '1.0', r: 0.23, a: 0.41 },
    { s: '1.5', r: 3.65, a: 3.24 },
    { s: '2.0', r: 19.15, a: 21.99 },
    { s: '2.5', r: 35.98, a: 22.01, fence: true },
    { s: '3.0', r: 30.41, a: 29.47 },
    { s: '3.5', r: 9.54, a: 14.78 },
    { s: '4.0', r: 0.79, a: 7.50, champ: true },
    { s: '4.5', r: 0.00, a: 0.23 },
    { s: '5.0', r: 0.00, a: 0.02 },
  ];
  const W = 680, H = 344;
  const x0 = 44, x1 = 664, yBase = 264, yTop = 70;
  const max = 38;
  const slot = (x1 - x0) / data.length;
  const bw = 15, gap = 3;
  const scale = (v) => (v / max) * (yBase - yTop);

  return (
    <ChartCard
      kicker="ARR · averaged reviews vs meta · per paper · 2025–2026"
      title="A paper's meta score swings wider than its averaged reviews."
      caption="Per-paper aggregate review score vs the area chair's meta score, half-point-scale era only (ARR switched the meta scale from integer to half-points in Feb 2025), 43,458 papers. The meta score reaches 4.0 seven times more often (7.5% vs 0.8%) and cuts the hedged 2.5 fence from 36% to 22%. Caveat: the review number is an average of three scores and the meta is a single score, so a single score's higher variance explains part of the wider tails, not area-chair generosity alone."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Grouped bar chart per paper: at 2.5 averaged reviews 36% vs meta 22%; at 4.0 averaged reviews 0.8% vs meta 7.5%.">
        <line x1={x0 - 6} y1={yBase} x2={x1} y2={yBase} stroke={border} strokeWidth="1" />
        {/* legend */}
        <g fontFamily="monospace" fontSize="11">
          <rect x={x0 + 2} y={yTop - 44} width={11} height={11} fill={muted} opacity="0.6" />
          <text x={x0 + 18} y={yTop - 35} fill={muted}>avg review</text>
          <rect x={x0 + 108} y={yTop - 44} width={11} height={11} fill={blue} opacity="0.9" />
          <text x={x0 + 124} y={yTop - 35} fill={muted}>meta (AC)</text>
        </g>
        {data.map((d, i) => {
          const cx = x0 + slot * i + slot / 2;
          const rH = scale(d.r), aH = scale(d.a);
          const rx = cx - bw - gap / 2, ax = cx + gap / 2;
          return (
            <g key={d.s} fontFamily="monospace">
              {d.r > 0 && <rect x={rx} y={yBase - rH} width={bw} height={rH} fill={muted} opacity="0.6" />}
              {d.a > 0 && <rect x={ax} y={yBase - aH} width={bw} height={aH} fill={blue} opacity="0.9" />}
              <text x={cx} y={yBase + 18} textAnchor="middle" fontSize="11" fill={muted}>{d.s}</text>
            </g>
          );
        })}
        {/* fence-drop annotation at 2.5 */}
        {(() => {
          const cx = x0 + slot * 3 + slot / 2;
          return (
            <g fontFamily="monospace">
              <text x={cx} y={yBase - scale(35.98) - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill={muted}>36%</text>
              <text x={cx + bw + gap} y={yBase - scale(22.01) - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill={blue}>22%</text>
              <text x={cx} y={yTop - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill={ink}>fence: −14 pts</text>
            </g>
          );
        })()}
        {/* champion-jump annotation at 4.0 */}
        {(() => {
          const cx = x0 + slot * 6 + slot / 2;
          return (
            <g fontFamily="monospace">
              <text x={cx + bw + gap} y={yBase - scale(7.50) - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill={blue}>7.5%</text>
              <text x={cx - bw} y={yBase - 8} textAnchor="middle" fontSize="10" fill={muted}>0.8%</text>
              <text x={cx + 6} y={yTop + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={ink}>champion: ×9.5</text>
              <line x1={cx + 6} y1={yTop + 10} x2={cx + bw / 2 + gap} y2={yBase - scale(7.50) - 14} stroke={ink} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            </g>
          );
        })()}
      </svg>
    </ChartCard>
  );
};

// --- ARR: volume exploded, mean held -----------------------------------------
export const ArrMeanVsVolumeChart = () => {
  const d = [
    { c: '2021/05', m: 2.611, n: 63, yr: '2021' },
    { c: '2021/06', m: 2.587, n: 23 },
    { c: '2021/07', m: 2.648, n: 27 },
    { c: '2021/08', m: 2.800, n: 40 },
    { c: '2021/09', m: 2.801, n: 276 },
    { c: '2021/10', m: 2.664, n: 320 },
    { c: '2021/11', m: 2.749, n: 2585 },
    { c: '2021/12', m: 2.791, n: 179 },
    { c: '2022/01', m: 2.586, n: 1777, yr: '2022' },
    { c: '2022/02', m: 2.547, n: 161 },
    { c: '2022/03', m: 2.566, n: 332 },
    { c: '2022/04', m: 2.662, n: 173 },
    { c: '2022/06', m: 2.794, n: 107 },
    { c: '2022/07', m: 2.256, n: 82 },
    { c: '2022/09', m: 2.410, n: 183 },
    { c: '2022/10', m: 2.495, n: 376 },
    { c: '2022/12', m: 2.496, n: 474 },
    { c: '2023/02', m: 2.457, n: 140, yr: '2023' },
    { c: '2023/04', m: 2.516, n: 187 },
    { c: '2023/08', m: 2.476, n: 105 },
    { c: '2023/10', m: 2.242, n: 1263 },
    { c: '2023/12', m: 2.617, n: 2224 },
    { c: '2024/02', m: 2.638, n: 4585, yr: '2024' },
    { c: '2024/04', m: 2.575, n: 763 },
    { c: '2024/06', m: 2.641, n: 4774 },
    { c: '2024/08', m: 2.548, n: 409 },
    { c: '2024/10', m: 2.607, n: 2704 },
    { c: '2024/12', m: 2.651, n: 1991 },
    { c: '2025/02', m: 2.600, n: 7321, yr: '2025' },
    { c: '2025/05', m: 2.664, n: 6472 },
    { c: '2025/07', m: 2.282, n: 1439 },
    { c: '2025/10', m: 2.621, n: 3310 },
    { c: '2026/01', m: 2.646, n: 9177, yr: '2026' },
    { c: '2026/03', m: 2.579, n: 2071 },
    { c: '2026/05', m: 2.628, n: 13668 },
  ];
  const W = 720, H = 340;
  const x0 = 40, x1 = 664, yBase = 262, yTop = 54;
  const nMax = 14000, mLo = 2.0, mHi = 2.9;
  const slot = (x1 - x0) / d.length;
  const bw = Math.min(12, slot - 3);
  const nScale = (v) => (v / nMax) * (yBase - yTop);
  const mY = (m) => yBase - ((m - mLo) / (mHi - mLo)) * (yBase - yTop);
  const cx = (i) => x0 + slot * i + slot / 2;
  const meanLine = d.map((p, i) => `${cx(i)},${mY(p.m)}`).join(' ');

  return (
    <ChartCard
      kicker="ARR · mean review score vs volume · 2021–2026"
      title="ARR grew more than 100× in five years. The average score didn't move."
      caption="Per-cycle scored-paper count (bars, left axis) and mean per-paper aggregate review score (line, right axis) across 35 ACL Rolling Review cycles, May 2021 to May 2026. Volume rose from 23 scored papers in mid-2021 to 13,668 in May 2026 while the mean stayed inside a 2.24–2.80 band. The two lowest means (2023/10, 2025/07) are small off-cadence cycles."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img"
        aria-label="Bars show review volume rising sharply to 13,668 by 2026; the overlaid mean-score line stays flat near 2.6 throughout.">
        {/* mean grid band 2.5-2.7 */}
        <rect x={x0} y={mY(2.7)} width={x1 - x0} height={mY(2.5) - mY(2.7)} fill={blue} opacity="0.06" />
        <line x1={x0} y1={mY(2.6)} x2={x1} y2={mY(2.6)} stroke={blue} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <line x1={x0 - 6} y1={yBase} x2={x1} y2={yBase} stroke={border} strokeWidth="1" />
        {/* left axis ticks (volume) */}
        <g fontFamily="monospace" fontSize="9" fill={muted}>
          {[0, 5000, 10000].map((t) => (
            <g key={t}>
              <line x1={x0 - 4} y1={yBase - nScale(t)} x2={x0} y2={yBase - nScale(t)} stroke={muted} strokeWidth="1" />
              <text x={x0 - 7} y={yBase - nScale(t) + 3} textAnchor="end">{t / 1000 + 'k'}</text>
            </g>
          ))}
        </g>
        {/* right axis ticks (mean) */}
        <g fontFamily="monospace" fontSize="9" fill={blue}>
          {[2.0, 2.5, 2.9].map((t) => (
            <text key={t} x={x1 + 6} y={mY(t) + 3} textAnchor="start">{t.toFixed(1)}</text>
          ))}
        </g>
        {/* volume bars */}
        {d.map((p, i) => (
          <rect key={p.c} x={cx(i) - bw / 2} y={yBase - nScale(p.n)} width={bw} height={nScale(p.n)} fill={muted} opacity="0.45" />
        ))}
        {/* year labels */}
        <g fontFamily="monospace" fontSize="10" fill={muted}>
          {d.map((p, i) => p.yr && (
            <text key={p.yr} x={cx(i)} y={yBase + 18} textAnchor="middle">{p.yr}</text>
          ))}
        </g>
        {/* mean line + dots */}
        <polyline points={meanLine} fill="none" stroke={blue} strokeWidth="1.75" opacity="0.9" />
        {d.map((p, i) => <circle key={p.c} cx={cx(i)} cy={mY(p.m)} r="2" fill={blue} />)}
        {/* annotations */}
        <g fontFamily="monospace">
          <text x={x0 + 8} y={mY(2.6) - 8} fontSize="10" fontWeight="700" fill={blue}>mean holds near 2.6</text>
          <text x={cx(34)} y={yBase - nScale(13668) - 8} textAnchor="end" fontSize="10" fontWeight="700" fill={ink}>13,668</text>
          <text x={cx(1)} y={yBase - 8} textAnchor="middle" fontSize="9" fill={muted}>23</text>
        </g>
      </svg>
    </ChartCard>
  );
};

const ResearchChart = ({ type }) => {
  if (type === 'seam-absorption') return <SeamAbsorptionChart />;
  if (type === 'seam-model-panel') return <SeamModelPanelChart />;
  if (type === 'seam-register') return <SeamRegisterChart />;
  if (type === 'outcome-contracts') return <OutcomeContractsChart />;
  if (type === 'recovery-affordances') return <RecoveryAffordancesChart />;
  if (type === 'outcome-boundaries') return <OutcomeBoundariesChart />;
  if (type === 'detector-vocabulary') return <DetectorVocabularyChart />;
  if (type === 'lapse-dissociation') return <LapseDissociationChart />;
  if (type === 'lapse-consolidation') return <LapseConsolidationChart />;
  if (type === 'lapse-timebomb') return <LapseTimeBombDiagram />;
  if (type === 'trace-chain') return <TraceChainDiagram />;
  if (type === 'smoke-catches') return <SmokeGateCatchesChart />;
  if (type === 'signflip-audit') return <SignFlipAuditChart />;
  if (type === 'arr-score-ceiling') return <ArrScoreCeilingChart />;
  if (type === 'arr-reviewer-vs-ac') return <ArrReviewerVsAcChart />;
  if (type === 'arr-mean-vs-volume') return <ArrMeanVsVolumeChart />;
  return null;
};

export default ResearchChart;

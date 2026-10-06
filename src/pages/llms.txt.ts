import type { APIRoute } from 'astro';
import { posts } from '../data/posts.js';
import { posters } from '../data/posters.js';

const BASE_URL = 'https://spanthi.com';

function link(title: string, path: string, description: string) {
  // Page paths get the trailing slash the host serves; files keep their name.
  const normalised = /\.[a-z0-9]{2,5}$/i.test(path) ? path : path.replace(/\/?$/, '/');
  const url = path.startsWith('http') ? path : `${BASE_URL}${normalised}`;
  return `- [${title}](${url}): ${description}`;
}

// Static entry points worth surfacing to answer engines. Kept short and real:
// no anchor-only or thin pages.
const CORE_PAGES = [
  link('Home', '/', 'Portfolio of Sugam Panthi, software engineer, LLM memory and evaluation researcher, and writer. Bio, experience, projects, publications, and honors.'),
  link('Blog', '/blog', 'Technical essays on LLM memory and evaluation, agents, engineering, and design. Each is a public companion to real experiments or shipped work.'),
  link('Posters', '/posters', 'Research posters for each paper, readable in the browser and printable at A0.'),
  link('Slides', '/slides', 'Talk slides, viewable full screen in the browser.'),
  link('Resume (PDF)', '/Resume.pdf', 'Sugam Panthi resume: experience, research, publications, and skills.'),
  link('CV (PDF)', '/CV.pdf', 'Sugam Panthi academic CV.'),
];

// Papers by arXiv or preprint id only. A paper under review never names its
// venue here (see AGENTS.md); the venue appears after acceptance.
const PAPERS = [
  link(
    'LAPSE: Memory Consolidation Flattens the Temporal Shape of User Facts (arXiv:2609.36457)',
    'https://arxiv.org/abs/2609.36457',
    'Memory writers rewrite temporary statements ("I\'m staying in Pasadena") as permanent facts ("lives in Pasadena"). LAPSE measures how consolidation drops temporal aspect.',
  ),
  link(
    'Can LLMs Separate Pasted Artifacts From User Speech? Absorption at Unmarked Prompt Seams (SEAM, alphaXiv preprint)',
    'https://www.alphaxiv.org/abs/2609.llm-pasted-artifact-separation',
    'The SEAM benchmark: across 20 models, 7.7% to 66.7% absorb a trailing remark into the pasted artifact at a bare newline; explicit markers help in 19 of 20.',
  ),
  link(
    'Outcome Monitors: Recovery Affordances for Silent Tool Failures (arXiv:2608.19303)',
    'https://arxiv.org/abs/2608.19303',
    'AI agents trust plausible but corrupted tool results; outcome-monitor receipts improve recovery across five models and two environments.',
  ),
  link(
    'Compression Is Not Evaluation-Neutral: Fixed RAG Compression Can Distort Reader Comparisons (arXiv:2606.21807)',
    'https://arxiv.org/abs/2606.21807',
    'Giving every reader the same stored compressed evidence shrinks reader upgrades: on HotpotQA, a 31.8-point gap between readers falls to 7.8 points under one RECOMP output. Releases the ragscale audit toolkit.',
  ),
  link(
    'Same Ranking, Different Winner: How Scoring Targets Shape LLM Memory Benchmarks (Findings of EMNLP 2026, arXiv:2605.24060)',
    'https://arxiv.org/abs/2605.24060',
    'Raw, Source, and Canonical scoring targets change LLM memory benchmark conclusions on LoCoMo and LongMemEval-S.',
  ),
];

const TALKS = [
  link('LAPSE slides', '/slides/lapse', 'Talk slides for LAPSE: memory writers turn "I\'m working at" into "works at" and lose the cue that a fact may not last.'),
  ...posters.map((p) => link(`Poster: ${p.title}`, `/poster/${p.slug}`, p.status === 'draft' ? `Idea proposition poster, no paper yet, ${p.authors}.` : `Research poster, ${p.authors}.`)),
];

export const GET: APIRoute = () => {
  const visible = posts
    .filter((p) => p.status !== 'draft')
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const lines: string[] = [
    '# Sugam Panthi',
    '',
    '> Software engineer, researcher, and writer based in Hattiesburg, MS. Research on LLM memory, evaluation, and agents. Engineering and design essays that document real experiments and shipped work.',
    '',
    '## Core Pages',
    ...CORE_PAGES,
    '',
    '## Papers',
    ...PAPERS,
    '',
    '## Posters and Slides',
    ...TALKS,
    '',
    '## Writing',
    ...visible.map((p) =>
      link(
        (p.seoTitle ?? p.title).replace(/\s*\|\s*Sugam Panthi\s*$/, ''),
        p.canonicalPath ?? `/blog/${p.slug}`,
        p.seoDescription ?? p.excerpt ?? '',
      ),
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

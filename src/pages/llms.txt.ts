import type { APIRoute } from 'astro';
import { posts } from '../data/posts.js';

const BASE_URL = 'https://spanthi.com';

function link(title: string, path: string, description: string) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  return `- [${title}](${url}): ${description}`;
}

// Static entry points worth surfacing to answer engines. Kept short and real —
// no anchor-only or thin pages.
const CORE_PAGES = [
  link('Home', '/', 'Portfolio of Sugam Panthi — software engineer, researcher, and writer. Bio, experience, projects, publications, and honors.'),
  link('Blog', '/blog', 'Technical essays on LLM memory and evaluation, agents, engineering, and design — each a public companion to real experiments or shipped work.'),
  link('Resume (PDF)', '/Resume.pdf', 'Sugam Panthi resume: experience, research, publications, and skills.'),
  link(
    'Paper: When Target Choice Changes Benchmark Conclusions in Transformed Conversational Memory (PDF)',
    '/When_Target_Choice_Changes_Benchmark_Conclusions_in_Transformed_Conversational_Memory.pdf',
    'Research paper on how Raw, Source, and Canonical scoring targets change LLM memory benchmark conclusions.',
  ),
];

export const GET: APIRoute = () => {
  const visible = posts
    .filter((p) => p.status !== 'draft')
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const lines: string[] = [
    '# Sugam Panthi',
    '',
    '> Software engineer, researcher, and writer based in Hattiesburg, MS. Research on LLM memory, evaluation, and agents; engineering and design essays that document real experiments and shipped work.',
    '',
    '## Core Pages',
    ...CORE_PAGES,
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

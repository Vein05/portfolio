// Single registry for the poster set. The gallery (/posters/) and the poster
// routes (/poster/<slug>/ and /poster/<slug>/landscape/) both read this, so a
// new poster is added in one place rather than three.
export const posters = [
  {
    slug: 'memory-targets',
    title: 'Same Ranking, Different Winner: How Scoring Targets Shape LLM Memory Benchmarks',
    venue: 'Findings of EMNLP 2026, arXiv:2605.24060',
    authors: 'Sugam Panthi and Rabab Abdelfattah',
    status: 'published',
    formats: ['portrait', 'landscape'],
  },
  {
    slug: 'outcome-monitors',
    title: 'Outcome Monitors: Recovery Affordances for Silent Tool Failures',
    venue: 'arXiv:2608.19303',
    authors: 'Sugam Panthi and Rabab Abdelfattah',
    status: 'published',
    formats: ['portrait', 'landscape'],
  },
  {
    slug: 'rag-compression',
    title: 'Compression Is Not Evaluation-Neutral: Fixed RAG Compression Can Distort Reader Comparisons',
    venue: 'arXiv:2606.21807',
    authors: 'Sugam Panthi and Rabab Abdelfattah',
    status: 'published',
    formats: ['portrait', 'landscape'],
  },
  {
    slug: 'seam',
    title: 'Can LLMs Separate Pasted Artifacts from User Speech? Absorption at Unmarked Prompt Seams',
    venue: 'Under review; preprint on alphaXiv, September 2026',
    authors: 'Sugam Panthi, Muhaiminul Yeamin, and Rabab Abdelfattah',
    status: 'under-review',
    formats: ['portrait', 'landscape'],
  },
  {
    slug: 'aspect-persistence',
    title: 'Memory Consolidation Flattens the Temporal Shape of User Facts',
    venue: 'arXiv:2609.36457',
    authors: 'Sugam Panthi, Muhaiminul Yeamin, Siyan Luo, and Rabab Abdelfattah',
    status: 'under-review',
    formats: ['portrait', 'landscape'],
  },
  {
    slug: 'stale-policy',
    title: 'The Stale Answer Problem: Where the Current Statement Drops Out',
    venue: 'Draft idea proposition, no paper yet, 2026-09-04',
    authors: 'Sugam Panthi',
    status: 'draft',
    formats: ['portrait'],
  },
];

// Sheet geometry per format. Portrait is A0; landscape is the 44 x 32 in sheet
// the lab's print shop runs (3168 x 2304 pt), which is what every other poster
// from the group is printed at.
export const FORMATS = {
  portrait: { w: 841, h: 1189, label: 'A0', paper: 'A0 portrait, 841 x 1189 mm' },
  landscape: { w: 1117.6, h: 812.8, label: '44 x 32', paper: '44 x 32 in, 1117.6 x 812.8 mm' },
};

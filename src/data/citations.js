// Single source of truth for paper citations (BibTeX).
// Consumed by the homepage Papers panel ("Copy BibTeX" button) and by the
// ```bibtex block in blog posts (`key: <id>`). Add a paper here once, cite
// it anywhere.

export const citations = {
  "rag-compression": {
    label: "Fixed RAG Compression Collapses Measured Reader Scaling (arXiv 2026)",
    bibtex: `@misc{panthi2026ragcompression,
  title         = {Fixed RAG Compression Collapses Measured Reader Scaling},
  author        = {Panthi, Sugam and Abdelfattah, Rabab},
  year          = {2026},
  eprint        = {2606.21807},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CL},
  doi           = {10.48550/arXiv.2606.21807},
  url           = {https://arxiv.org/abs/2606.21807}
}`,
  },
  "memory-targets": {
    label: "Same Ranking, Different Winner: How Scoring Targets Shape LLM Memory Benchmarks (arXiv 2026)",
    bibtex: `@misc{panthi2026memorytargets,
  title         = {Same Ranking, Different Winner: How Scoring Targets Shape {LLM} Memory Benchmarks},
  author        = {Panthi, Sugam and Abdelfattah, Rabab},
  year          = {2026},
  eprint        = {2605.24060},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CL},
  doi           = {10.48550/arXiv.2605.24060},
  url           = {https://arxiv.org/abs/2605.24060}
}`,
  },
  "plastic-recycling": {
    label: "A Comprehensive Review of Plastic Recycling in the Construction Industry (2025)",
    bibtex: `@inproceedings{panthi2025plastic,
  title     = {A Comprehensive Review of Plastic Recycling in the Construction Industry: Challenges and Opportunities in the {US}},
  author    = {Panthi, Sugam and Zhang, Fan},
  year      = {2025},
  booktitle = {CIB Conferences},
  volume    = {1},
  number    = {1},
  pages     = {63},
  doi       = {10.7771/3067-4883.2081},
  url       = {https://docs.lib.purdue.edu/cib-conferences/vol1/iss1/63/}
}`,
  },
};

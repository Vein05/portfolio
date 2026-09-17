// Single source of truth for paper citations (BibTeX).
// Consumed by the homepage Papers panel ("Copy BibTeX" button) and by the
// ```bibtex block in blog posts (`key: <id>`). Add a paper here once, cite
// it anywhere.

export const citations = {
  "seam": {
    label: "Can LLMs Separate Pasted Artifacts From User Speech? Absorption at Unmarked Prompt Seams (alphaXiv 2026)",
    bibtex: `@misc{panthi2026seam,
  title         = {Can {LLMs} Separate Pasted Artifacts From User Speech? Absorption at Unmarked Prompt Seams},
  author        = {Panthi, Sugam and Yeamin, Muhaiminul and Abdelfattah, Rabab},
  year          = {2026},
  howpublished  = {alphaXiv preprint},
  url           = {https://www.alphaxiv.org/abs/2609.llm-pasted-artifact-separation}
}`,
  },
  "outcome-monitors": {
    label: "Outcome Monitors: Recovery Affordances for Silent Tool Failures (arXiv 2026)",
    bibtex: `@misc{panthi2026outcomemonitors,
  title         = {Outcome Monitors: Recovery Affordances for Silent Tool Failures},
  author        = {Panthi, Sugam and Abdelfattah, Rabab},
  year          = {2026},
  eprint        = {2608.19303},
  archivePrefix = {arXiv},
  primaryClass  = {cs.AI},
  doi           = {10.48550/arXiv.2608.19303},
  url           = {https://arxiv.org/abs/2608.19303}
}`,
  },
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
    label: "Same Ranking, Different Winner: How Scoring Targets Shape LLM Memory Benchmarks (EMNLP Findings 2026)",
    bibtex: `@inproceedings{panthi2026memorytargets,
  title         = {Same Ranking, Different Winner: How Scoring Targets Shape {LLM} Memory Benchmarks},
  author        = {Panthi, Sugam and Abdelfattah, Rabab},
  booktitle     = {Findings of the Association for Computational Linguistics: EMNLP 2026},
  year          = {2026},
  note          = {To appear},
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

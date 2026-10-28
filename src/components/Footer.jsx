import React from "react";

const LAST_UPDATED = "April 28, 2026";

const Footer = () => {
  return (
    <footer className="mt-0 border-border-paper pt-8 pb-10">
      <div className="flex flex-col gap-4">
        {/* Top row: name mark + last updated */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xs uppercase tracking-widest text-ink-dark font-semibold">
            Sugam Panthi
          </span>
          <span className="text-xs text-ink-muted tracking-wide">
            Last updated&nbsp;&mdash;&nbsp;{LAST_UPDATED}
          </span>
        </div>


        {/* Bottom row: credit */}
        <p className="text-[11px] text-ink-muted leading-relaxed">
          Design ideas drawn from{" "}
          <a
            href="https://garden.bradwoods.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-blue hover:underline underline-offset-2"
          >
            garden.bradwoods.io
          </a>
          .
        </p>
        {/* Cross-links: invisible to users, crawlable by search engines */}
        <div
          aria-hidden="true"
          style={{
            fontSize: 0,
            lineHeight: 0,
            overflow: "hidden",
            height: 0,
            width: 0,
            position: "absolute",
          }}
        >
          <a href="https://orderpost.store" tabIndex={-1} rel="noopener">OrderPost</a>
          <a href="https://magnoliaed.ai" tabIndex={-1} rel="noopener">MagnoliaEd</a>
          <a href="https://costumary.com" tabIndex={-1} rel="noopener">Costumary</a>
          <a href="https://deptlink.com" tabIndex={-1} rel="noopener">DeptLink</a>
          <a href="https://notes.spanthi.com/library/" tabIndex={-1}>Paper notes</a>
          <a href="https://notes.spanthi.com/papers/lapse/" tabIndex={-1}>Language Model Memory Flattens the Temporal Form of User Facts</a>
          <a href="https://notes.spanthi.com/papers/derivaudit/" tabIndex={-1}>Memory Is a Derivation: The Distributed-Evidence Paradox in Long-Term Agents</a>
          <a href="https://notes.spanthi.com/papers/lost-in-compaction/" tabIndex={-1}>Lost in Context Compaction: When LLM Systems Drop Side Constraints</a>
          <a href="https://notes.spanthi.com/papers/lost-in-transliteration/" tabIndex={-1}>Lost in Transliteration: Bridging the Script Gap in Neural IR</a>
          <a href="https://notes.spanthi.com/papers/biology/" tabIndex={-1}>On the Biology of a Large Language Model</a>
          <a href="https://notes.spanthi.com/papers/grpo-sft-lora/" tabIndex={-1}>GRPO, SFT and LoRA: How a Model Learns From Scores</a>
          <a href="https://notes.spanthi.com/papers/irt-trust/" tabIndex={-1}>Can We Trust Item Response Theory for AI Evaluation?</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

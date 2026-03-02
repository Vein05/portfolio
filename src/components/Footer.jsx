import React from "react";

const LAST_UPDATED = "March 2, 2026";

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
      </div>
    </footer>
  );
};

export default Footer;

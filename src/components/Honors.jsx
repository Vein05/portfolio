import React from 'react';
import { FaTrophy, FaGraduationCap, FaCode } from 'react-icons/fa';

const typeConfig = {
  Winner: {
    icon: FaTrophy,
  },
  Scholar: {
    icon: FaGraduationCap,
  },
  Developer: {
    icon: FaCode,
  },
};

const honors = [
  {
    type: "Winner",
    title: "Pitch Competition",
    organization: "MPI (Mississippi Polymer Institute)",
    link: "https://www.thepolymerinstitute.com/"
  },
  {
    type: "Winner",
    title: "Hackathon",
    organization: "hack@davidson",
    link: "https://hack-davidson-2025.devpost.com/project-gallery"
  },
  {
    type: "Winner",
    title: "Hackathon",
    organization: "hatchery@usm",
    link: "https://www.usm.edu/news/2024/release/hatchathon.php"
  },
  {
    type: "Scholar",
    title: "Honors Scholar",
    organization: "USM",
    link: "https://www.usm.edu/"
  },
  {
    type: "Developer",
    title: "Verified Discord Developer",
    organization: "Discord",
    link: "https://discord.com/developers"
  }
];

export default function Honors() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-ink-dark">Honors &amp; Awards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {honors.map((honor, index) => {
          const config = typeConfig[honor.type] || typeConfig.Developer;
          const Icon = config.icon;
          return (
            <a
              key={index}
              href={honor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-4 bg-paper-surface border border-border-paper hover:bg-ink-dark hover:border-ink-dark transition-colors duration-200"
            >
              <div className="mt-0.5 shrink-0 text-ink-muted group-hover:text-paper-light/50">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="inline-block text-xs uppercase tracking-widest text-ink-muted group-hover:text-paper-light/40 mb-1">
                  {honor.type}
                </span>
                <p className="text-sm font-semibold text-ink-dark group-hover:text-paper-light leading-snug">{honor.title}</p>
                <p className="text-xs text-ink-muted group-hover:text-paper-light/40 mt-0.5 truncate">{honor.organization}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
// export deafault Projects;
import React from 'react';

export default function Honors() {
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

  return (
    <>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Honors & Awards</h2>
        <div className="space-y-4">
          {honors.map((honor, index) => (
            <div 
              key={index} 
              className="pb-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">
                  {honor.type}:
                </span>
                <span className="text-sm text-gray-700">
                  {honor.title} @
                </span>
                <a 
                  href={honor.link} 
                  className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {honor.organization}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
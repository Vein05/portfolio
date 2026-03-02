import React, { useEffect } from 'react';

const publications = [
  {
    title: "A Comprehensive Review of Plastic Recycling in the Construction Industry: Challenges and Opportunities in the US",
    authors: "Sugam Panthi, Fan Zhang",
    venue: "CIB Conferences",
    volume: "Vol. 1, Iss. 1, p. 63",
    year: "2025",
    link: "https://docs.lib.purdue.edu/cib-conferences/vol1/iss1/63/",
    doi: "10.7771/3067-4883.2081"
  }
];

const Research = () => {
  useEffect(() => {
    if (document.querySelector('script[src*="cdn.plu.mx/widget-popup.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.plu.mx/widget-popup.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Research</h2>
      <div className="space-y-4">
        {publications.map((pub, index) => (
          <div key={index} className="pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-500 hover:underline leading-snug"
                >
                  {pub.title}
                </a>
                <p className="text-sm text-gray-700 mt-0.5">{pub.authors}</p>
                <p className="text-sm italic text-gray-500">
                  {pub.venue} &mdash; {pub.volume} &mdash; {pub.year}
                </p>
              </div>
              <div className="shrink-0 flex items-center">
                <a
                  href={`https://plu.mx/plum/a/?doi=${encodeURIComponent(pub.doi)}`}
                  className="plumx-plum-print-popup"
                  data-hide-when-empty="true"
                  data-doi={pub.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Research;

import React from 'react';

const Experience = () => {
  return (
    <div className="mt-3">
      <span className="text-2xl font-bold mb-2 underline">Experience</span>
      <div className="">
        <div>
          <span className="text-sm font-semibold text-blue-500">Undergraduate Research Assistant</span>
          <p className="text-xs">The University of Southern Mississippi</p>
          <ul className="text-xs list-disc list-inside mt-1">
            <li>Analyzed plastic recycling's impact on agriculture and construction, contributing to two journal submissions via data analysis, visualization, and LSTM-based predictive modeling. </li>
            <li>Built a React Native app connecting farmers and recycling plants for efficient plastic waste transport using Clerk, MongoDB, and Mapbox.s</li>
          </ul>
        </div>
        <div>
          <span className="text-sm font-semibold text-blue-500">Tech Intern</span>
          <p className="text-xs">I internted at Best One Network (Butwal) as an tech intern from February 2024 - May 2024.</p>
          <ul className="text-xs list-disc list-inside mt-1">
            <li>Enhanced the payment confirmation API by transitioning from Django to FlaskWSGI framework, optimizing processing speed by 20% and improving scalability by 30%.</li>
            <li>Identified, reported, and solved 5 critical bugs during the testing phase, leading to a 10% reduction in post-deployment issues.</li>
            <li>Efficiently integrated and documented the upgraded API into the main codebase using Git and Jira.</li>
          </ul>
        </div>      
        </div>
    </div>
  );
};

export default Experience;
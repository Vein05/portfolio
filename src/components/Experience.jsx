import React from 'react';

const Experience = () => {
  return (
    <div className="">
      <span className="text-md font-bold">Experience</span>
      <div className="">
        <div>
          <span className="text-sm font-semibold">1. Undergraduate Research Assistant</span>
          <p className="text-xs">The University of Southern Mississippi</p>
          <ul className="list-disc list-inside mt-2">
          </ul>
        </div>
        <div>
          <span className="text-sm font-semibold">2. Tech Intern</span>
          <p className="text-xs">I internted at Best One Network (Butwal) as an tech intern from February 2024 - May 2024.</p>
          <ul className="text-xs list-disc list-inside mt-1">
            <li>Enhanced the payment confirmation API by transitioning from Django to FlaskWSGI framework, optimizing processing speed by 20% and improving scalability by 30%.</li>
            <li>Identified, reported, and solved 5 critical bugs during the testing phase, leading to a 10% reduction in post-deployment issues.</li>
            <li>Efficiently integrated and documented the upgraded API into the main codebase using Git and Jira.</li>
          </ul>
        </div>      </div>
    </div>
  );
};

export default Experience;
import React from 'react';

const Projects = () => {
  return (
    <div className="">
      <h2 className="text-md font-bold">Projects</h2>
      <div className="space-y-4">
        <div>
          <span className="flex flex-row text-sm font-semibold text-blue-500"><img className="h-4 w-4 mr-1" src="/images/folder-git.png" alt="git"/> <a href='https://github.com/cohesion-org/deepseek-go' target='_blank' rel="noreferrer">Deepseek</a></span>
          <p className="text-xs"> A Deepseek wrapper written for Go supporting R-1, Chat V3, and Coder. </p>
          <ul className="text-xs list-disc list-inside mt-1">
            <li>Developed and maintained an OpenSource API wrapper with 30+ stars, 10+ dependents.</li>
            <li>Added support for modular conversations with the AI, covering 80% of the Deepseek API.</li>
          </ul>
        </div>
        <div>
          <span className="flex flex-row text-sm font-semibold text-blue-500">
            <img className="h-4 w-4 mr-1" src="/images/folder-git.png" alt="git" />
            <a href='https://github.com/saphalpdyl/Cohesion' target='_blank' rel="noreferrer">Cohesion - AI-Based SQL Assistant</a>
          </span>
          <p className="text-xs">Developed an AI-powered OpenSource web application for SQL schema generation.</p>
          <ul className="text-xs list-disc list-inside mt-1">
            <li>Reduced SQL schema generation time by 70%.</li>
            <li>Designed a custom CSV format named SS-CSV, improving performance by 200%.</li>
            <li>Collaborated on a SQL schema serializer, enhancing processing speed by 500%.</li>
            <li>Deployed a backend testing system using Go, Gin, and Docker for optimized benchmarking.</li>
          </ul>
        </div>
      </div>
      <div>
          <span className="flex flex-row text-sm font-semibold text-blue-500">
            <img className="h-4 w-4 mr-1" src="/images/folder-git.png" alt="git" />
            <a href='https://github.com/Danimebot/danime'>Danime - A Discord Bot</a>
          </span>
          <p className="text-xs">Collaborated with 3 developers to build an OpenSource Discord bot.</p>
          <ul className="text-xs list-disc list-inside mt-1">
            <li>Developed server management tools and fun commands.</li>
            <li>Verified by Discord, achieving 1,000,000+ users and 2,000,000+ API calls.</li>
            <li>Utilized Python, Discord API, Flask, MongoDB, and Git.</li>
          </ul>
        </div>
        <div>
          <span className="flex flex-row text-sm font-semibold text-blue-500">
          <img className="h-4 w-4 mr-1" src="/images/folder-git.png" alt="git" />
            <a href='https://mokshaa.vercel.app/'>Moksha - A Social App</a>
          </span>
          <p className="text-xs">Developed a full-stack self-help platform.</p>
          <ul className="text-xs list-disc list-inside mt-1">
            <li>Used React JS and Tailwind CSS for the frontend and Firebase for the integrated forum.</li>
            <li>OpenSource and hosted on Vercel.</li>
            <li>Implemented a login system through Google Auth with 50+ users and 1000+ page views.</li>
            <li>Focused on helping teens through self-help guides and testimonials.</li>
          </ul>
        </div>
        <div>
          <span className="flex flex-row text-sm font-semibold text-blue-500">
            <img className="h-4 w-4 mr-1" src="/images/folder-git.png" alt="git" />
            <a href='https://github.com/Vein05/url-shortener-go'>URL Shortener</a>
          </span>
          <p className="text-xs">Developed an OpenSource cross-platform dynamic URL shortener.</p>
          <ul className="text-xs list-disc list-inside mt-1">
            <li>Used Go, Gin, and MongoDB.</li>
            <li>Created the frontend in HTML and JS with seamless Gin integration.</li>
            <li>Implemented a QR code system for shortened URLs.</li>
          </ul>
        </div>
    </div>
  );
};

export default Projects;
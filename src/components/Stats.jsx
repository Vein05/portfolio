import React from 'react';

const Stats = () => {
  return (
    <div className='w-70v'>
      <div className=''>
        <a href="https://github.com/vein05/" target="_blank" rel="noreferrer"> <img
          src="http://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=vein05&theme=github"
          alt="Profile Details"
        />
        
        <div className='grid grid-cols-2 '>
            <img
            src="http://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=vein05&theme=github&exclude=jupyter%20Notebook"
            alt="Repos per Language"
            />
            <img
            src="http://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=vein05&theme=github&exclude=Jupyter%20Notebook"
            alt="Most Commit Language"
            />
            <img
            src="http://github-profile-summary-cards.vercel.app/api/cards/stats?username=vein05&theme=github"
            alt="GitHub Stats"
            />
            <img
            src="http://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=vein05&theme=github&utcOffset=-6"
            alt="Productive Time"
            />
        
        </div>
        </a>
      </div>
    </div>
  );
};

export default Stats;
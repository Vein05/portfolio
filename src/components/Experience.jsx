import React from 'react';

const Experience = () => {
  const experiences = [
    {
      title: "AI & ML Intern",
      company: "Prediction 3D",
      period: "May 2025 – Present",
      achievements: [
        "Analyzed site data, including images and sensor inputs, to develop predictive models for enhancing safety and productivity using PyTorch.",
        "Collaborated with a team of 20 engineers to integrate AI solutions into web applications using ASPNet, Node.",
        "Contributed to data visualization dashboards, providing actionable insights for stakeholders to optimize quality control in construction projects."
      ],
      status: "active"
    },
    {
      title: "Co-Founder & CTO",
      company: "MagnoliaEd LLC",
      period: "April 2025 – Present",
      achievements: [
        "Built an AI-powered EdTech platform enabling instructors to create personalized chatbots for their classes using course materials, with role-based dashboards.",
        "Led full-stack development (Next.js, Firebase, Python), fine-tuned LLAMA-3, and utilized vector embeddings.",
        "Secured funding($2,500) and multiple startup competition wins; deployed to programs at Universities and Colleges."
      ],
      status: "active"
    },
    {
      title: "Undergraduate Research Assistant",
      company: "The University of Southern Mississippi",
      period: "Aug 2024 - Present",
      achievements: [
        "Analyzed plastic recycling's impact on agriculture and construction, contributing to two journal submissions via data analysis, visualization, and LSTM-based predictive modeling.",
        "Built a React Native app connecting farmers and recycling plants for efficient plastic waste transport using Clerk, MongoDB, and Mapbox."
      ],
      status: "active"
    },
    {
      title: "Tech Intern",
      company: "Best One Network (Butwal)",
      period: "Feb 2024 - May 2024",
      achievements: [
        "Enhanced the payment confirmation API by transitioning from Django to FlaskWSGI framework, optimizing processing speed by 20% and improving scalability by 30%.",
        "Identified, reported, and solved 5 critical bugs during the testing phase, leading to a 10% reduction in post-deployment issues.",
        "Efficiently integrated and documented the upgraded API into the main codebase using Git and Jira."
      ],
      status: "completed"
    }
  ];

  return (
    <div className="mt-8 mb-2 pb-2  border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Experience</h2>
      
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-blue-300 rounded-lg"></div>
        
        <div className='flex flex-col'>
          {experiences.map((exp, index) => (
            <div key={index} className="relative flex mb-3 last:mb-0">
              <div className="relative z-10 flex-shrink-0">
                <div className="ml-1 w-3 h-3 bg-blue-300 rounded-full mt-1"></div>
              </div>
              
              <div className="ml-4 flex-grow">
                <div className="">
                  <div className="flex justify-between items-center mb-0">
                    <span className="text-md font-semibold text-blue-500">
                      {exp.title}
                    </span> 
                    <span className="text-sm italic"> 
                        {exp.period}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 italic">
                    {exp.company}
                  </span>

                </div>
                
                <ul className="text-xs list-disc list-inside space-y-1">
                  {exp.achievements.map((achievement, achievementIndex) => (
                    <li key={achievementIndex} className="text-gray-700">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
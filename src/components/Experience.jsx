import React from 'react';

const Experience = () => {
  const experiences = [
    {
      title: "Co-Founder & CTO",
      company: "MagnoliaEd LLC",
      period: "Apr 2025 – Present",
      achievements: [
        "Founded an AI-powered EdTech platform delivering personalized instructor chatbots and role-based dashboards, adopted by multiple college classrooms.",
        "Led full-stack development for a RAG(Retrieval-augmented generation) agentic model, established CI/CD pipelines with GitHub Actions for rapid deployment and automated testing.",
        "Designed and implemented a Hybrid Monolithic architecture using Docker and Terraform with AWS fargate, enabling independent scaling of chat, analytics, and authentication services, enabling the platform to handle 1,000+ concurrent student sessions.",
        "Secured $27,000 in startup funding from Co-Builders: powered by Microsoft, attracted angel investors through pitch competitions, and built investor relations while managing stakeholder communications."
      ],
      status: "active"
    },
    {
      title: "AI & ML Intern",
      company: "Prediction 3D",
      period: "May 2025 – Present",
      achievements: [
        "Developed predictive models using PyTorch on multimodal construction site data, by processing images and sensor readings, resulting in improved safety and productivity insights for field teams.",
        "Integrated AI solutions into web applications with LangChain and Pinecone, collaborating with a 20-engineer team, enabling seamless deployment of ML features to end-users.",
        "Contributed to the design of a microservice-based data pipeline, separating data ingestion, preprocessing, and model inference for improved maintainability.",
        "Built Python-based data visualization dashboards by transforming processed datasets into actionable charts, reducing decision-making time for stakeholders by 30%."
      ],
      status: "active"
    },
    {
      title: "Undergraduate Research Assistant",
      company: "The University of Southern Mississippi",
      period: "Nov 2024 - Present",
      achievements: [
        "Researched and modeled U.S. plastic waste trends using LSTM networks, cleaning and visualizing large datasets, contributing to two journal paper submissions.",
        "Designed a React Native recycling logistics app integrating Clerk, MongoDB, and Mapbox, enabling real-time waste transportation tracking for plantations.",
        "Proposed a modular backend using microservices for data collection, analytics, and reporting, improving scalability for future research projects."
      ],
      status: "active"
    },
    {
      title: "Tech Intern",
      company: "Best One Network (Butwal)",
      period: "Feb 2024 - May 2024",
      achievements: [
        "Enhanced the payment confirmation API by transitioning from Django monolith to FlaskWSGI microservice, optimizing processing speed by 20% and improving scalability by 30%.",
        "Identified, reported, and solved 5 critical bugs during the testing phase, leading to a 10% reduction in post-deployment issues.",
        "Efficiently integrated and documented the upgraded API into the main codebase using Git and Jira, and contributed to the design of a service-oriented architecture for future integrations."
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
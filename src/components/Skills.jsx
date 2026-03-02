import React from 'react';

const skillGroups = [
  {
    label: "Languages",
    skills: ["Go", "Python", "JavaScript", "TypeScript", "SQL"]
  },
  {
    label: "Frameworks & Libraries",
    skills: ["React", "Next.js", "React Native", "Flask", "Django", "LangChain", "PyTorch"]
  },
  {
    label: "Infrastructure & Databases",
    skills: ["Docker", "Terraform", "AWS Fargate", "Firebase", "MongoDB", "Pinecone", "PostgreSQL"]
  },
  {
    label: "Systems & Protocols",
    skills: ["Kafka", "Raft", "gRPC", "REST", "Microservices"]
  },
  {
    label: "Tools & Practices",
    skills: ["Git", "GitHub Actions", "CI/CD", "Jira", "Turborepo"]
  }
];

const Skills = () => {
  return (
    <div className="mt-12 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-ink-dark">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-0">
        {skillGroups.map((group) => (
          <div key={group.label} className="border-b border-border-paper py-5 transition-all duration-200">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="lg:w-1/3">
                <h3 className="text-xs uppercase tracking-widest text-ink-blue mb-1">
                  {group.label}
                </h3>
              </div>
              <div className="lg:w-2/3">
                 <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-3 py-1 border border-border-paper text-sm text-ink-dark hover:bg-ink-dark hover:text-paper-light hover:border-ink-dark cursor-default transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;

const Projects = () => {
  const projects = [
    {
      title: "Deepseek",
      description: "A Deepseek client written for Go supporting R-1, Chat V3, and Coder.",
      link: "https://github.com/cohesion-org/deepseek-go",
      achievements: [
        "Maintained an OpenSource package with more than 300+ stars, 100+ dependents, and 10+ collaborators",
        "Added comprehensive support for modular conversations with the AI, coverin full Deepseek API functionality including R-1, Chat V3, and Coder models",
        "Implemented comprehensive unit and functional testing with CI/CD actions, ensuring code reliability, maintainability, and automated deployment processes"
      ]
    },

    {
      title: "Ripple",
      description: "Developed a web application for creating, playing, and sharing flashcards in 3D, enhancing study experiences.",
      link: "https://github.com/saphalpdyl/ripple",
      achievements: [
        "Engineered with a Next.js frontend and Go backend, deployed on Cloud Run with Firebase for database storage",
        "Utilized Turborepo for monorepo management, enabling efficient development and deployment workflows",
        "Incorporated OCR using Tesseract and text-to-speech features powered by OpenAI, providing advanced user interactivity"
      ]
    },
    {
      title: "Cohesion - AI-Based SQL Assistant",
      description: "Developed an AI-powered OpenSource web application for SQL schema generation.",
      link: "https://github.com/saphalpdyl/Cohesion",
      achievements: [
        "Reduced SQL schema generation time by 70% through AI-powered automation, significantly improving developer productivity and workflow efficiency",
        "Designed and implemented a custom CSV format named SS-CSV, improving data processing performance by 200% compared to standard formats",
        "Collaborated on developing a SQL schema serializer and deployed a comprehensive backend testing system using Go, Gin, and Docker for optimized benchmarking, enhancing processing speed by 500%"
      ]
    },
    {
      title: "Danime - A Discord Bot",
      description: "Collaborated with 3 developers to build an OpenSource Discord bot.",
      link: "https://github.com/Danimebot/danime",
      achievements: [
        "Successfully collaborated with 3 developers to create a Discord-verified bot that achieved 1,000,000+ users and 2,000,000+ API calls",
        "Developed comprehensive server management tools and entertaining commands that enhanced user engagement and community interaction across Discord servers",
        "Utilized a robust technology stack including Python, Discord API, Flask, MongoDB, and Git for version control, ensuring scalable and maintainable code architecture"
      ]
    },
    {
      title: "Moksha - A Social App",
      description: "Developed a full-stack self-help platform.",
      link: "https://mokshaa.vercel.app/",
      achievements: [
        "Built a full-stack application using React JS and Tailwind CSS for the frontend with Firebase integration for the community forum, creating a seamless user experience",
        "Implemented a secure Google Auth login system that successfully onboarded 50+ users and generated 1000+ page views, demonstrating strong user engagement and retention",
        "Created an OpenSource self-help platform specifically focused on helping teenagers through comprehensive self-help guides, testimonials, and community support features"
      ]
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Projects</h2>
      <div className="space-y-2">
        {projects.map((project, index) => (
          <div key={index} className="mb-3">
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <a
                  className="text-md font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.title}
                </a>
                <span className="ml-1 text-sm text-gray-600 italic">
                  {"-"} {project.description}
                </span>
              </div>
            </div>
            <ul className="text-xs list-disc list-inside space-y-1">
              {project.achievements.map((achievement, achievementIndex) => (
                <li key={achievementIndex} className="text-gray-700">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
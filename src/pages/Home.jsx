import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Honors from "../components/Honors";
import { FaGithub, FaLinkedin, FaEnvelope, FaEye, FaDownload } from "react-icons/fa";
import React from "react";

function Home() {
  React.useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <>
      <div className="page">
        <div className="resume-container lg:max-w-3xl lg:mx-auto m-2 p-2">
          <div className="header-section">
            <div className="text-center mb-3">
              <h1 className="text-xl lg:text-4xl font-bold text-gray-900 mb-2">
                Sugam Panthi
              </h1>
              <p className="text-sm lg:text-base text-gray-600 font-medium">
                Co-founder @ {" "}
                <a 
                href="magnoliaed.net"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                >
                  MagnoliaEd
                </a>
                {" "}
                 | Research Assistant @{" "}
                <a
                  href="https://www.usm.edu/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  USM 
                </a>
              </p>
              <section className="nav">
                <nav className="flex justify-center space-x-2 text-gray-600">
                  <a href="#projects" className="underline">Projects</a>
                  <span className="text-black">/</span>
                  <a href="#experience" className="underline">Experience</a>
                  <span className="text-black">/</span>
                  <a href="#honors" className="underline">Honors</a>

                </nav>
              </section>
            </div>

            <div className="lg:flex lg:items-start lg:gap-8">
              <div className="lg:flex-1 mb-6 lg:mb-0">
                <div className="space-y-4">
                  <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                    I'm Sugam Panthi, based in Hattiesburg, Mississippi. I have experience building technologies using Go and Python. I'm currently interning as an AI and MI fellow @{" "}
                    <a
                      href="https://prediction3d.com"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Prediction3d
                    </a>
                    .
                  </p>
                  
                  <p className="text-sm lg:text-base text-gray-700">
                    I'm pursuing a <span className="font-semibold text-gray-900">Bachelor's in Computer Science</span> at{" "}
                    <a
                      href="https://www.usm.edu/"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      The University of Southern Mississippi
                    </a>
                    , Hattiesburg, Mississippi.
                  </p>
                  <div className="border-t border-gray-200 ">
                    <p className="font-thin text-gray-700"> For professional queries</p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start ">
                    <a 
                      href="/resume.pdf" 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FaEye className="h-2 w-4" />
                      View Resume
                    </a>
                    <a 
                      href="/resume.pdf" 
                      className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      download="Sugam_Panthi_Resume.pdf"
                    >
                      <FaDownload className="h-4 w-4" />
                      Download
                    </a>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-row items-center justify-center gap-3 mb-5 lg:flex-row lg:items-center lg:gap-4 lg:justify-normal">
                      <a 
                        href="mailto:Sugam.Panthi@usm.edu" 
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <FaEnvelope className="h-4 w-4" />
                        <span className="text-sm">Sugam.Panthi@usm.edu</span>
                      </a>
                      
                      <a 
                        href="https://www.linkedin.com/in/sugam-panthi"
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <FaLinkedin className="h-4 w-4" />
                        <span className="text-sm">sugam-panthi</span>
                      </a>
                      
                      <a 
                        href="https://www.github.com/vein05" 
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <FaGithub className="h-4 w-4" />
                        <span className="text-sm">vein05</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <img
                    className="rounded-full object-cover border-4 border-gray-100 shadow-lg lg:scale-150"
                    src="/images/headshot.jpeg"
                    alt="Sugam Panthi headshot"
                    style={{
                      width: "160px",
                      height: "160px",
                      objectPosition: "bottom"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <section id="experience">
            <Experience />
          </section>

          <section id="projects">
            <Projects />
          </section>

          <section id="honors">
            <Honors />
          </section>
          <div className="mt-3"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
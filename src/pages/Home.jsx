import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Stats from "../components/Stats"

function Home() {
  return (
    <>
    <div className="page flex justify-center">
      <div className="resume-container max-w-2xl ">
        {/* Introduction Section */}
        <div className="introduction flex flex-col justify-center items-center">
          <span className="text-lg lg:text-4xl font-bold">Sugam Panthi</span>
          <span className="italic text-xs lg:text-sm ">
            Software Developer | Research Assistant @ The University of Southern Mississippi
          </span>
        </div>

        {/* Middle Section */}
        <div className="middle mt-2 flex flex-row lg:flex-row justify-between">
          {/* About Me Section */}
          <div className="about lg:w-3/4">
            <div className="text-xs mt-6">
              <p>I'm Sugam Panthi, a Software Engineer based in Hattiesburg, Mississippi. I'm a self-taught backend developer with experience building applications using Go and Python.
              I also have experience working with Large Language Models and ML technologies in general.
              </p>
              <div className="text-xs mt-2">
                <span> I'm doing a </span>
                <span className="font-bold">Bachelor's in Computer Science </span>
                <span>at The University of Southern Mississippi Hattiesburg, Mississippi.</span>
              </div>      
            <div className="flex lg:justify-between mt-1 lg:w-1/2">
              <div className="flex">
                  <img src="/images/eye.png" className="h-4 w-4" alt="github" />
                  <p><a href="/resume.pdf" className="ml-1 text-md font-bold text-blue-600" target="_blank">View Resume</a></p>
              </div>
              <div className="flex">
                <img src="/images/download.png" className="h-4 w-4" alt="github"/>
                <p><a href="/resume.pdf" className="ml-1 text-md font-bold text-blue-600" download="Sugam_Panthi_Resume.pdf">Download Resume</a></p>
              </div>
            </div>
              <div className="mt-1 flex flex-col lg:flex-row space-x-1">
                <div className="flex items-center">
                  <img src="/images/mail.png" className="h-4 w-4 mr-1" alt="gmail" />
                  <a href="mailto:Sugam.Panthi@usm.edu" className="text-blue-600 underline">
                    Sugam.Panthi@usm.edu
                  </a>
                </div>
                <div className="flex items-center">
                  <img src="/images/linkedin.png" className="h-4 w-4 mr-1" alt="linkedin" />
                  <a
                    href="https://www.linkedin.com/in/sugam-panthi"
                    className="text-blue-600 underline"
                  >
                    sugam-panthi
                  </a>
                </div>
                <div className="flex items-center">
                  <img src="/images/github.png" className="h-4 w-4" alt="github" />
                  <a href="https://www.github.com/vein05" className="text-blue-600 underline">
                    vein05
                  </a>
                </div>

              </div>


            </div>
          </div>

          <div className="picture w-2/3 lg:w-1/4">
            <img className="rounded-full" src="/images/headshot.jpeg" alt="headshot"/>
          </div>
        </div>
        <Projects />
        <Experience />
        <Stats />
      </div>
    </div>
  </>
  );
}

export default Home;
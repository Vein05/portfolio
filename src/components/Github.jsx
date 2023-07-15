import Repo from "./Repo";
import ProjectInfo from "./ProjectInfo";
import {useState} from "react";
import {Button} from "@material-tailwind/react"

function Github() {
  const repos = ["Danime", "Quotient-Bot", "QPlayer", "Abode",  "Calculator" ];
  const [currentRepoIndex, setCurrentRepoIndex] = useState(0);

    return (
      <div id="Projects">
        <h1 className="bold text-center underline text-3xl">Projects I've worked on</h1>
        <div className="flex pl-10 pt-5 space-x-32 items-center justify-center">
          <ProjectInfo/>
          <div className="pt-5 flex flex-col justify-center items-center space-y-5">
            
            
            <div className="flex flex-row items-center justify-center space-x-5">
              
              <Button
                color="light-blue"
                disabled={currentRepoIndex === 0}
                onClick={() => {
                  setCurrentRepoIndex(currentRepoIndex - 1);
                }}
              >
                Previous
              </Button>
              <Repo repo={repos[currentRepoIndex]} />
              <Button
                color="light-blue"
                disabled={currentRepoIndex === repos.length - 1}
                onClick={() => {
                  setCurrentRepoIndex(currentRepoIndex + 1);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Github;
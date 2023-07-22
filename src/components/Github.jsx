import { useEffect, useState } from "react";
import { getRepositoryStats } from "./github";
import AbodeImage from "../images/abode.png";
import CalculatorImage from "../images/calc.jpg";
import DanimeImage from "../images/danime.png";
import QPlayerImage from "../images/qplayer.jpg";
import QuotientImage from "../images/quotient.png";
import RepoCard from "./RepoCard";

const repoImages = {
  Abode: AbodeImage,
  Calculator: CalculatorImage,
  Danime: DanimeImage,
  QPlayer: QPlayerImage,
  "Quotient-Bot": QuotientImage,
};

const repos = ["Danime", "Quotient-Bot", "QPlayer", "Abode", "Calculator"];

function Github() {
  const [repoStats, setRepoStats] = useState(null);
  const [currentRepoIndex, setCurrentRepoIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const stats = await getRepositoryStats(repos[currentRepoIndex]);
      setRepoStats(stats);
    }
    fetchData();
  }, [currentRepoIndex]);

  function handleNextRepo() {
    if (currentRepoIndex < repos.length - 1) {
      setCurrentRepoIndex(currentRepoIndex + 1);
    }
  }

  function handlePrevRepo() {
    if (currentRepoIndex > 0) {
      setCurrentRepoIndex(currentRepoIndex - 1);
    }
  }

  const repoImagePosition = currentRepoIndex % 2 === 0 ? "left" : "right";

  return (
    <div id="Projects" className="flex flex-col items-center space-y-5">
      <h1 className="text-3xl font-bold underline">Projects I've worked on</h1>
      {repoStats ? (
        <RepoCard stats={repoStats} image={repoImages[repoStats.repo]} imagePosition={repoImagePosition} />
      ) : (
        <p>Loading...</p>
      )}
      <div className="flex justify-between w-1/2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={currentRepoIndex === 0}
          onClick={handlePrevRepo}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={currentRepoIndex === repos.length - 1}
          onClick={handleNextRepo}
        >
          Next
        </button>
      </div>
    </div>
  );
}
export default Github;
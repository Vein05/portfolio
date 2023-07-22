import AvaIcon from "./AvaIcon";
import MyContribution from "./MyContribution";

import spicyInfoData from "../data/spicyData.json";

function spicyInfo(repo) {
  const repoInfo = spicyInfoData.find((data) => data.repo === repo);
  if (repoInfo) {
    return (
      <ul className="pl-5 list-disc">
        {repoInfo.info.map((info, index) => (
          <li key={index}>{info}</li>
        ))}
      </ul>
    );
  } else {
    return null;
  }
}


function RepoCard({ stats, image, imagePosition }) {
  const handleClick = () => {
    window.open(`https://github.com/${stats.fullName}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center space-y-5 pt-5">
      <div className={`flex flex-col ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} items-center space-y-2 md:items-start md:space-x-5 w-full md:w-3/4 lg:w-2/3`}>
        <div className="flex-shrink-0">
          <img src={image} className="rounded-full object-cover h-96 w-96 md:h-72 md:w-72" alt="" />
        </div>
        <div className="space-y-2 text-left ">
          <h2 className="text-xl text-center lg:text-2xl font-bold text-blue-500 capitalize">{stats.repo}</h2>
          <span className="text-sm lg:text-xl">Stars : {stats.totalStars}</span>          
          <p className="text-sm lg:text-xl">Description: {stats.description}</p>
          <p className="text-sm lg:text-xl inline-flex">
            My Role : <MyContribution repo={stats.repo} />
          </p>
          <p className="text-sm lg:text-xl">Spicy info : {spicyInfo(stats.repo)}</p>
        </div>
      </div>
      <div className="space-y-4 text-center md:text-left w-full md:w-3/4 lg:w-2/3">
        <div className="flex flex-wrap items-center justify-center space-x-2">
          <span className="text-sm md:text-base">Devs:</span>
          {stats.contributors.map((contributor, index) => (
            <AvaIcon key={index} name={contributor.name} link={contributor.avatarUrl} />
          ))}
        </div>
        <button
          className="block w-full py-2 font-bold text-blue-gray-900 bg-blue-gray-900/10 hover:bg-blue-gray-900/20 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
          onClick={handleClick}
        >
          Visit the Project
        </button>
      </div>
    </div>
  );
}

export default RepoCard;
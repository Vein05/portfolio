import Abode from "../images/abode.png";
import Calculator from "../images/calc.jpg";
import Danime from "../images/danime.png";
import QPlayer from "../images/qplayer.jpg";
import Quotient from "../images/quotient.png";

import AvaIcon from "./AvaIcon";
import MyContribution from "./MyContribution";

function RepoCard(props) {
  const { stats } = props;

  let image;
  switch (stats.repo) {
    case "Abode":
      image = Abode;
      break;
    case "Calculator":
      image = Calculator;
      break;
    case "Danime":
      image = Danime;
      break;
    case "QPlayer":
      image = QPlayer;
      break;
    case "Quotient-Bot":
      image = Quotient;
      break;
    default:
      break;
  }

  function handleClick() {
    window.open("https://github.com/" + stats.fullName, "_blank");
  }

  return (
    <div className="w-96 px-2 py-2 ">
      <div className="overflow-hidden">
        <div className="">
          <img src={image} alt="" className="w-full h-full rounded-full object-cover" />
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="capitalize font-bold text-2xl text-blue-500">{stats.repo}</h2>
            <p className="font-medium ">🌟 {stats.totalStars}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="inline-flex">My Role: &nbsp;<MyContribution repo={stats.repo} /> </p>
            <p className="inline-flex">Description:&nbsp;{stats.description}</p>
            </div>
        </div>
        <div className="p-4 pt-0">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap items-center justify-center space-x-2">
              <span>Devs: </span>
              {stats.contributors.map((contributor, index) => (
                <AvaIcon
                  key={index}
                  name={contributor.name}
                  link={contributor.avatarUrl}
                />
              ))}
            </div>
            <button
              className="text-center py-2 block w-full bg-blue-gray-900/10 text-blue-gray-900 hover:bg-blue-gray-900/20 font-bold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
              onClick={handleClick}
            >
              Visit on GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepoCard;
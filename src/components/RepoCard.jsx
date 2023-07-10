import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    CardFooter,
    Button,
} from "@material-tailwind/react";

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
        <div className="">
            <Card className="" style={{ width: "30rem"}}>
                <CardHeader shadow={false} floated={false} className="">
                    <img src={image} className="w-full h-full object-cover" />
                </CardHeader>
                <CardBody className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                        <Typography color="blue-gray" className="capitalize ">
                            {stats.repo}
                        </Typography>
                        <Typography color="blue-gray" className="font-medium">
                            🌟 {stats.totalStars} <br />
                        </Typography>
                    </div>
                    <div className="flex space-x-2">
                        <p className="font-normal opacity-75">My Contribution:</p>{" "}
                        <MyContribution repo={stats.repo} />
                    </div>
                    <Typography variant="small" className="font-normal opacity-75">
                        Description: {stats.description}
                    </Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <div>
                        <div className="flex flex-wrap items-center justify-center space-x-2">
                            <span>Contributors: </span>
                            {stats.contributors.map((contributor) => (
                                <AvaIcon key="1" name={contributor.name} link={contributor.avatarUrl} />
                            ))}
                        </div>
                        <Button
                            ripple={false}
                            fullWidth={true}
                            className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
                            onClick={handleClick}
                        >
                            Visit on GitHub
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default RepoCard;
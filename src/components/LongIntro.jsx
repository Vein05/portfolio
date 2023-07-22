import Image from "../images/image.jpg"
import Table from "./Table"

function LongIntro(){
    return (
        <div id="Qualifications">
            <div className="flex flex-col lg:flex lg:flex-row items-center space-x-3 pl-5">
                <img src={Image} alt="myPhoto" className= "h-48 lg:h-96 rounded-lg" />
                <span className="text-xl pl-2">
                    “Endowed with a passion for technology, I embark on a quest to unravel the enigmatic mysteries of the digital realm. 
                    Through relentless pursuit of knowledge and innovation, I push the limits of what's possible and explore uncharted territories,
                    eager to discover endless possibilities.”
                </span>

            </div>
            <div>
                <Table/>
            </div>
        </div>
    )

}


export default LongIntro
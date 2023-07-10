import Image from "../images/image.jpg"
import Table from "./Table"

function LongIntro(){
    return (
        <div>
            <div className="flex items-center space-x-3 overflow-hidden">
                <img src={Image} alt="image" height="300" width="300" className= "object-cover pl-5 transition duration-300 transform hover:scale-105 rounded-lg shadow-xl shadow-blue-gray-900/50" />

                <p className="pl-2  font-ClashGrotesk-Light">
                <div class="text-2xl text-gray-600 inline-flex">“</div>
                Endowed with a passion for technology, I embark on a quest to unravel the enigmatic mysteries of the digital realm. 
                Through relentless pursuit of knowledge and innovation, I push the limits of what's possible and explore uncharted territories,
                eager to discover endless possibilities.
                <div class="h-3 text-2xl inline-flex text-gray-600">”</div>
                </p>
                

            </div>
            <div>
                <Table/>
            </div>
        </div>
    )

}


export default LongIntro
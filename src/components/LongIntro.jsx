import Image from "../images/image.jpg"
import Table from "./Table"

function LongIntro(){
    return (
        <div id="Qualifications">
            <div className="flex flex-col lg:flex lg:flex-row items-center space-x-3 pl-5">
                <img src={Image} alt="myPhoto" className= "h-48 lg:h-96 rounded-lg" />
                <Table/>
            </div>
        </div>
    )

}


export default LongIntro
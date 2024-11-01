import Quote from "./Quote"
function Intro(){
    return(
        <div id="About"className="flex justify-center items-center flex-col space-y-10">
            <div className="flex justify-center items-center flex-col space-y-5">
                <span className="m-10"><Quote/></span>
                <div className="flex justify-center items-center flex-col space-y-10">
                    <h1 className=" text-8xl" >Hello, <br/>I'm <u className="text-blue-500"> Sugam </u>
                    </h1>
                    <span className="text-xl">I'm a <span className="font-custom text-blue-500">Student & Software Developer</span> from <a target="_blank"  rel="noreferrer" href="https://en.wikipedia.org/wiki/Nepal">Nepal 🇳🇵.</a></span>
                </div>
            </div>
        </div>
    )
}


export default Intro
import Quote from "./Quote"
function Intro(){
    return(
        <div id="About"className="flex justify-center items-center flex-col space-y-10">
            <div className="flex justify-center items-center flex-col space-y-5">
                <p className="m-10"><Quote/></p>
                <div className="flex justify-center items-center flex-col space-y-10">
                    <h1 className="font-custom text-8xl" >Hello, <br/>I'm <u className="text-blue-500"> Sugam </u>
                    </h1>
                    <p className="text-xl">I'm an 18 year old <span className="font-custom text-blue-500">Tech Aficionado </span> from <a target="_blank"  rel="noreferrer" href="https://en.wikipedia.org/wiki/Nepal">🇳🇵</a> who loves to code and develop new skills.</p>

                </div>
            </div>
        </div>
    )
}


export default Intro
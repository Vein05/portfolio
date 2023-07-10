import Quote from "./Quote"
function Intro(){
    return(
        <div className="flex justify-center items-center flex-col space-y-10">
            <div className="flex justify-center items-center flex-col space-y-5">
                <p className="m-10"><Quote/></p>
                <div className="flex justify-center items-center flex-col space-y-10">
                    <h1 className="font-custom text-6xl" >Hi, I'm <u> Sugam </u>
                    </h1>
                    <p>Also known as Vein. I'm 18 and from <a target="_blank" href="https://en.wikipedia.org/wiki/Nepal">🇳🇵</a></p>

                    <div className="pt-10 flex space-x-5 justify-center items-center">
                        <img
                        src="https://github-readme-stats.vercel.app/api?username=vein05&show_icons=true&theme=dracula&card=600&line_height=30&include_all_commits=true"
                        alt="Stats"/>
                        
                        <img
                        src="https://github-readme-stats.vercel.app/api/top-langs/?username=vein05"
                        alt="stats"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Intro
import Letter from "./Letter";
import React from 'react';

function smoothScroll(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: 'smooth',
    });
  }
}

function Main(){
    let heart = "https://media.discordapp.net/attachments/478172509037133824/1175296140678266970/IMG_20231009_135535.jpg?ex=656ab6d3&is=655841d3&hm=fd86357e805bd1afbae33fb7031ea57b8f1dd1a3133b596aa748a441eedffd34"
    let bears = "https://media.discordapp.net/attachments/478172509037133824/1175296141542309909/IMG_20231002_161836.jpg?ex=656ab6d4&is=655841d4&hm=616bba8242dadea9ea15e710154c4c91fddb54ea25c76e8db0d8c0007275a79c"
    let nisha1= "https://media.discordapp.net/attachments/478172509037133824/1175300007038046259/77.jpg?ex=656aba6d&is=6558456d&hm=1ab5a7be8b05b7c808f5517e232fdc852eea1c9a8c4230d270b0840a76f4a6a2"
    let nisha2= "https://media.discordapp.net/attachments/478172509037133824/1175300669893267557/19.jpg?ex=656abb0b&is=6558460b&hm=96a8faf6e59a6c6a1086731053d4c966e9053d9ddc89dd5194afc2f180b6b528"
    return (
        <div className="bg-red-200 ">
        <div>
            <div class="h-screen flex items-center flex-col gap-y-10 lg:gap-y-3 bg-red-200">
                <div className="lg:scale-50 m-3 p-3 flex flex-row space-x-2">
                    <img src={heart} alt="Heart" className="w-1/2 rounded-lg transform -rotate-6 hover:scale-110 transition duration-300" />
                    <img src={bears} alt="Bears" className="w-1/2 rounded-lg transform rotate-6 hover:scale-110 transition duration-300" />
                </div>

                <div class="flex flex-col items-center justify-center ">
                    <span class="text-3xl font-bold "> Happy 18th babeeee !</span>
                    <a href="#loveLetter"
                        onClick={() => smoothScroll('loveLetter')}>click here!
                    </a>
                </div>
                <div className="lg:scale-50 m-5 p-5 flex flex-row space-x-2">
                    <img src={nisha1} alt="nisha1" className="w-1/2 rounded-lg transform -rotate-6 hover:scale-110 transition duration-300" />
                    <img src={nisha2} alt="nisha2" className="w-1/2 rounded-lg transform rotate-6 hover:scale-110 transition duration-300" />
                </div>
            </div>
        </div>  
        <div id="loveLetter" class="h-screen">
            <div className="pt-2 m-2 font-bold text-black">
                This is a love letter to my girlfriend, Qin: my girl, my pearl, my whole wide world.
            </div>
            <Letter/>
        </div>
        </div>
    )

}




export default Main;
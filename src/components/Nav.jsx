import React from 'react';
import Logo from "../images/logo.jpg"
import Typewriter from 'typewriter-effect';
import GraphemeSplitter from "grapheme-splitter";

const stringSplitter = string => {
  const splitter = new GraphemeSplitter();
  return splitter.splitGraphemes(string);
};

function Nav(){
    return(
        <nav className='py-2 flex justify-center items-center lg:justify-between'>
            <div className='flex items-center justify-center lg:items-strech'>
                <div className='lg:flex space-x-1 hidden'>
                    {/* <img src={Logo} 
                    className='w-10 h-10 object-fit rounded-full lg:'
                    alt=""/> */}
                    <p className='text-xl lg:text-2xl lg:inline-flex'>I love 
                        <span className='pl-1'><Typewriter
                            options={{
                                strings: ['<u>OpenSource</u> 🌍','<u>Coding</u> 💻', '<u>Music</u> 🎸', ' <u>Reading</u> 📖', ' <u>Writing</u> 🖊'],
                                autoStart: true,
                                deleteSpeed: "natural",
                                pauseFor : 1200,
                                stringSplitter,
                                loop: true,
                                }
                            }
                        />
                        </span>
                    </p>

                </div>

            </div>
            <div className='py-2 lg:px-10'>
                    <ul className='text-xl lg:text-2xl flex space-x-2 flex-wrap'>
                        <li><a href="/home/#About" className='hover:text-shadow-md hover:text-blue-500 transition-colors duration-300 transform hover:scale-150'>About</a></li>
                        <li><a href="/home/#Contacts" className='hover:text-blue-500 transition-colors duration-300 transform hover:scale-150'>Contact</a></li>
                        <li><a href="/home/#Projects" className='hover:text-blue-500 transition-colors duration-300 transform hover:scale-150'>Projects</a></li>
                        <li><a href="/home/#Blog" className='hover:text-blue-500 transition-colors duration-300 transform hover:scale-150'>Blog</a></li>

                    </ul>
                </div>
        </nav>
    )
}

export default Nav
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
        <nav className='py-2 flex items-center'>
            <div className='flex justify-between items-center flex-wrap: nowrap '>
                <div className='flex space-x-1 flex-row'>
                    <img src={Logo} 
                    className='h-10 w-10 rounded-full hover:shadow-md transition duration-300 transform hover:scale-125'
                    alt=""/>
                    <p className='text-2xl inline-flex '>I love 
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

                <div className='py-2 px-10 flex justify-end fixed top-0 w-full' >
                    <ul className='flex space-x-2 text-2xl'>
                        <li><a href="/home/#About" className='hover:text-shadow-md hover:text-blue-500 transition-colors duration-300 transform hover:scale-150'>About</a></li>
                        <li><a href="/home/#Contacts" className='hover:text-blue-500 transition-colors duration-300 transform hover:scale-150'>Contact</a></li>
                        <li><a href="/home/#Projects" className='hover:text-blue-500 transition-colors duration-300 transform hover:scale-150'>Projects</a></li>
                        <li><a href="/home/#Blog" className='hover:text-blue-500 transition-colors duration-300 transform hover:scale-150'>Blog</a></li>

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav

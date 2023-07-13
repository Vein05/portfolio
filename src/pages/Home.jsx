import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Intro from "../components/Intro";
import LongIntro from "../components/LongIntro";
import Github from "../components/Github";
import Blog from "../components/Blog";
import Coding from "../components/Coding";
import Contact from "../components/Contact";


gsap.registerPlugin(ScrollTrigger);

function Home() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    gsap.fromTo(
      element.querySelector('.intro'), 
      { autoAlpha: 0, x: -200 }, 
      { 
        duration: 1.5,  
        autoAlpha: 1,  
        x: 0,
        ease: "power3.out" 
      });
      // gsap.fromTo(
      //   element.querySelector('.github'), 
      //   { autoAlpha: 0, x: 1200 }, 
      //   {
      //     duration: 1.5,  
      //     autoAlpha: 1,  
      //     x: 0, 
      //     ease: "power3.out",
      //     scrollTrigger: {
      //       trigger: '.github',
      //       start: 'top center',
      //       end: 'bottom center',
      //       scrub: true
      //     }})

    gsap.fromTo(
      element.querySelector('.coding'), 
      { autoAlpha: 0, x: -200 }, 
      {
        duration: 2,  
        autoAlpha: 1,  
        x: 0, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.coding',
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }})
   }, []);

    return(
        <div className="bg-main" ref={ref}>
            <div className=" p-2 flex space-x-8 flex-col min-h-screen">
            <Nav/>
            <div className="intro">
                <Intro/>
            </div>
            <div className=" py-4 mt-auto">
            <Footer/>
            </div>
        </div>

        <div className="coding p-2 flex flex-col min-h-screen">
            <Coding/>
            <div className=" py-4 mt-auto">
            <Footer/>
            </div>
        </div>

        <div className="longIntro pt-2 flex flex-col min-h-screen">
            <LongIntro/>
            <div className="pr-5 pl-5 mt-auto">
            <Footer/>
            </div>
        </div>

        <div className="github pt-2 flex flex-col min-h-screen space-y-5">
            <Github />
            <div className="pr-5 pl-5 mt-auto">
            <Footer/>
            </div>
        </div>

        <div className="blog pt-2 flex flex-col min-h-screen space-y-5">
            <Blog/>
            <div className="pr-5 pl-5 mt-auto">
            <Footer/>
         </div>

      </div>

      <div className="contact pt-2 flex flex-col min-h-screen space-y-5">
            <Contact/>
        </div>

    </div>

    )

}

export default Home

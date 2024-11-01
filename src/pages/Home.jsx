import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Intro from "../components/Intro";
import LongIntro from "../components/LongIntro";
import Github from "../components/Github";
// import Blog from "../components/Blog";
import Coding from "../components/Coding";
import Contact from "../components/Contact";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    gsap.fromTo(
      element.querySelector(".intro"),
      { autoAlpha: 0, x: -200 },
      {
        duration: 1.1,
        autoAlpha: 1,
        x: 0,
        ease: "power3.out",
      }
    );

    // gsap.fromTo(
    //   element.querySelector(".coding"),
    //   { autoAlpha: 0, x: -200 },
    //   {
    //     duration: 2,
    //     autoAlpha: 1,
    //     x: 0,
    //     ease: "power3.out",
    //     scrollTrigger: {
    //       trigger: ".coding",
    //       start: "top center",
    //       end: "bottom center",
    //       scrub: true,
    //     },
    //   }
    // );
  }, []);

    return (
      <div className="bg-main" ref={ref}>
        <div className="p-2 flex flex-col min-h-screen">
          <Nav />
          <div className="flex-1 space-y-5 pt-5">
            <div className="intro">
              <Intro />
              <Footer scrollTo=".coding" />
            </div>

            <div className="coding min">
              <Coding />
              {/* <Footer scrollTo=".longIntro" /> */}
            </div>

            <div className="longIntro">
              <LongIntro />
              <Footer scrollTo=".github" />
            </div>

            <div className="github">
              <Github />
              <Footer scrollTo=".blog" />
            </div>

            {/* <div className="blog">
              <Blog />
              <Footer scrollTo=".contact" />
            </div> */}

            <div className="contact">
              <Contact />
            </div>
          </div>
        </div>
      </div>
    );
  }


export default Home;

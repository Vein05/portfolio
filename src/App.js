import React from "react"
import Nav from "./components/Nav";
// import Quote from "./components/Quote";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import LongIntro from "./components/LongIntro";
import Github from "./components/Github";
import './App.css';

function App() {
  return (
    <div className="bg-main">
      <div className=" p-2 flex flex-col min-h-screen">
        <Nav/>
        
        <Intro/>
        <div className=" py-4 mt-auto">
          <Footer/>
        </div>
      </div>

      <div className="pt-2 flex flex-col min-h-screen">

        <LongIntro/>
        
        <div className="pr-5 pl-5 mt-auto">
          <Footer/>
        </div>
      </div>

      <div className="pt-2 flex flex-col min-h-screen space-y-5">
        <Github />
        <div className="pr-5 pl-5 mt-auto">
          <Footer/>
        </div>
      </div>

      <div className="pt-2 flex flex-col min-h-screen space-y-5">
        <div className="pr-5 pl-5 mt-auto">
          <Footer/>
        </div>
      </div>

    </div>



    
  )
}


export default App;

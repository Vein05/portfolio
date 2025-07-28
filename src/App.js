import React from "react"
import Home from "./pages/Home"
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PTE from "./pages/Blogs/10-best-tips-for-the-PTE-examination"
import NoPage from "./pages/NoPage"
import SAT from "./pages/Blogs/best-free-resources-for-the-digital-SAT"
import AcademicQualifications from "./pages/AcademicQualtifications"
function App() {

  return (
    <>
      <BrowserRouter> 
        <Routes>
          <Route index element= {<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/pages/academic-qualifications" element={<AcademicQualifications/>} />

          <Route path="*" element={<NoPage/>} />

          <Route path="/blogs/10-best-tips-for-the-PTE-examination" element={<PTE/>}  />
          <Route path="/blogs/best-free-resources-for-the-digital-SAT" element={<SAT />} />
        </Routes>

      </BrowserRouter>

    </>
    
  )
}


export default App;

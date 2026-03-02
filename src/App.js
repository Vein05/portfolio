import React from "react"
import Home from "./pages/Home"
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NoPage from "./pages/NoPage"
import AcademicQualifications from "./pages/AcademicQualtifications"
import BlogDirectory from "./pages/blog/BlogDirectory"
import BlogPost from "./pages/blog/BlogPost"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pages/academic-qualifications" element={<AcademicQualifications />} />
          <Route path="/blog" element={<BlogDirectory />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          <Route path="*" element={<NoPage />} />

        </Routes>

      </BrowserRouter>

    </>

  )
}


export default App;

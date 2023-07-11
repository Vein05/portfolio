import React from "react"
import Home from "./pages/Home"
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PTE from "./pages/Blogs/10-best-tips-for-the-PTE-examination"
import NoPage from "./pages/NoPage"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element= {<Home/>} />
          <Route path="/home" element={<Home/>} />

          <Route path="*" element={<NoPage/>} />

          <Route path="/blogs/10-best-tips-for-the-PTE-examination" element={<PTE/>}  />
        </Routes>

      </BrowserRouter>

    </>
    
  )
}


export default App;

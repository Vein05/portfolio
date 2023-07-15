import React, { useState, useEffect } from "react";
import Next from "../images/next.svg";
import Before from "../images/before.svg";
import DOMPurify from "dompurify";
import topicsData from "../data/topics.json";

function Table() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  const currentTopic = topicsData[currentTopicIndex];

  useEffect(() => {
    if (currentTopic.description) {
      currentTopic.description = DOMPurify.sanitize(currentTopic.description);
    }
  }, [currentTopic]);

  function handleNext() {
    setCurrentTopicIndex(Math.min(currentTopicIndex + 1, topicsData.length - 1));
  }
  
  function handleBack() {
    setCurrentTopicIndex(Math.max(currentTopicIndex - 1, 0));
  }

  return (
    <div id="Topic" className="">
      <div className="">
        <div className="flex items-center justify-center space-x-2 px-4 py-2">
          <a href="#Topic" onClick={(e) => { e.preventDefault(); handleBack(); }}>
            <img src={Before} alt="Before" className="h-10 w-10 duration-300 transform hover:scale-125" />
          </a>
          <p className="text-bold text-3xl text-blue-500 ">{currentTopic.topic}</p>
          <a href="#Topic" onClick={(e) => { e.preventDefault(); handleNext(); }}>
            <img src={Next} alt="Next" className="h-10 w-10 duration-300 transform hover:scale-125" />
          </a>
        </div>
      </div>
      <div className="flex items-center justify-center mt-5">
        <div className="p-6">
          {currentTopic.subTopic !== undefined && (
            <div className="text-2xl font-bold mb-4">
              {`${currentTopic.subTopic}`}
            </div>
          )}
          
          {currentTopic.description !== undefined && (
            <div className="text-xl" dangerouslySetInnerHTML={{ __html: currentTopic.description }}></div>
          )}

          {currentTopic.readMore && (
            <div className="mt-4 text-xl flex justify-center items-center">
              <a href={currentTopic.readMore} className="text-blue-500 hover:text-blue-700">Read More</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;
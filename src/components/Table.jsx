import React, { useState } from "react";
import Next from "../images/next.svg";
import Before from "../images/before.svg";
import { Card, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import topicsData from "../data/topics.json";

function Table() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentSubTopicIndex, setCurrentSubTopicIndex] = useState(0);

  const currentTopic = topicsData[currentTopicIndex];
  const subTopic = currentTopic.subTopic;

  function handleNext() {
    setCurrentTopicIndex(Math.min(currentTopicIndex + 1, topicsData.length - 1));
    setCurrentSubTopicIndex(0);
  }
  
  function handleBack() {
    setCurrentTopicIndex(Math.max(currentTopicIndex - 1, 0));
    setCurrentSubTopicIndex(0);
  }

  return (
    <div>
      <div className="font-bold flex items-center justify-center space-x-2">
        <a href="" onClick={(e) => { e.preventDefault(); handleBack(); }}>
          <img src={Before} alt="Before" className="h-8 w-7 duration-300 transform hover:scale-125" />
        </a>

        <p className="underline">{currentTopic.topic}</p>

        <a href="" onClick={(e) => { e.preventDefault(); handleNext(); }}>
          <img src={Next} alt="Next" className="h-8 w-7 duration-300 transform hover:scale-125" />
        </a>
      </div>

      <div className="flex items-center justify-center">
        <Card className="flex justify-center items-center mt-2">
          <CardBody>
            
            {currentTopic.subTopic && (
              <Typography variant="h5" className="mb-2">
               {`• ${currentTopic.subTopic}`}
              </Typography>)
            }
            <Typography dangerouslySetInnerHTML={{ __html: currentTopic.description }} />
          </CardBody>
          
          {currentTopic.readMore && (
            <CardFooter className="pt-0">
                <a href={currentTopic.readMore}>
                <Button color="indigo">Read More</Button>
                </a>
            </CardFooter>
            )}
            

        </Card>
      </div>
    </div>
  );
}

export default Table;
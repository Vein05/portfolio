import React, { useState } from 'react';
import CountdownClock from './CountdownClock'; 
import Birthday20th from "./Birthday20th";
import JanUpdate from "./JanUpdate";
import VirtualDate from "./VirtualDate";

const AfterLogin = () => {
  const [activeComponent, setActiveComponent] = useState(null); // State to track the active component

  const buttons = [
    { id: 'birthday20th', label: 'Birthday 20th' },
    { id: 'janUpdate', label: 'Jan Update' },
    { id: 'virtualDate', label: 'Virtual Date'}
  ];

  const handleButtonClick = (id) => {
    setActiveComponent((prev) => (prev === id ? null : id)); // Toggle the active component
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back!
        </h1>
        <img
          src="/images/cutebear.gif"
          alt="nicebeargif"
          className="mx-auto h-[250px] w-[200px] rounded-md shadow-md"
        />
        <div className="mt-6 text-center">
          <CountdownClock targetDate={new Date('2022-06-18')} />
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          {buttons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.id)}
              className={`px-6 py-2 rounded-lg transition duration-200 ${
                activeComponent === button.id
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
        <div className="mt-8">
          {/* Render the active component based on the state */}
          {activeComponent === 'birthday20th' && <Birthday20th />}
          {activeComponent === 'janUpdate' && <JanUpdate />}
          {activeComponent === 'virtualDate' && <VirtualDate />}
        </div>
      </div>
    </div>
  );
};


export default AfterLogin;
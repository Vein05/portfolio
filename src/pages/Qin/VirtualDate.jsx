import React from "react";
import itinerary from "./itinerary.json"; // Import the JSON file

const VirtualDate = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
      <h1 className="text-4xl font-bold text-pink-600 mb-8">Our Virtual Date Itinerary</h1>
      <div className="w-full max-w-2xl space-y-8">
        {itinerary.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Step Image Placeholder */}
            <div className="w-45 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <img
                src={step.image}
                alt="Step Placeholder"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Step Title */}
            <p className="text-lg font-semibold text-gray-700 mb-2">{step.value}</p>

            {/* Step Description */}
            <p className="text-sm text-gray-600 text-center mb-4">{step.description}</p>

            {index < itinerary.length - 1 && (
                <div className="flex items-center justify-center my-4">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                    </svg>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-pink-500 mx-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    >
                    <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                    />
                    </svg>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                    </svg>
                </div>
                )}
          </div>
        ))}
      </div>
      <p className="text-pink-600 font-semibold">
        Forever yours,<br />
        Your Dumplinggg 🥟
      </p>
    </div>
  );
};

export default VirtualDate;
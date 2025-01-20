import React, { useState } from "react";

const gifts = ["🍫", "👗", "💍", "🍔", "🍕", "🎁", "🍩", "🍰", "🥤", "🎀"];

const GiftBox = () => {
  const [currentGift, setCurrentGift] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
      setCurrentGift(randomGift);
      setIsAnimating(false);
    }, 500); // Animation duration
  };

  return (
    <div className="mt-5 flex flex-col items-center justify-center bg-pink-100">
      <div className="relative">
        <button
          onClick={handleClick}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-pink-600 transition-all duration-300 focus:outline-none"
        >
          🎁 Gift Box
        </button>
        <p className="text-sm text-gray-600 mt-2">Click for a gift</p>
      </div>

      {/* Gift Reveal Section */}
      {currentGift && (
        <div
          className={`mt-8 text-6xl transform transition-all duration-500 ${
            isAnimating ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          {currentGift}
        </div>
      )}
    </div>
  );
};

export default GiftBox;
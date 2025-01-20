import React, { useState, useEffect } from 'react';
import GiftBox from './Giftbox';
import './JanUpdate.css'; // Import the CSS file for animations

const JanUpdate = () => {
  const [emojis, setEmojis] = useState([]);
  const [showSurprise, setShowSurprise] = useState(false); // State to toggle the surprise

  // Function to generate random emojis
  const generateEmojis = () => {
    const emojiList = ['❤️', '🥰', '💖', '🌹', '💕', '😘', '✨', '🎉']; // List of emojis to rain
    const newEmojis = Array(30) // Number of emojis to render
      .fill()
      .map(() => ({
        id: Math.random().toString(36).substring(7), // Unique ID for each emoji
        emoji: emojiList[Math.floor(Math.random() * emojiList.length)], // Random emoji
        left: Math.random() * 100, // Random horizontal position
        animationDuration: `${Math.random() * 3 + 2}s`, // Random animation duration
      }));
    setEmojis(newEmojis);
  };

  // Generate emojis when the component mounts
  useEffect(() => {
    generateEmojis();
  }, []);

  // Function to handle the surprise button click
  const handleSurpriseClick = () => {
    setShowSurprise(true);
  };

  return (
    <div className="relative bg-pink-100 p-6 rounded-lg shadow-md text-gray-700 overflow-hidden">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">My Dearest Love,</h2>
      <p className="mb-4">
        As the new year begins, I find myself thinking of you more than ever. Every moment we’ve shared, every laugh,
        every smile, and even every tear has only made my love for you grow stronger. You are my sunshine on the darkest
        days, and my calm in the stormiest nights.
      </p>
      <p className="mb-4">
        I miss the way your eyes light up when you’re happy, the sound of your voice when you call my name, and the warmth
        of your embrace that makes everything feel right. Even though we’re apart, my heart is always with you, and I
        cherish every memory we’ve created together.
      </p>
      <p className="mb-4">
        This year, I promise to love you more deeply, support you more fully, and cherish you more than ever. No matter
        where life takes us, I’ll always be by your side, holding your hand and walking this journey with you.
      </p>
      <p className="text-pink-600 font-semibold">
        Forever yours,<br />
        Your Dumplinggg 🥟
      </p>

      {/* Emoji rain */}
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="emoji absolute text-2xl"
          style={{
            left: `${emoji.left}%`,
            animationDuration: emoji.animationDuration,
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      <GiftBox />

      {/* Surprise button */}
      {!showSurprise && (
        <div className="mt-6 text-center">
          <button
            onClick={handleSurpriseClick}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-200"
          >
            Click here for a surprise!
          </button>
        </div>
      )}

      {/* Surprise content */}
      {showSurprise && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold text-pink-600 mb-4">For You, My Love:</p>
          <div className="text-gray-700 italic">
            <p>तिम्रा टिलपिल टिलपिल आँखा देखि</p>
            <p>गाला हुँदै</p>
            <p>भुईं झरेका</p>
            <p>आँसु रोक्न</p>
            <p>म कुन तारा तोडू?</p>
            <p>के माग्छौ तिमी?</p>
            <p className="mt-4">म घामपछि आउँछु</p>
            <p>तारासंगै</p>
            <p>तिमीलाई मन पर्ने जून भएर।</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JanUpdate;
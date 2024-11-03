import React from "react";
import { FaDiscord, FaInstagram, FaFacebook, FaGithub, FaEnvelope } from "react-icons/fa";
import { gsap } from "gsap"; 

const Contact = () => {
  const onEnter = (event) => {
    gsap.to(event.target, { scale: 1.1 });
  };

  const onLeave = (event) => {
    gsap.to(event.target, { scale: 1 });
  };

  return (
    <div id="Contacts" className="flex flex-col items-center justify-center h-screen">
      <img
        src="/images/logo.jpg"
        alt=""
        className="w-72 h-72 object-top rounded-full mb-8 object-cover"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      />
      <h1 className="text-3xl font-bold mb-8">Talk to me on</h1>
      <div className="flex justify-center mb-8 border-b-4 border-blue-500 pb-4">
        <a
          href="https://discordapp.com/users/427436602403323905"
          target="_blank"
          rel="noreferrer"
          className="mx-3"
        >
          <FaDiscord
            className="text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out"
            size={32}
          />
        </a>
        <a
          href="https://www.instagram.com/itsmesugam05/"
          target="_blank"
          rel="noreferrer"
          className="mx-3"
        >
          <FaInstagram
            className="text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out"
            size={32}
          />
        </a>
        <a
          href="https://www.facebook.com/sugam.panthi.7"
          target="_blank"
          rel="noreferrer"
          className="mx-3"
        >
          <FaFacebook
            className="text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out"
            size={32}
          />
        </a>
        <a
          href="https://github.com/vein05"
          target="_blank"
          rel="noreferrer"
          className="mx-3"
        >
          <FaGithub
            className="text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out"
            size={32}
          />
        </a>
        <a
          href="mailto:sugampanthi05@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="mx-3"
        >
          <FaEnvelope
            className="text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out"
            size={32}
          />
        </a>
      </div>
    </div>
  );
};

export default Contact;
import React from "react";
import { FaDiscord, FaInstagram, FaFacebook, FaGithub, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      id="Contacts"
      className="flex flex-col items-center justify-center h-screen"
    >
      <h1 className="text-3xl font-bold mb-8">Talk to me on</h1>
      <img
        src="/images/logo.jpg"
        alt=""
        className="w-72 h-72 object-top rounded-full mb-8 object-cover"
      />
      <div className="flex justify-center mb-8">
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
          href="mailto:man359905@gmail.com"
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
    </motion.div>
  );
};

export default Contact;
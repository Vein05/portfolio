import React from "react";
import YouTube from "react-youtube";
import Nav from "../../components/Nav";

const SAT = () => {

  const opts = {
    height: "250",
    width:"470",
    playerVars: {
      autoplay: 0,
    },
  };

  const channels = [
    {
      name: "Tutorllini Test Prep",
      description: "If you struggle with math, Tutorllini Test Prep is the channel for you. They offer video solutions for all the official College Board SAT practice tests, as well as insightful skill explanations. They also have a great series on using DESMOS, a graphing calculator, to solve questions quickly. Tutorllini Test Prep is currently working on a full SAT Math course, so be sure to check out their playlists for more information.",
      videoId: "Kdz-LCbkH1U",
        image : "https://yt3.ggpht.com/TU76AKmPppIDOdhOjm3yqzhU5CaH4gX9iWaqGWpwH_XLZrMVCk_CwizqYrK_JO_jUWWlVU1LdTE=s88-c-k-c0x00ffffff-no-rj"
    },
    {
      name: "SCORE: Your College Counselor",
      description: "SCORE: Your College Counselor is an excellent resource for SAT Reading and Writing prep. They explain every topic and skill in a fun, engaging way, and provide free study resources and tips for exam day. Whether you need help with vocabulary, grammar rules, or reading comprehension strategies, SCORE has you covered. They also offer Math help and college admissions guidance.",
      videoId: "C4WunTuhhWw",
        image : "https://yt3.ggpht.com/ZbhcjP3ap1WlKXu3jTcD-d4OMhnaxKXyxJnHn0ovamixtqbJNSJ-eRV_1tBe8oO4JNMZAjlIDg=s88-c-k-c0x00ffffff-no-rj"
    },
    {
      name: "Seberson Method",
      description: "If you need concise English tips, the Seberson Method is a great channel to consider. She offers tips on grammar, vocabulary, and reading comprehension that are easy to understand. Her videos are a helpful resource for anyone looking to improve their English skills for the SAT exam or beyond.",
      videoId: "b0BPFV3P74Y",
      image: "https://yt3.ggpht.com/ytc/AOPolaSMOhC6sbsM-zdlyiijJCT0p0sIod2RuoqYyoJ9kA=s176-c-k-c0x00ffffff-no-rj-mo",
    },
    {
      name: "John-Jung SAT",
      description: "John-Jung SAT provides detailed explanations of SAT math concepts and strategies. With over 500 SAT math videos, this channel covers everything from basic arithmetic to advanced trigonometry and statistics. John-Jung breaks down test-taking approaches in an easy-to-understand way. Highly recommended for boosting your SAT math score.",      videoId: "PlEL31Uc_So",
      image: "https://yt3.ggpht.com/JOgKaQgamD4v3JvZeS8JtA1TJwcgw1IZBBo6gfLDB4izxgWLnrZQcQ4tywm06W0Hb0_MGag1dzY=s176-c-k-c0x00ffffff-no-rj",
    },
    {
      name: "Ritesh Verma",
      description: "Another great resource for SAT Math tutorials is Ritesh Verma. They offer comprehensive Math lessons, covering all topics tested on the SAT. The videos are easy to follow and provide clear explanations of the concepts.",
      videoId: "KAExIBs41O4",
      image: "https://yt3.googleusercontent.com/ytc/AOPolaSOoL448TTQqgPk5E8BioxiU9g5ItE4Li2ego3Alw=s176-c-k-c0x00ffffff-no-rj-mo",
    },
    {
      name: "Sol Lee",
      description: "Sol Lee is a great option for SAT Math and Science tips and tricks. With their videos, they offer strategies and examples that help you solve Math and Science questions on the SAT exam.",
      videoId: "GHF_I-imVwc",
      image: "https://yt3.googleusercontent.com/_HvBTodv4GEc_E2HBxWkAOkM4ATzpJppwM02MFHUSKLGEFJ3LMglyvcQeI4_UlYfJlcJDisS=s176-c-k-c0x00ffffff-no-rj",
    },
    {
      name: "Scalar Learning",
      description: "Scalar Learning is a channel focused on Math and test-taking strategies. They offer tips and tricks for solving Math problems quickly and efficiently. Additionally, Scalar Learning provides test-taking strategies to help you approach the SAT with confidence.",
      videoId: "l-m_cQ0PPqE",
      image: "https://yt3.googleusercontent.com/ytc/AOPolaR5KOOZEJSMnnfcLzbameeQ9FVBYZqGf2LHf4wTgA=s176-c-k-c0x00ffffff-no-rj-mo",
    },
  ];

  return (
    <>
      <Nav />

      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20">

        <h1 className="text-3xl font-bold text-blue-500 my-8">
          Top YouTube Channels for SAT Prep
        </h1>

        <p className="text-lg text-center mb-4">
          Here are some of the best YouTube channels to help you prepare for the SAT exam. These channels offer a range of resources, including practice questions, strategies, and tips to help you improve your scores.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
          {channels.map((channel, index) => (
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200" key={channel.name}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{`${index + 1}. ${channel.name}`}</h2>
                <a
                  href={`https://www.youtube.com/watch?v=${channel.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={channel.image} alt={`${channel.name} logo`} className="w-20 h-20 object-cover rounded-full" />
                </a>
              </div>
              <p className="text-gray-700 mb-4">{channel.description}</p>
              <div className="aspect-w-16 aspect-h-9">
                <YouTube videoId={channel.videoId} opts={opts} className="w-full h-full" />
              </div>
            </div>
          ))}

        </div>
        <div className="text-center my-8">
            <p className="text-lg">
                In addition to these YouTube channels, it's also important to do College Board's official practice tests through the Bluebook app. Remember to take breaks, stay hydrated, and get plenty of rest leading up to the exam. Good luck on your SAT journey!
            </p>
            </div>
      </div>
    </>
  );
};

export default SAT;
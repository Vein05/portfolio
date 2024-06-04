import { useEffect, useState } from 'react';
import moment from 'moment';

const AfterLogin = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showMessage, setShowMessage] = useState(false);

  const handleButtonClick = () => {
    setShowMessage(true);
  };

  const FIRSTDATE = new Date('2022-06-18');
  let timeSince = moment(FIRSTDATE).fromNow();

  return (
    <div className="bg-blue-100 flex flex-col items-center justify-center h-full">
      <h1>Welcome Dear, <u>I've missed you very much</u></h1>
      <img src="/images/cutebear.gif" alt="nicebeargif" className="mt-5 h-[250px] w-[200px] rounded-md" />
      <div className="flex-col space-y-2 font-sans mt-5 p-1 mr-4 text-xs border-2 border-black rounded-sm">
        <p>First of all, I'm very much happy to see you turn 20 🎊. <i>It just feels like yesterday when you were 18 huhu.</i></p>
        <p>It feels like just yesterday we were jumping cafes and having fun all around. I still miss you buying chocolates and goodies and the hug you gave me when you got happy. I miss this feeling every day and I can't help but cry sometimes when I realize I can't do it right now, but I believe I can give you the world once this is over.</p>
        <p>Even though we're miles apart, I still feel so connected to you. Every day, I think about you, and I can't wait for the day we can be together again.</p>
        <p>Time has flown by so quickly, and every moment with you has been a treasure. The past few months you have been very strong and inspiring; tackling all the hardships one after another, being away from your family and love, but still working hard to see the good days. I'm very very proud of you dear and even if I am not there with you, I always think about you and pray you are doing well.</p>
        <p>So, here's to you, my love. <span className="text-pink-300">Happy 20th birthday!</span> May this year be filled with love, joy, and endless opportunities. I can't wait to create more beautiful memories with you, celebrate many more birthdays together, and continue building our wonderful journey.</p>
        <p>Love always,<br />Dumplingg</p>
      </div>
      <div className="mt-5 text-sm">
        It has been {timeSince} since we have been together, and I hope to say this for the rest of my years too.
      </div>
      <button
        onClick={handleButtonClick}
        className="mt-10 bg-blue-300 text-white p-2 rounded-md"
      >
        Click for a surprise!
      </button>
      {showMessage && (
        <div className="m-2 mr-5 bg-yellow-100 p-2 rounded-md">
          <p className="text-sm font-sans">I love you more than words can express. Here’s to many more wonderful years together 🍷!</p>
        </div>
      )}
    </div>
  );
};

export default AfterLogin;
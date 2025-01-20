import { useEffect, useState } from 'react';

const Birthday20th = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showMessage, setShowMessage] = useState(false);

  const handleButtonClick = () => {
    setShowMessage(true);
  };

  let song = `**Shani**
                        [Intro]
                        La, La La La La Laaaa
                        La La, La La Lalala

                        **[Verse]**
                        Malai, man parxa timi
                        Timro tyo, sabai kura

                        Timi, aaeu kaha-bata?
                        Baseu yo man mah, Malai nashodi

                        Kina timi, risauxau vana
                        Bacha dinxu ma, dinxu yo mana

                        Samau, yhi hat mero
                        Bana mero, shadai varriiiiii laiiii (DDDU)

                        **[Chorous]**
                        Timro tyo sano keshle
                        Paryi halyo ni, malai behal
                        Herda herdai samay bitiskiyo
                        Timi sangai, tha na paii

                        Timro tyo nasilo aakha le
                        Pari halyo ni, malai behal
                        Garo hunxa, timi na huda
                        Parki rahanxu timro tiraa…

                        One more stanza here must include sani 

                        **[Verse 2]** 

                        Hera, buja kura mero
                        Kina tadpauxau, Esari malai

                        Mana, kura yo mero, 
                        khusi rakhxuu, Juni Juni vari laiii 

                        Makuka deuu, ferie aaudainaa
                        Ma jastaiiiii…… 

                        **[Chorous]**
                        Timro tyo sano keshle
                        Paryi halyo ni, malai behal
                        Herda herdai samay bitiskiyo
                        Timi sangai, tha na paii

                        Timro tyo nasilo aakha le
                        Pari halyo ni, malai behal
                        Garo hunxa, timi na huda
                        Parki rahanxu timro tiraa…

                        **[Outro]**
                        La, La La La La Laaaa
                        La La, La La Lalala
`;

  const formattedSong = song.split('\n').map((line, index) => (
    <span key={index}>
      {line.startsWith('**') ? <strong>{line.replace(/\*\*/g, '')}</strong> : line}
      <br />
    </span>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Dear, <u>I've missed you very much</u>
        </h1>
        <div className="mt-6 text-gray-700 space-y-4">
          <p>
            First of all, I'm very much happy to see you turn 20 🎊.{' '}
            <i>It just feels like yesterday when you were 18 huhu.</i>
          </p>
          <p>
            It feels like just yesterday we were jumping cafes and having fun all around. I still miss you buying
            chocolates and goodies and the hug you gave me when you got happy. I miss this feeling every day and I
            can't help but cry sometimes when I realize I can't do it right now, but I believe I can give you the
            world once this is over.
          </p>
          <p>
            I have added many goodies for you this time, and here is what everything signifies. I was ready to buy
            a lot of chocolates but the authorities won't allow it huhu.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Shampoo, Serum:</strong> So that your hair remains as silky smooth as ever and you remember me
              every time you bath (same with the 3 things I can't mention here) 🙈
            </li>
            <li>
              <strong>Light nail-polish:</strong> So that your fingers shine.
            </li>
            <li>
              <strong>Watch:</strong> So that you know that the more the hand turns the more I'm nearer to seeing you.
            </li>
            <li>
              <strong>Facewash, Lotion, Moisturizer, Powder:</strong> So my baby is everything and her skin remains soft.
            </li>
            <li>
              <strong>Hair Clips and Hair Tie:</strong> So my baby's hair doesn't come in front when the wind is blowing.
            </li>
            <li>
              <strong>Necklace, Tops, and Earrings:</strong> So mero kanxu ko neck kali na dekhios and ghumkas for when
              she goes to parties or traditional looks.
            </li>
            <li>
              <strong>Ring:</strong> So that she knows we are unofficially married already and it is going to happen. (I
              wanted to add a mangalsutra but I thought timi faint holau so garena haha)
            </li>
          </ul>
          <p>
            Even though we're miles apart, I still feel so connected to you. Every day, I think about you, and I
            can't wait for the day we can be together again.
          </p>
          <p>
            Time has flown by so quickly, and every moment with you has been a treasure. The past few months you have
            been very strong and inspiring; tackling all the hardships one after another, being away from your
            family and love, but still working hard to see the good days. I'm very very proud of you dear and even
            if I am not there with you, I always think about you and pray you are doing well.
          </p>
          <p>
            So, here's to you, my love. <span className="text-pink-500 font-semibold">Happy 20th birthday!</span> May
            this year be filled with love, joy, and endless opportunities. I can't wait to create more beautiful
            memories with you, celebrate many more birthdays together, and continue building our wonderful journey.
          </p>
          <p>
            Love always,<br />
            <span className="text-pink-600 font-semibold">Dumplinggg!</span>
          </p>
        </div>
        <button
          onClick={handleButtonClick}
          className="mt-8 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Click for a surprise!
        </button>
        {showMessage && (
          <div className="mt-6 bg-yellow-100 p-4 rounded-lg shadow-md transition-opacity duration-500 ease-in-out">
            <p className="text-gray-700 text-sm">
              I love you more than words can express. Here’s to many more wonderful years together 🍷
            </p>
            <div className="mt-4 text-gray-700 text-sm">
              <p>Here is a song for youu:</p>
              <div id="song-lyrics" className="mt-2 font-mono text-xs bg-white p-3 rounded-md shadow-inner">
                {formattedSong}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Birthday20th;
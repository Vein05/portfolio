import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CountdownClock = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const target = moment(targetDate);
      const duration = moment.duration(target.diff(now));

      setTimeLeft({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [targetDate]);

  return (
    <div className="text-center mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Time since we started talking</h2>
      <div className="flex justify-center space-x-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <span className="text-2xl font-bold text-blue-600">{timeLeft.days}</span>
          <span className="block text-sm text-gray-600">Days</span>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <span className="text-2xl font-bold text-blue-600">{timeLeft.hours}</span>
          <span className="block text-sm text-gray-600">Hours</span>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <span className="text-2xl font-bold text-blue-600">{timeLeft.minutes}</span>
          <span className="block text-sm text-gray-600">Minutes</span>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <span className="text-2xl font-bold text-blue-600">{timeLeft.seconds}</span>
          <span className="block text-sm text-gray-600">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownClock;
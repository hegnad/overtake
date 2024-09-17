"use client";

import { useState, useEffect, useRef } from "react"; // Make sure to import useRef
import { getNextRace } from "../utils/api/ergast";

export default function RaceCountdown() {
  const [raceData, setRaceData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timer = useRef(null); // Use useRef to persist the timer across renders

  useEffect(() => {
    async function fetchRace() {
      const race = await getNextRace();
      setRaceData(race);
      if (race && race.raceTimeDate) {
        calculateTimeLeft(race.raceTimeDate);
      }
    }

    fetchRace();

    // Cleanup the interval when component unmounts
    return () => clearInterval(timer.current); // Access timer using useRef
  }, []);

  // Function to calculate remaining time
  const calculateTimeLeft = (raceTimeDate) => {
    timer.current = setInterval(() => {
      const now = new Date();
      const difference = raceTimeDate - now;

      if (difference <= 0) {
        clearInterval(timer.current); // Clear the countdown once time runs out
        setTimeLeft(null); // Set to null if the race is due
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
  };

  return (
    <div>
      {raceData ? (
        <div>
          <h2>Countdown to {raceData.raceName}</h2>
          <p>
            Circuit: {raceData.circuitName} in {raceData.circuitLocation}
          </p>
          {timeLeft ? (
            <div>
              <p>
                {timeLeft.days} Days {timeLeft.hours} Hours {timeLeft.minutes}{" "}
                Minutes {timeLeft.seconds} Seconds
              </p>
            </div>
          ) : (
            <p>The race has started or the data is not available.</p>
          )}
        </div>
      ) : (
        <p>Loading race data...</p>
      )}
    </div>
  );
}

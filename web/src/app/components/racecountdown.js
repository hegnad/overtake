"use client";

import { useState, useEffect, useRef } from "react";
import { getNextRace } from "../utils/api/ergast";

export default function RaceCountdown() {
  const [raceData, setRaceData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    async function fetchRace() {
      const race = await getNextRace();
      setRaceData(race);
      if (race && race.raceTimeDate) {
        calculateTimeLeft(race.raceTimeDate);
      }
    }

    fetchRace();

    return () => clearInterval(timer.current);
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
        <div className="border-2 rounded-xl text-center m-2">
          <div className="m-2">
            <h2>{raceData.gpName} lights out in:</h2>
            <p>
              Circuit: {raceData.circuitName} at {raceData.circuitLocation}
            </p>
          </div>
          {timeLeft ? (
            <div className="grid grid-flow-col gap-1 text-center auto-cols-max justify-center">
              <div className="flex flex-col p-2 bg-slate-800 rounded-2xl text-neutral-content m-2 w-20">
                <span className="countdown font-mono text-5xl">
                  <span>{timeLeft.days}</span>
                </span>
                days
              </div>
              <div className="flex flex-col p-2 bg-slate-800 rounded-2xl text-neutral-content m-2 w-20">
                <span className="countdown font-mono text-5xl">
                  <span>{timeLeft.hours}</span>
                </span>
                hours
              </div>
              <div className="flex flex-col p-2 bg-slate-800 rounded-2xl text-neutral-content m-2 w-20">
                <span className="countdown font-mono text-5xl">
                  <span>{timeLeft.minutes}</span>
                </span>
                min
              </div>
              <div className="flex flex-col p-2 bg-slate-800 rounded-2xl text-neutral-content m-2 w-20">
                <span className="countdown font-mono text-5xl">
                  <span>{timeLeft.seconds}</span>
                </span>
                sec
              </div>
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

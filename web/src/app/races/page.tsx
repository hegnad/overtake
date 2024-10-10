"use client";

import SidebarLayout from "../ui/sidebar-layout";
import { getRaceResults, getSeasonRounds } from "../utils/api/ergast";
import styles from "../home.module.css";
import { useEffect, useState } from "react";

export default function Races() {
  const [raceResults, setRaceResults] = useState<any[]>([]);
  const [raceName, setRaceName] = useState<string>("");
  const [raceSeason, setRaceSeason] = useState<string>("");
  const [raceRound, setRaceRound] = useState<string>(""); // Change to string to directly store the round
  const [rounds, setRounds] = useState<string[]>([]);

  const seasons = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 2024 - i);

  useEffect(() => {
    const fetchRounds = async () => {
      if (raceSeason !== "") {
        const data = await getSeasonRounds(raceSeason);
        if (data) {
          setRounds(data);
        }
      }
    };

    fetchRounds();
  }, [raceSeason]);

  useEffect(() => {
    const fetchRaceResults = async () => {
      if (raceSeason && raceRound) {
        setRaceResults([]); // Reset results when changing the round
        const data = await getRaceResults(raceSeason, raceRound);
        if (data) {
          const raceResults = data?.raceResults || [];
          const raceName = data?.raceName || "";
          setRaceResults(raceResults);
          setRaceName(raceName);
        }
      }
    };

    fetchRaceResults();
  }, [raceRound, raceSeason]);

  return (
    <SidebarLayout>
      <div className={styles.driversResults}>
        <h1 className={styles.title}>Races: Historical Results</h1>
        <div>
          <h3>Select the season of the race you wish to check: </h3>
          <select
            className="text-black"
            value={raceSeason}
            onChange={(e) => {
              setRaceSeason(e.target.value);
              setRaceRound(""); // Reset round when season changes
            }}
          >
            <option value="" disabled>
              Select a season
            </option>
            {seasons.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {raceSeason == "" && rounds.length === 0 ? (
            <p></p>
          ) : raceSeason && rounds.length > 0 ? (
            <div>
              <h3>Select the round: </h3>
              {/* This function has been created using copilot AI
                Context prompt is active
                Propmt: "Set the select element to use a dafault initial option with no value */}

              <select
                className="text-black"
                value={raceRound} // Use the round directly
                onChange={(e) => setRaceRound(e.target.value)} // Set selected round directly
              >
                <option value="" disabled>
                  Select a round
                </option>
                {rounds.map((round, index) => (
                  <option key={index + 1} value={index + 1}>
                    {round}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>Loading Rounds...</p>
          )}
        </div>
        <div>
          {raceResults && raceResults.length > 0 ? (
            <h2>
              {raceName} Season {raceSeason} Round #{raceRound}
            </h2>
          ) : (
            <p></p>
          )}

          {raceSeason == "" || raceRound == "" ? (
            <p>Select a season and round to see the results.</p>
          ) : raceResults && raceResults.length === 0 ? (
            <p>Loading Results...</p>
          ) : (
            <table className="table-fixed border-separate border-spacing-1 border border-slate-500 border-spacing-2 p-5">
              <thead>
                <tr className="border border-slate-600">
                  <th className="border border-slate-700 w-16">Position</th>
                  <th className="border border-slate-700 w-24">Driver</th>
                  <th className="border border-slate-700 w-36">Constructor</th>
                  <th className="border border-slate-700 w-24">Points</th>
                </tr>
              </thead>
              <tbody>
                {raceResults?.map((result) => (
                  <tr key={result.position}>
                    <td className="border border-slate-700 px-2">
                      {result.position}
                    </td>
                    <td className="border border-slate-700 px-2">
                      {result.Driver.familyName}
                    </td>
                    <td className="border border-slate-700 px-2">
                      {result.Constructor.name}
                    </td>
                    <td className="border border-slate-700 text-right px-2">
                      {result.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

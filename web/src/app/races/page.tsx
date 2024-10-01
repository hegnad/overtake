"use client";

import SidebarLayout from "../ui/sidebar-layout";
import { getRaceResults } from "../utils/api/ergast";
import styles from "../home.module.css";
import { useEffect, useState } from "react";

export default function Races() {
  const [raceResults, setRaceResults] = useState<any[]>([]);
  const [raceName, setRaceName] = useState<string>("");
  const [raceSeason, setRaceSeason] = useState<string>("");
  const [raceRound, setRaceRound] = useState<string>("");

  useEffect(() => {
    const fetchRaceResults = async () => {
      if (raceSeason && raceRound) {
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
        <h1>Races</h1>
        <p>Information about races.</p>
        <div>
          <h3>Select the season of the race you wish to check: </h3>
          <select
            className="text-black"
            value={raceSeason}
            onChange={(e) => setRaceSeason(e.target.value)}
          >
            <option value="" disabled>
              Select a season
            </option>
            {[2020, 2021, 2022, 2023, 2024].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <h3>Select the round: </h3>
          <select
            className="text-black"
            value={raceRound}
            onChange={(e) => setRaceRound(e.target.value)}
          >
            <option value="" disabled>
              Select a round
            </option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </select>
        </div>
        <div>
          {raceResults && raceResults.length > 0 && (
            <h2>
              {raceName} Season {raceSeason} Round #{raceRound}
            </h2>
          )}
          <ul>
            {raceSeason == "" || raceRound == "" ? (
              <p>Select a season and round to see the results.</p>
            ) : raceResults && raceResults.length === 0 ? (
              <p>Loading Results...</p>
            ) : (
              raceResults?.map((result) => (
                <li key={result.position}>
                  <p>
                    <span>{result.position}</span> {result.Driver.familyName}{" "}
                    {result.Constructor.name} {result.points}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </SidebarLayout>
  );
}

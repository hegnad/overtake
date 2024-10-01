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

  const seasons = [2020, 2021, 2022, 2023, 2024];

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

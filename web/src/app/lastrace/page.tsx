"use client";

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./lastrace.module.css";
import Image from "next/image";
import { getDriverHeadshot } from "../utils/api/overtake";

export default function LastRace() {
  const [raceResults, setRaceResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [winnerImage, setWinnerImage] = useState(null);

  // Fetch race results when the component mounts
  useEffect(() => {
    const fetchRaceResults = async () => {
      try {
        const response = await fetch(
          "https://ergast.com/api/f1/current/last/results.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch race results");
        }
        const data = await response.json();
        setRaceResults(data.MRData.RaceTable.Races[0]); // Set the last race results
        const winnerDriverId = data.MRData.RaceTable.Races[0].Results[0].number;
        const winnerImageUrl = await getDriverHeadshot(winnerDriverId);
        setWinnerImage(winnerImageUrl);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRaceResults();
  }, []);

  if (loading)
    return (
      <SidebarLayout>
        <p>Loading...</p>
      </SidebarLayout>
    );
  if (error)
    return (
      <SidebarLayout>
        <p>Error: {error}</p>
      </SidebarLayout>
    );

  // Destructure the race data
  const { raceName, Circuit, date, Results } = raceResults ?? ({} as any);
  const { circuitName, Location } = Circuit || {};

  return (
    <SidebarLayout>
      <div className={styles.container}>
        <div>
          <h1>Last Race Results</h1>

          <div className={styles.header}>
            <div>
              <h2>{raceName}</h2>
              {/* Method available on Date objects that converts the date to a string using the local settings of the user's browser */}
              <p>Date: {new Date(date).toLocaleDateString()}</p>
              <p>Circuit: {circuitName}</p>
              <p>
                Location: {Location.locality}, {Location.country}
              </p>
            </div>
            <div className={styles.winnerbox}>
              <h1>Race Winner</h1>
              <Image
                src={winnerImage || "Loading..."}
                alt="Winner"
                width={200}
                height={200}
              />
            </div>
          </div>

          <h1>Race Results:</h1>
          <div className={styles.raceresults}>
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Driver</th>
                  <th>Constructor</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {Results.map(
                  (result: {
                    Driver: {
                      driverId: Key | null | undefined;
                      givenName: string;

                      familyName: string;
                    };
                    position: number | undefined;
                    Constructor: {
                      name: string | undefined;
                    };
                    Time: { time: any };
                    status: string;
                  }) => (
                    <tr key={result.Driver.driverId}>
                      <td>{result.position}</td>
                      <td>
                        {result.Driver.givenName} {result.Driver.familyName}
                      </td>
                      <td>{result.Constructor.name}</td>
                      <td>{result.Time?.time || result.status || "+1 Lap"}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

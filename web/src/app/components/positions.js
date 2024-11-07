"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./positions.module.css";
import {
  getDrivers,
  getIntervals,
  getLapNumber,
  getLatestSessionName,
} from "../utils/api/openF1";
import extractOldestRecords from "../utils/dataManipulation";
import { get } from "http";

export default function Positions() {
  const [postitions, setPositions] = useState([]);
  const [lapNumber, setLapNumber] = useState("Loading...");
  const sesssionName = useRef("Loading...");
  //useRef determined to be used in consultation with a friend, since useState caused conflicts and reRenders
  //only run on initial render, does not re render on change, stores info in between renders
  const drivers = useRef([]);
  const apiUrl = `https://api.openf1.org/v1/position?session_key=latest`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (drivers.current.length === 0) {
          drivers.current = await getDrivers();
        }
        let intervalData = await getIntervals();
        const response = await fetch(apiUrl);
        const data = await response.json();
        const latestPosData = extractOldestRecords(data);
        latestPosData.sort((a, b) => a.position - b.position);
        sesssionName.current = getLatestSessionName();

        latestPosData.forEach((pos) => {
          const driver = drivers.current.find(
            (driver) => driver.driver_number === pos.driver_number
          );
          pos.full_name = driver?.broadcast_name || "Unknown";
          pos.driverUrl = driver?.url || "";
          pos.team_name = driver?.team_name || "";
        });
        latestPosData.forEach((pos) => {
          const interval = intervalData.find(
            (interval) => interval.driver_number == pos.driver_number
          );
          pos.gap_to_leader = interval?.gap_to_leader || "";
          pos.interval = interval?.interval || "";
        });
        let lapNumber = await getLapNumber(latestPosData[0].driver_number);
        setLapNumber(lapNumber);
        setPositions(latestPosData);
      } catch (error) {
        console.error("Error fetching live data: ", error);
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 15000); // Fetch every 15 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className={styles.driversResults}>
      <h1>Live Pos</h1>
      {postitions.length === 0 && <p>Loading...</p>}
      <h2>Lap: {lapNumber}</h2>
      <h2>Session: {sesssionName.current}</h2>
      <div className={styles.raceresults}>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Number</th>
              <th>Driver Name</th>
              <th>Team Name</th>
              <th>Interval</th>
              <th>Gap to Leader</th>
              {/* <th>Time</th> */}
            </tr>
          </thead>
          <tbody>
            {postitions.map((item, index) => (
              <tr key={index}>
                <td>{item.position}</td>
                <td>
                  <a href={item.driverUrl}>{item.driver_number}</a>
                </td>
                <td>{item.full_name}</td>
                <td>{item.team_name}</td>
                <td>{item.interval}</td>
                <td>{item.gap_to_leader}</td>
                {/* <td>{item.date.toLocaleTimeString()}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

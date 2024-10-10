"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../home.module.css";
import { getDrivers, getIntervals, getLapNumber } from "../utils/api/openF1";
import extractOldestRecords from "../utils/dataManipulation";

export default function Positions() {
  const [postitions, setPositions] = useState([]);
  const [lapNumber, setLapNumber] = useState("Loading...");
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
      <h3>Lap: {lapNumber}</h3>
      <table className="table-fixed border-separate border-spacing-1 border border-slate-500 border-spacing-2 p-5">
        <thead>
          <tr className="border border-slate-600">
            <th className="border border-slate-700 w-16">Position</th>
            <th className="border border-slate-700 w-16">Number</th>
            <th className="border border-slate-700 w-40">Driver Name</th>
            <th className="border border-slate-700 w-36">Team Name</th>
            <th className="border border-slate-700 w-24">Interval</th>
            <th className="border border-slate-700 w-24">Gap to Leader</th>
            {/* <th>Time</th> */}
          </tr>
        </thead>
        <tbody>
          {postitions.map((item, index) => (
            <tr key={index}>
              <td className="border border-slate-700 px-2">{item.position}</td>
              <td className="border border-slate-700 px-2">
                <a href={item.driverUrl}>{item.driver_number}</a>
              </td>
              <td className="border border-slate-700 px-2">{item.full_name}</td>
              <td className="border border-slate-700 px-2">{item.team_name}</td>
              <td className="border border-slate-700 px-2 text-right">
                {item.interval}
              </td>
              <td className="border border-slate-700 px-2 text-right">
                {item.gap_to_leader}
              </td>
              {/* <td>{item.date.toLocaleTimeString()}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

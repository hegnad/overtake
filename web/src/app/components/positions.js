"use client";

import { useState, useEffect } from "react";
import styles from "../home.module.css";
import { getDrivers } from "../utils/api/openF1";
import extractOldestRecords from "../utils/dataManipulation";

export default function Positions() {
  const [postitions, setPositions] = useState([]);
  const apiUrl = `https://api.openf1.org/v1/position?session_key=latest`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const latestPosData = extractOldestRecords(data);
        latestPosData.sort((a, b) => a.position - b.position);
        const driverData = await getDrivers();
        latestPosData.forEach((pos) => {
          const driver = driverData.find(
            (driver) => driver.driver_number === pos.driver_number
          );
          pos.full_name = driver?.broadcast_name || "Unknown";
          pos.driverUrl = driver?.url || "";
          pos.team_name = driver?.team_name || "";
        });
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
      <ul>
        {postitions.map((item, index) => (
          <li key={index}>
            <p>
              {item.position} - {item.driver_number} - {item.full_name} -{" "}
              {item.team_name} - {item.date.toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

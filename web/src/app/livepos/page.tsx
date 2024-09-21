"use client";

import { useState, useEffect } from "react";
import styles from "../home.module.css";
import SidebarLayout from "../ui/sidebar-layout";

interface Positions {
  driver_number: number;
  position: number;
  date: Date;
}

export default function LivePos() {
  const [postitions, setPositions] = useState<Positions[]>([]);
  const apiUrl = `https://api.openf1.org/v1/position?session_key=9472`;

  function extractOldestRecords(data: any) {
    // Parse the date strings into Date objects
    const parsedData = data.map((item: any) => ({
      ...item,
      date: new Date(item.date),
    }));

    // Sort the data by date in descending order (latest first)
    parsedData.sort((a: any, b: any) => b.date - a.date);

    // Create a Map to store the oldest record for each driver
    const oldestRecords = new Map();

    // Iterate through the sorted data
    for (const record of parsedData) {
      const { driver_number } = record;

      // If we haven't seen this driver before, or if this record is older than the stored one
      if (
        !oldestRecords.has(driver_number) ||
        record.date > oldestRecords.get(driver_number).date
      ) {
        oldestRecords.set(driver_number, record);
      }
    }

    console.log(oldestRecords);

    // Convert the Map values to an array and return
    return Array.from(oldestRecords.values());
  }

  useEffect(() => {
    console.log(postitions);
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const latestPosData = extractOldestRecords(data);
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
    <SidebarLayout>
      <div className={styles.driversResults}>
        <h1>Live Pos</h1>
        {postitions.length === 0 && <p>Loading...</p>}
        <ul>
          {postitions
            .sort((a, b) => a.position - b.position)
            .map((item, index) => (
              <li key={index}>
                <p>
                  {item.driver_number} - {item.position} -{" "}
                  {item.date.toLocaleTimeString()}
                </p>
              </li>
            ))}
        </ul>
      </div>
    </SidebarLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "../home.module.css";

interface IntervalData {
  driver_number: number;
  gap_to_leader: string;
  interval: string;
  date: Date;
}

export default function LiveRace() {
  const [intervalData, setIntervalData] = useState<IntervalData[]>([]);
  const apiUrl = "https://api.openf1.org/v1/intervals?session_key=9472";

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
        record.date < oldestRecords.get(driver_number).date
      ) {
        oldestRecords.set(driver_number, record);
      }
    }

    // Convert the Map values to an array and return
    return Array.from(oldestRecords.values());
  }

  useEffect(() => {
    console.log(intervalData);
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const latestIntervalData = extractOldestRecords(data);
        setIntervalData(latestIntervalData);
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
        <div>
          <h2>Live Data</h2>
          {intervalData.length === 0 && <p>Loading...</p>}
          <ul>
            {intervalData.map((item, index) => (
              <li key={index}>
                Driver Number: {item.driver_number}, Gap to leader:{" "}
                {item.gap_to_leader}, Interval {item.interval}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SidebarLayout>
  );
}

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import SidebarLayout from "../ui/sidebar-layout";

export default function LastRace() {
  const [raceResults, setRaceResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch race results when the component mounts
  useEffect(() => {
    const fetchRaceResults = async () => {
      try {
        const response = await fetch("https://ergast.com/api/f1/current/last/results.json");
        if (!response.ok) {
          throw new Error("Failed to fetch race results");
        }
        const data = await response.json();
        setRaceResults(data.MRData.RaceTable.Races[0]); // Set the last race results
        setLoading(false);
      } catch (err) {
        // setError(err.message);
        // setLoading(false);
      }
    };

    fetchRaceResults();
  }, []);

  if (loading) return <SidebarLayout><p>Loading...</p></SidebarLayout>;
  if (error) return <SidebarLayout><p>Error: {error}</p></SidebarLayout>;

  // Destructure the race data
  const { raceName, Circuit, date, Results } = raceResults ?? {} as any;
  const { circuitName, Location } = Circuit || {};

  return (
    <SidebarLayout>
      <h1>Last Race Results</h1>
      <div>
        <h2>{raceName}</h2>
        <p>Date: {new Date(date).toLocaleDateString()}</p>
        <p>Circuit: {circuitName}</p>
        <p>Location: {Location.locality}, {Location.country}</p>

        <h3>Race Results:</h3>
        <ul>
          {Results.map((result: { Driver: { driverId: Key | null | undefined; givenName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; familyName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; position: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; Constructor: { name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; Time: { time: any; }; }) => (
            <li key={result.Driver.driverId}>
              <strong>{result.position}. {result.Driver.givenName} {result.Driver.familyName}</strong> ({result.Constructor.name}) - Time: {result.Time?.time || "N/A"}
            </li>
          ))}
        </ul>
      </div>
    </SidebarLayout>
  );
}
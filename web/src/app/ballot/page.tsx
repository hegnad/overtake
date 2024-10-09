"use client";

import { useState, useEffect, useContext, useRef } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./ballot.module.css";
import { IdentityContext } from "../lib/context/identity";
import { CombinedDriver } from "./apiDriver";
import Image from "next/image";
import defaultDriverImage from "../../../public/images/defaultdriverimg.png";
import { getNextRace } from "../utils/api/ergast";

export default function Top10GridPrediction() {
  const [selectedBox, setSelectedBox] = useState<number | null>(null); // Tracks selected box
  const [gridPredictions, setGridPredictions] = useState<(string | null)[]>(
    Array(10).fill(null)
  ); // Stores the top 10 driver predictions
  const [availableDrivers, setAvailableDrivers] = useState<CombinedDriver[]>(
    []
  ); // List of drivers
  const [actualResults, setActualResults] = useState<string[]>([]); // List of actual top 10 results
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitText, setSubmitText] = useState<string>("SUBMIT BALLOT");
  const [validTime, setValidTime] = useState<boolean>(true);

  const identity = useContext(IdentityContext);

  const nextRaceData = useRef<(string | Date)[]>([]);

  useEffect(() => {
    // Helper function to remove accents from names
    const removeAccents = (str: string) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Fetch drivers from the Ergast API
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "https://ergast.com/api/f1/current/last/drivers.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }
        const ergastData = await response.json();
        const ergastDrivers = ergastData.MRData.DriverTable.Drivers.map(
          (driver: { givenName: string; familyName: string }) => ({
            name: `${driver.givenName} ${driver.familyName}`, // Create the full name for the CombinedDriver
            firstName: driver.givenName,
            lastName: driver.familyName,
          })
        );

        const openF1Response = await fetch(
          "https://api.openf1.org/v1/drivers?session_key=latest"
        );
        if (!openF1Response.ok) {
          throw new Error("Failed to fetch driver image from openF1.");
        }
        const openF1data = await openF1Response.json();
        const openF1Drivers = openF1data.map(
          (driver: { full_name: string; headshot_url: string }) => ({
            fullName: driver.full_name,
            headshotUrl: driver.headshot_url,
          })
        );

        // Combine Ergast and OpenF1 data by matching driver names
        const combinedDrivers: CombinedDriver[] = ergastDrivers.map(
          (ergastDriver: { firstName: any; lastName: any }) => {
            const ergastFullName = `${ergastDriver.firstName} ${ergastDriver.lastName}`;
            const ergastFullNameNoAccents = removeAccents(
              ergastFullName.toLowerCase()
            );

            const matchingDriver = openF1Drivers.find(
              (openF1Driver: { fullName: string }) => {
                const openF1FullNameNoAccents = removeAccents(
                  openF1Driver.fullName.toLowerCase()
                );

                // Compare both regular and reversed name order
                const openF1FullNameReversed = openF1Driver.fullName
                  .split(" ")
                  .reverse()
                  .join(" ")
                  .toLowerCase();
                const openF1FullNameReversedNoAccents = removeAccents(
                  openF1FullNameReversed
                );

                return (
                  openF1FullNameNoAccents === ergastFullNameNoAccents ||
                  openF1FullNameReversedNoAccents === ergastFullNameNoAccents
                );
              }
            );

            return {
              name: ergastFullName, // Use Ergast full name
              headshotUrl: matchingDriver?.headshotUrl || defaultDriverImage, // Fallback to an empty string if no match
            };
          }
        );

        if (nextRaceData.current.length == 0) {
          const raceData = await getNextRace();
          nextRaceData.current = raceData
            ? [raceData.raceName, raceData.raceTimeDate]
            : [];
        }

        let deadline = new Date(nextRaceData.current[1]);
        const currentDate = new Date();
        //fake deadline for testing the disabling
        //const deadline = new Date(new Date(currentDate).getTime() - 15 * 60000);
        if (currentDate >= deadline) setValidTime(false);

        setAvailableDrivers(combinedDrivers);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    console.log("actualResults updated:", actualResults);
  }, [actualResults]);

  const handleBoxClick = (index: number) => {
    setSelectedBox(index); // Highlight the clicked box
  };

  const handleDriverClick = (driver: string) => {
    if (selectedBox !== null) {
      const updatedPredictions = [...gridPredictions];
      updatedPredictions[selectedBox] = driver;

      // Mark the driver as selected without removing it from the list
      setGridPredictions(updatedPredictions);
      setSelectedBox(null); // Reset the selected box after the driver is placed
    }
  };

  const isDriverSelected = (driver: string) => {
    return gridPredictions.includes(driver);
  };

  // Fetch race results (this function will be called after ballot submission)
  const fetchRaceResults = async () => {
    try {
      const raceResultsResponse = await fetch(
        "https://ergast.com/api/f1/current/last/results.json"
      );
      if (!raceResultsResponse.ok) {
        throw new Error("Failed to fetch race results");
      }
      const raceResultsData = await raceResultsResponse.json();
      const raceResults =
        raceResultsData.MRData.RaceTable.Races[0].Results.slice(0, 10).map(
          (result: { Driver: { givenName: string; familyName: string } }) =>
            `${result.Driver.givenName} ${result.Driver.familyName}`
        );

      setActualResults(raceResults);
      console.log("Race results fetched successfully: ", raceResults);
    } catch (fetchError) {
      console.error("Error fetching race results:", fetchError);
      setActualResults([]); // Fallback to an empty array in case of error
    }
  };

  const handleSubmit = async () => {
    if (gridPredictions.includes(null)) {
      setSubmitText("INVALID BALLOT, TRY AGAIN");
      return;
    }

    let deadline = new Date(nextRaceData.current[1]);

    const currentDate = new Date();
    //fake deadline for testing the disabling
    //const deadline = new Date(new Date(currentDate).getTime() - 15 * 60000);

    console.log(deadline);
    console.log(currentDate);
    if (currentDate >= deadline) {
      setSubmitText("DISABLED");
      return;
    }

    const requestBody = {
      DriverPredictions: gridPredictions,
    };

    try {
      const response = await fetch("http://localhost:8080/api/ballot/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${identity.sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error(`Failed to submit ballot: ${response.status}`);
        setSubmitText("SUBMISSION FAILED, TRY AGAIN");
        return;
      }

      console.log("Ballot submitted successfully.");
      setSubmitText("TRY AGAIN");

      // Fetch race results after successful ballot submission
      await fetchRaceResults();
    } catch (err) {
      console.error("Error submitting ballot:", err);
      setSubmitText("ERROR, TRY AGAIN");
    }
  };

  const getBoxColor = (
    predictedDriver: string | null,
    actualPosition: number
  ) => {
    const predictedPosition = gridPredictions.indexOf(predictedDriver);
    if (predictedPosition === actualPosition) return styles.correct;
    if (Math.abs(predictedPosition - actualPosition) === 1)
      return styles.nearMiss1;
    if (Math.abs(predictedPosition - actualPosition) === 2)
      return styles.nearMiss2;
    return "";
  };

  const handleTryAgain = () => {
    // Reset everything to the initial state
    setGridPredictions(Array(10).fill(null));
    setActualResults([]);
    setSubmitText("SUBMIT BALLOT");
    setSelectedBox(null);
  };

  // Get top three selected drivers
  const topThreeDrivers = gridPredictions.slice(0, 3);

  if (loading)
    return (
      <SidebarLayout>
        <p>Loading drivers...</p>
      </SidebarLayout>
    );
  if (error)
    return (
      <SidebarLayout>
        <p>Error: {error}</p>
      </SidebarLayout>
    );

  return (
    <SidebarLayout>
      <div>
        {/* Left side: Ballot */}
        {!validTime ? (
          <div className={styles.container}>
            {" "}
            <p>Unable to submit ballot</p>{" "}
          </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.ballot}>
              {/* Ballot Podium */}
              <div className={styles.topThreeImages}>
                {topThreeDrivers.map((driver, index) => {
                  const driverData = availableDrivers.find(
                    (d) => d.name === driver
                  );

                  if (!driverData) return null; // Skip if driver data is not available

                  return (
                    <div
                      key={index}
                      className={`${styles.driverImageContainer} ${
                        index === 0
                          ? styles.firstImage
                          : index === 1
                            ? styles.secondImage
                            : styles.thirdImage
                      }`}
                    >
                      <Image
                        src={driverData.headshotUrl}
                        alt={driverData.name}
                        width={100}
                        height={100}
                        className={styles.podiumImage}
                        unoptimized
                      />
                    </div>
                  );
                })}
              </div>
              <br />

              {/* Ballot List */}
              {gridPredictions.map((driver, index) => (
                <div
                  key={index}
                  className={`${styles.ballotBox} ${
                    selectedBox === index ? styles.selected : ""
                  } ${driver ? styles.filledBox : ""}`}
                  onClick={() => handleBoxClick(index)}
                >
                  {index + 1}. {driver || "_________________________________"}
                </div>
              ))}

              <button
                onClick={
                  submitText === "TRY AGAIN" ? handleTryAgain : handleSubmit
                }
                className={styles.submitButton}
              >
                {submitText}
              </button>
            </div>

            {/* Right side: Actual or predicted results */}

            <div className={styles.driverList}>
              <div className={styles.driverListContainer}>
                {actualResults.length === 0 ? (
                  <ul
                    className={styles.driverGrid}
                    style={{ listStyleType: "none", padding: 0 }}
                  >
                    {availableDrivers.map((driver, index) => (
                      <li
                        key={index}
                        className={
                          isDriverSelected(driver.name) ? styles.crossedOut : ""
                        }
                        onClick={() => handleDriverClick(driver.name)}
                      >
                        <div className={styles.driverNameAndImage}>
                          <Image
                            src={driver.headshotUrl}
                            alt={driver.name}
                            width={100}
                            height={100}
                            className={styles.driverImage}
                            unoptimized
                          />
                          {driver.name}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  actualResults.map((driver, index) => {
                    const actualPos = index;
                    const predictedPos = gridPredictions.indexOf(driver);

                    const posDifference = predictedPos - actualPos;

                    let positionChangeText = "";

                    if (predictedPos === -1) {
                      positionChangeText = ""; // Driver not in user's predictions
                    } else {
                      const posDifference = predictedPos - actualPos;
                      if (posDifference > 0) {
                        positionChangeText = ` (\u2191 ${posDifference})`; // Moved up
                      } else if (posDifference < 0) {
                        positionChangeText = ` (\u2193 ${Math.abs(
                          posDifference
                        )})`; // Moved down
                      }
                    }

                    const boxColor = getBoxColor(driver, index);

                    const driverData = availableDrivers.find(
                      (d) => d.name === driver
                    );
                    const driverImageUrl = driverData
                      ? driverData.headshotUrl
                      : "";

                    return (
                      <div
                        key={index}
                        className={`${styles.actualResultsBox} ${boxColor}`}
                      >
                        <div className={styles.driverNameAndImage}>
                          <Image
                            src={driverImageUrl}
                            alt={driver}
                            width={30}
                            height={30}
                            className={styles.driverImage}
                            unoptimized
                          />
                          {index + 1}. {driver} {positionChangeText}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}

"use client";

import { useState, useEffect, useContext, useRef } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./ballot.module.css";
import { IdentityContext } from "../lib/context/identity";
import { CombinedDriver } from './apiDriver';
import Image from "next/image";
import defaultDriverImage from '../../../public/images/defaultdriverimg.png';

export default function Top10GridPrediction() {
    const identity = useContext(IdentityContext);
    const [selectedBox, setSelectedBox] = useState<number | null>(null); // Tracks selected box
    const [gridPredictions, setGridPredictions] = useState<(string | null)[]>(Array(10).fill(null)); // Stores the top 10 driver predictions
    const [availableDrivers, setAvailableDrivers] = useState<CombinedDriver[]>([]); // List of drivers, this is fetched from API
    const [actualResults, setActualResults] = useState<string[]>([]); // List of actual top 10 results, this is fetched from API
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [submitText, setSubmitText] = useState<string>("SUBMIT BALLOT"); // Sets the state of our ballot button
    const [ballotScore, setBallotScore] = useState<number | null>(null); // Track the score of the ballot
    const [driverPoints, setDriverPoints] = useState<number[]>([]);
    const [leagues, setLeagues] = useState<RaceLeagueInfo[]>([]);
    const [selectedLeagueId, setSelectedLeagueId] = useState("");
    const [validTime, setValidTime] = useState<boolean>(true);
    const nextRaceData = useRef<(string | Date)[]>([]);

    interface RaceLeagueInfo {
        leagueId: number;
        ownerId: number;
        name: string;
        isPublic: boolean;
    }

    useEffect(() => {

        // ChatGPT prompt: How do I make a method to remove accents from a string.
        const removeAccents = (str: string) => {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        };

        // Fetch driver data from APIs.
        // References Dominic and Sebastian's code to fetch data from Ergast API:
        /*
         * try {

                // Fetches names from Ergast
                const response = await fetch("https://ergast.com/api/f1/current/last/drivers.json");
                if (!response.ok) {
                    throw new Error("Failed to fetch drivers");
                }
                const ergastData = await response.json();
        */
        const fetchDrivers = async () => {

            try {

                // Fetches names from Ergast
                const response = await fetch("https://ergast.com/api/f1/current/last/drivers.json");
                if (!response.ok) {
                    throw new Error("Failed to fetch drivers");
                }
                const ergastData = await response.json();

                // Fetches driver first and last name from Ergast

                // ChatGPT prompt: How do I only fetch the required properties, familyName and givenName, from my api into firstName and lastName.
                // result: const ergastDrivers = ergastData.MRData.DriverTable.Drivers.map((driver) => ({
                // I had to assign a type value to the properties within the API e.g. givenName: string;

                const ergastDrivers = ergastData.MRData.DriverTable.Drivers.map((driver: { givenName: string; familyName: string }) => ({
                        name: `${driver.givenName} ${driver.familyName}`, // Create the full name for the CombinedDriver
                        firstName: driver.givenName,
                        lastName: driver.familyName,
                    })
                );

                // Fetches driver photo and name from OpenF1
                const openF1Response = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
                if (!openF1Response.ok) {
                    throw new Error("Failed to fetch driver image from openF1.")
                }
                const openF1data = await openF1Response.json();
                const openF1Drivers = openF1data.map((driver: { full_name: string; headshot_url: string; }) => ({
                    fullName: driver.full_name,
                    headshotUrl: driver.headshot_url
                }));

                // Combine Ergast and OpenF1 data by matching driver names

                // ChatGPT prompt: How do I assign the driver photo from OpenF1 to its corresponding driver using the name data from Ergast.
                // ChatGPT result: I had to create an interface file, apiDriver.ts, to define the shape of the data we want to store from both APIs.

                const combinedDrivers: CombinedDriver[] = ergastDrivers.map((ergastDriver: { firstName: any; lastName: any; }) => {
                    const ergastFullName = `${ergastDriver.firstName} ${ergastDriver.lastName}`;
                    const ergastFullNameNoAccents = removeAccents(ergastFullName.toLowerCase());

                    const matchingDriver = openF1Drivers.find((openF1Driver: { fullName: string; }) => {
                        const openF1FullNameNoAccents = removeAccents(openF1Driver.fullName.toLowerCase());

                        // Compare both regular and reversed name order
                        const openF1FullNameReversed = openF1Driver.fullName.split(" ").reverse().join(" ").toLowerCase();
                        const openF1FullNameReversedNoAccents = removeAccents(openF1FullNameReversed);

                        return (
                            openF1FullNameNoAccents === ergastFullNameNoAccents ||
                            openF1FullNameReversedNoAccents === ergastFullNameNoAccents
                        );
                    });

                    return {
                        name: ergastFullName, // Use Ergast full name
                        headshotUrl: matchingDriver?.headshotUrl || defaultDriverImage, // Fallback to an empty string if no match
                    };
                });

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
        const fetchLeagues = async () => {
            const response = await fetch("http://localhost:8080/api/league/populate", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();

                setLeagues(data);
            } else {
                console.error(`non-successful status code: ${response.status}`)
            }
        };

        if (identity.sessionToken) {
            fetchLeagues();
        }
    }, [identity.sessionToken]);

    // Logs to console the contents of the actual race results whenever this component is mounted.
    useEffect(() => {
        if (gridPredictions.every(driver => driver !== null) && actualResults.length > 0) {
            const { totalScore, driverPoints } = calculateBallotScore(gridPredictions, actualResults);
            setBallotScore(totalScore);
            setDriverPoints(driverPoints);
        }
    }, [gridPredictions, actualResults]);


    // Event that triggers when a BALLOT box is selected.
    const handleBoxClick = (index: number) => {
        setSelectedBox(index);
    };

    // Event that triggers when a DRIVER box is selected.
    const handleDriverClick = (driver: string) => {
        if (selectedBox !== null) {
            // Googled how to create a copy of an array, which is how I found the Spread Syntax.
            const updatedPredictions = [...gridPredictions];
            updatedPredictions[selectedBox] = driver;

            // Mark the driver as selected without removing it from the list
            setGridPredictions(updatedPredictions);

            // Reset the selected box after the driver is placed
            setSelectedBox(null);
        }
    };

    // Checks if driver has already been selected by user, returns True if selected driver exists in the gridPredictions.
    const isDriverSelected = (driver: string) => {
        return gridPredictions.includes(driver);
    };

    // Fetch race results (this function will be called after ballot submission)
    // References Sebastian's code to fetch the most recent race results from Ergast API: app/lastrace/page.tsx
    const fetchRaceResults = async () => {

        try {
            const raceResultsResponse = await fetch("https://ergast.com/api/f1/current/last/results.json");
            if (!raceResultsResponse.ok) {
                throw new Error("Failed to fetch race results");
            }
            const raceResultsData = await raceResultsResponse.json();

            // Only retrieve the top 10 final positions.
            const raceResults = raceResultsData.MRData.RaceTable.Races[0].Results.slice(0, 10).map(
                (result: { Driver: { givenName: any; familyName: any; }; }) => `${result.Driver.givenName} ${result.Driver.familyName}`
            );

            console.log("Race results fetched successfully: ", raceResults);

            // Return the race results array for further processing
            setActualResults(raceResults);
            return raceResults;

        } catch (fetchError) {
            console.error("Error fetching race results:", fetchError);
            return []; // Return an empty array in case of error
        }

    };


    const calculateBallotScore = (predictions: (string | null)[], results: string[]) => {

        let totalScore = 0;

        // Array to store corresponding points for each driver
        const driverPoints = new Array(results.length).fill(0);

        predictions.forEach((predictedDriver, predictedPosition) => {

            if (!predictedDriver) return;

            const actualPosition = results.indexOf(predictedDriver);

            // Check for exact matches
            if (actualPosition === predictedPosition) {

                // 1st place bonus
                if (predictedPosition === 0) {
                    totalScore += 25; 
                    driverPoints[actualPosition] = 25;

                // 2nd place bonus
                } else if (predictedPosition === 1) {
                    totalScore += 20; 
                    driverPoints[actualPosition] = 20;

                // 3rd place bonus
                } else if (predictedPosition === 2) {
                    totalScore += 15; 
                    driverPoints[actualPosition] = 15;

                } else {
                    totalScore += 10;
                    driverPoints[actualPosition] = 10;
                }

            // Check for 1 pos off
            } else if (Math.abs(actualPosition - predictedPosition) === 1) {
                totalScore += 5;
                driverPoints[actualPosition] = 5;
            // Check for 2 pos off
            } else if (Math.abs(actualPosition - predictedPosition) === 2) {
                totalScore += 3;
                driverPoints[actualPosition] = 3;
            } else if (actualPosition === -1) {
                return;
            }

        });

        return { totalScore, driverPoints };

    }

    // Submits Ballot data to corresponding tables in our postgres server.
    const handleSubmit = async () => {
        // Ensure the ballot is completely filled
        if (gridPredictions.includes(null)) {
            setSubmitText("INVALID BALLOT, TRY AGAIN");
            return;
        }

        if (!selectedLeagueId) {
            setSubmitText("MUST SELECT A LEAGUE, TRY AGAIN");
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

        try {
            // Step 1: Fetch the actual race results before scoring
            const raceResults = await fetchRaceResults();

            // Step 2: Calculate the ballot score based on race results
            const { totalScore, driverPoints } = calculateBallotScore(gridPredictions, raceResults);  // Use raceResults instead of actualResults
            console.log(`Final Ballot Score inside handleSubmit: ${totalScore}`);
            setBallotScore(totalScore); // Updates the UI with the new score, if necessary

            // Step 3: Prepare the request body with the correct score and predictions
            const requestBody = {
                DriverPredictions: gridPredictions,
                totalScore: totalScore,
                leagueId: selectedLeagueId,
            };

            // Step 4: Submit the ballot to the backend
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
            setSubmitText("BALLOT SUBMITTED SUCCESSFULLY");

        } catch (err) {
            console.error("Error submitting ballot:", err);
            setSubmitText("ERROR, TRY AGAIN");
        }
    };


    // Colour-coordinates actual results depending on the user's predictions.
    const getBoxColor = (predictedDriver: string | null, actualPosition: number) => {
        const predictedPosition = gridPredictions.indexOf(predictedDriver);
        if (predictedPosition === actualPosition) return styles.correct;
        if (Math.abs(predictedPosition - actualPosition) === 1) return styles.nearMiss1;
        if (Math.abs(predictedPosition - actualPosition) === 2) return styles.nearMiss2;
        return "";
    };

    // Reset everything to the initial state
    const handleTryAgain = () => {
        setGridPredictions(Array(10).fill(null));
        setActualResults([]);
        setSubmitText("SUBMIT BALLOT");
        setSelectedBox(null);
        setBallotScore(null);
    };

    // Get top three selected drivers
    const topThreeDrivers = gridPredictions.slice(0, 3);

    if (loading) return <SidebarLayout><p>Loading drivers...</p></SidebarLayout>;
    if (error) return <SidebarLayout><p>Error: {error}</p></SidebarLayout>;

    return (
        <SidebarLayout>
            <div className={styles.container}>

                {/* Left side: Ballot */}

                <div className={styles.ballot}>

                    <div>

                        {!validTime ? (
                            <div className={styles.container}>
                                <p>Unable to submit ballot</p>
                            </div>
                        ) : (
                            <>
                                {/* League Selection Form */}
                                <form onSubmit={handleSubmit} className={styles.leagueList}>
                                    <h2>Select League</h2>
                                    <select
                                        id="leagueSelect"
                                        value={selectedLeagueId}
                                        onChange={(e) => setSelectedLeagueId(e.target.value)}
                                    >
                                        <option value="">-- Select League --</option>
                                        {leagues.map((league) => (
                                            <option key={league.leagueId} value={league.leagueId}>
                                                {league.name}
                                            </option>
                                        ))}
                                    </select>
                                </form>

                                {/* Ballot Podium */}
                                <div className={styles.topThreeImages}>
                                    {topThreeDrivers.map((driver, index) => {
                                        const driverData = availableDrivers.find((d) => d.name === driver);
                                        if (!driverData) return null; // Skip if driver data is not available

                                        return (
                                            <div
                                                key={index}
                                                className={`${styles.driverImageContainer} ${index === 0 ? styles.firstImage : index === 1 ? styles.secondImage : styles.thirdImage}`}
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
                                        className={`${styles.ballotBox} ${selectedBox === index ? styles.selected : ""} ${driver ? styles.filledBox : ""}`}
                                        onClick={() => handleBoxClick(index)}
                                    >
                                        {index + 1}. {driver || "_________________________________"}
                                    </div>
                                ))}

                                <button onClick={submitText === "TRY AGAIN" ? handleTryAgain : handleSubmit} className={styles.submitButton}>
                                    {submitText}
                                </button>

                                {/* Display Ballot Score */}
                                {ballotScore !== null && (
                                    <div className={styles.scoreDisplay}>
                                        <p>Your Ballot Score: {ballotScore} points</p>
                                    </div>
                                )}
                            </>
                        )}

                    </div>

                </div>

                {/* Right side: Actual or predicted results */}

                <div className={styles.driverList}>

                    <div className={styles.driverListContainer}>
                        {actualResults.length === 0 ? (
                            <ul className={styles.driverGrid} style={{ listStyleType: 'none', padding: 0 }}>
                                {availableDrivers.map((driver, index) => (
                                <li
                                    key={index}
                                    className={isDriverSelected(driver.name) ? styles.crossedOut : ""}
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
                                        positionChangeText = ` (\u2193 ${Math.abs(posDifference)})`; // Moved down
                                    }
                                }

                                const boxColor = getBoxColor(driver, index);

                                const driverData = availableDrivers.find(d => d.name === driver);
                                const driverImageUrl = driverData ? driverData.headshotUrl : "";

                                return (
                                    <div key={index} className={`${styles.actualResultsBox} ${boxColor}`}>
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
                                            <span className={styles.driverPoints}>
                                                {driverPoints[index] !== undefined ? `  +${driverPoints[index]}pts` : ""}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

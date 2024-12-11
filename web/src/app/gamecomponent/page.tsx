"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./gamecomponent.module.css";
import { getDrivers } from "../utils/api/ergast";
import SidebarLayout from "../ui/sidebar-layout";
import SimBallot from "../components/simballot";
import SimLeaderboard from "../components/simleaderboard";

interface Driver {
    driverId: string;
    givenName: string;
    familyName: string;
    fullName: string;
    imageUrl: string;
    progress: number;
    speed: number;
    position: number;
    finished: boolean;
    finishTime: number | null;
    team: string;
    speedBoost: number;
}

interface DriverPrediction {
    driverName: string;
    position: number;
}

interface BallotContent {
    ballotId: number;
    predictions: DriverPrediction[];
}

interface BallotScores {
    ballotId: number;
    ballotScore: number;
}

export default function GameComponent() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [raceStarted, setRaceStarted] = useState(false);
    const [raceFinished, setRaceFinished] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [raceResults, setRaceResults] = useState<Driver[]>([]);
    const [loadingDrivers, setLoadingDrivers] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [unscoredBallots, setUnscoredBallots] = useState<BallotContent[] | null>(null);

    const teamColors: { [key: string]: string } = {
        Mercedes: "#27F4D2",
        "Red Bull Racing": "#3671C6",
        Ferrari: "#E8002D",
        McLaren: "#FF8000",
        Alpine: "#FF87BC",
        RB: "#6692FF",
        "Aston Martin": "#229971",
        Williams: "#64C4FF",
        "Kick Sauber": "#52E252",
        Haas: "#B6BABD",
    };

    const driverTeams: { [key: string]: string } = {
        "hamilton": "Mercedes",
        "russell": "Mercedes",
        "max_verstappen": "Red Bull Racing", // Corrected
        "perez": "Red Bull Racing",
        "leclerc": "Ferrari",
        "sainz": "Ferrari",
        "norris": "McLaren",
        "piastri": "McLaren",
        "ocon": "Alpine",
        "gasly": "Alpine",
        "bottas": "Kick Sauber",
        "zhou": "Kick Sauber",
        "alonso": "Aston Martin",
        "stroll": "Aston Martin",
        "albon": "Williams",
        "sargeant": "Williams",
        "hulkenberg": "Haas",
        "kevin_magnussen": "Haas", // Corrected
        "tsunoda": "RB",
        "ricciardo": "RB",
        "doohan": "Alpine", // Added
        "colapinto": "Williams", // Added
        "lawson": "RB", // Added
    };

    const oddDrivers = drivers.filter((driver) => driver.position % 2 !== 0);
    const evenDrivers = drivers.filter((driver) => driver.position % 2 === 0);

    // Fetch drivers
    useEffect(() => {
        async function fetchDrivers() {
            try {
                const fetchedDrivers = await getDrivers();

                const formattedDrivers = fetchedDrivers.map((driver: any) => ({
                    ...driver,
                    fullName: `${driver.givenName} ${driver.familyName}`,
                    team: driverTeams[driver.driverId] || "Unknown", // Assign team based on driver ID
                    imageUrl: getDriverImagePath(driver.driverId),
                    progress: 0,
                    speed: 0,
                    position: 0,
                    finished: false,
                    finishTime: null,
                }));

                setDrivers(formattedDrivers);
            } catch (error) {
                setError("Failed to fetch drivers");
            } finally {
                setLoadingDrivers(false);
            }
        }

        fetchDrivers();
    }, []);

    // Helper function to get driver image path
    const getDriverImagePath = (driverId: string) => {
        return `/assets/driver_headshot/${driverId}.png`;
    };

    // Shuffle drivers for the starting grid
    const shuffleDrivers = () => {
        const shuffledDrivers: Driver[] = [...drivers]
            .sort(() => Math.random() - 0.5)
            .map((driver, index) => ({
                ...driver,
                progress: 0,
                speed: 0,
                position: index + 1,
                finished: false,
                finishTime: null,
                speedBoost: 1 - (index / 19), // Calculate speed boost (1st gets 1 km/h, 20th gets 0 km/h)
            }));
        setDrivers(shuffledDrivers);
        setRaceStarted(false);
        setRaceFinished(false);
        setRaceResults([]);
        setShowLeaderboard(false);
    };

    // Start race
    const startRace = () => {
        setRaceStarted(true);
    };

    // Update progress and check for race completion
    useEffect(() => {
        if (!raceStarted || raceFinished) return;

        const progressInterval = setInterval(() => {
            setDrivers((prevDrivers) =>
                prevDrivers.map((driver) => {
                    if (driver.finished) return driver;

                    const randomSpeed = Math.random() * (4 - 2.5) + 2.5; // Randomized speed (2.5 km/h to 4 km/h)
                    const newSpeed = randomSpeed + driver.speedBoost; // Add the speed boost
                    const newProgress = driver.progress + newSpeed;

                    if (newProgress >= 100) {
                        return {
                            ...driver,
                            progress: 100,
                            finished: true,
                            finishTime: Date.now(),
                        };
                    }

                    return { ...driver, progress: newProgress, speed: newSpeed };
                })
            );
        }, 1000);

        return () => clearInterval(progressInterval);
    }, [raceStarted, raceFinished]);

    const getUnscoredBallots = async () => {
        const response = await fetch("http://localhost:8080/api/sim/populateunscored", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            const data: BallotContent[] = await response.json();
            setUnscoredBallots(data);
        } else {
            console.error(`Non-successful status code: ${response.status}`);
        }
    };

    const scoreBallots = () => {
        if (!unscoredBallots || raceResults.length === 0) return;

        // Mapping full driver names to driver IDs
        const driverNameToId: { [key: string]: string } = {
            "Alexander Albon": "albon",
            "George Russell": "russell",
            "Lewis Hamilton": "hamilton",
            "Carlos Sainz": "sainz",
            "Kevin Magnussen": "kevin_magnussen",
            "Sergio Perez": "perez",
            "Guanyu Zhou": "zhou",
            "Max Verstappen": "max_verstappen",
            "Lance Stroll": "stroll",
            "Franco Colapinto": "colapinto",
            "Oscar Piastri": "piastri",
            "Logan Sargeant": "sargeant",
            "Valtteri Bottas": "bottas",
            "Charles Leclerc": "leclerc",
            "Lando Norris": "norris",
            "Esteban Ocon": "ocon",
            "Pierre Gasly": "gasly",
            "Yuki Tsunoda": "tsunoda",
            "Daniel Ricciardo": "ricciardo",
            "Liam Lawson": "lawson",
            "Fernando Alonso": "alonso",
            "Nico Hulkenberg": "hulkenberg",
            "Jack Doohan": "doohan",
        };

        unscoredBallots.forEach((ballot) => {
            // Normalize predictions by converting driverName to driverId
            const sortedPredictions = ballot.predictions
                .sort((a, b) => a.position - b.position) // Sort by position
                .map((prediction) => driverNameToId[prediction.driverName] || prediction.driverName.toLowerCase().trim());

            console.log("Normalized Predictions (sorted):", sortedPredictions);

            // Normalize race results to use driver IDs
            const normalizedResults = raceResults.map((driver) => driver.driverId);

            console.log("Normalized Race Results:", normalizedResults);

            // Calculate the total score for the ballot
            const { totalScore } = calculateBallotScore(sortedPredictions, normalizedResults);

            console.log(`Score for Ballot ${ballot.ballotId}:`, totalScore);

            // Send the calculated score to the backend
            fetch("http://localhost:8080/api/sim/updatescores", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ballotId: ballot.ballotId, score: totalScore }),
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.text().then((error) => {
                            console.error(`Failed to update score for Ballot ${ballot.ballotId}: ${error}`);
                        });
                    }
                    console.log(`Score successfully updated for Ballot ${ballot.ballotId}`);
                })
                .catch((err) => console.error(`Failed to update score: ${err.message}`));
        });
    };

    // Call `scoreBallots` after unscoredBallots is populated
    useEffect(() => {
        if (unscoredBallots && raceResults.length > 0) {
            scoreBallots();
        }
    }, [unscoredBallots, raceResults]);

    function calculateBallotScore(predictions: string[], results: string[]) {
        let totalScore = 0;

        predictions.forEach((predictedDriver, predictedPosition) => {
            const actualPosition = results.indexOf(predictedDriver);

            if (actualPosition === -1) return;

            // Points logic remains unchanged
            if (actualPosition === predictedPosition) {
                if (predictedPosition === 0) totalScore += 25;
                else if (predictedPosition === 1) totalScore += 20;
                else if (predictedPosition === 2) totalScore += 15;
                else totalScore += 10;
            } else if (Math.abs(actualPosition - predictedPosition) === 1) totalScore += 5;
            else if (Math.abs(actualPosition - predictedPosition) === 2) totalScore += 3;
        });

        return { totalScore };
    }

    const resetRace = () => {
        // Reset the race state to its initial values
        setDrivers([]);
        setRaceStarted(false);
        setRaceFinished(false);
        setRaceResults([]);
        setShowLeaderboard(true); // Show the leaderboard after resetting the race

        // Re-fetch drivers to reset the starting grid
        async function fetchDrivers() {
            try {
                const fetchedDrivers = await getDrivers();

                const formattedDrivers = fetchedDrivers.map((driver: any) => ({
                    ...driver,
                    fullName: `${driver.givenName} ${driver.familyName}`,
                    imageUrl: `/assets/driver_headshot/${driver.driverId}.png`,
                    progress: 0,
                    speed: 0,
                    position: 0,
                    finished: false,
                    finishTime: null,
                    speedBoost: 0,
                }));

                setDrivers(formattedDrivers);
            } catch (error) {
                setError("Failed to fetch drivers");
            }
        }

        fetchDrivers();
    };

    // Check if all drivers have finished
    useEffect(() => {
        if (drivers.every((driver) => driver.finished) && raceStarted) {
            const results = [...drivers].sort((a, b) => a.finishTime! - b.finishTime!);
            setRaceResults(results);
            setRaceFinished(true);
        }
    }, [drivers, raceStarted]);

    useEffect(() => {
        if (raceFinished) {
            getUnscoredBallots();
        }
    }, [raceFinished]);

    useEffect(() => {
        if (unscoredBallots && raceResults.length > 0) {
            scoreBallots();
        }
    }, [unscoredBallots, raceResults]);

    return (
        <SidebarLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>F1 Race Simulation</h1>
                    {!raceStarted && !raceFinished && (
                        <>
                            {!drivers.some((driver) => driver.position > 0) ? (
                                <button className={styles.button} onClick={shuffleDrivers}>
                                    Set the Starting Grid
                                </button>
                            ) : (
                                <button className={styles.button} onClick={startRace}>
                                    Start Race
                                </button>
                            )}
                        </>
                    )}
                </div>

                {showLeaderboard ? (
                    <SimLeaderboard />
                ) : (
                    <div className={styles.gridContainer}>
                        {!raceStarted && drivers.length > 0 && drivers.some((driver) => driver.position > 0) && (
                            <div className={styles.startingGrid}>
                                {/* Top row - Odd positions */}
                                <div className={styles.topRow}>
                                    {oddDrivers.map((driver) => (
                                        <div
                                            key={driver.driverId}
                                            className={`${styles.gridPosition}`}
                                            style={{ backgroundColor: teamColors[driver.team] || "#444444" }}
                                        >
                                            <span className={styles.positionNumber}>{driver.position}</span>
                                            <div className={styles.driver}>
                                                <Image
                                                    src={driver.imageUrl}
                                                    alt={driver.fullName}
                                                    className={styles.driverImage}
                                                    width={50}
                                                    height={50}
                                                    onError={(e) => (e.currentTarget.src = "/assets/driver_headshot/default.png")}
                                                />
                                                <p>
                                                    {driver.givenName[0]}. {driver.familyName}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom row - Even positions */}
                                <div className={styles.bottomRow}>
                                    {evenDrivers.map((driver) => (
                                        <div
                                            key={driver.driverId}
                                            className={`${styles.gridPosition}`}
                                            style={{ backgroundColor: teamColors[driver.team] || "#444444" }}
                                        >
                                            <span className={styles.positionNumber}>{driver.position}</span>
                                            <div className={styles.driver}>
                                                <Image
                                                    src={driver.imageUrl}
                                                    alt={driver.fullName}
                                                    className={styles.driverImage}
                                                    width={50}
                                                    height={50}
                                                    onError={(e) => (e.currentTarget.src = "/assets/driver_headshot/default.png")}
                                                />
                                                <p>
                                                    {driver.givenName[0]}. {driver.familyName}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {raceStarted && !raceFinished && (
                            <div className={styles.track}>
                                {drivers.map((driver) => (
                                    <div key={driver.driverId} className={styles.progressRow}>
                                        <p>
                                            {driver.givenName[0]}. {driver.familyName}
                                        </p>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progress}
                                                style={{
                                                    width: `${driver.progress}%`,
                                                    backgroundColor: teamColors[driver.team] || "#444444",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {raceFinished && (
                            <div className={styles.raceresults}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Position</th>
                                            <th>Driver</th>
                                            <th>Team</th>
                                            <th>Finish Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {raceResults.map((driver, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {driver.givenName[0]}. {driver.familyName}
                                                </td>
                                                <td>{driver.team}</td>
                                                <td>
                                                    {driver.finishTime
                                                        ? new Date(driver.finishTime).toLocaleTimeString()
                                                        : "Still racing"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button className={styles.button} onClick={resetRace}>
                                    View Leaderboard
                                </button>
                            </div>
                        )}

                        {!raceStarted && !raceFinished && drivers.length > 0 && drivers.some((driver) => driver.position > 0) && (
                            <div>
                                <SimBallot />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </SidebarLayout>

    );
}



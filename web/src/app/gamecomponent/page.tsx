"use client";

import { useState, useEffect } from "react";
import styles from "./gamecomponent.module.css";
import { getDrivers } from "../utils/api/ergast";
import Image from "next/image";

interface Driver {
    driverId: string;
    givenName: string;
    familyName: string;
    imageUrl: string;
    progress: number;
    speed: number;
    position: number;
    finished: boolean;
    finishTime: number | null;
}

export default function RaceSimulation() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [raceStarted, setRaceStarted] = useState(false);
    const [raceFinished, setRaceFinished] = useState(false);
    const [raceResults, setRaceResults] = useState<Driver[]>([]);
    const [loadingDrivers, setLoadingDrivers] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch drivers
    useEffect(() => {
        async function fetchDrivers() {
            try {
                const fetchedDrivers = await getDrivers();
                setDrivers(fetchedDrivers);
            } catch (error) {
                setError("Failed to fetch drivers");
            } finally {
                setLoadingDrivers(false);
            }
        }
        fetchDrivers();
    }, []);

    // Shuffle the driver order
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
            }));

        setDrivers(shuffledDrivers);
        setRaceStarted(false);
        setRaceFinished(false);
        setRaceResults([]);
    };


    // Start the race
    const startRace = () => {
        setRaceStarted(true);
    };

    // Progress simulation
    useEffect(() => {
        if (!raceStarted || raceFinished) return;

        const progressInterval = setInterval(() => {
            setDrivers((prevDrivers) =>
                prevDrivers
                    .map((driver) => {
                        if (driver.finished) return driver;

                        const newSpeed = Math.random() * (4 - 2.5) + 2.5; // Speed range: 2.5% to 4%
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
                    .sort((a, b) => b.progress - a.progress)
            );
        }, 1000);

        return () => clearInterval(progressInterval);
    }, [raceStarted, raceFinished]);

    // Check if all drivers have finished
    useEffect(() => {
        if (drivers.every((driver) => driver.finished) && raceStarted) {
            const results = [...drivers].sort((a, b) => {
                if (a.finishTime === null) return 1; // `a` goes after `b`
                if (b.finishTime === null) return -1; // `b` goes after `a`
                return a.finishTime - b.finishTime;
            });
            setRaceResults(results); // No error, as `raceResults` is typed correctly
            setRaceFinished(true);
        }
    }, [drivers, raceStarted]);

    // Reset the race
    const resetRace = () => {
        shuffleDrivers();
    };

    return (
        <div className={styles.container}>
            <h1>F1 Race Simulation</h1>

            {loadingDrivers ? (
                <p>Loading drivers...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {!raceStarted && !raceFinished && (
                        <button onClick={shuffleDrivers}>Set the Starting Grid</button>
                    )}

                    {!raceStarted && drivers.length > 0 && (
                        <>
                            <div className={styles.grid}>
                                {drivers.map((driver) => (
                                    <div key={driver.driverId} className={styles.driver}>
                                        <Image
                                            src={driver.imageUrl}
                                            alt={driver.givenName}
                                            width={50}
                                            height={50}
                                        />
                                        <p>
                                            {driver.givenName[0]}. {driver.familyName}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {drivers.length > 0 && (
                                <button onClick={startRace}>Start Race</button>
                            )}
                        </>
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
                                            style={{ width: `${driver.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {raceFinished && (
                        <>
                            <ol className={styles.results}>
                                {raceResults.map((driver) => (
                                    <li key={driver.driverId}>
                                        {driver.givenName[0]}. {driver.familyName} -{" "}
                                        {driver.finishTime
                                            ? `Finished at ${new Date(driver.finishTime).toLocaleTimeString()}`
                                            : "Still racing"}
                                    </li>
                                ))}
                            </ol>
                            <button onClick={resetRace}>Reset the Race</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}


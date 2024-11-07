"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPrevRace } from "../utils/api/ergast";
import styles from "./ballotactualresults.module.css";
import { Driver } from "../ballot/ballotDriverType";

interface BallotActualResultsProps {
    gridPredictions: (string | null)[];
    drivers: Driver[];
}

export default function BallotActualResults({ gridPredictions, drivers }: BallotActualResultsProps) {

    const [actualResults, setActualResults] = useState<string[]>([]);
    const [driverPoints, setDriverPoints] = useState<number[]>(Array(10).fill(0));

    useEffect(() => {
        const fetchResults = async () => {
            const results = await getPrevRace();
            setActualResults(results);
            calculateDriverPoints(results);
        };
        fetchResults();
    }, [gridPredictions]);

    // Helper function to find driver ID from full name
    const getDriverIdByName = (driverFullName: string) => {
        const driver = drivers.find(d => `${d.givenName} ${d.familyName}` === driverFullName);
        return driver ? driver.driverId : "default";
    };

    const calculateDriverPoints = (results: string[]) => {

        const points = results.map((driverName, actualPosition) => {

            const predictedPosition = gridPredictions.indexOf(driverName);

            if (predictedPosition === -1) return 0;

            if (predictedPosition === actualPosition) {
                if (actualPosition === 0) return 25; // 1st place
                if (actualPosition === 1) return 20; // 2nd place
                if (actualPosition === 2) return 15; // 3rd place
                return 10;
            }

            if (Math.abs(predictedPosition - actualPosition) === 1) return 5;  // +/- 1 pos
            if (Math.abs(predictedPosition - actualPosition) === 2) return 3;  // +/- 2 pos

            return 0;  // No points if not in ballot

        });

        setDriverPoints(points);

    };

    const getBoxClass = (driverName: string, actualPosition: number) => {

        const predictedPosition = gridPredictions.indexOf(driverName);

        if (predictedPosition === actualPosition) return styles.exactMatch;  // Exact match (green)
        if (Math.abs(predictedPosition - actualPosition) === 1) return styles.oneOffMatch;  // +/- 1 position (yellow)
        if (Math.abs(predictedPosition - actualPosition) === 2) return styles.twoOffMatch;  // +/- 2 positions (orange)
        if (predictedPosition !== -1) return styles.inBallotNoMatch // In ballot, no points scored ()
        return "";

    };

    return (

        <div className={styles.resultsGrid}>

            <h3>Race Results</h3>

            {actualResults.map((driverName, index) => {

                const driverId = getDriverIdByName(driverName);

                return (

                    <div key={index} className={`${styles.resultBox} ${getBoxClass(driverName, index)}`}>
                        <Image
                            src={`/assets/driver_headshot/${driverId}.png`}
                            alt={driverName}
                            width={60}
                            height={60}
                            className={styles.driverImage}
                            onError={(e) => e.currentTarget.src = '/assets/driver_headshot/default.png'}
                        />
                        <p className={styles.position}>{index + 1}.</p>
                        <p className={styles.driverName}>{driverName}</p>
                        <p className={styles.driverPoints}>(+{driverPoints[index]})</p>
                    </div>

                );

            })}

        </div>

    );
}

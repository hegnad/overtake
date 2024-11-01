"use client";

import styles from "./actualResultsList.module.css";
import Image from "next/image";

interface ActualResultsListProps {
    actualResults: string[];
    gridPredictions: (string | null)[];
    availableDrivers: { name: string; headshotUrl: string }[];
}

export default function ActualResultsList({ actualResults, gridPredictions, availableDrivers }: ActualResultsListProps) {
    const getBoxColor = (predictedDriver: string | null, actualPosition: number) => {
        const predictedPosition = gridPredictions.indexOf(predictedDriver);
        if (predictedPosition === actualPosition) return styles.correct;
        if (Math.abs(predictedPosition - actualPosition) === 1) return styles.nearMiss1;
        if (Math.abs(predictedPosition - actualPosition) === 2) return styles.nearMiss2;
        return "";
    };

    return (
        <div className={styles.actualResultsList}>
            {actualResults.map((driver, index) => {
                const driverData = availableDrivers.find((d) => d.name === driver);
                const driverImageUrl = driverData ? driverData.headshotUrl : "";
                const boxColor = getBoxColor(driver, index);

                return (
                    <div key={index} className={`${styles.actualResultsBox} ${boxColor}`}>
                        <div className={styles.driverNameAndImage}>
                            <Image src={driverImageUrl} alt={driver} width={30} height={30} className={styles.driverImage} unoptimized />
                            {index + 1}. {driver}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

"use client";

import styles from "./podiumDisplay.module.css";
import Image from "next/image";

interface PodiumDisplayProps {
    gridPredictions: (string | null)[];
    availableDrivers: { name: string; headshotUrl: string }[];
}

export default function PodiumDisplay({ gridPredictions, availableDrivers }: PodiumDisplayProps) {
    const topThreeDrivers = gridPredictions.slice(0, 3);

    return (
        <div className={styles.podiumDisplay}>
            {topThreeDrivers.map((driver, index) => {
                const driverData = availableDrivers.find((d) => d.name === driver);
                if (!driverData) return null;

                return (
                    <div key={index} className={`${styles.driverImageContainer} ${index === 0 ? styles.firstImage : index === 1 ? styles.secondImage : styles.thirdImage}`}>
                        <Image src={driverData.headshotUrl} alt={driverData.name} width={100} height={100} className={styles.podiumImage} unoptimized />
                    </div>
                );
            })}
        </div>
    );
}
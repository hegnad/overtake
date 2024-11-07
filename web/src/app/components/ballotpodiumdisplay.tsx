"use client";

import styles from "./ballotpodiumdisplay.module.css";
import Image from "next/image";
import { Driver } from "../ballot/ballotDriverType";

interface PodiumDisplayProps {
    drivers: Driver[];
    gridPredictions: (string | null)[];
}

export default function PodiumDisplay({ drivers, gridPredictions }: PodiumDisplayProps) {

    const topThreeDrivers = gridPredictions.slice(0, 3);

    const getFlagImagePath = (nationality: string) => {
        return `/assets/country_flags/${nationality.substring(0, 2).toLowerCase()}.svg`;
    };

    const getDriverImagePath = (driverId: string) => {
        return `/assets/driver_headshot/${driverId}.png`;
    };

    return (
        <div className={styles.podiumDisplay}>
            {[0, 1, 2].map((index) => {
                const driver = topThreeDrivers[index];
                const driverData = drivers.find((d) => `${d.givenName} ${d.familyName}` === driver);

                const podiumClass = index === 0 ? styles.firstPlace : index === 1 ? styles.secondPlace : styles.thirdPlace;
                const shortLastName = driverData ? driverData.familyName.slice(0, 3).toUpperCase() : "---";

                return (
                    <div key={index} className={`${styles.driverContainer} ${podiumClass}`} data-podium={index + 1}>
                        {driverData ? (
                            <>
                                <Image
                                    src={getDriverImagePath(driverData.driverId)}
                                    alt={`${driverData.givenName} ${driverData.familyName}`}
                                    width={150}
                                    height={150}
                                    className={styles.podiumImage}
                                />
                                <div className={styles.podiumLine}></div>
                                <div className={styles.podiumNameAndFlag}>
                                    <p>{shortLastName}</p>
                                    <Image
                                        src={getFlagImagePath(driverData.nationality)}
                                        alt={`${driverData.nationality} Flag`}
                                        width={40}
                                        height={40}
                                        className={styles.podiumFlag}
                                    />
                                </div>
                                <div className={styles.podiumLine}></div>
                            </>
                        ) : (
                            <>
                                <div className={styles.placeholderImage}>
                                    <Image
                                        src="/assets/driver_headshot/default.png"
                                        alt="Placeholder"
                                        width={100}
                                        height={100}
                                        className={`${styles.podiumImage} ${styles.placeholderImage}`}                                    />
                                </div>
                                <div className={styles.podiumLine}></div>
                                <div className={styles.podiumNameAndFlag}>
                                    <p>{shortLastName}</p>
                                    <div className={styles.placeholderFlag}></div>
                                    </div>
                                <div className={styles.podiumLine}></div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

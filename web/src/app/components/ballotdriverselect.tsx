"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import styles from "./ballotdriverselect.module.css";
import { Driver } from "../ballot/ballotDriverType";

interface BallotDriverSelectProps {
    drivers: Driver[];
    onDriverClick: (driverId: string) => void;
    gridPredictions: (string | null)[];
}

export default function BallotDriverSelect({ drivers, onDriverClick, gridPredictions }: BallotDriverSelectProps) {

    const isDriverSelected = (driverFullName: string) => {
        return gridPredictions.includes(driverFullName);
    };

    const getDriverImagePath = (driverId: string) => {
        return `/assets/driver_headshot/${driverId}.png`;
    };

    return (
        <div className={styles.driverGrid}>
            {drivers.map((driver) => {
                const isSelected = isDriverSelected(driver.fullName);

                return (
                    <div
                        key={driver.driverId}
                        className={`${styles.driverBox} ${isSelected ? styles.crossedOut : ""}`}
                        onClick={() => !isSelected && onDriverClick(driver.driverId)}
                        style={{ cursor: isSelected ? "not-allowed" : "pointer" }}
                    >
                        <Image
                            src={getDriverImagePath(driver.driverId)}
                            alt={driver.fullName}
                            className={styles.driverImage}
                            width={90}
                            height={90}
                            onError={(e) => e.currentTarget.src = '/assets/driver_headshot/default.png'}
                        />
                        <p>{driver.fullName}</p>
                    </div>
                );
            })}
        </div>
    );
}

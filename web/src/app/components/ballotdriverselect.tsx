"use client";

import { useEffect, useState } from "react";
import styles from "./ballotdriverselect.module.css";
import { Driver } from "../ballot/ballotDriverType";

interface BallotDriverSelectProps {
    drivers: Driver[];
    onDriverClick: (driverId: string) => void;
    gridPredictions: (string | null)[];
}

export default function BallotDriverSelect({ drivers, onDriverClick, gridPredictions }: BallotDriverSelectProps) {

    const isDriverSelected = (driverId: string) => {
        return gridPredictions.includes(driverId);
    };

    return (

        <div className={styles.driverGrid}>
            {drivers.map((driver) => (
                <div
                    key={driver.driverId}
                    className={`${styles.driverBox} ${isDriverSelected(driver.driverId) ? styles.crossedOut : ""}`}
                    onClick={() => !isDriverSelected(driver.driverId) && onDriverClick(driver.driverId)}
                >
                    <p>{driver.fullName}</p>
                </div>
            ))}
        </div>

    );
}

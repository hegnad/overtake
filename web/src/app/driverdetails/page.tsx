"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './driverdetails.module.css';
import SidebarLayout from "../ui/sidebar-layout";
import { getDriverImages } from '../utils/api/overtake';
import { OvertakeDriver } from '../formulalearn/formulaLearnTypes';

export default function DriverDetailsComponent() {

    const [error, setError] = useState<string | null>(null);

    const [driverData, setDriverData] = useState<OvertakeDriver | null>(null);

    useEffect(() => {

        const storedDriverNumber = sessionStorage.getItem("selectedDriverNumber");

        if (!storedDriverNumber) {
            setError("No driver selected.");
            return;
        }

        async function fetchData() {

            try {
                const data = await getDriverImages(Number(storedDriverNumber));
                if (data) {
                    setDriverData(data);
                } else {
                    setError("Driver data not found.");
                }
            } catch (error) {
                console.error("Error fetching driver data:", error);
                setError("Failed to load driver details.");
            }

        }

        fetchData();

    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!driverData) {
        return <p>No Driver Data</p>;
    }

    const headshotImagePath = driverData.headshotPath;
    const flagImagePath = driverData.flagImagePath;
    const defaultImgPath = `/assets/driver_headshot/default.png`;

    return (

        <SidebarLayout>

            <div className={styles.driverDetailsContainer}>

                <Image
                    src={headshotImagePath}
                    alt={defaultImgPath}
                    width={100}
                    height={100}
                    className={styles.headshot}
                />

                <h1>
                    {driverData.firstName} {driverData.lastName}
                </h1>

                <p>
                    Number: {driverData.driverNumber}
                </p>

                <p>
                    Country: {driverData.nationality}
                </p>

                <Image
                    src={flagImagePath}
                    alt={defaultImgPath}
                    width={50}
                    height={50}
                    className={styles.flag}
                />

            </div>
        
        </SidebarLayout>
        
    );

}
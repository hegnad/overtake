import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './driverCard.module.css';
import StyledLine from './styledline'
import { getDriverImages } from '../utils/api/overtake';
import { OvertakeDriver } from '../formulalearn/formulaLearnTypes';

interface DriverCardProps {
    givenName: string;
    familyName: string;
    permanentNumber: number;
    nationality: string;
}

export default function DriverCard({ givenName, familyName, permanentNumber, nationality }: DriverCardProps) {

    const [driverData, setDriverData] = useState<OvertakeDriver | null>(null);

    useEffect(() => {

        async function fetchData() {

            try {
                const data = await getDriverImages(permanentNumber);
                setDriverData(data);
            } catch (error) {
                console.error("Error fetching driver data:", error);
            }

        }

        fetchData();

    }, [permanentNumber]);

    if (!driverData) {
        return <p>No Driver Data</p>;
    }

    const driverImagePath = driverData.headshotPath;
    const flagImagePath = driverData.flagImagePath;

    const defaultImgPath = `/assets/driver_headshot/default.png`;

    return (

        <div className={styles.driverCard}>

            <div className={styles.driverNames}>
                <h3>{givenName}</h3>
                <h4>{familyName}</h4>
            </div>

            <div className={styles.driverImageContainer}>
                <Image
                    src={driverImagePath}
                    alt={defaultImgPath}
                    width={220}
                    height={220}
                    className={styles.driverImage}
                />
            </div>

            <StyledLine color='red' size='thin' />

            <div className={styles.driverNumAndFlag}>
                <div className={styles.numContainer}>
                    <h2>{permanentNumber}</h2>
                </div>
                <Image
                    src={flagImagePath}
                    alt={nationality}
                    width={40}
                    height={40}
                    className={styles.flag}
                />
            </div>

            <StyledLine color='red' size='thin' />

        </div>

    );
}
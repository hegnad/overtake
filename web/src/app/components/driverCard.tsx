import React from 'react';
import Image from 'next/image';
import styles from './driverCard.module.css';
import StyledLine from './styledline'

interface DriverCardProps {
    givenName: string;
    familyName: string;
    driverId: string;
    permanentNumber: string;
    nationality: string;
}

export default function DriverCard({ givenName, familyName, driverId, permanentNumber, nationality }: DriverCardProps) {
    
    const driverImagePath = `/assets/driver_headshot/${driverId}.png`;
    const flagImagePath = `/assets/country_flags/${nationality.substring(0, 2).toLowerCase()}.svg`;

    return (

        <div className={styles.driverCard}>

            <div className={styles.driverNames}>
                <h3>{givenName}</h3>
                <h4>{familyName}</h4>
            </div>

            <div className={styles.driverImageContainer}>
                <Image src={driverImagePath} alt={givenName} width={220} height={220} className={styles.driverImage} />
            </div>

            <StyledLine color='red' size='thin' />

            <div className={styles.driverNumAndFlag}>
                <div className={styles.numContainer}>
                    <h2>{permanentNumber}</h2>
                </div>
                <Image src={flagImagePath} alt={nationality} width={40} height={40} className={styles.flag} />
            </div>

            <StyledLine color='red' size='thin' />

        </div>

    );
}
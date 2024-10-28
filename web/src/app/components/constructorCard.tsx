import React from 'react';
import Image from "next/image";
import styles from "./constructorCard.module.css";

interface ConstructorCardProps {
    constructorId: string;
    name: string;
    nationality: string;
}

export default function ConstructorCard({ constructorId, name, nationality }: ConstructorCardProps) {

    const teamLogoPath = `/assets/teamlogos/${constructorId}_mini.png`;
    const carImagePath = `/assets/cars/${constructorId}.png`;

    return (
        <div className={styles.constructorCard}>
            <div className={styles.imagesContainer}>
                <div className={styles.teamLogoContainer}>
                    <Image
                        src={teamLogoPath}
                        alt={`${name} Team Logo`}
                        width={60}
                        height={60}
                        className={styles.teamLogo}
                    />
                </div>
                <div className={styles.carImageContainer}>
                    <Image
                        src={carImagePath}
                        alt={`${name} Car Image`}
                        width={300}
                        height={200}
                        className={styles.carImage}
                    />
                </div>
            </div>
        </div>
    );
}

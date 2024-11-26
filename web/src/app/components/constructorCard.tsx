import React, { useEffect, useState } from 'react';
import Image from "next/image";
import styles from "./constructorCard.module.css";
import { getTeamData } from '../utils/api/overtake';
import { OvertakeConstructor } from '../formulalearn/formulaLearnTypes';

interface ConstructorCardProps {
    constructorId: string;
    name: string;
    nationality: string;
}

export default function ConstructorCard({ constructorId, name, nationality }: ConstructorCardProps) {

    const [teamData, setTeamData] = useState<OvertakeConstructor | null>(null);

    useEffect(() => {

        async function fetchData() {

            try {
                const data = await getTeamData(constructorId);
                setTeamData(data);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }

        }

        fetchData();

    }, [constructorId]);

    if (!teamData) {
        return <p>No Team Data</p>;
    }

    const teamLogoPath = teamData.teamImagePath;
    const carImagePath = teamData.carImagePath;

    console.log("Image Paths: ", teamLogoPath, carImagePath);

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

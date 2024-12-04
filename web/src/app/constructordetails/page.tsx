"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './constructordetails.module.css';
import SidebarLayout from "../ui/sidebar-layout";
import { getTeamData } from '../utils/api/overtake';
import { OvertakeConstructor } from '../formulalearn/formulaLearnTypes';

export default function ConstructorDetailsComponent() {

    const [error, setError] = useState<string | null>(null);

    const [teamData, setTeamData] = useState<OvertakeConstructor | null>(null);

    useEffect(() => {

        const storedConstructorId = sessionStorage.getItem("selectedConstructorId");

        if (!storedConstructorId) {
            setError("No constructor selected.");
            return;
        }

        async function fetchData() {

            try {
                const data = await getTeamData(storedConstructorId);
                if (data) {
                    setTeamData(data);
                } else {
                    setError("Team data not found.");
                }
            } catch (error) {
                console.error("Error fetching team data:", error);
                setError("Failed to load team details.");
            }

        }

        fetchData();

    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!teamData) {
        return <p>No Team Data</p>;
    }

    const logoImagePath = teamData.teamImagePath;
    const flagImagePath = teamData.flagImagePath;
    const carImagePath = teamData.carImagePath;
    const defaultImgPath = `/assets/driver_headshot/default.png`;

    return (

        <SidebarLayout>

            <div className={styles.constructorDetailsContainer}>

                <Image
                    src={logoImagePath}
                    alt={defaultImgPath}
                    width={100}
                    height={100}
                    className={styles.teamLogo}
                />

                <Image
                    src={carImagePath}
                    alt={defaultImgPath}
                    width={100}
                    height={100}
                    className={styles.car}
                />

                <h1>
                    {teamData.fullName}
                </h1>

                <p>
                    Base: {teamData.base}
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
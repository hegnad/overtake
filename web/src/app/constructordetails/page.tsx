"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './constructordetails.module.css';
import SidebarLayout from "../ui/sidebar-layout";
import { getTeamData } from '../utils/api/overtake';
import { getCurrentDriversByConstructor, getConstructorStanding, getConstructorPoints, getWinsOfConstructor, getPodiumsOfConstructor, getConstructorSeasonResults } from '../utils/api/ergast';
import { getDriverImages } from '../utils/api/overtake';
import { OvertakeConstructor, OvertakeDriver } from '../formulalearn/formulaLearnTypes';
import StyledLine from "../components/styledline";
import { useRouter } from 'next/navigation';
import HamsterLoader from "../components/loaders/hamsterloader";

interface ConstructorFinalResult {
    season: string;
    position: string;
    points: string;
    wins: string;
    polePositions: string;
}

export default function ConstructorDetailsComponent() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sessionLoading, setSessionLoading] = useState<boolean>(true);

    const router = useRouter();

    const [storedConstructorId, setStoredConstructorId] = useState<string | null>(null);

    const [teamData, setTeamData] = useState<OvertakeConstructor | null>(null);

    const [driver1, setDriver1] = useState<OvertakeDriver | null>(null);
    const [driver2, setDriver2] = useState<OvertakeDriver | null>(null);

    const [constructorStanding, setConstructorStanding] = useState<number | null>(null);
    const [constructorPoints, setConstructorPoints] = useState<number | null>(null);
    const [constructorWins, setConstructorWins] = useState<number | null>(null);
    const [constructorPodiums, setConstructorPodiums] = useState<number | null>(null);
    const [constructorSeasonResults, setConstructorSeasonResults] = useState<ConstructorFinalResult[]>([]);


    useEffect(() => {
        if (typeof window !== "undefined") {
            const constructorId = sessionStorage.getItem("selectedConstructorId");
            if (constructorId) {
                setStoredConstructorId(constructorId);
            } else {
                setError("No constructor selected.");
            }
            setSessionLoading(false); // Mark session loading as complete
        }
    }, []);

    useEffect(() => {

        if (sessionLoading || !storedConstructorId) return;

        async function fetchAllData() {
            try {
                setLoading(true);

                // Execute all fetch calls in parallel
                const [
                    fetchedTeamData,
                    fetchedDrivers,
                    fetchedStanding,
                    fetchedPoints,
                    fetchedWins,
                    fetchedPodiums,
                    fetchedSeasonResults
                ] = await Promise.all([
                    getTeamData(storedConstructorId),
                    getCurrentDriversByConstructor(storedConstructorId),
                    getConstructorStanding(storedConstructorId),
                    getConstructorPoints(storedConstructorId),
                    getWinsOfConstructor(storedConstructorId),
                    getPodiumsOfConstructor(storedConstructorId),
                    getConstructorSeasonResults(storedConstructorId),
                ]);

                // Set team data
                if (fetchedTeamData) {
                    setTeamData(fetchedTeamData);
                } else {
                    setError("Team data not found.");
                }

                // Set driver data
                if (fetchedDrivers && fetchedDrivers.length >= 2) {
                    const driverNumbers = fetchedDrivers.map((driver: { permanentNumber: any; }) => driver.permanentNumber);

                    const [metadata1, metadata2] = await Promise.all([
                        getDriverImages(driverNumbers[0]),
                        getDriverImages(driverNumbers[1]),
                    ]);

                    setDriver1(metadata1);
                    setDriver2(metadata2);
                } else {
                    setError("Less than two drivers found for this constructor.");
                }

                // Set standings, points, wins, and podiums
                setConstructorStanding(fetchedStanding || null);
                setConstructorPoints(fetchedPoints || null);
                setConstructorWins(fetchedWins || null);
                setConstructorPodiums(fetchedPodiums || null);

                // Set season results
                setConstructorSeasonResults(fetchedSeasonResults || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load constructor details.");
            } finally {
                setLoading(false);
            }
        }

        fetchAllData();
    }, [storedConstructorId, sessionLoading]);

    if (loading) {
        return <SidebarLayout><HamsterLoader /></SidebarLayout>;
    }

    if (error) {
        return <SidebarLayout><p>{error}</p></SidebarLayout>;
    }

    if (!teamData) {
        return <SidebarLayout><p>Loading Team Data...</p></SidebarLayout >;
    }

    const handleReturnClick = () => {
        router.push('./formulalearn');
    };

    const LargeLogoImagePath = `/assets/teamlogos/${storedConstructorId}.png`;
    const defaultImgPath = '/assets/driver_headshot/default.png';

    const renderDriverCard = (driver: OvertakeDriver | null) => {
        if (!driver) {
            return <p>Loading Driver...</p>;
        }

        const driverImagePath = driver.headshotPath || defaultImgPath;
        const flagImagePath = driver.flagImagePath || defaultImgPath;

        return (
            <div className={styles.driverCard}>
                <div className={styles.driverNames}>
                    <h3>{driver.firstName}</h3>
                    <h4>{driver.lastName}</h4>
                </div>

                <div className={styles.driverImageContainer}>
                    <Image
                        src={driverImagePath}
                        alt={driver.lastName}
                        width={220}
                        height={220}
                        className={styles.driverImage}
                        draggable="false"
                    />
                </div>

                <StyledLine color="yellow" size="thick" />

                <div className={styles.driverNumAndFlag}>
                    <div className={styles.numContainer}>
                        <h2>{driver.driverNumber}</h2>
                    </div>
                    <Image
                        src={flagImagePath}
                        alt={driver.nationality}
                        width={40}
                        height={40}
                        className={styles.flag}
                        draggable="false"
                    />
                </div>

                <StyledLine color="yellow" size="thick" />

            </div>
        );
    };

    return (

        <SidebarLayout>

            <div className={styles.constructorDetailsContainer}>

                <button onClick={handleReturnClick} className={styles.returnButton}>
                    {'<'}
                </button>

                <div className={styles.constructorContainer}>

                    {/* TOP CONTAINER */}

                    <div className={styles.topContainer}>

                        <div className={styles.textContainer}>

                            <Image
                                src={LargeLogoImagePath}
                                alt={teamData.fullName}
                                width={100}
                                height={100}
                                className={styles.teamLogo}
                            />

                            <StyledLine color='yellow' size="overtaker" />

                            <div className={styles.constructorDetails}>

                                <h2>
                                    FULL TEAM NAME: {teamData.fullName}
                                </h2>
                                <h2>
                                    BASE: {teamData.base}
                                </h2>
                                <h2>
                                    TEAM CHIEF: {teamData.teamChief}
                                </h2>
                                <h2>
                                    TECHNICAL CHIEF: {teamData.technicalChief}
                                </h2>
                                <h2>
                                    CHASSIS: {teamData.chassis}
                                </h2>
                                <h2>
                                    POWER UNIT: {teamData.powerUnit}
                                </h2>
                                <h2>
                                    FIRST YEAR: {teamData.firstYear}
                                </h2>

                                <div className={styles.standingAndPointsContainer}>

                                    <h1>
                                        CONSTRUCTOR STANDING:
                                    </h1>

                                    <div className={styles.standing}>
                                        #{constructorStanding}
                                    </div>

                                    <div className={styles.standing}>
                                        {constructorPoints} pts
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* DRIVERS SECTION */}

                        <div className={styles.driverCardContainer}>
                            {renderDriverCard(driver1)}
                            {renderDriverCard(driver2)}
                        </div>

                    </div>

                    {/* BOTTOM CONTAINER */}

                    <div className={styles.constructorStatsContainer}>

                        <div className={styles.carContainer}>
                            <Image
                                src={teamData.carImagePath}
                                alt={teamData.fullName}
                                width={100}
                                height={100}
                                className={styles.car}
                            />
                        </div>

                        <div className={styles.resultsTableContainer}>

                            <table className={styles.resultsTable}>

                                <thead>
                                    <tr>
                                        <th>SEASON</th>
                                        <th>FINAL POS</th>
                                        <th>POLES</th>
                                        <th>WINS</th>
                                        <th>POINTS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {constructorSeasonResults.map((result) => (
                                        <tr key={result.season}>
                                            <td>{result.season}</td>
                                            <td>{result.position}</td>
                                            <td>{result.polePositions}</td>
                                            <td>{result.wins}</td>
                                            <td>{result.points}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
                
            </div>

        </SidebarLayout>

    );

}

"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './driverdetails.module.css';
import SidebarLayout from "../ui/sidebar-layout";
import { getDriverImages } from '../utils/api/overtake';
import { getWinsOfDriver, getPodiumsOfDriver, getDriverStanding, getDriverSeasonResults } from '../utils/api/ergast';
import { OvertakeDriver } from '../formulalearn/formulaLearnTypes';
import HamsterLoader from "../components/loaders/hamsterloader";

interface DriverFinalResult {
    season: string;
    position: string;
    points: string;
    wins: string;
    polePositions: string;
}

export default function DriverDetailsComponent() {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    const [driverData, setDriverData] = useState<OvertakeDriver | null>(null);
    const [driverWins, setDriverWins] = useState<number | null>(null);
    const [driverPodiums, setDriverPodiums] = useState<number | null>(null);
    const [driverStanding, setDriverStanding] = useState<number | null>(null);
    const [driverSeasonResults, setDriverSeasonResults] = useState<DriverFinalResult[]>([]);

    useEffect(() => {
        const storedDriverNumber = sessionStorage.getItem("selectedDriverNumber");
        const storedDriverId = sessionStorage.getItem("selectedDriverId");

        if (!storedDriverNumber || !storedDriverId) {
            setError("No driver selected.");
            setLoading(false);
            return;
        }

        async function fetchAllData() {
            try {
                setLoading(true);

                // Execute all fetch calls in parallel
                const [
                    fetchedDriverData,
                    fetchedWins,
                    fetchedPodiums,
                    fetchedStanding,
                    fetchedSeasonResults,
                ] = await Promise.all([
                    getDriverImages(Number(storedDriverNumber)),
                    getWinsOfDriver(storedDriverId),
                    getPodiumsOfDriver(storedDriverId),
                    getDriverStanding(storedDriverId),
                    getDriverSeasonResults(storedDriverId),
                ]);

                // Set driver data
                if (fetchedDriverData) {
                    setDriverData(fetchedDriverData);
                } else {
                    setError("Driver data not found.");
                }

                // Set wins, podiums, and standing
                setDriverWins(fetchedWins || 0);
                setDriverPodiums(fetchedPodiums || 0);
                setDriverStanding(fetchedStanding || null);

                // Set season results
                setDriverSeasonResults(fetchedSeasonResults || []);
            } catch (error) {
                console.error("Error fetching driver details:", error);
                setError("Failed to load driver details.");
            } finally {
                setLoading(false);
            }
        }

        fetchAllData();

    }, []);

    if (loading) {
        return (
            <SidebarLayout>
                <HamsterLoader />
            </SidebarLayout>
        );
    }

    if (error) {
        return <SidebarLayout><p>{error}</p></SidebarLayout>;
    }

    if (!driverData) {
        return <SidebarLayout><p>No Driver Data</p></SidebarLayout>;
    }

    const handleReturnClick = () => {
        router.push('./formulalearn');
    };

    const headshotImagePath = driverData.headshotPath;
    const flagImagePath = driverData.flagImagePath;
    const miniTeamLogoPath = driverData.teamImagePath;
    const defaultImgPath = '/assets/driver_headshot/default.png';

    return (

        <SidebarLayout>

            <div className={styles.driverDetailsContainer}>

                <button onClick={handleReturnClick} className={styles.returnButton}>
                    {'<'}
                </button>

                <div className={styles.driverDetails}>

                    {/* TOP CONTAINER */}

                    <div className={styles.topContainer}>

                        {/* Driver Details - Left Column */}

                        <div className={styles.driverTextContainer}>

                            <h1>
                                {driverData.firstName} {driverData.lastName}
                            </h1>

                            <div className={styles.numTeamFlagContainer}>

                                <div className={styles.numContainer}>
                                    <p>
                                        {driverData.driverNumber}
                                    </p>
                                </div>

                                <div className={styles.teamLogoContainer}>
                                    <Image
                                        src={miniTeamLogoPath}
                                        alt={defaultImgPath}
                                        width={50}
                                        height={50}
                                        className={styles.teamLogo}
                                    />
                                </div>

                                <div className={styles.flagContainer}>
                                    <Image
                                        src={flagImagePath}
                                        alt={defaultImgPath}
                                        width={50}
                                        height={50}
                                        className={styles.flag}
                                    />
                                </div>

                            </div>

                            <div className={styles.ageAndNationalityContainer}>

                                <div className={styles.ageContainer}>
                                    <p>
                                        AGE: {driverData.age}
                                    </p>
                                </div>

                                <div className={styles.nationalityContainer}>
                                    <p>
                                        COUNTRY: {driverData.nationality}
                                    </p>
                                </div>

                            </div>

                            <div className={styles.raceFinishContainer}>

                                <div className={styles.raceWinsContainer}>
                                    <p>
                                        {driverWins !== null
                                            ? `${driverWins} RACE WIN${driverWins === 1 ? "" : "S"}`
                                            : "Loading..."}
                                    </p>
                                </div>

                                <div className={styles.raceWinsContainer}>
                                    <p>
                                        {driverPodiums !== null
                                            ? `${driverPodiums} PODIUM${driverPodiums === 1 ? "" : "S"}`
                                            : "Loading..."}
                                    </p>
                                </div>

                            </div>

                            <div className={styles.driverStandingContainer}>
                                <p>
                                    DRIVER STANDING:
                                </p>

                                <div className={styles.driverStanding}>
                                    {driverStanding !== null ? driverStanding : "Loading..."}
                                </div>
                            </div>

                        </div>

                        {/* Driver Details - Right Column */}

                        <div className={styles.driverHeadshotContainer}>

                            <Image
                                src={headshotImagePath}
                                alt={defaultImgPath}
                                width={100}
                                height={100}
                                className={styles.headshot}
                            />

                        </div>

                    </div>

                    {/* BOTTOM CONTAINER */}

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
                                {driverSeasonResults.map((result) => (
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
        
        </SidebarLayout>
        
    );

}
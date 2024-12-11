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

interface DriverFinalResult {
    season: string;
    position: string;
    points: string;
    wins: string;
    polePositions: string;
}

export default function DriverDetailsComponent() {

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [driverData, setDriverData] = useState<OvertakeDriver | null>(null);
    const [driverWins, setDriverWins] = useState<number | null>(null);
    const [driverPodiums, setDriverPodiums] = useState<number | null>(null);
    const [driverStanding, setDriverStanding] = useState<number | null>(null);
    const [driverSeasonResults, setDriverSeasonResults] = useState<DriverFinalResult[]>([]);

    useEffect(() => {

        const storedDriverNumber = sessionStorage.getItem("selectedDriverNumber");
        const storedDriverId = sessionStorage.getItem("selectedDriverId");

        if (!storedDriverNumber) {
            setError("No driver selected.");
            return;
        }

        if (!storedDriverId) {
            setError("No driver selected.");
            return;
        }

        async function fetchDriverData() {
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

        async function fetchDriverWins() {
            try {
                const wins = await getWinsOfDriver(storedDriverId);
                if (wins !== null && wins !== undefined) { 
                    setDriverWins(Number(wins));
                } else {
                    setDriverWins(0);
                }
            } catch (error) {
                console.error("Error fetching driver wins:", error);
                setDriverWins(0);
            }
        }

        async function fetchDriverPodiums() {
            try {
                const podiums = await getPodiumsOfDriver(storedDriverId);
                if (podiums !== null && podiums !== undefined) { 
                    setDriverPodiums(Number(podiums));
                } else {
                    setDriverPodiums(0);
                }
            } catch (error) {
                console.error("Error fetching driver podiums:", error);
                setDriverPodiums(0);
            }
        }

        async function fetchDriverStanding() {
            try {
                const standing = await getDriverStanding(storedDriverId);
                if (standing !== null) {
                    setDriverStanding(Number(standing));
                } else {
                    setError("No driver standings data found.");
                }
            } catch (error) {
                console.error("Error fetching driver standing:", error);
                setError("Failed to load driver standing.");
            }
        }

        async function fetchDriverSeasonResults() {
            try {
                const results: DriverFinalResult[] = await getDriverSeasonResults(storedDriverId);
                if (results !== null) {
                    setDriverSeasonResults(results);
                } else {
                    setError("No driver season result data found.");
                }
            } catch (error) {
                console.error("Error fetching driver season results:", error);
                setError("Failed to load driver season results.");
            }
        }

        fetchDriverData();
        fetchDriverWins();
        fetchDriverPodiums();
        fetchDriverStanding();
        fetchDriverSeasonResults();

    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!driverData) {
        return <p>No Driver Data</p>;
    }

    const handleReturnClick = () => {
        router.push('./formulalearn');
    };

    const headshotImagePath = driverData.headshotPath;
    const flagImagePath = driverData.flagImagePath;
    const miniTeamLogoPath = driverData.teamImagePath;
    const defaultImgPath = `/assets/driver_headshot/default.png`;

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
                                        NATIONALITY: {driverData.nationality}
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
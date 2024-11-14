"use client";

import { useState, useEffect, useContext, useRef } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./ballot.module.css";
import { getNextRace } from "../utils/api/ergast";
import { timeNow } from "../utils/api/worldtime";
import { getDrivers } from "../utils/api/ergast";
import { Driver } from "./ballotDriverType";
import BallotDriverSelect from "../components/ballotdriverselect";
import BallotList from "../components/ballotlist";
import BallotLeagueSelect from "../components/ballotleageselect";
import BallotSubmission from "../components/ballotsubmission";
import PodiumDisplay from "../components/ballotpodiumdisplay";
import BallotScore from "../components/ballotscore";
import BallotActualResults from "../components/ballotactualresults";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Top10GridPrediction() {

    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

    const [selectedBox, setSelectedBox] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [showScoreButton, setShowScoreButton] = useState(false);
    const [showActualResults, setShowActualResults] = useState(false);
    const [totalScore, setTotalScore] = useState<number | null>(null);

    const [gridPredictions, setGridPredictions] = useState<(string | null)[]>(Array(10).fill(null));

    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingDrivers, setLoadingDrivers] = useState(true);

    const router = useRouter();

    // Driver fetch
    useEffect(() => {

        async function fetchDrivers() {

            try {
                const driverData = await getDrivers();
                await new Promise((resolve) => setTimeout(resolve, 1000));
                if (driverData) setDrivers(driverData);
            } catch (error) {
                setError("Failed to fetch drivers");
            } finally {
                setLoadingDrivers(false);
            }

        }

        fetchDrivers();

    }, []);

    const handleDriverClick = (driverId: string) => {

        if (selectedBox !== null) {

            // Map driverId to driver's full name
            const selectedDriver = drivers.find(driver => driver.driverId === driverId);
            const driverName = selectedDriver ? `${selectedDriver.givenName} ${selectedDriver.familyName}` : "";

            // Prevent duplicate by checking if the driver's name is already in gridPredictions
            if (!gridPredictions.includes(driverName)) {

                const updatedPredictions = [...gridPredictions];
                updatedPredictions[selectedBox] = driverName;
                setGridPredictions(updatedPredictions);

                // Automatically select the next empty position
                const nextAvailablePosition = updatedPredictions.findIndex((driver) => driver === null);
                setSelectedBox(nextAvailablePosition !== -1 ? nextAvailablePosition : null);

            } else {
                console.log(`Driver ${driverName} is already selected in the ballot.`);
            }

        }

    };

    const handleSubmissionSuccess = () => {
        setSubmissionSuccess(true);
        setShowScoreButton(true);
        setTimeout(() => setSubmissionSuccess(false), 2000);
    };

    const handlePositionSelect = (position: number) => {
        setSelectedBox(position);
    };

    const handleLeagueSelect = (leagueId: number) => {
        setSelectedLeagueId(leagueId);
    };

    const handleLoadExistingBallot = (existingBallot: (string | null)[]) => {
        setGridPredictions(existingBallot);
        setIsEditing(true);
    };

    const handleScoreCalculated = (score: number) => {
        setTotalScore(score);
    };

    const handleScoreButtonClick = () => {
        setShowActualResults(true);
    };

    const handleToggleResultsView = () => {
        setShowActualResults(!showActualResults);
    };

    const getLoadingImagePath = () => {
        return `/images/loading.svg`;
    };

    const handleReturnClick = () => {
        router.push('./raceleague');
    };

    return (

        <SidebarLayout>

            <div className={styles.pageContainer}>

                {/* Left Column: League Select and Ballot List */}

                <div className={styles.leftColumn}>

                    <BallotLeagueSelect onLeagueSelect={handleLeagueSelect} />
                    <BallotList
                        onDriverSelect={handlePositionSelect}
                        gridPredictions={gridPredictions}
                        selectedBox={selectedBox}
                        submissionSuccess={submissionSuccess}
                    />
                    <BallotSubmission
                        gridPredictions={gridPredictions}
                        selectedLeagueId={selectedLeagueId}
                        onSubmissionSuccess={handleSubmissionSuccess}
                        onLoadExistingBallot={handleLoadExistingBallot}
                    />
                    {showScoreButton && (
                        <BallotScore
                            gridPredictions={gridPredictions}
                            onScoreCalculated={handleScoreCalculated}
                            isEditing={isEditing}
                            onScoreButtonClick={handleScoreButtonClick}
                            selectedLeagueId={selectedLeagueId}
                        />
                    )}
                    {showActualResults && (
                        <button onClick={handleToggleResultsView} className={styles.toggleButton}>
                            Back to Driver List
                        </button>
                    )}

                </div>

                {/* Right Column: Driver Select */}

                <div className={styles.rightColumn}>

                    <div className={styles.podiumAndReturn}>

                        <button onClick={handleReturnClick} className={styles.returnButton}>
                            {'<'}
                        </button>

                        <div className={styles.podiumDisplayContainer}>
                            {!showActualResults && (
                                <PodiumDisplay
                                    drivers={drivers}
                                    gridPredictions={gridPredictions}
                                />
                            )}
                        </div>

                    </div>

                    {showActualResults ? (
                        <>
                            <BallotActualResults
                                gridPredictions={gridPredictions}
                                drivers={drivers}
                            />
                            {totalScore !== null && (
                                <div className={styles.scoreDisplay}>
                                    <h4>Your Score: {totalScore}</h4>
                                </div>
                            )}
                        </>
                    ) : loadingDrivers ? (
                        <div className={styles.loadingImageContainer}>
                            <Image
                                src={getLoadingImagePath()}
                                alt={'Loading Drivers...'}
                                className={styles.loadingImage}
                                width={90}
                                height={90}
                            />
                        </div>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <BallotDriverSelect
                            drivers={drivers}
                            onDriverClick={handleDriverClick}
                            gridPredictions={gridPredictions}
                        />
                    )}

                </div>

            </div>

        </SidebarLayout>

    );

}

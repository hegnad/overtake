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


export default function Top10GridPrediction() {

    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

    const [selectedBox, setSelectedBox] = useState<number | null>(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [gridPredictions, setGridPredictions] = useState<(string | null)[]>(Array(10).fill(null));

    const [error, setError] = useState<string | null>(null);
    const [loadingDrivers, setLoadingDrivers] = useState(true);


    // Driver fetch
    useEffect(() => {

        async function fetchDrivers() {

            try {
                const driverData = await getDrivers();
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
        setTimeout(() => setSubmissionSuccess(false), 2000);
    };

    const isDriverSelected = (driverId: string) => {
        const driver = drivers.find(d => d.driverId === driverId);
        const driverFullName = driver ? `${driver.givenName} ${driver.familyName}` : "";
        return gridPredictions.includes(driverFullName);
    };

    const handlePositionSelect = (position: number) => {
        setSelectedBox(position);
    };

    const handleLeagueSelect = (leagueId: number) => {
        setSelectedLeagueId(leagueId);
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
                    />
                </div>

                {/* Right Column: Driver Select */}

                <div className={styles.rightColumn}>
                    <PodiumDisplay
                        drivers={drivers}
                        gridPredictions={gridPredictions}
                    />
                    {loadingDrivers ? (
                        <p>Loading drivers...</p>
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

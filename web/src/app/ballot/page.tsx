"use client";

import { useState, useEffect, useContext, useRef } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./ballot.module.css";
import { IdentityContext } from "../lib/context/identity";
import { CombinedDriver } from "./apiDriver";
import Image from "next/image";
import defaultDriverImage from "../../../public/images/defaultdriverimg.png";
import { getNextRace } from "../utils/api/ergast";
import { timeNow } from "../utils/api/worldtime";
import { getDrivers } from "../utils/api/ergast";
import { Driver } from "./ballotDriverType";
import BallotDriverSelect from "../components/ballotdriverselect";
import BallotList from "../components/ballotlist";
import BallotLeagueSelect from "../components/ballotleageselect";
import BallotSubmission from "../components/ballotsubmission";


export default function Top10GridPrediction() {

    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

    const [selectedBox, setSelectedBox] = useState<number | null>(null);
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

            const selectedDriver = drivers.find(driver => driver.driverId === driverId);
            const driverName = selectedDriver ? `${selectedDriver.givenName} ${selectedDriver.familyName}` : driverId;

            const updatedPredictions = [...gridPredictions];
            updatedPredictions[selectedBox] = driverName;
            setGridPredictions(updatedPredictions);
            setSelectedBox(null);

            const nextAvailablePosition = updatedPredictions.findIndex((driver) => driver === null);
            setSelectedBox(nextAvailablePosition !== -1 ? nextAvailablePosition : null);

        }

    }

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
                    <BallotList onDriverSelect={handlePositionSelect} gridPredictions={gridPredictions} selectedBox={selectedBox} />
                    <BallotSubmission
                        gridPredictions={gridPredictions}
                        selectedLeagueId={selectedLeagueId}
                    />
                </div>

                {/* Right Column: Driver Select */}

                <div className={styles.rightColumn}>
                    {loadingDrivers ? (
                        <p>Loading drivers...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <BallotDriverSelect drivers={drivers} onDriverClick={handleDriverClick} gridPredictions={gridPredictions} />
                    )}
                </div>

            </div>

        </SidebarLayout>

    );

}

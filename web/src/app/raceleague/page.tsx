"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./raceleague.module.css";
import CreateRaceLeague from "../components/createleague";
import UserRaceLeagues from "../components/userraceleagues";
import UserBallot from "../components/userballot";
import LeagueHeader from "../components/leagueheader"
import StyledLine from "../components/styledline";

export default function RaceLeague() {
    const [showCreateLeague, setShowCreateLeague] = useState(false);

    const handleCreateLeagueClick = () => {
        setShowCreateLeague(true);
    };

    const handleCloseModal = () => {
        setShowCreateLeague(false);
    }

    return (
    <SidebarLayout>
        <LeagueHeader onCreateLeagueClick={handleCreateLeagueClick} />
        <StyledLine color="yellow" />
        <div className={styles.container}>
            <UserRaceLeagues />
            <UserBallot />
        </div>
        {/* Pop up modal for create race league */}
        {showCreateLeague && (
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <CreateRaceLeague />
                    <button className={styles.closeButton} onClick={handleCloseModal}>
                        Close
                    </button>
                </div>
            </div>
        )}
    </SidebarLayout>
  );
}

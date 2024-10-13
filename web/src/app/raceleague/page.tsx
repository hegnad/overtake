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
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleCreateLeagueClick = () => {
        setShowCreateLeague(true);
    };

    const handleCloseModal = () => {
        setShowCreateLeague(false);
        setShowConfirmation(false);
    }

    const handleLeagueCreated = () => {
        setShowCreateLeague(false);
        setShowConfirmation(true);
    }

    return (
    <SidebarLayout>
        <LeagueHeader onCreateLeagueClick={handleCreateLeagueClick} />
        <StyledLine color="yellow" size="thick"/>
            <div className={styles.container}>
                {showCreateLeague? (
                    <div >
                        <CreateRaceLeague onLeagueCreated={handleLeagueCreated}/>
                    </div>
                ) : showConfirmation ? (
                    <div>
                        <h2> League Created Successfully!</h2>
                        <button className={styles.closeButton} onClick={handleCloseModal}>
                            CLOSE
                        </button>
                    </div>
                ): (
                    <div>
                        <UserRaceLeagues />
                        <UserBallot />
                    </div>
                )}
            </div>
    </SidebarLayout>
  );
} 

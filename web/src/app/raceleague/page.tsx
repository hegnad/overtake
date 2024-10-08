"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "../home.module.css";
import CreateRaceLeague from "../components/createleague";
import UserRaceLeagues from "../components/userraceleagues";
import UserBallot from "../components/userballot";

export default function RaceLeague() {

    return (
    <SidebarLayout>
      <div className={styles.driversResults}>
        <CreateRaceLeague/>
        <UserRaceLeagues/>
        <UserBallot/>
      </div>
    </SidebarLayout>
  );
}

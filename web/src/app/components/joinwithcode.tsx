"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect, use } from "react";
import StyledLine from "./styledline";
import styles from './joinleague.module.css';
import leagueDropdownStyle from './ballotleagueselect.module.css';

interface JoinWithCodeProps {
    onLeagueJoined: () => void;
}

export default function JoinWithCode({ onLeagueJoined }: JoinWithCodeProps) {
  const identity = useContext(IdentityContext);
  const [inviteCode, setInviteCode] = useState("");
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);


  const handleJoinLeague = async () => {
    const response = await fetch(
      `http://localhost:8080/api/league/join/${inviteCode}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${identity.sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: inviteCode }),
      }
    );

    if (response.status === 200) {
      const data = await response.json();
        console.log(data);
        onLeagueJoined();
    } else {
      console.error(`Failed to join league, status code: ${response.status}`);
    }
  };

    return (

        <div className={styles.joinLeagueCodeContainer}>

            <h1>Join League by Code:</h1>

            <StyledLine color="yellow" size="thin" />

            <p>Enter the code provided by the league owner to join their league.</p>

            <input
                type="text"
                placeholder="Enter code"
                onChange={(e) => setInviteCode(e.target.value)}
                className={leagueDropdownStyle.leagueDropdownCode}
            />

            <br />

            <button onClick={handleJoinLeague} className={styles.joinLeagueButton}>
                JOIN LEAGUE
            </button>

        </div>

  );
}

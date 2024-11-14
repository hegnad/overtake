"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import styles from "./userraceleagues.module.css";
import StyledLine from "./styledline";

interface RaceLeagueInfo {
  leagueId: number;
  ownerId: number;
  name: string;
  isPublic: boolean;
}

export default function UserRaceLeagues() {
  const identity = useContext(IdentityContext);
  const router = useRouter();
  const [leagues, setLeagues] = useState<RaceLeagueInfo[]>([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      const response = await fetch(
        "http://localhost:8080/api/league/populate",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${identity.sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        setLeagues(data);
      } else {
        console.error(`non-successful status code: ${response.status}`);
      }
    };

    if (identity.sessionToken) {
      fetchLeagues();
    }
  }, [identity.sessionToken]);

  const handleClick = (leagueId: number) => {
    // Store the leagueId in sessionStorage
    sessionStorage.setItem("selectedLeagueId", leagueId.toString());

    // Navigate to /leaguedetails without any query parameters
    router.push("/leaguedetails");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Your Race Leagues</h2>
      <StyledLine color="red" size="thick" />
      <ul className={styles.leagueList}>
        {leagues.length > 0 ? (
          leagues.map((league, index) => (
            <li key={league.leagueId} className={styles.leagueItem}>
              <button
                className={styles.leagueButton}
                onClick={() => handleClick(league.leagueId)}
              >
                <div className={styles.iconContainer}>
                  <div className={styles.iconBackground}>
                    <Image
                      src="/images/logo.svg"
                        alt="flags"
                        width={70}
                        height={70}
                        className={styles.icon}
                    />
                  </div>
                </div>
                <div className={styles.leagueInfo}>
                  <h3>{league.name}</h3>
                  <h2>x Members</h2>
                </div>
              </button>
            </li>
          ))
        ) : (
          <p className={styles.footer}>No Leagues Found.</p>
        )}
      </ul>
    </div>
  );
}

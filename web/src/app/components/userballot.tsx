"use client"

import { useRouter } from 'next/navigation';
import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";''
import StyledLine from './styledline';
import styles from "./userballot.module.css";
import podiumStyle from "./ballotpodiumdisplay.module.css"
import leagueMenuStyle from "./ballotleagueselect.module.css";
import Image from "next/image";

export default function UserBallot() {
    const identity = useContext(IdentityContext);
    const [ballots, setBallots] = useState<{ position: number; driverId: string, fullName: string, nationality: string, team: string }[]>([]);
    const [leagues, setLeagues] = useState<{ leagueId: string; name: string }[]>([]);
    const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLeagues = async () => {
            const response = await fetch("http://localhost:8080/api/league/populate", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setLeagues(data);
            }
        };

        // Fetch leagues only once when the component mounts
        if (identity.sessionToken) {
            fetchLeagues();
        }
    }, [identity.sessionToken]);

    useEffect(() => {
        const fetchBallot = async () => {
            if (selectedLeagueId) {
                const response = await fetch(`http://localhost:8080/api/ballot/populate?leagueId=${selectedLeagueId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${identity.sessionToken}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log(`Fetching ballot for league ID: ${selectedLeagueId}, Response Status: ${response.status}`);

                if (response.status === 200) {
                    const data = await response.json();
                    setBallots(data);
                } else if (response.status === 404) {
                    setBallots([]);
                }
            }
        };

        fetchBallot();
    }, [selectedLeagueId, identity.sessionToken]);

    const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLeagueId(event.target.value);
    };

    const handleClick = () => {
        router.push('./ballot');
    };

    const getDriverImagePath = (driverId: string) => {
        return `/assets/driver_headshot/${driverId}.png`;
    };

    const getLastName = (fullName: string) => {
        const lastName = fullName.split(' ').pop() || "";
        return lastName.substring(0, 3).toUpperCase();
    }

    const convertLastToDriverId = (fullName: string) => {
        const lastName = fullName.split(' ').pop() || "";
        return lastName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    const driver1 = ballots.find(ballot => ballot.position === 1);
    const driver2 = ballots.find(ballot => ballot.position === 2);
    const driver3 = ballots.find(ballot => ballot.position === 3);

    console.log(ballots);

    return (

        <div>
            <div className={styles.heading}>
                <button className={styles.ballotButton} onClick={handleClick}>
                    Your Ballot {'>'}
                </button>
            </div>
            <StyledLine color="red" size="thick" />

            <div className={styles.yourBallotContainer}>

                {/* Dropdown for selecting league */}
                <select id="leagueSelect" onChange={handleLeagueChange} className={leagueMenuStyle.leagueDropdownLeaguePage} value={selectedLeagueId || ''}>
                    <option value="">Select a league</option>
                    {leagues.map(league => (
                        <option key={league.leagueId} value={league.leagueId}>
                            {league.name}
                        </option>
                    ))}
                </select>

                <br />
                <br />

                <div className={podiumStyle.podiumDisplayLeaguePage}>

                        {driver2 ? (
                            <div className={podiumStyle.driverContainer}>
                                <Image
                                    src={getDriverImagePath(convertLastToDriverId(driver2.driverId))}
                                    alt={`${driver2.driverId}`}
                                    width={200}
                                    height={200}
                                    className={podiumStyle.podiumImage}
                                />
                                    <span className={styles.position2}>{driver2.position}</span>
                                    <StyledLine color="silver" size="thin" />
                                    <div className={podiumStyle.podiumNameAndFlag}>
                                        <h2>{getLastName(driver2.driverId)}</h2>
                                    </div>
                                    <StyledLine color="silver" size="thin" />
                                    <span className={styles.teamName}>TEAM</span>
                            </div>
                        ) : null} 

                        {driver1 ? (
                            <div className={podiumStyle.driverContainer}>
                                <Image
                                    src={getDriverImagePath(convertLastToDriverId(driver1.driverId))}
                                    alt={`${driver1.driverId}`}
                                    width={200}
                                    height={200}
                                    className={podiumStyle.podiumImage}
                                />
                                <span className={styles.position1}>{driver1.position}</span>
                                    <StyledLine color="yellow" size="thin" />
                                    <div className={podiumStyle.podiumNameAndFlag}>
                                        <h2>{getLastName(driver1.driverId)}</h2>
                                    </div>
                                    <StyledLine color="yellow" size="thin" />
                                    <span className={styles.teamName}>TEAM</span>
                            </div>
                        ) : null}

                        {driver3 ? (
                            <div className={podiumStyle.driverContainer}>
                                <Image
                                    src={getDriverImagePath(convertLastToDriverId(driver3.driverId))}
                                    alt={`${driver3.driverId}`}
                                    width={200}
                                    height={200}
                                    className={podiumStyle.podiumImage}
                                />
                            <span className={styles.position3}>{driver3.position}</span>
                                    <StyledLine color="bronze" size="thin" />
                                    <div className={podiumStyle.podiumNameAndFlag}>
                                        <h2>{getLastName(driver3.driverId)}</h2>
                                    </div>
                                    <StyledLine color="bronze" size="thin" />
                                    <span className={styles.teamName}>TEAM</span>
                            </div>
                        ) : (
                            <p className={styles.footer} onClick={handleClick}>No Ballots Found.</p>
                        )}

                </div>

            </div>

        </div>
    );
}

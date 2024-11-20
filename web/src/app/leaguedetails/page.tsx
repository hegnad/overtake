"use client"

import { IdentityContext } from "../lib/context/identity";
import { useEffect, useState, useContext } from 'react';
import { getRaceResults, getSeasonRounds } from "../utils/api/ergast";
import styles from "./leaguedetails.module.css";
import SidebarLayout from "../ui/sidebar-layout";

interface Member {
    username: string;
    totalScore: number;
}

interface RoundDetails {
    ballotId: number;
    userId: number;
    username: string;
    score: number;
}

export default function LeagueDetailsComponent() {
    const [leagueId, setLeagueId] = useState<string | null>(null);
    const [leagueName, setLeagueName] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[] | null>(null);
    const [raceResults, setRaceResults] = useState<any[]>([]);
    const [raceName, setRaceName] = useState<string>("");
    const [raceSeason, setRaceSeason] = useState<string>("");
    const [raceRound, setRaceRound] = useState<string>("");
    const [rounds, setRounds] = useState<string[]>([]);
    const [roundDetails, setRoundDetails] = useState<RoundDetails[]>([]);
    const [ballotId, setBallotId] = useState<string | null>(null);
    const [ballotContent, setBallotContent] = useState<string[] | null>(null);

    const currentYear = new Date().getFullYear();
    const seasons = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => currentYear - i);

    const identity = useContext(IdentityContext);

    useEffect(() => {
        const fetchRounds = async () => {
            if (raceSeason !== "") {
                const data = await getSeasonRounds(raceSeason);
                if (data) {
                    setRounds(data);
                }
            }
        };

        fetchRounds();
    }, [raceSeason]);

    useEffect(() => {
        const fetchRaceResults = async () => {
            if (raceSeason && raceRound) {
                setRaceResults([]); // Reset results when changing the round
                const data = await getRaceResults(raceSeason, raceRound);
                if (data) {
                    const raceResults = data?.raceResults || [];
                    const raceName = data?.raceName || "";
                    setRaceResults(raceResults);
                    setRaceName(raceName);
                }
            }
        };

        fetchRaceResults();
    }, [raceRound, raceSeason]);

    useEffect(() => {
        if (raceSeason && raceRound) {
            fetchRoundDetails();
        }
    }, [raceSeason, raceRound]);

    useEffect(() => {
        if (ballotId) {
            fetchBallotDetails();
        }
    }, [ballotId]);

    useEffect(() => {
        const storedLeagueId = sessionStorage.getItem('selectedLeagueId');
        console.log("Retrieved League ID from sessionStorage:", storedLeagueId);

        if (storedLeagueId) {
            setLeagueId(storedLeagueId);

            const fetchLeagueName = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/league/getLeagueName?leagueId=${encodeURIComponent(storedLeagueId)}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${identity.sessionToken}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 200) {
                        const name = await response.text();
                        setLeagueName(name);
                    } else {
                        console.error(`Failed to fetch league name: ${response.status}`);
                    }
                } catch (error) {
                    console.error("Error fetching league name:", error);
                }
            };

            const fetchLeagueDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/league/populateDetails?leagueId=${encodeURIComponent(storedLeagueId)}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${identity.sessionToken}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 200) {
                        const data: Member[] = await response.json();
                        const sortedMembers = data.sort((a, b) => b.totalScore - a.totalScore);
                        setMembers(sortedMembers);
                    } else {
                        console.error(`Non-successful status code: ${response.status}`);
                    }
                } catch (error) {
                    console.error("Error fetching league details:", error);
                }
            };

            fetchLeagueName();
            fetchLeagueDetails();
        } else {
            console.error('No leagueId found in sessionStorage');
        }
    }, [identity.sessionToken]);

    if (!leagueId) {
        return <div>Loading...</div>;
    }

    const fetchRoundDetails = async () => {
        console.log(leagueId, raceRound);
        try {
            const response = await fetch(`http://localhost:8080/api/league/getLeagueRoundDetails?leagueId=${leagueId}&raceId=${raceRound}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data: RoundDetails[] = await response.json();
                setRoundDetails(data);
            }
        } catch (error) {
            console.error("Error fetching league details:", error);
        }
    };

    const fetchBallotDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/ballot/populateBallotContent?ballotId=${ballotId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setBallotContent(data);
            }
        } catch (error) {
            console.error("Error fetching league details:", error);
        }
    }

    return (
        <SidebarLayout>
            <div className={styles.container}>
                <h1 className={styles.header}>League Details</h1>
                <p className={styles.leagueInfo}>
                    {leagueName ? `League Name: ${leagueName}` : "Loading League Name..."}
                </p>

                <h2>Members</h2>
                <div className={styles.scrollContainer}>
                    <ul className={styles.membersList}>
                        {members && members.length > 0 ? (
                            members.map((member: Member, index: number) => (
                                <li key={index} className={styles.memberItem}>
                                    <span>{member.username ? member.username : "Unknown"}</span>
                                    <span>Total Score: {member.totalScore ?? "N/A"}</span>
                                </li>
                            ))
                        ) : (
                            <li className={styles.memberItem}>No Members Found</li>
                        )}
                    </ul>
                </div>

                <h2>Season Breakdown</h2>
                <div>
                    <h3>Select the season of the race you wish to check: </h3>
                    <select
                        value={raceSeason}
                        onChange={(e) => {
                            setRaceSeason(e.target.value);
                            setRaceRound("");
                            setBallotId(null);
                            setBallotContent(null);
                        }}
                        className={styles.dropdown}
                    >
                        <option value="" disabled>
                            Select a season
                        </option>
                        {seasons.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    {raceSeason && rounds.length > 0 && (
                        <div>
                            <h3>Select the round: </h3>
                            <select
                                value={raceRound}
                                onChange={(e) => {
                                    setRaceRound(e.target.value);
                                    setBallotId(null);
                                    setBallotContent(null);
                                }}
                                className={styles.dropdown}
                            >
                                <option value="" disabled>
                                    Select a round
                                </option>
                                {rounds.map((round, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {round}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {roundDetails.length > 0 && (
                    <div>
                        <h3>Round Details</h3>
                        <ul className={styles.roundDetailsList}>
                            {roundDetails.map((detail) => (
                                <li key={detail.ballotId} className={styles.roundDetailItem}>
                                    <button
                                        onClick={() => setBallotId(detail.ballotId.toString())}
                                        className={styles.detailButton}
                                    >
                                        <span>{detail.username}</span>
                                        <span>Score: {detail.score}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {ballotContent && (
                    <div>
                        <h3>
                            Ballot Of {roundDetails.find((d) => d.ballotId.toString() === ballotId)?.username} for{" "}
                            {raceName}
                        </h3>
                        <ul className={styles.ballotList}>
                            {ballotContent.map((content, index) => (
                                <li key={index} className={styles.ballotItem}>
                                    {index + 1}. {content}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
 
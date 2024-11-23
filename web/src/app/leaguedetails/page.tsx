"use client"

import { IdentityContext } from "../lib/context/identity";
import { useEffect, useState, useContext } from 'react';
import { getRaceResults, getSeasonRounds } from "../utils/api/ergast";
import { useRouter } from 'next/navigation';
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

interface DriverResult {
    position: string;
    Driver: {
        givenName: string;
        familyName: string;
    };
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
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [showJoinCode, setShowJoinCode] = useState<boolean>(false);
    const [joinCode, setJoinCode] = useState<string | null>(null);
    const [ballotRaceResults, setBallotRaceResults] = useState<DriverResult[] | null>(null);

    const currentYear = new Date().getFullYear();
    const seasons = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => currentYear - i);

    const identity = useContext(IdentityContext);
    const router = useRouter();

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

            const isUserLeagueOwner = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/league/isUserLeagueOwner?leagueId=${encodeURIComponent(storedLeagueId)}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${identity.sessionToken}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 200) {
                        const result = await response.json();
                        setIsOwner(result);
                    }
                } catch (error) {
                    console.error("Error fetching league details:", error);
                }
            };

            const fetchJoinCode = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/league/getJoinCode?leagueId=${encodeURIComponent(storedLeagueId)}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${identity.sessionToken}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 200) {
                        const result = await response.json();
                        setJoinCode(result);
                    }
                } catch (error) {
                    console.error("Error fetching league details:", error);
                }
            };

            fetchLeagueName();
            fetchLeagueDetails();
            isUserLeagueOwner();
            fetchJoinCode();
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
            const ballotResponse = await fetch(`http://localhost:8080/api/ballot/populateBallotContent?ballotId=${ballotId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (ballotResponse.status === 200) {
                const ballotData = await ballotResponse.json();
                setBallotContent(ballotData);

                // Fetch race results for the selected race
                const results = await getRaceResults(raceSeason, raceRound);
                if (results) {
                    const raceResults = results?.raceResults || [];
                    setBallotRaceResults(raceResults);
                }
            }
        } catch (error) {
            console.error("Error fetching ballot details:", error);
        }
    };

    const getDriverIdByName = (driverFullName: string | null | undefined) => {
        if (typeof driverFullName !== "string" || !driverFullName) {
            return "default";
        }
        return driverFullName.toLowerCase().replace(/\s+/g, "_");
    };

    const getBallotComparisonClass = (driverName: string, position: number) => {
        const predictedPosition = ballotContent?.indexOf(driverName) ?? -1;

        if (predictedPosition === position) return styles.exactMatch; // Exact match (green)
        if (Math.abs(predictedPosition - position) === 1) return styles.oneOffMatch; // +/- 1 position (yellow)
        if (Math.abs(predictedPosition - position) === 2) return styles.twoOffMatch; // +/- 2 positions (orange)
        if (predictedPosition !== -1) return styles.inBallotNoMatch; // In ballot, no points scored
        return ""; // Not in ballot
    };

    const onReturnClick = () => {
        router.push('/raceleague');
    };

    const onEditLeagueClick = () => {
        router.push('/editleague');
    }

    const onViewJoinCodeClick = () => {
        setShowJoinCode(true);
    }

    return (
        <SidebarLayout>
            <div className={styles.container}>
                {isOwner && (
                    <div className={styles.ownerHeader}>

                        <button className={styles.returnButton} onClick={onReturnClick}>
                            {'<'}
                        </button>
                        <button className={styles.button} onClick={onEditLeagueClick}>
                            EDIT LEAGUE
                        </button>
                        <button className={styles.button} onClick={onViewJoinCodeClick}>
                            VIEW JOIN CODE
                        </button>
                    </div>
                )}

                {showJoinCode && (
                    <div className={styles.popup}>
                        <div className={styles.popupContent}>
                            <p>
                                Invite Code for <strong>{leagueName}</strong>: <strong>{joinCode}</strong>
                            </p>
                            <button className={styles.closeButton} onClick={() => setShowJoinCode(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}

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

                {ballotContent && ballotRaceResults && (
                    <div className={styles.resultsGrid}>
                        <h3>
                            Ballot Of {roundDetails.find((d) => d.ballotId.toString() === ballotId)?.username} for{" "}
                            {raceName}
                        </h3>

                        {ballotContent.map((predictedDriver, index) => {
                            // Find the driver's actual position in race results
                            const actualIndex = ballotRaceResults.findIndex(
                                (result) => `${result.Driver.givenName} ${result.Driver.familyName}` === predictedDriver
                            );

                            // Determine points and styling based on position difference
                            let points = 0;
                            let styleClass = styles.inBallotNoMatch; // Default style for no match

                            if (actualIndex !== -1) {
                                const positionDifference = Math.abs(actualIndex - index);

                                if (positionDifference === 0) {
                                    points = 25;
                                    styleClass = styles.exactMatch;
                                } else if (positionDifference === 1) {
                                    points = 5;
                                    styleClass = styles.oneOffMatch;
                                } else if (positionDifference === 2) {
                                    points = 3;
                                    styleClass = styles.twoOffMatch;
                                }
                            }

                            // Generate driver ID for image
                            const driverId = getDriverIdByName(predictedDriver);

                            return (
                                <div key={index} className={`${styles.resultBox} ${styleClass}`}>
                                    <img
                                        src={`/assets/driver_headshot/${driverId}.png`}
                                        alt={predictedDriver}
                                        className={styles.driverImage}
                                        onError={(e) => (e.currentTarget.src = "/assets/driver_headshot/default.png")}
                                    />
                                    <p className={styles.position}>{index + 1}.</p>
                                    <p className={styles.driverName}>{predictedDriver}</p>
                                    <p className={styles.driverPoints}>+{points}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
 
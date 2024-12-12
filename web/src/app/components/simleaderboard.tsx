"use client";

import { useState, useEffect } from "react";
import styles from "./simleaderboard.module.css";
import Image from "next/image";

const teamLogos = [
    './assets/teamlogos/mclaren_mini.png',       // 1st position
    './assets/teamlogos/ferrari_mini.png',       // 2nd position
    './assets/teamlogos/red_bull_mini.png',      // 3rd position
    './assets/teamlogos/mercedes_mini.png',      // 4th position
    './assets/teamlogos/aston_martin_mini.png',  // 5th position
    './assets/teamlogos/alpine_mini.png',        // 6th position
    './assets/teamlogos/haas_mini.png',          // 7th position
    './assets/teamlogos/rb_mini.png',            // 8th position
    './assets/teamlogos/williams_mini.png',      // 9th position
    './assets/teamlogos/sauber_mini.png'         // 10th position
];

interface LeaderboardEntry {
    username: string;
    score: number;
}

export default function SimLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch leaderboard data from the API
    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const response = await fetch("http://localhost:8080/api/sim/leaderboard", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch leaderboard: ${response.status}`);
                }

                const data: LeaderboardEntry[] = await response.json();

                // Sort data from highest score to lowest score
                const sortedData = data.sort((a, b) => b.score - a.score);
                setLeaderboard(sortedData);
            } catch (error: any) {
                setError(error.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, []);

    const getPositionClass = (index: any) => {
        switch (index) {
            case 0:
                return styles.gold;
            case 1:
                return styles.silver;
            case 2:
                return styles.bronze;
            default:
                return '';
        }
    };

    const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Leaderboard</h1>

            {loading ? (
                <p className={styles.loadingText}>Loading leaderboard...</p>
            ) : error ? (
                <p className={styles.errorText}>{error}</p>
            ) : leaderboard.length === 0 ? (
                <p className={styles.noDataText}>No entries found on the leaderboard.</p>
            ) : (
                <ul className={styles.leaderboardList}>
                    {leaderboard.map((entry, index) => (
                        <li key={index} className={styles.leaderboardItem}>
                            <span className={`${styles.rank} ${getPositionClass(index)}`}>{index + 1}.</span>
                            {index < teamLogos.length && (
                                <Image
                                    src={teamLogos[index]}
                                    alt={`Team logo for position ${index + 1}`}
                                    width={20}
                                    height={20}
                                    className={styles.teamLogo}
                                />
                            )}
                            <span className={`${styles.username} ${getPositionClass(index)}`}>{entry.username}</span>
                            <span className={`${styles.score} ${getPositionClass(index)}`}>{entry.score}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import styles from "./simleaderboard.module.css";

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
                            <span className={styles.rank}>{index + 1}.</span>
                            <span className={styles.username}>{entry.username}</span>
                            <span className={styles.score}>{entry.score}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
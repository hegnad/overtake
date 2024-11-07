"use client";

import { useState, useEffect, useContext } from "react";
import styles from "./ballotleagueselect.module.css";
import { IdentityContext } from "../lib/context/identity";

interface League {
    leagueId: number;
    name: string;
}

interface LeagueSelectionProps {
    onLeagueSelect: (leagueId: number) => void;
}

export default function BallotLeagueSelect({ onLeagueSelect }: LeagueSelectionProps) {

    const identity = useContext(IdentityContext);

    const [leagues, setLeagues] = useState<League[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/league/populate", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${identity.sessionToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch leagues: ${response.status}`);
                }

                const data = await response.json();
                setLeagues(data);
            } catch (error) {
                console.error("Error fetching leagues:", error);
                setError("Failed to fetch leagues.");
            }
        };

        if (identity.sessionToken) {
            fetchLeagues();
        }
    }, [identity.sessionToken]);

    const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const leagueId = Number(event.target.value);
        onLeagueSelect(leagueId);
    };

    return (

        <div className={styles.leagueSelection}>
            {error ? (
                <p>{error}</p>
            ) : (
                    <select className={styles.leagueDropdown} onChange={handleLeagueChange} defaultValue="">
                    <option value="" disabled>
                        -- Select a League --
                    </option>
                    {leagues.map((league) => (
                        <option key={league.leagueId} value={league.leagueId}>
                            {league.name}
                        </option>
                    ))}
                </select>
            )}
        </div>

    );

}

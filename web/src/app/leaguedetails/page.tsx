"use client"

import { IdentityContext } from "../lib/context/identity";
import { useEffect, useState, useContext } from 'react';

interface LeagueInfo {
    leagueId: string;
    memberNames: string[];
}

export default function LeagueDetailsComponent() {
    const [leagueId, setLeagueId] = useState<string | null>(null);
    const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null);
    const identity = useContext(IdentityContext);

    useEffect(() => {
        // Retrieve the leagueId from sessionStorage
        const storedLeagueId = sessionStorage.getItem('selectedLeagueId');
        console.log("Retrieved League ID from sessionStorage:", storedLeagueId);

        if (storedLeagueId) {
            setLeagueId(storedLeagueId);

            // Fetch League Details
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
                        const data: LeagueInfo = await response.json(); // Cast the response to LeagueInfo type
                        console.log("Fetched league details: ", data);
                        setLeagueInfo(data);
                    } else {
                        console.error(`Non-successful status code: ${response.status}`);
                    }
                } catch (error) {
                    console.error("Error fetching league details:", error);
                }
            };

            fetchLeagueDetails();
        } else {
            console.error('No leagueId found in sessionStorage');
        }
    }, [identity.sessionToken]);

    if (!leagueId) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>League Details</h1>
            <p>League ID: {leagueId}</p>
            <h2>Members</h2>
            <ul>
                {leagueInfo && leagueInfo.memberNames && leagueInfo.memberNames.length > 0 ? (
                    leagueInfo.memberNames.map((name: string, index: number) => (
                        <li key={index}>{name}</li>
                    ))
                ) : (
                    <li>No Members Found</li>
                )}
            </ul>
        </div>
    );
}

"use client"

import { IdentityContext } from "../lib/context/identity";
import { useEffect, useState, useContext } from 'react';

interface Member {
    username: string;
    totalScore: number;
}

export default function LeagueDetailsComponent() {
    const [leagueId, setLeagueId] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[] | null>(null);
    const identity = useContext(IdentityContext);

    useEffect(() => {
        // Retrieve the leagueId from sessionStorage
        const storedLeagueId = sessionStorage.getItem('selectedLeagueId');
        console.log("Retrieved League ID from sessionStorage:", storedLeagueId);

        if (storedLeagueId) {
            setLeagueId(storedLeagueId);

            // Fetch League Details (members)
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
                        const data: Member[] = await response.json(); // Cast the response directly to an array of Member
                        console.log("Fetched members: ", data);
                        setMembers(data);
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
                {members && members.length > 0 ? (
                    members.map((member: Member, index: number) => (
                        <li key={index}>
                            {member.username ? member.username : "Unknown"} - Total Score: {member.totalScore !== undefined ? member.totalScore : "N/A"}
                        </li>
                    ))
                ) : (
                    <li>No Members Found</li>
                )}
            </ul>
        </div>
    );
}

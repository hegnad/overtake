"use client"

import { useEffect, useState } from 'react';

export default function LeagueDetails() {
    const [leagueId, setLeagueId] = useState<string | null>(null);
    const [leagueInfo, setLeagueInfo] = useState(null);

    useEffect(() => {
        // Retrieve the leagueId from sessionStorage
        const storedLeagueId = sessionStorage.getItem('selectedLeagueId');
        if (storedLeagueId) {
            setLeagueId(storedLeagueId);

            /*
            // Perform API call to fetch league details using leagueId
            const fetchLeagueDetails = async () => {
                // Example API call
                // const response = await fetch(`http://localhost:8080/api/league/${storedLeagueId}`);
                // const data = await response.json();
                // setLeagueInfo(data);
            };

            fetchLeagueDetails();
            */
        } else {
            console.error('No leagueId found in sessionStorage');
        }
    }, []);

    if (!leagueId) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Render your league information here */}
            <h1>League Details</h1>
            <p>League ID: {leagueId}</p>
        </div>
    );
}
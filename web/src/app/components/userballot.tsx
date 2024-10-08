"use client"

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";

export default function UserBallot() {
    const identity = useContext(IdentityContext);
    const [ballots, setBallots] = useState<{ position: number; driverId: string }[]>([]);

    useEffect(() => {
        const fetchBallot = async () => {
            const response = await fetch("http://localhost:8080/api/ballot/populate", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();

                setBallots(data.map((ballot: { position: number; driverId: string }) => ballot));
            } else {
                console.error(`non-successful status code: ${response.status}`)
            }
        };

        if (identity.sessionToken) {
            fetchBallot();
        }
    }, [identity.sessionToken]);

    return (
        <div>
            <h2>Your Ballot</h2>
            <ul>
                {ballots.length > 0 ? (
                    ballots.map((ballot, index) => (
                        <li key={index}>
                            Position: {ballot.position}, Driver ID: {ballot.driverId}
                        </li>
                    ))
                ) : (
                    <p>No Ballots Found.</p>
                )}
            </ul>
        </div>
    );
}
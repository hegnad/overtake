"use client";

import { useEffect, useState, useContext } from "react";
import { IdentityContext } from "../lib/context/identity";
import SidebarLayout from "../ui/sidebar-layout";

interface UserPoints {
    username: string;
    totalPoints: number;
    pointsThisSeason: number;
    highestLeaguePoints: number;
    highestLeagueName: string;
}

export default function Profile() {
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const identity = useContext(IdentityContext);

    useEffect(() => {
        const storedUserId = Number(sessionStorage.getItem("profileUserId"));
        console.log("Retrieved User ID from sessionStorage:", storedUserId);


        const fetchUserPoints = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/account/pointsInfo?userId=${encodeURIComponent(storedUserId)}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${identity.sessionToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setUserPoints(data);
                    console.log(userPoints);
                } else {
                    console.error(`Failed to fetch user points: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching user points:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPoints();
    }, [identity.sessionToken]);

    return (
        <SidebarLayout>
            {isLoading ? (
                <p>Loading...</p>
            ) : userPoints ? (
                <div>
                    <h1>Profile of {userPoints.username}</h1>
                    <h2>Lifetime Points: {userPoints.totalPoints}</h2>
                    <h2>Points this season: {userPoints.pointsThisSeason}</h2>
                    <h2>Highest Individual League Points this season: {userPoints.highestLeaguePoints} ({userPoints.highestLeagueName})</h2>
                </div>
            ) : (
                <p>Failed to load profile data.</p>
            )}
        </SidebarLayout>
    );
}
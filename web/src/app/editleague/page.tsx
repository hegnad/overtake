"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";
import styles from "./editleague.module.css"
import SidebarLayout from "../ui/sidebar-layout";

export default function EditLeague() {
    const identity = useContext(IdentityContext);
    const [leagueId, setLeagueId] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);

    useEffect(() => {
        const storedLeagueId = sessionStorage.getItem('selectedLeagueId');
        console.log(storedLeagueId);

        if (storedLeagueId) {
            setLeagueId(storedLeagueId);

            const fetchLeagueDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/league/getLeagueById?leagueId=${encodeURIComponent(storedLeagueId)}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${identity.sessionToken}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 200) {
                        const result = await response.json();
                        setName(result.name);
                        setIsPublic(result.isPublic);
                    }

                } catch (error) {
                    console.error("Error fetching league name:", error);
                }
            }
        } else {
            console.error('No leagueId found in sessionStorage');
        }
    }, [identity.sessionToken]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/league/updateLeagueDetails', {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    leagueId,
                    name,
                    isPublic,
                }),
            });

            if (response.status === 200) {
                const result = await response.json();
                console.log(result.Message);
            } else {
                console.error("Failed to update league details.");
            }
        } catch (error) {
            console.error("Error updating league details:", error);
        }
    };

    return (
        <SidebarLayout>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <h2 className={styles.heading}>
                        <label>New League Name</label>
                    </h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                        placeholder="Enter league name"
                    />
                </div>

                <br />

                <div className={styles.formGroup}>
                    <h2 className={styles.heading}>
                        <label>League Visibility</label>
                    </h2>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={`${styles.privacyButton} ${!isPublic ? styles.active : ""
                                }`}
                            onClick={() => setIsPublic(false)}
                        >
                            Private
                        </button>
                        <button
                            type="button"
                            className={`${styles.privacyButton} ${isPublic ? styles.active : ""
                                }`}
                            onClick={() => setIsPublic(true)}
                        >
                            Public
                        </button>
                    </div>
                </div>

                <br />

                <div className={styles.formGroup}>
                    <button type="submit" className={styles.submitButton}>
                        EDIT LEAGUE
                    </button>
                </div>
            </form>
        </SidebarLayout>
    );
}
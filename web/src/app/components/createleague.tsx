"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext } from "react";
import styles from "./createleague.module.css";

interface CreateRaceLeagueProps {
    onLeagueCreated: () => void;
}

export default function CreateRaceLeague({ onLeagueCreated }: CreateRaceLeagueProps) {
    const identity = useContext(IdentityContext);
    const [name, setName] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleNameChange = (value: string) => {
        setName(value);
        if (value.length < 7) {
            setError("League name must be at least 7 characters long.");
        } else {
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (name.length < 7) {
            setError("League name must be at least 7 characters long.");
            return;
        }

        const response = await fetch("http://localhost:8080/api/league/create", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${identity.sessionToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                isPublic,
            }),
        });

        if (response.status !== 200) {
            console.error(`Non-successful status code: ${response.status}`);
        } else {
            onLeagueCreated();
        }
    };

    return (
        <div className={styles.centeredWrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <h2 className={styles.heading}>
                        <label htmlFor="league-name">League Name</label>
                    </h2>
                    <input
                        id="league-name"
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className={styles.input}
                        placeholder="Enter league name"
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <div className={styles.formGroup}>
                    <h2 className={styles.heading}>
                        <label>League Visibility</label>
                    </h2>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={`${styles.privacyButton} ${!isPublic ? styles.active : ""}`}
                            onClick={() => setIsPublic(false)}
                        >
                            Private
                        </button>
                        <button
                            type="button"
                            className={`${styles.privacyButton} ${isPublic ? styles.active : ""}`}
                            onClick={() => setIsPublic(true)}
                        >
                            Public
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={name.length < 7}
                    >
                        Create League
                    </button>
                </div>
            </form>
        </div>
    );
}

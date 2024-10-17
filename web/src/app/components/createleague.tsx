"use client"

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext } from "react";
import styles from "./createleague.module.css"

interface CreateRaceLeagueProps {
    onLeagueCreated: () => void;
}

export default function CreateRaceLeague({ onLeagueCreated }: CreateRaceLeagueProps) {
    const identity = useContext(IdentityContext);
    const [name, setName] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
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
          // TODO: handle error on UI instead of backend
          console.error(`non-successful status code: ${response.status}`);
        } else {
            onLeagueCreated();
        }
      };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <h2 className={styles.heading}>
                    <label>League Name</label>
                </h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    placeholder="Enter league name"
                />
            </div>

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

            <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>
                    CREATE LEAGUE
                </button>
            </div>
        </form>
    );
}
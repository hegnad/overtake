"use client"

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext } from "react";
import styles from "./createleague.module.css"

export default function CreateRaceLeague() {
    const identity = useContext(IdentityContext);
    const [name, setName] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);

    /*
    **ChatGPT generated parameter**
    
    Parameter was originally 'e: mouse event', however this was causing an error with the form's 'onSubmit' event handler.
    Parameter has now been updated at the assistance of ChatGPT.

    Prompt:

    "the following is a page in my system that allows users to create race leagues. The 'handleSubmit' method
    is currently causing errors with the form's 'onSubmit' event handler. Please review the code, and explain
    the cause of the error, as well as how to fix it:
    
    [copy/paste of code from lines 1-87]"
    */

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
          // TODO: ???
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
"use client";

import { useState, useEffect, useContext } from "react";
import styles from "./ballotsubmission.module.css";
import { IdentityContext } from "../lib/context/identity";

interface BallotSubmissionProps {
    gridPredictions: (string | null)[];
    selectedLeagueId: number | null;
}

export default function BallotSubmission({ gridPredictions, selectedLeagueId }: BallotSubmissionProps) {

    const identity = useContext(IdentityContext);

    const [buttonText, setButtonText] = useState("SUBMIT BALLOT");

    useEffect(() => {
        const isComplete = gridPredictions.every(position => position !== null);
        setButtonText(isComplete ? "SUBMIT BALLOT" : "PLEASE COMPLETE BALLOT");
    }, [gridPredictions]);

    const handleSubmit = async () => {

        // Check if all positions are filled before allowing submission
        if (gridPredictions.includes(null)) {
            setButtonText("PLEASE COMPLETE BALLOT");
            return;
        }

        try {
            const requestBody = {
                DriverPredictions: gridPredictions,
                totalScore: null,
                leagueId: selectedLeagueId,
            };

            const response = await fetch("http://localhost:8080/api/ballot/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setButtonText("BALLOT SUBMITTED!");
            } else {
                console.error("Failed to submit ballot:", response.status);
                setButtonText("SUBMISSION FAILED");
            }
        } catch (error) {
            console.error("Error submitting ballot:", error);
            setButtonText("ERROR, TRY AGAIN");
        }

    };

    return (

        <div className={styles.submissionContainer}>
            <button onClick={handleSubmit} className={styles.submitButton}>
                {buttonText}
            </button>
        </div>

    );
}
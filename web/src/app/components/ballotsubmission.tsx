"use client";

import { useState, useEffect, useContext } from "react";
import styles from "./ballotsubmission.module.css";
import { IdentityContext } from "../lib/context/identity";

interface BallotSubmissionProps {
    gridPredictions: (string | null)[];
    selectedLeagueId: number | null;
    onSubmissionSuccess: () => void;
    onLoadExistingBallot: (existingBallot: (string | null)[]) => void;
}

export default function BallotSubmission({
    gridPredictions,
    selectedLeagueId,
    onSubmissionSuccess,
    onLoadExistingBallot,
}: BallotSubmissionProps) {

    const identity = useContext(IdentityContext);
    const [buttonText, setButtonText] = useState("SUBMIT BALLOT");
    const [isEditing, setIsEditing] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [hasLoadedBallot, setHasLoadedBallot] = useState(false);

    // Check for existing ballot on league change
    useEffect(() => {

        const checkExistingBallot = async () => {

            if (!selectedLeagueId || hasLoadedBallot) return;

            try {

                const response = await fetch(`http://localhost:8080/api/ballot/populate?leagueId=${selectedLeagueId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${identity.sessionToken}`,
                    },
                });

                if (response.ok) {
                    const ballotData = await response.json();
                    const ballotPredictions = ballotData.map((item: { driverId: string }) => item.driverId);
                    onLoadExistingBallot(ballotPredictions); // Send data to parent component
                    setIsEditing(true); // Set editing mode if a ballot exists
                    setHasLoadedBallot(true);
                } else {
                    setIsEditing(false);
                    onLoadExistingBallot(Array(10).fill(null)); // Reset if no ballot
                    setHasLoadedBallot(true);
                }

            } catch (error) {
                console.error("Error checking for existing ballot:", error);
            }

        };

        checkExistingBallot();

    }, [selectedLeagueId, hasLoadedBallot, identity.sessionToken, onLoadExistingBallot]);

    useEffect(() => {
        const isComplete = gridPredictions.every(position => position !== null);
        setButtonText(isComplete ? "SUBMIT BALLOT" : "PLEASE COMPLETE BALLOT");
    }, [gridPredictions]);

    const handleSubmit = async () => {

        if (gridPredictions.includes(null)) {
            setButtonText("PLEASE COMPLETE BALLOT");
            return;
        }

        if (!selectedLeagueId) {
            setButtonText("MUST SELECT A LEAGUE");
            return;
        }

        setButtonText("SUBMITTING...");

        const requestBody = {
            DriverPredictions: gridPredictions,
            totalScore: null,
            leagueId: selectedLeagueId,
        };

        const endpoint = isEditing ? "update" : "create";
        const url = `http://localhost:8080/api/ballot/${endpoint}`;

        try {
            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setButtonText("BALLOT SUBMITTED!");
                onSubmissionSuccess();
                setIsEditing(true);
                console.log("Ballot Request Body: ", requestBody);
            } else {
                console.error(`Failed to ${isEditing ? "update" : "create"} ballot:`, response.status);
                setButtonText("SUBMISSION FAILED");
            }

        } catch (error) {
            console.error(`Error ${isEditing ? "updating" : "creating"} ballot:`, error);
            setButtonText("ERROR, TRY AGAIN");
        }

    };

    useEffect(() => {
        if (selectedLeagueId) {
            setButtonText("SUBMIT BALLOT");
        }
    }, [selectedLeagueId]);

    return (

        <div className={styles.submissionContainer}>

            <button
                onClick={handleSubmit}
                onMouseEnter={() => isEditing && buttonText === "BALLOT SUBMITTED!" && setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={styles.submitButton}
            >
                {hovering ? "EDIT BALLOT" : buttonText}
            </button>

        </div>

    );
}

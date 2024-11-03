"use client";

import { useState, useEffect, useContext } from "react";
import styles from "./ballotscore.module.css";
import { IdentityContext } from "../lib/context/identity";
import { getPrevRace } from "../utils/api/ergast";

interface BallotScoreProps {
    gridPredictions: (string | null)[];
    onScoreCalculated: (score: number) => void;
    isEditing: boolean;
    onScoreButtonClick: () => void;
    selectedLeagueId: number | null;
}

export default function BallotScore({
    gridPredictions,
    onScoreCalculated,
    isEditing,
    onScoreButtonClick,
    selectedLeagueId,
}: BallotScoreProps) {

    const identity = useContext(IdentityContext);

    const [buttonText, setButtonText] = useState("SCORE BALLOT");
    const [ballotId, setBallotId] = useState<number | null>(null);

    useEffect(() => {

        // Fetch ballotId based on leagueId if available
        const fetchBallotId = async () => {

            if (selectedLeagueId) {
                const response = await fetch(`http://localhost:8080/api/ballot/getBallotId?leagueId=${selectedLeagueId}`);
                if (response.ok) {
                    const id = await response.json();
                    setBallotId(id);
                }
            }

        };

        fetchBallotId();

    }, [selectedLeagueId]);

    const handleScoreBallot = async () => {

        try {

            const raceResults = await getPrevRace();

            const { totalScore } = calculateBallotScore(gridPredictions, raceResults);

            onScoreCalculated(totalScore);
            onScoreButtonClick();
            setButtonText("SCORE CALCULATED");

            const raceId = 1;

            console.log("LeagueId: ", selectedLeagueId);
            console.log("Total Score: ", totalScore);

            const requestBody = {
                LeagueId: selectedLeagueId,
                RaceId: raceId,
                Score: totalScore,
            }

            console.log("Request Body: ", requestBody);

            // Update the score in the database
            if (selectedLeagueId) {

                const response = await fetch(`http://localhost:8080/api/ballot/updateScore`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${identity.sessionToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    console.log("Score updated successfully in database:", totalScore);
                } else {
                    console.error("Failed to update score:", response.status);
                    setButtonText("UPDATE FAILED");
                }

            }

        } catch (error) {

            console.error("Error scoring ballot:", error);
            setButtonText("ERROR, TRY AGAIN");

        }

    };

    return (

        <div className={styles.scoreButtonContainer}>
            <button
                onClick={handleScoreBallot}
                disabled={!isEditing} // Disable if no ballot exists
                className={`${styles.scoreButton} ${!isEditing ? styles.disabled : ""}`}
            >
                {buttonText}
            </button>
        </div>

    );

}

function calculateBallotScore(predictions: (string | null)[], results: string[]) {

    let totalScore = 0;
    const driverPoints = new Array(results.length).fill(0);

    predictions.forEach((predictedDriver, predictedPosition) => {

        if (!predictedDriver) return;

        const actualPosition = results.indexOf(predictedDriver);

        if (actualPosition === predictedPosition) {
            if (predictedPosition === 0) totalScore += 25;
            else if (predictedPosition === 1) totalScore += 20;
            else if (predictedPosition === 2) totalScore += 15;
            else totalScore += 10;
        } else if (Math.abs(actualPosition - predictedPosition) === 1) totalScore += 5;
        else if (Math.abs(actualPosition - predictedPosition) === 2) totalScore += 3;

    });

    return { totalScore, driverPoints };

}

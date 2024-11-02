"use client";

import styles from "./ballotlist.module.css";

interface BallotListProps {
    onDriverSelect: (position: number) => void;
    gridPredictions: (string | null)[];
    selectedBox: number | null;
    submissionSuccess: boolean;
}

export default function BallotList({
    onDriverSelect,
    gridPredictions,
    selectedBox,
    submissionSuccess,
}: BallotListProps) {

    const handlePositionClick = (index: number) => {
        onDriverSelect(index);
    };

    return (

        <div className={styles.ballotList}>
            {Array.from({ length: 10 }, (_, index) => (
                <div
                    key={index}
                    className={`${styles.ballotBox} ${selectedBox === index ? styles.selected : ""} ${gridPredictions[index] ? styles.filledBox : ""} ${submissionSuccess ? styles.submissionSuccess : ""}`}
                    onClick={() => handlePositionClick(index)}
                >
                    {index + 1}. {gridPredictions[index] || "_________________________________"}
                </div>
            ))}
        </div>

    );

}
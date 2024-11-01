"use client";

import styles from "./ballotlist.module.css";

interface BallotListProps {
    onDriverSelect: (position: number) => void;
    gridPredictions: (string | null)[];
    selectedBox: number | null;
}

export default function BallotList({ onDriverSelect, gridPredictions, selectedBox }: BallotListProps) {

    const handlePositionClick = (index: number) => {
        onDriverSelect(index);
    };

    return (

        <div className={styles.ballotList}>
            {Array.from({ length: 10 }, (_, index) => (
                <div
                    key={index}
                    className={`${styles.ballotBox} ${selectedBox === index ? styles.selected : ""} ${gridPredictions[index] ? styles.filledBox : ""}`}
                    onClick={() => handlePositionClick(index)}
                >
                    {index + 1}. {gridPredictions[index] || "_________________________________"}
                </div>
            ))}
        </div>

    );

}
import styles from "./leagueheader.module.css";
import React from 'react';

interface LeagueHeaderProps {
    onCreateLeagueClick: () => void;
}

const LeagueHeader: React.FC<LeagueHeaderProps> = ({ onCreateLeagueClick }) => {

    return (
        <div className={styles.container}>
            <button className={styles.button} onClick={onCreateLeagueClick}>
                CREATE A RACE LEAGUE
            </button>
            <button className={styles.button}>
                JOIN A RACE LEAGUE
            </button>
        </div>
    );
};

export default LeagueHeader;
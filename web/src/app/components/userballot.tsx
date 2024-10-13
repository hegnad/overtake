"use client"

import { useRouter } from 'next/navigation';
import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";''
import StyledLine from './styledline';
import styles from "./userballot.module.css";
export default function UserBallot() {
    const identity = useContext(IdentityContext);
    const [ballots, setBallots] = useState<{ position: number; driverId: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchBallot = async () => {
            const response = await fetch("http://localhost:8080/api/ballot/populate", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setBallots(data);
            } else if (response.status === 404) {
                setBallots([]);
            }
        };

        if (identity.sessionToken) {
            fetchBallot();
        }
    }, [identity.sessionToken]);

    const handleClick = () => {
        router.push('./ballot');
    };

    const getLastName = (fullName: string) => {
        const lastName = fullName.split(' ').pop() || "";
        return lastName.substring(0, 3).toUpperCase();
    }

    const driver1 = ballots.find(ballot => ballot.position === 1);
    const driver2 = ballots.find(ballot => ballot.position === 2);
    const driver3 = ballots.find(ballot => ballot.position === 3);

    return (
        <div>
            <h2 className={styles.heading}>Your Ballot</h2>
            <StyledLine color="red" size="thick" />
            <button onClick={handleClick}>
                <ul className={styles.driverList}>
                    {driver2 ? (
                        <li className={styles.driverCard}>
                            <div className={styles.driverInfo}>
                                <div className={styles.imageBackground2}>
                                    <p className={styles.driverImage}>Driver Img...</p>
                                </div>
                                <span className={styles.position}>{driver2.position}</span>
                                <StyledLine color="silver" size="thin" />
                                    <div className={styles.flexRow}>
                                        <span className={styles.driverName}>{getLastName(driver2.driverId)}</span>
                                    <span className={styles.flag}>Flag</span>
                                </div>
                                <StyledLine color="silver" size="thin" />
                                <span className={styles.teamName}>TEAM</span>
                            </div>
                        </li>
                    ) : null} 

                    {driver1 ? (
                        <li className={styles.driverCard}>
                            <div className={styles.driverInfo}>
                                <div className={styles.imageBackground1}>
                                    <p className={styles.driverImage}>Driver Img...</p>
                                </div>
                                <span className={styles.position}>{driver1.position}</span>
                                <StyledLine color="yellow" size="thin" />
                                <div className={styles.flexRow}>
                                    <span className={styles.driverName}>{getLastName(driver1.driverId)}</span>
                                    <span className={styles.flag}>Flag</span>
                                </div>
                                <StyledLine color="yellow" size="thin" />
                                <span className={styles.teamName}>TEAM</span>
                            </div>
                        </li>
                    ) : null}

                    {driver3 ? (
                        <li className={styles.driverCard}>
                            <div className={styles.driverInfo}>
                                <div className={styles.imageBackground3}>
                                    <p className={styles.driverImage}>Driver Img...</p>
                                </div>
                                <span className={styles.position}>{driver3.position}</span>
                                <StyledLine color="bronze" size="thin" />
                                <div className={styles.flexRow}>
                                    <span className={styles.driverName}>{getLastName(driver3.driverId)}</span>
                                    <span className={styles.flag}>Flag</span>
                                </div>
                                <StyledLine color="bronze" size="thin" />
                                <span className={styles.teamName}>TEAM</span>
                            </div>
                        </li>
                    ) : (
                        <p className={styles.footer}>No Ballots Found.</p>
                    )}
                </ul>
            </button>
        </div>
    );
}

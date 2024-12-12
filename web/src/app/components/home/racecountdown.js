"use client";

import { useState, useEffect, useRef } from "react";
import HamsterLoader from "../loaders/hamsterloader";
import { getNext2025 } from "@/app/utils/api/overtake";
import styles from "./racecountdown.module.css";
import Image from 'next/image';

export default function RaceCountdown() {
    const [raceData, setRaceData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const timer = useRef(null);

    useEffect(() => {
        async function fetchRace() {
            const race = await getNext2025();
            setRaceData(race);
            if (race && race.raceTimeDate) {
                calculateTimeLeft(race.raceTimeDate);
            }
        }

        fetchRace();

        return () => clearInterval(timer.current);
    }, []);

    const calculateTimeLeft = (raceTimeDate) => {
        timer.current = setInterval(() => {
            const now = new Date();
            const difference = raceTimeDate - now;

            if (difference <= 0) {
                clearInterval(timer.current);
                setTimeLeft(null);
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);
    };

    const auGpImagePath = 'assets/track_layout/melbourne.png';
    const auGpFlagPath = 'assets/country_flags/au.svg';

    return (

        <div>

            {raceData ? (

                <div className={styles.raceCountdownContainer}>

                    {/* Images Container */}
                    <div className={styles.imagesContainer}>
                        <Image
                            src={auGpImagePath}
                            alt="Track Layout"
                            className={styles.trackImage}
                            width={200}
                            height={200}
                        />
                        
                    </div>

                    {/* Text Container */}

                    <div className={styles.textContainer}>

                        <div className={styles.raceDetails}>

                            <h1>
                                Australia
                            </h1>

                            <div className={styles.flagAndDate}>

                                <Image
                                    src={auGpFlagPath}
                                    alt="Country Flag"
                                    className={styles.flagImage}
                                    width={100}
                                    height={50}
                                />

                                <h3>
                                    March 13 - 16
                                    <br />
                                    2025
                                    <br />
                                    <h2>{raceData.circuitName} at {raceData.circuitLocation}</h2>
                                </h3>

                                <h2></h2>

                            </div>

                            

                        </div>

                        {timeLeft ? (
                            <div className={styles.countdownGrid}>
                                <div className={styles.countdownBox}>
                                    <span className={styles.countdownNumber}>{timeLeft.days}</span>
                                    <span className={styles.countdownLabel}>DAYS</span>
                                </div>
                                <div className={styles.countdownBox}>
                                    <span className={styles.countdownNumber}>{timeLeft.hours}</span>
                                    <span className={styles.countdownLabel}>HOURS</span>
                                </div>
                                <div className={styles.countdownBox}>
                                    <span className={styles.countdownNumber}>{timeLeft.minutes}</span>
                                    <span className={styles.countdownLabel}>MIN</span>
                                </div>
                                <div className={styles.countdownBox}>
                                    <span className={styles.countdownNumber}>{timeLeft.seconds}</span>
                                    <span className={styles.countdownLabel}>SEC</span>
                                </div>
                            </div>
                        ) : (
                            <p>The race has started or the data is not available.</p>
                        )}
                    </div>

                </div>

            ) : (

                    <HamsterLoader />

            )}

        </div>

    );

}

"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import styles from "./circuitCard.module.css";

interface CircuitCardProps {
    circuitId: string;
    circuitName: string;
    location: {
        country: string;
        locality: string;
    };
    roundNumber: number;
}

export default function CircuitCard({ circuitId, circuitName, location, roundNumber }: CircuitCardProps) {
    const [layoutImage, setLayoutImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchLayoutImage = async () => {

            try {

                const apiUrl = `http://localhost:8080/api/images/track/${roundNumber}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                setLayoutImage(data); // Assuming the API returns the image URL

            } catch (err) {
                console.error("Error fetching track layout image:", err);
                setError("Failed to load layout image");
            } finally {
                setLoading(false);
            }

        };

        fetchLayoutImage();

    }, [roundNumber]);

    return (

        <div className={styles.circuitContainer}>

            <div className={styles.circuitCard}>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                        <p className={styles.error}>{error}</p>
                    ) : (
                        <>
                            <div className={styles.imageContainer}>
                                <Image
                                    src={layoutImage || "/assets/trackLayouts/default.png"}
                                    alt={`${circuitName} layout`}
                                    width={100}
                                    height={100}
                                    className={styles.layoutImage}
                                />
                            </div>
                        </>
                )}

                {/* 
                <div className={styles.circuitInfo}>
                    <h3>{circuitName}</h3>
                    <p>{location.locality}, {location.country}</p>
                </div>
                */}

            </div>

        </div>

    );

}

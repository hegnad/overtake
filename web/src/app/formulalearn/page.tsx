"use client";

import SidebarLayout from "../ui/sidebar-layout";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import styles from "./formulalearn.module.css";
import { getDrivers, getConstructors, getCircuits } from "../utils/api/ergast";
import { Driver, Constructor, Circuit } from "./formulaLearnTypes";
import DriverCard from "../components/driverCard";
import ConstructorCard from "../components/constructorCard";
import CircuitCard from "../components/circuitCard";

export default function FormulaLearn() {

    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [constructors, setConstructors] = useState<Constructor[]>([]);
    const [circuits, setCircuits] = useState<Circuit[]>([]);

    const [currentBlock, setCurrentBlock] = useState(0); // Tracks current block (5 drivers)
    const driversPerBlock = 5; // Number of drivers visible at once
    const totalBlocks = Math.ceil(drivers.length / driversPerBlock); // Total blocks

    const scrollRef = useRef<HTMLDivElement>(null);

    const [loadingDrivers, setLoadingDrivers] = useState(true);
    const [loadingConstructors, setLoadingConstructors] = useState(true);
    const [loadingCircuits, setLoadingCircuits] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // Driver fetch
    useEffect(() => {

        async function fetchDrivers() {

            try {
                const driverData = await getDrivers();
                if (driverData) setDrivers([...driverData, ...driverData]);
            } catch (error) {
                setError("Failed to fetch drivers");
            } finally {
                setLoadingDrivers(false);
            }

        }

        fetchDrivers();

    }, []);

    // Constructor fetch
    useEffect(() => {

        async function fetchConstructors() {

            try {
                const constructorData = await getConstructors();
                if (constructorData) setConstructors(constructorData);
            } catch (error) {
                setError("Failed to fetch constructors");
            } finally {
                setLoadingConstructors(false);
            }

        }

        fetchConstructors();

    }, []);

    // Circuit fetch
    useEffect(() => {

        async function fetchCircuits() {

            try {
                const circuitData = await getCircuits();
                if (circuitData) setCircuits(circuitData);
            } catch (error) {
                setError("Failed to fetch circuits");
            } finally {
                setLoadingCircuits(false);
            }

        }

        fetchCircuits();

    }, []);

    // Dragging logic
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
        scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current.offsetLeft || 0);
        const walk = x - startX.current; // Calculate the distance moved
        scrollRef.current.scrollLeft = scrollLeft.current - walk; // Update the scroll position
    };

    const handleMouseUpOrLeave = () => {
        isDragging.current = false; // Stop dragging
    };

    const handleDriverClick = (permanentNumber: number) => {
        sessionStorage.setItem("selectedDriverNumber", permanentNumber.toString());
        router.push('./driverdetails');
        console.log(`Driver with permanent number, ${permanentNumber}, clicked!`);
    };

    const handleConstructorClick = (constructorId: string) => {
        sessionStorage.setItem("selectedConstructorId", constructorId);
        router.push('./constructordetails');
        console.log(`Constructor with constructor id, ${constructorId}, clicked!`);
    }

    return (
        <SidebarLayout>
            {error && <p className={styles.error}>{error}</p>}

            {/* Drivers Display */}
            <div className={styles.drivers}>
                <div className={styles.header}>
                    <h1>DRIVERS</h1>
                </div>

                {loadingDrivers ? (
                    <p>Loading drivers...</p>
                ) : (
                    <>
                            <div
                                ref={scrollRef}
                                className={styles.driverGrid}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUpOrLeave}
                                onMouseLeave={handleMouseUpOrLeave} // Handle case where mouse leaves container
                            >
                            {drivers.map((driver, index) => (
                                <DriverCard
                                    key={`${driver.driverId}-${index}`}
                                    givenName={driver.givenName}
                                    familyName={driver.familyName}
                                    permanentNumber={driver.permanentNumber}
                                    nationality={driver.nationality}
                                    onClick={() => handleDriverClick(driver.permanentNumber)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className={styles.constructorsAndCircuitsContainer}>
                {/* Constructors Display */}
                <div className={styles.constructors}>
                    <div className={styles.header}>
                        <h1>CONSTRUCTORS</h1>
                    </div>
                    <div className={styles.constructorGrid}>
                        {constructors.map((constructor) => (
                            <ConstructorCard
                                key={constructor.constructorId}
                                constructorId={constructor.constructorId}
                                name={constructor.name}
                                nationality={constructor.nationality}
                                onClick={() => handleConstructorClick(constructor.constructorId)}
                            />
                        ))}
                    </div>
                </div>

                {/* Circuits Display */}
                <div className={styles.circuits}>
                    <div className={styles.header}>
                        <h1>CIRCUITS</h1>
                    </div>

                    {loadingCircuits ? (
                        <p>Loading circuits...</p>
                    ) : (
                        <div className={styles.circuitsGrid}>
                            {circuits.map((circuit, index) => (
                                <CircuitCard
                                    key={circuit.circuitId}
                                    circuitId={circuit.circuitId}
                                    circuitName={circuit.circuitName}
                                    location={circuit.location}
                                    roundNumber={index + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );

}

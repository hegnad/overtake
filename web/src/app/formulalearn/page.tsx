"use client";

import SidebarLayout from "../ui/sidebar-layout";
import { useEffect, useState } from "react";
import styles from "./formulalearn.module.css";
import { getDrivers, getConstructors, getCircuits } from "../utils/api/ergast";
import { Driver, Constructor, Circuit } from "./formulaLearnTypes";

export default function FormulaLearn() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [constructors, setConstructors] = useState<Constructor[]>([]);
    const [circuits, setCircuits] = useState<Circuit[]>([]);
    const [loadingDrivers, setLoadingDrivers] = useState(true);
    const [loadingConstructors, setLoadingConstructors] = useState(true);
    const [loadingCircuits, setLoadingCircuits] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Driver fetch
    useEffect(() => {

        async function fetchDrivers() {

            try {
                const driverData = await getDrivers();
                if (driverData) setDrivers(driverData);
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

    return (

        <SidebarLayout>

            {error && <p className={styles.error}>{error}</p>}

            {/* Drivers Display */}
            <div className={styles.drivers}>
                <h2>Drivers</h2>
                {loadingDrivers ? (
                    <p>Loading drivers...</p>
                ) : (
                    <ul>
                        {drivers.map((driver) => (
                            <li key={driver.driverId}>
                                {driver.fullName} ({driver.nationality}) - #{driver.permanentNumber}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Constructors Display */}
            <div className={styles.constructors}>
                <h2>Constructors</h2>
                {loadingConstructors ? (
                    <p>Loading constructors...</p>
                ) : (
                    <ul>
                        {constructors.map((constructor) => (
                            <li key={constructor.constructorId}>
                                {constructor.name} ({constructor.nationality})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Circuits Display */}
            <div className={styles.circuits}>
                <h2>Circuits</h2>
                {loadingCircuits ? (
                    <p>Loading circuits...</p>
                ) : (
                    <ul>
                        {circuits.map((circuit) => (
                            <li key={circuit.circuitId}>
                                {circuit.circuitName} ({circuit.location.country})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </SidebarLayout>

    );
}

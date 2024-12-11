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
import HamsterLoader from "../components/loaders/hamsterloader";

export default function FormulaLearn() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [circuits, setCircuits] = useState<Circuit[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedDriver, setHighlightedDriver] = useState<string | null>(null); // ID of the highlighted driver

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

    // Search Functionality
    const handleSearch = () => {
        if (!scrollRef.current || !drivers.length) return;

        const driverIndex = drivers.findIndex(
            (driver) =>
                driver.givenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                driver.familyName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (driverIndex !== -1) {
            const cardWidth = 250;
            const gap = 10;
            const containerCenter = (scrollRef.current.clientWidth - cardWidth) / 2;
            const driverPosition = driverIndex * (cardWidth + gap);

            scrollRef.current.scrollTo({
                left: driverPosition - containerCenter,
                behavior: "smooth",
            });

            setHighlightedDriver(drivers[driverIndex].driverId);
        } else {
            alert("Driver not found!");
        }
    };

    // Clear Search
    const handleClearSearch = () => {
        setSearchTerm(""); // Reset search term
        setHighlightedDriver(null); // Remove highlighted driver
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: 0,
                behavior: "smooth",
            });
        }
    };

    // Dragging logic
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const dragThreshold = 10; // Minimum movement to consider it a drag
    const isDragMovement = useRef(false); // Track if movement qualifies as a drag

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        isDragMovement.current = false; // Reset drag movement state
        startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
        scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current.offsetLeft || 0);
        const walk = x - startX.current; // Calculate the distance moved

        // Mark as a drag if the movement exceeds the threshold
        if (Math.abs(walk) > dragThreshold) {
            isDragMovement.current = true;
        }

        scrollRef.current.scrollLeft = scrollLeft.current - walk; // Update the scroll position
    };

    const handleMouseUpOrLeave = () => {
        if (!scrollRef.current || !isDragging.current) return;

        // Stop dragging
        isDragging.current = false;

        // Snap to the nearest driver card only if a drag occurred
        if (isDragMovement.current) {
            const scrollPosition = scrollRef.current.scrollLeft;
            const cardWidth = 250; // Width of a card
            const gap = 0; // Gap between cards
            const totalCardWidth = cardWidth + gap; // Total width of one card including gap

            // Find the nearest card index
            const nearestCardIndex = Math.round(scrollPosition / totalCardWidth);

            // Smoothly snap to the nearest card
            scrollRef.current.scrollTo({
                left: nearestCardIndex * totalCardWidth,
                behavior: "smooth",
            });
        }

    };

    const handleDriverClick = (permanentNumber: number, driverId: string) => {
        if (!isDragMovement.current) {
            sessionStorage.setItem("selectedDriverNumber", permanentNumber.toString());
            sessionStorage.setItem("selectedDriverId", driverId);
            router.push('./driverdetails');
            console.log(`Driver clicked: Permanent Number: ${permanentNumber}, Driver ID: ${driverId}`);
        }
    };

  const handleConstructorClick = (constructorId: string) => {
    sessionStorage.setItem("selectedConstructorId", constructorId);
    router.push("./constructordetails");
    console.log(`Constructor with constructor id, ${constructorId}, clicked!`);
  };

    return (
        <SidebarLayout>
            {error && <p className={styles.error}>{error}</p>}

            {/* Drivers Display */}

            <div className={styles.drivers}>

                <div className={styles.header}>
                    <h1>DRIVERS</h1>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search driver..."
                            className={styles.searchInput}
                        />
                        <button onClick={handleSearch} className={styles.searchButton}>
                            Search
                        </button>
                        <button onClick={handleClearSearch} className={styles.clearButton}>
                            Clear
                        </button>
                    </div>
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
                                    onClick={() => handleDriverClick(driver.permanentNumber, driver.driverId)}
                                    highlight={driver.driverId === highlightedDriver}
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

                    {loadingConstructors ? (
                        <p>Loading constructors...</p>
                    ) : (
                            <>
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
                            </>
                    )}
                    
                </div>

                {/* Circuits Display */}

                <div className={styles.circuits}>
                    <div className={styles.header}>
                        <h1>CIRCUITS</h1>
                    </div>

                    {loadingCircuits ? (
                        <p>Loading circuits...</p>
                    ) : (
                            <>
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
                            </>
                    )}

                </div>

            </div>

        </SidebarLayout>

    );

}

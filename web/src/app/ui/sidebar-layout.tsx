"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import styles from "./sidebar-layout.module.css";
import ProfileButton from "./profile-button";
import { IdentityContext } from "../lib/context/identity";
import { useContext } from "react";
import Modal from "react-modal";
import HowToPlay from "../components/howto";
import Image from 'next/image';
import StyledLine from '../components/styledline';
import { useRouter } from 'next/navigation';

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
    const identity = useContext(IdentityContext);
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const handleReturnClick = () => {
        router.push('/');
    };

    return (

        <div className={styles.container}>

            <div className={styles.sidebar}>

                <div className={styles.logoWithLine}>

                    <div className={styles.logoContainer} onClick={handleReturnClick}>
                        <Image
                            src="/images/logo.svg"
                            alt="Overtake Logo"
                            width={50}
                            height={50}
                            className={styles.logoImage}
                            onClick={handleReturnClick}
                        />

                        <Link href="/" className={styles.logoLink}>
                            Overtake
                        </Link>
                    </div>

                    <StyledLine color='yellow' size='sidebar' />

                </div>

                <nav className={styles.nav}>

                    {/* Always visible links */}

                    <div className={styles.howToPlayButtonContainer}>

                        {!isOpen && (

                            <button
                                onClick={() => setIsOpen(true)}
                                className={styles.howToPlayButton}
                            >
                                <div className={styles.circle}></div>
                                <div className={styles.circle}></div>
                                <div className={styles.circle}></div>
                                <div className={styles.circle}></div>
                                <p>How To Play</p>
                            </button>

                        )}

                        <div className={styles.modalBackground}>

                            <Modal
                                isOpen={isOpen}
                                onRequestClose={() => setIsOpen(false)}
                                contentLabel="How to play"
                                className={styles.modalContainer}
                            >
                                <HowToPlay />
                                <button onClick={() => setIsOpen(false)}>Close</button>
                            </Modal>

                        </div>

                    </div>

                    <Link href="/races" className={styles.navItem}>
                        <span>RACES</span>
                    </Link>
                    <Link href="/livepos" className={styles.navItem}>
                        <span>LIVE POSITIONS</span>
                    </Link>


                    {/* Links visible only if the user is logged in */}

                    {identity?.sessionToken && (
                        <>
                            <Link href="/raceleague" className={styles.navItem}>
                                <span>RACE LEAGUE</span>
                            </Link>
                            <Link href="/formulalearn" className={styles.navItem}>
                                <span>FORMULALEARN</span>
                            </Link>
                            <Link href="/lastrace" className={styles.navItem}>
                                <span>LAST RACE</span>
                            </Link>
                            <Link href="/gamecomponent" className={styles.navItem}>
                                <span>CAPSTONE GAME</span>
                            </Link>
                        </>
                    )}

                </nav>

                <div className={styles.profileContainer}>
                    <ProfileButton />
                </div>

            </div>

            <div className="overflow-scroll bg-background w-4/5 p-4">{children}</div>

        </div>

    );

}

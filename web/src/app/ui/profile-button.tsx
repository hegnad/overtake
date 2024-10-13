"use client";

import { useRouter } from 'next/navigation';
import { useContext, useState } from "react";
import styles from "./profile-button.module.css";
import { IdentityContext } from "../lib/context/identity";

export default function ProfileButton() {
    const identity = useContext(IdentityContext);
    const [showButtons, setShowButtons] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        identity.setSessionToken(undefined);
        window.location.href = '/'; // Redirect after logout
    };

    const handleLoginClick = () => {
        console.log('Login button clicked!'); // Debugging
        router.push('/login'); // Programmatic navigation
    };

    const handleUsernameClick = () => {
        setShowButtons((prevShowButtons) => !prevShowButtons); // Toggle the buttons
    };

    return (
        <>
            {identity.sessionToken ? (
                <div className={styles.user}>
                    {showButtons && (
                        <div className={styles.buttonList}>
                            <button className={styles.actionButton}>Profile</button>
                            <button className={styles.actionButton}>Friends</button>
                            <button className={styles.actionButton}>Settings</button>
                            <button onClick={handleLogout} className={styles.actionButton}>
                                Logout
                            </button>
                        </div>
                    )}
                    {identity.accountInfo ? (
                        <button onClick={handleUsernameClick} className={styles.actionButton}>
                            {identity.accountInfo.username}
                        </button>
                    ) : (
                        <span>Loading...</span>
                    )}
                </div>
            ) : (
                <div className={styles.login}>
                    <button className={styles.actionButton} onClick={handleLoginClick}>
                        Signup/Login
                    </button>
                </div>
            )}
        </>
    );
}

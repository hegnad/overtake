"use client";

import { useRouter } from 'next/navigation';
import { useContext, useState } from "react";
import styles from "./profile-button.module.css";
import { IdentityContext } from "../lib/context/identity";
import FriendsList from '../components/friendsList';

export default function ProfileButton() {
    const identity = useContext(IdentityContext);
    const [showButtons, setShowButtons] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
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

    const handleFriendsClick = () => {
        setShowFriends((prevShowFriends) => !prevShowFriends);
        setShowButtons((prevShowButtons) => !prevShowButtons);
    }

    const handleProfileClick = () => {
        const currentUserId = identity.accountInfo?.userId;
        if (currentUserId) {
            sessionStorage.setItem("profileUserId", currentUserId.toString());
        }
        router.push('/profile')
    }

    return (
        <>
            {identity.sessionToken ? (
                <div className={styles.user}>
                    {showButtons && (
                        <div className={styles.buttonList}>
                            <button onClick={handleProfileClick} className={styles.actionButton}>
                                Profile
                            </button>
                            <button onClick={handleFriendsClick} className={styles.actionButton}>
                                Friends
                            </button>
                            <button className={styles.actionButton}>
                                Settings
                            </button>
                            <button onClick={handleLogout} className={styles.actionButton}>
                                Logout
                            </button>
                        </div>
                    )}
                    {showFriends && (
                        <div>
                            <FriendsList/>
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

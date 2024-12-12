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
    const [isButtonsVisible, setIsButtonsVisible] = useState(false); // Control for smooth close
    const [isFriendsVisible, setIsFriendsVisible] = useState(false);

    const router = useRouter();

    const handleLogout = () => {
        identity.setSessionToken(undefined);
        window.location.href = '/';
    };

    const handleLoginClick = () => {
        router.push('/login');
    };

    const handleUsernameClick = () => {
        if (!showButtons) {
            setIsButtonsVisible(true); // Make visible before opening
            setTimeout(() => setShowButtons(true), 10); // Add slight delay for smooth open
        } else {
            setShowButtons(false);
            setTimeout(() => setIsButtonsVisible(false), 300); // Wait for transition to complete
        }
        if (showFriends) {
            setShowFriends(false);
            setTimeout(() => setIsFriendsVisible(false), 300);
        }
    };

    const handleFriendsClick = () => {
        if (!showFriends) {
            setIsFriendsVisible(true);
            setTimeout(() => setShowFriends(true), 10);
        } else {
            setShowFriends(false);
            setTimeout(() => setIsFriendsVisible(false), 300);
        }
        if (showButtons) {
            setShowButtons(false);
            setTimeout(() => setIsButtonsVisible(false), 300);
        }
    };

    const handleProfileClick = () => {
        const currentUserId = identity.accountInfo?.userId;
        if (currentUserId) {
            sessionStorage.setItem("profileUserId", currentUserId.toString());
        }
        router.push('/profile');
    };

    return (
        <>
            {identity.sessionToken ? (
                <div className={styles.user}>
                    {isButtonsVisible && (
                        <div className={`${styles.buttonList} ${showButtons ? styles.show : ''}`}>
                            <button onClick={handleProfileClick} className={styles.actionButton}>
                                Profile
                            </button>
                            <button onClick={handleFriendsClick} className={styles.actionButton}>
                                Friends
                            </button>
                            <button onClick={handleLogout} className={styles.actionButton}>
                                Logout
                            </button>
                        </div>
                    )}
                    {isFriendsVisible && (
                        <div className={`${styles.friendsListContainer} ${showFriends ? styles.show : ''}`}>
                            <FriendsList />
                        </div>
                    )}
                    <button onClick={handleUsernameClick} className={styles.username}>
                        {identity.accountInfo?.username || 'Loading...'}
                    </button>
                </div>
            ) : (
                <div className={styles.login}>
                    <button className={styles.username} onClick={handleLoginClick}>
                        Signup/Login
                    </button>
                </div>
            )}
        </>
    );
}

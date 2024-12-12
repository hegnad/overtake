"use client";

import SidebarLayout from "../ui/sidebar-layout";
import { useEffect, useState, useContext } from "react";
import styles from "./editprofile.module.css";
import { IdentityContext } from "../lib/context/identity";
import { useRouter } from "next/navigation";

export default function EditProfile() {
    const identity = useContext(IdentityContext);
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/account/update-profile", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    username: username || undefined,
                    password: password || undefined,
                }),
            });

            if (response.ok) {
                setMessage("Profile updated successfully!");
                router.push("/");
            } else {
                const error = await response.json();
                setMessage(error.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("An error occurred.");
        }
    };

    return (

        <SidebarLayout>

            <div className={styles.editProfileContainer}>

                <h1>EDIT PROFILE</h1>

                <div className={styles.formContainer}>

                    <form onSubmit={handleSubmit}>

                        <div>
                            <label className={styles.formHeader}>First Name:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={styles.inputContainer}
                            />
                        </div>
                        <div>
                            <label className={styles.formHeader}>Last Name:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.inputContainer}
                            />
                        </div>
                        <div>
                            <label className={styles.formHeader}>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.inputContainer}
                            />
                        </div>
                        <div>
                            <label className={styles.formHeader}>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.inputContainer}
                            />
                        </div>

                        <button type="submit" className={styles.updateButton}>Update Profile</button>

                    </form>

                </div>

                {message && <p>{message}</p>}

            </div>

        </SidebarLayout>

    );

}
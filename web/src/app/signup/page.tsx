"use client";

import { MouseEvent, useContext, useState, useEffect } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import { IdentityContext } from "../lib/context/identity";
import { useRouter } from "next/navigation";
import { Session } from "../lib/models/session";
import SignupLoginTabs from "../ui/signup-login-tabs";

export default function Signup() {
  const router = useRouter();
  const identity = useContext(IdentityContext);

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    // Validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    useEffect(() => {
        // Validate form
        const isEmailValid = email ? emailRegex.test(email) : true;
        const isUsernameValid = username ? username.length > 5 : true;
        const isPasswordValid = password ? passwordRegex.test(password) : true;
        const areFieldsFilled =
            firstName && lastName && email && username && password && confirmPassword;

        // Set individual field errors
        setEmailError(email && !isEmailValid ? "Invalid email format." : null);
        setUsernameError(username && username.length <= 5 ? "Username must be longer than 5 characters." : null);
        setPasswordError(
            password && !isPasswordValid
                ? "Password must be at least 8 characters long, contain 1 number, and 1 special character."
                : null
        );
        setConfirmPasswordError(
            confirmPassword && confirmPassword !== password ? "Passwords do not match." : null
        );

        // Check overall form validity
        if (
            areFieldsFilled &&
            isEmailValid &&
            isUsernameValid &&
            isPasswordValid &&
            password === confirmPassword
        ) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [firstName, lastName, email, username, password, confirmPassword]);

    const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        try {
            const response = await fetch("http://localhost:8080/api/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            });

            if (response.status === 409) {
                const errorData = await response.json();
                setUsernameError(errorData.message); // Display backend-provided error
            } else if (response.status !== 200) {
                throw new Error("Failed to create account. Please try again.");
            } else {
                const session = (await response.json()) as Session;
                identity.setSessionToken(session.token);
                router.push("/");
            }
        } catch (error) {
            alert("error");
        }
    };

    return (
        <SidebarLayout>
            <div className="w-full h-full flex flex-col">
                <SignupLoginTabs isLoginActive={false} />
                <form className="flex flex-col rounded-2xl p-4 gap-4 bg-accent grow">
                    <div className="flex flex-col gap-2">
                        <p className="text-white">
                            <label>First Name:</label>
                        </p>
                        <input
                            className="px-2 py-1 rounded-lg bg-input max-w-sm"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-white">
                            <label>Last Name:</label>
                        </p>
                        <input
                            className="px-2 py-1 rounded-lg bg-input max-w-sm"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-white">
                            <label>Email Address:</label>
                        </p>
                        <input
                            className="px-2 py-1 rounded-lg bg-input max-w-sm"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500">{emailError}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-white">
                            <label>Username:</label>
                        </p>
                        <input
                            className="px-2 py-1 rounded-lg bg-input max-w-sm"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameError && <p className="text-red-500">{usernameError}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-white">
                            <label>Enter Password:</label>
                        </p>
                        <input
                            className="px-2 py-1 rounded-lg bg-input max-w-sm"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="text-red-500">{passwordError}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-white">
                            <label>Confirm Password:</label>
                        </p>
                        <input
                            className="px-2 py-1 rounded-lg bg-input max-w-sm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPasswordError && <p className="text-red-500">{confirmPasswordError}</p>}
                    </div>
                    <div>
                        <input
                            className={`px-4 py-2 ${isFormValid
                                    ? "bg-primary text-white cursor-pointer"
                                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                }`}
                            onClick={handleSubmit}
                            type="submit"
                            value="SIGN UP"
                            disabled={!isFormValid}
                        />
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}

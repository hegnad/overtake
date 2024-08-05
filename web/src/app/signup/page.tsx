"use client";

import { MouseEvent, useContext, useState } from "react";
import Link from "next/link";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./signup.module.css";
import { IdentityContext } from "../lib/context/identity";
import { useRouter } from "next/navigation";
import { Session } from "../lib/models/session";

export default function Signup() {
  const router = useRouter();

  const identity = useContext(IdentityContext);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();

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

    if (response.status !== 200) {
      // TODO: handle error on UI instead
      console.error(`non-successful status code: ${response.status}`);
    } else {
      const session = (await response.json()) as Session;
      identity.setSessionToken(session.token);

      router.push("/");
    }
  };

  return (
    <SidebarLayout>
      <Link href="/login">Login</Link>
      <div className={styles.container}>
        <form className={styles.form}>
          <div>
            <p>
              <label>First name:</label>
            </p>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </div>
          <div>
            <p>
              <label>Last name:</label>
            </p>
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <div>
            <p>
              <label>Email address:</label>
            </p>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <p>
              <label>Username:</label>
            </p>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <p>
              <label>Enter password:</label>
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <p>
              <label>Confirm password:</label>
            </p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          <input onClick={handleSubmit} type="submit" value="Sign Up" />
        </form>
      </div>
    </SidebarLayout>
  );
}

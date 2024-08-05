"use client";

import { MouseEvent, useContext, useState } from "react";
import Link from "next/link";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./login.module.css";
import { IdentityContext } from "../lib/context/identity";
import { useRouter } from "next/navigation";
import { Session } from "../lib/models/session";

export default function Login() {
  const router = useRouter();

  const identity = useContext(IdentityContext);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
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
      <Link href="/signup">Sign Up</Link>
      <div className={styles.container}>
        <form className={styles.form}>
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
          <input onClick={handleSubmit} type="submit" value="Login" />
        </form>
      </div>
    </SidebarLayout>
  );
}

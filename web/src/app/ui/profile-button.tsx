"use client";

import { useContext } from "react";
import styles from "./profile-button.module.css";
import { IdentityContext } from "../lib/context/identity";
import Link from "next/link";

export default function ProfileButton() {
  const identity = useContext(IdentityContext);

  return (
    <>
      {identity.sessionToken ? (
        <div className={styles.user}>
          {identity.accountInfo ? (
            <span>{identity.accountInfo.username}</span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      ) : (
        <div className={styles.login}>
          <Link className={styles.loginLink} href="/login">
            Signup/Login
          </Link>
        </div>
      )}
    </>
  );
}

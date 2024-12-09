"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import styles from "./sidebar-layout.module.css";
import ProfileButton from "./profile-button";
import { IdentityContext } from "../lib/context/identity";
import { useContext } from "react";
import Modal from "react-modal";
import HowToPlay from "../components/howto";

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const identity = useContext(IdentityContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img
            src="/images/logo.svg"
            alt="Overtake Logo"
            className={styles.logoImage}
          />
          <Link href="/" className={styles.logoLink}>
            Overtake
          </Link>
        </div>
        <div>
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="relative border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-14 w-56 rounded-md bg-sky-800 p-2 flex justify-center items-center font-extrabold"
            >
              <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
              <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
              <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
              <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
              <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
              <p className="z-10">How To Play</p>
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
        <nav className={styles.nav}>
          {/* Always visible links */}
          <Link href="/races" className={styles.navItem}>
            RACES
          </Link>
          <Link href="/livepos" className={styles.navItem}>
            LIVE POSITIONS
          </Link>

          {/* Links visible only if the user is logged in */}
          {identity?.sessionToken && (
            <>
              <Link href="/raceleague" className={styles.navItem}>
                RACE LEAGUE
              </Link>
              <Link href="/formulalearn" className={styles.navItem}>
                FORMULALEARN
              </Link>
              <Link href="/lastrace" className={styles.navItem}>
                LAST RACE
              </Link>
              <Link href="/gamecomponent" className={styles.navItem}>
                CAPSTONE GAME
              </Link>
            </>
          )}
        </nav>
        <ProfileButton />
      </div>
      <div className="overflow-scroll bg-background w-4/5 p-4">{children}</div>
    </div>
  );
}

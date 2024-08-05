import { ReactNode } from "react";
import Link from "next/link";
import styles from "./sidebar-layout.module.css";
import ProfileButton from "./profile-button";

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
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
        <nav className={styles.nav}>
          <Link href="/races" className={styles.navItem}>
            Races
          </Link>
          <Link href="/raceleague" className={styles.navItem}>
            Race League
          </Link>
          <Link href="/formulalearn" className={styles.navItem}>
            FormulaLearn
          </Link>
        </nav>
        <ProfileButton />
      </div>
      <div className={styles.main}>{children}</div>
    </div>
  );
}

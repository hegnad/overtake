"use client";

import OpenF1 from "../utils/api/openF1";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "../home.module.css";

export default function LiveRace() {
  return (
    <SidebarLayout>
      <div className={styles.driversResults}>
        <h1>Live Race</h1>
        <OpenF1 />
      </div>
    </SidebarLayout>
  );
}

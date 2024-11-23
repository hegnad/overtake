import React from "react";
import styles from "./hamster.module.css";

export default function HamsterLoader() {
  return (
    <div className={styles.loader}>
      <div className={styles.hamster}>
        <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
}

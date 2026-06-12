import React from "react";
import styles from "./Loader.module.scss";

interface LoaderProps {
  type?: "spinner" | "skeleton" | "page";
}

export const Loader: React.FC<LoaderProps> = ({ type = "spinner" }) => {
  if (type === "page") {
    return (
      <div className={styles.pageLoader}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>Loading Studio Store...</p>
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className={styles.skeletonCard}>
            <div className={styles.imagePlaceholder}></div>
            <div className={styles.lineShort}></div>
            <div className={styles.lineMedium}></div>
            <div className={styles.lineTiny}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

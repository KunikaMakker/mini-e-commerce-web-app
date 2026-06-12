import React from "react";
import { AlertCircle } from "lucide-react";
import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "We encountered a small problem loading this store. Please verify your connection.",
  onRetry,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <AlertCircle className={styles.icon} size={36} />
        <h2 className={styles.title}>Something Went Wrong</h2>
        <p className={styles.message}>{message}</p>
        
        {onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

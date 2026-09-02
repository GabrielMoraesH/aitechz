"use client";

import { Toaster } from "sonner";
import styles from "./AppToaster.module.css";

function ToastIcon({ type }: { type: "success" | "error" | "warning" | "info" }) {
  const symbols = { success: "✓", error: "!", warning: "!", info: "i" } as const;
  return <span className={`${styles.icon} ${styles[type]}`} aria-hidden="true">{symbols[type]}</span>;
}

export function AppToaster() {
  return <Toaster
    position="top-right"
    closeButton
    gap={10}
    icons={{
      success: <ToastIcon type="success" />,
      error: <ToastIcon type="error" />,
      warning: <ToastIcon type="warning" />,
      info: <ToastIcon type="info" />,
    }}
    toastOptions={{
      classNames: {
        toast: styles.toast,
        content: styles.content,
        title: styles.title,
        description: styles.description,
        closeButton: styles.closeButton,
      },
    }}
  />;
}

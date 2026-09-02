"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import styles from "./ConfirmDialog.module.css";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  pending?: boolean;
  pendingLabel?: string;
  variant?: "default" | "danger";
  triggerRef?: RefObject<HTMLElement | null>;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel = "Cancelar", pending = false, pendingLabel, variant = "default", triggerRef, onConfirm, onCancel }: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef?.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onCancel();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); trigger?.focus(); };
  }, [open, onCancel, pending, triggerRef]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(<div className={styles.layer}>
    <button type="button" className={styles.backdrop} aria-label="Cancelar e fechar diálogo" disabled={pending} onClick={onCancel} />
    <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1}>
      <div className={`${styles.marker} ${variant === "danger" ? styles.dangerMarker : ""}`} aria-hidden="true">!</div>
      <div className={styles.copy}><h2 id={titleId}>{title}</h2><p id={descriptionId}>{description}</p></div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancel} disabled={pending} onClick={onCancel}>{cancelLabel}</button>
        <button type="button" className={variant === "danger" ? styles.danger : styles.confirm} disabled={pending} onClick={onConfirm}>{pending ? (pendingLabel ?? "Aguarde...") : confirmLabel}</button>
      </div>
    </div>
  </div>, document.body);
}

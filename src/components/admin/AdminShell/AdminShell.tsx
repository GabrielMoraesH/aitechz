"use client";
import { Suspense, type ReactNode } from "react";
import { useEffect, useState } from "react";
import type { AdminUser } from "@/server/services/sessionService";
import { AdminSidebar } from "@/components/admin/AdminSidebar/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar/AdminTopbar";
import { ToastFeedback } from "@/components/admin/ToastFeedback/ToastFeedback";
import styles from "./AdminShell.module.css";
export function AdminShell({ children, user }: { children: ReactNode; user: AdminUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false); window.addEventListener("keydown", closeOnEscape); return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", closeOnEscape); }; }, [menuOpen]);
  return <div className={styles.shell}><Suspense fallback={null}><ToastFeedback /></Suspense><div className={styles.desktopSidebar}><AdminSidebar role={user.role} /></div><div className={styles.workspace}><AdminTopbar user={user} onMenuClick={() => setMenuOpen(true)} menuOpen={menuOpen} /><main className={styles.content}>{children}</main></div>{menuOpen && <div className={styles.mobileLayer}><button type="button" className={styles.overlay} aria-label="Fechar menu" onClick={() => setMenuOpen(false)} /><div id="admin-mobile-sidebar" className={styles.drawer}><AdminSidebar role={user.role} mobile onClose={() => setMenuOpen(false)} /></div></div>}</div>;
}

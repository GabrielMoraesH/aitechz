import type { UserRole } from "@prisma/client";
import Image from "next/image";
import { AdminIcon } from "@/components/admin/AdminIcons";
import { AdminNav } from "@/components/admin/AdminNav/AdminNav";
import styles from "./AdminSidebar.module.css";
export function AdminSidebar({ role, mobile, onClose }: { role: UserRole; mobile?: boolean; onClose?: () => void }) {
  return <aside className={styles.sidebar} aria-label="Menu administrativo"><div className={styles.brand}><Image src="/brand/logo-horizontal.png" alt="Aitechz" width={180} height={60} priority />{mobile && <button autoFocus type="button" onClick={onClose} className={styles.close} aria-label="Fechar menu"><AdminIcon name="close" /></button>}</div><AdminNav role={role} onNavigate={onClose} /><div className={styles.footer}><span>Área administrativa</span><small>Aitechz</small></div></aside>;
}

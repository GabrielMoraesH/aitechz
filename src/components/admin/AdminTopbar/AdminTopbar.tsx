import type { AdminUser } from "@/server/services/sessionService";
import { AdminIcon } from "@/components/admin/AdminIcons";
import { getRoleLabel } from "@/lib/auth";
import { logoutAction } from "@/server/actions/authActions";
import styles from "./AdminTopbar.module.css";
function getInitials(name: string) { const parts = name.trim().split(/\s+/).filter(Boolean); return `${parts[0]?.[0] ?? "A"}${parts.length > 1 ? parts.at(-1)?.[0] ?? "" : ""}`.toUpperCase(); }
export function AdminTopbar({ user, onMenuClick, menuOpen }: { user: AdminUser; onMenuClick: () => void; menuOpen: boolean }) {
  return <header className={styles.topbar}><div className={styles.context}><button type="button" onClick={onMenuClick} className={styles.menu} aria-label="Abrir menu" aria-expanded={menuOpen} aria-controls="admin-mobile-sidebar"><AdminIcon name="menu" /></button><div><span>Administração</span><strong>Painel Aitechz</strong></div></div><div className={styles.actions}><div className={styles.avatar} aria-hidden="true">{getInitials(user.name)}</div><div className={styles.user}><strong>{user.name}</strong><span>{getRoleLabel(user.role)}</span></div><form action={logoutAction}><button type="submit" className={styles.logout}><AdminIcon name="logout"/><span>Sair</span></button></form></div></header>;
}

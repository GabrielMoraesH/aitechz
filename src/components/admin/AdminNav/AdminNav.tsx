"use client";
import type { UserRole } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcons";
import styles from "./AdminNav.module.css";

const items: { href: string; label: string; icon: AdminIconName; ownerOnly?: boolean }[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" }, { href: "/admin/produtos", label: "Produtos", icon: "products" }, { href: "/admin/categorias", label: "Categorias", icon: "categories" }, { href: "/admin/ofertas", label: "Ofertas", icon: "offers" }, { href: "/admin/usuarios", label: "Usuários", icon: "users", ownerOnly: true }, { href: "/admin/configuracoes", label: "Configurações", icon: "settings", ownerOnly: true },
];
export function AdminNav({ role, onNavigate }: { role: UserRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav aria-label="Navegação administrativa" className={styles.nav}><span className={styles.label}>Menu principal</span><ul>{items.filter((item) => !item.ownerOnly || role === "OWNER").map((item) => { const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href); return <li key={item.href}><Link href={item.href} onNavigate={onNavigate} className={active ? styles.active : undefined} aria-current={active ? "page" : undefined}><AdminIcon name={item.icon}/><span>{item.label}</span></Link></li>; })}</ul></nav>;
}

import type { UserRole } from "@prisma/client";
import Link from "next/link";
import { UserActiveForm } from "@/components/admin/UserActiveForm/UserActiveForm";
import { getRoleLabel } from "@/lib/auth";
import { formatAdminDate } from "@/lib/productFormat";
import { toggleUserActiveAction } from "@/server/actions/adminUserActions";
import { requireRole } from "@/server/services/sessionService";
import { userService } from "@/server/services/userService";
import styles from "./Users.module.css";

const PAGE_SIZE = 20;
type SearchParams = { page?: string; search?: string; status?: string; role?: string; created?: string; updated?: string; deactivated?: string; reactivated?: string; error?: string };
function pageHref(params: SearchParams, page: number) { const query = new URLSearchParams(); for (const key of ["search", "status", "role"] as const) if (params[key]) query.set(key, params[key]); query.set("page", String(page)); return `/admin/usuarios?${query}`; }

export default async function UsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireRole(["OWNER"]); const params = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const active = params.status === "active" ? true : params.status === "inactive" ? false : undefined;
  const role: UserRole | undefined = params.role === "OWNER" || params.role === "EMPLOYEE" ? params.role : undefined;
  const filters = { page: requestedPage, pageSize: PAGE_SIZE, search: params.search?.trim() || undefined, active, role };
  let result = await userService.listAdmin(filters); const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE)); const page = Math.min(requestedPage, totalPages); if (page !== requestedPage) result = await userService.listAdmin({ ...filters, page });
  return <section className={styles.page}><header className={styles.heading}><div><span>Painel administrativo</span><h1>Usuários</h1><p>Gerencie os acessos administrativos da Aitechz.</p></div><Link href="/admin/usuarios/novo" className={styles.primary}>Novo funcionário</Link></header>
    <form className={styles.filters} method="get"><label className={styles.search}><span>Buscar usuários</span><input name="search" type="search" defaultValue={params.search} placeholder="Nome ou email" /></label><label><span>Status</span><select name="status" defaultValue={params.status ?? ""}><option value="">Todos</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select></label><label><span>Perfil</span><select name="role" defaultValue={params.role ?? ""}><option value="">Todos</option><option value="OWNER">Proprietários</option><option value="EMPLOYEE">Funcionários</option></select></label><button>Filtrar</button><Link href="/admin/usuarios" className={styles.clear}>Limpar</Link></form>
    {!result.items.length ? <div className={styles.empty}><h2>Nenhum usuário encontrado</h2><p>Ajuste os filtros ou cadastre um funcionário.</p></div> : <><div className={styles.tableCard}><div className={styles.tableScroll}><table><thead><tr><th>Usuário</th><th>Perfil</th><th>Status</th><th>Criado em</th><th>Atualizado em</th><th>Ações</th></tr></thead><tbody>{result.items.map((user) => <tr key={user.id}><td><div className={styles.user}><strong>{user.name}</strong><span>{user.email}</span></div></td><td><span className={`${styles.badge} ${styles.role}`}>{getRoleLabel(user.role)}</span></td><td><span className={`${styles.badge} ${user.active ? styles.active : styles.inactive}`}>{user.active ? "Ativo" : "Inativo"}</span></td><td className={styles.date}>{formatAdminDate(user.createdAt)}</td><td className={styles.date}>{formatAdminDate(user.updatedAt)}</td><td><div className={styles.rowActions}><Link href={`/admin/usuarios/${user.id}/editar`}>Editar</Link>{user.role === "EMPLOYEE" && <UserActiveForm active={user.active} action={toggleUserActiveAction.bind(null, user.id)} className={`${styles.toggle} ${user.active ? styles.deactivate : styles.reactivate}`} />}</div></td></tr>)}</tbody></table></div></div><nav className={styles.pagination}><span>{result.total} {result.total === 1 ? "usuário" : "usuários"}</span><div>{page > 1 ? <Link href={pageHref(params, page - 1)}>Anterior</Link> : <span>Anterior</span>}<strong>Página {page} de {totalPages}</strong>{page < totalPages ? <Link href={pageHref(params, page + 1)}>Próxima</Link> : <span>Próxima</span>}</div></nav></>}
  </section>;
}

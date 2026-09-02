import Link from "next/link";
import { CategoryActiveForm } from "@/components/admin/CategoryActiveForm/CategoryActiveForm";
import { formatAdminDate } from "@/lib/productFormat";
import { toggleCategoryActiveAction } from "@/server/actions/adminCategoryActions";
import { categoryService } from "@/server/services/categoryService";
import styles from "./Categories.module.css";

const PAGE_SIZE = 20;
type SearchParams = { page?: string; search?: string; status?: string; created?: string; updated?: string; deactivated?: string; reactivated?: string };

function buildHref(params: SearchParams, page: number) {
  const query = new URLSearchParams();
  for (const key of ["search", "status"] as const) if (params[key]) query.set(key, params[key]);
  query.set("page", String(page));
  return `/admin/categorias?${query}`;
}

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const active = params.status === "active" ? true : params.status === "inactive" ? false : undefined;
  const filters = { page: requestedPage, pageSize: PAGE_SIZE, search: params.search?.trim() || undefined, active };
  let result = await categoryService.listAdmin(filters);
  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  if (page !== requestedPage) result = await categoryService.listAdmin({ ...filters, page });

  return <section className={styles.page}>
    <header className={styles.heading}><div><span>Painel administrativo</span><h1>Categorias</h1><p>Organize as categorias utilizadas no catálogo.</p></div><Link href="/admin/categorias/nova" className={styles.primary}>Nova categoria</Link></header>
    <form className={styles.filters} method="get">
      <label className={styles.search}><span>Buscar categorias</span><input type="search" name="search" defaultValue={params.search} placeholder="Nome ou slug" /></label>
      <label><span>Status</span><select name="status" defaultValue={params.status ?? ""}><option value="">Todas</option><option value="active">Ativas</option><option value="inactive">Inativas</option></select></label>
      <button type="submit">Filtrar</button><Link href="/admin/categorias" className={styles.clear}>Limpar</Link>
    </form>
    {!result.items.length ? <div className={styles.empty}><div className={styles.placeholder} aria-hidden="true" /><h2>Nenhuma categoria cadastrada</h2><p>Cadastre a primeira categoria para organizar os produtos.</p><Link href="/admin/categorias/nova" className={styles.primary}>Nova categoria</Link></div> : <>
      <div className={styles.tableCard}><div className={styles.tableScroll}><table><thead><tr><th>Categoria</th><th>Status</th><th>Produtos</th><th>Atualizado em</th><th>Ações</th></tr></thead><tbody>{result.items.map((category) => <tr key={category.id}>
        <td><div className={styles.category}><strong>{category.name}</strong><span>{category.slug}</span><small>Criado: {category.createdByName ?? "—"}</small></div></td><td><span className={`${styles.badge} ${category.active ? styles.active : styles.inactive}`}>{category.active ? "Ativa" : "Inativa"}</span></td><td>{category.productCount}</td><td className={styles.date}><span>{formatAdminDate(category.updatedAt)}</span><small>{category.updatedByName ?? "—"}</small></td>
        <td><div className={styles.rowActions}><Link href={`/admin/categorias/${category.id}/editar`}>Editar</Link><CategoryActiveForm active={category.active} action={toggleCategoryActiveAction.bind(null, category.id, category.active)} className={`${styles.toggle} ${category.active ? styles.deactivate : styles.reactivate}`} /></div></td>
      </tr>)}</tbody></table></div></div>
      <nav className={styles.pagination} aria-label="Paginação de categorias"><span>{result.total} {result.total === 1 ? "categoria" : "categorias"}</span><div>{page > 1 ? <Link href={buildHref(params, page - 1)}>Anterior</Link> : <span aria-disabled="true">Anterior</span>}<strong>Página {page} de {totalPages}</strong>{page < totalPages ? <Link href={buildHref(params, page + 1)}>Próxima</Link> : <span aria-disabled="true">Próxima</span>}</div></nav>
    </>}
  </section>;
}

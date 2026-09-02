import Image from "next/image";
import Link from "next/link";
import { RemoveOfferForm } from "@/components/admin/RemoveOfferForm/RemoveOfferForm";
import { formatAdminDate, formatBRL } from "@/lib/productFormat";
import { removeProductPromotionAction } from "@/server/actions/adminOfferActions";
import { offerService } from "@/server/services/offerService";
import styles from "./Offers.module.css";

const PAGE_SIZE = 20;
type SearchParams = { page?: string; search?: string; offer?: string; status?: string; category?: string; added?: string; updated?: string; removed?: string };
function buildHref(params: SearchParams, page: number) {
  const query = new URLSearchParams();
  for (const key of ["search", "offer", "status", "category"] as const) if (params[key]) query.set(key, params[key]);
  query.set("page", String(page)); return `/admin/ofertas?${query}`;
}

export default async function OffersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const filters = { page: requestedPage, pageSize: PAGE_SIZE, search: params.search?.trim() || undefined, offered: params.offer === "yes" ? true : params.offer === "no" ? false : undefined, active: params.status === "active" ? true : params.status === "inactive" ? false : undefined, categoryId: params.category || undefined };
  const categories = await offerService.getFilterCategories();
  let result = await offerService.listAdmin(filters);
  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE)); const page = Math.min(requestedPage, totalPages);
  if (page !== requestedPage) result = await offerService.listAdmin({ ...filters, page });

  return <section className={styles.page}>
    <header className={styles.heading}><span>Painel administrativo</span><h1>Ofertas</h1><p>Gerencie preços promocionais dos produtos.</p></header>
    <form className={styles.filters} method="get">
      <label className={styles.search}><span>Buscar produtos</span><input type="search" name="search" defaultValue={params.search} placeholder="Nome, marca ou slug" /></label>
      <label><span>Oferta</span><select name="offer" defaultValue={params.offer ?? ""}><option value="">Todas</option><option value="yes">Em oferta</option><option value="no">Sem oferta</option></select></label>
      <label><span>Status</span><select name="status" defaultValue={params.status ?? ""}><option value="">Todos</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select></label>
      <label><span>Categoria</span><select name="category" defaultValue={params.category ?? ""}><option value="">Todas</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <button type="submit">Filtrar</button><Link href="/admin/ofertas" className={styles.clear}>Limpar</Link>
    </form>
    {!result.items.length ? <div className={styles.empty}><div className={styles.placeholder} aria-hidden="true" /><h2>{params.offer === "yes" ? "Nenhum produto está em oferta no momento." : "Nenhum produto disponível."}</h2>{Boolean(params.search || params.offer || params.status || params.category) && <p>Ajuste ou limpe os filtros para tentar novamente.</p>}</div> : <>
      <div className={styles.tableCard}><div className={styles.tableScroll}><table><thead><tr><th>Produto</th><th>Categoria</th><th>Preço normal</th><th>Preço promocional</th><th>Status</th><th>Atualizado em</th><th>Ações</th></tr></thead><tbody>{result.items.map((product) => <tr key={product.id}>
        <td><div className={styles.product}>{product.primaryImage ? <div className={styles.productImage}><Image src={product.primaryImage.url} alt={product.primaryImage.alt} fill sizes="40px" /></div> : <div className={styles.productPlaceholder} aria-hidden="true" />}<div><strong>{product.name}</strong><span>{product.brand}</span><small>Criado: {product.createdByName ?? "—"}</small></div></div></td>
        <td className={styles.category}>{product.categoryName}</td>
        <td className={styles.money}>{product.price ? <strong>{formatBRL(product.price)}</strong> : <span className={styles.muted}>Sem preço</span>}</td>
        <td className={styles.money}>{product.promotionalPrice ? <strong className={styles.promotion}>{formatBRL(product.promotionalPrice)}</strong> : <span className={styles.muted}>Sem oferta</span>}</td>
        <td><span className={`${styles.badge} ${product.active ? styles.active : styles.inactive}`}>{product.active ? "Ativo" : "Inativo"}</span></td>
        <td className={styles.date}><span>{formatAdminDate(product.updatedAt)}</span><small>{product.updatedByName ?? "—"}</small></td>
        <td><div className={styles.rowActions}><Link href={`/admin/ofertas/${product.id}`} title={product.promotionalPrice ? undefined : "Adicionar oferta"}>{product.promotionalPrice ? "Editar" : "Add oferta"}</Link>{product.promotionalPrice && <RemoveOfferForm action={removeProductPromotionAction.bind(null, product.id)} className={styles.remove} />}<Link href={`/admin/produtos/${product.id}/editar`} className={styles.secondary} title="Editar produto">Produto</Link></div></td>
      </tr>)}</tbody></table></div></div>
      <nav className={styles.pagination} aria-label="Paginação de ofertas"><span>{result.total} {result.total === 1 ? "produto" : "produtos"}</span><div>{page > 1 ? <Link href={buildHref(params, page - 1)}>Anterior</Link> : <span aria-disabled="true">Anterior</span>}<strong>Página {page} de {totalPages}</strong>{page < totalPages ? <Link href={buildHref(params, page + 1)}>Próxima</Link> : <span aria-disabled="true">Próxima</span>}</div></nav>
    </>}
  </section>;
}

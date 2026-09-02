import Link from "next/link";
import Image from "next/image";
import type { ProductCondition } from "@prisma/client";
import { ProductActiveForm } from "@/components/admin/ProductActiveForm/ProductActiveForm";
import { formatAdminDate, formatBRL, PRODUCT_CONDITION_LABELS } from "@/lib/productFormat";
import { toggleProductActiveAction } from "@/server/actions/adminProductActions";
import { productService } from "@/server/services/productService";
import styles from "./Products.module.css";

const PAGE_SIZE = 20;
type SearchParams = { page?: string; search?: string; status?: string; condition?: string; category?: string; created?: string; updated?: string; deactivated?: string; reactivated?: string };
function buildHref(params: SearchParams, page: number) {
  const query = new URLSearchParams();
  for (const key of ["search", "status", "condition", "category"] as const) if (params[key]) query.set(key, params[key]);
  query.set("page", String(page)); return `/admin/produtos?${query}`;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const active = params.status === "active" ? true : params.status === "inactive" ? false : undefined;
  const condition: ProductCondition | undefined = params.condition === "NEW" || params.condition === "USED" ? params.condition : undefined;
  const categories = await productService.getAdminFilterCategories();
  const filters = { page: requestedPage, pageSize: PAGE_SIZE, search: params.search?.trim() || undefined, active, condition, categoryId: params.category || undefined };
  let result = await productService.listAdmin(filters);
  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE)); const page = Math.min(requestedPage, totalPages);
  if (page !== requestedPage) result = await productService.listAdmin({ ...filters, page });
  return <section className={styles.page}>
    <header className={styles.heading}><div><span>Painel administrativo</span><h1>Produtos</h1><p>Gerencie os produtos exibidos pela Aitechz.</p></div><Link href="/admin/produtos/novo" className={styles.primary}>Novo produto</Link></header>
    <form className={styles.filters} method="get">
      <label className={styles.search}><span>Buscar produtos</span><input type="search" name="search" defaultValue={params.search} placeholder="Nome ou marca" /></label>
      <label><span>Status</span><select name="status" defaultValue={params.status ?? ""}><option value="">Todos</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select></label>
      <label><span>Condição</span><select name="condition" defaultValue={params.condition ?? ""}><option value="">Todas</option><option value="NEW">Novo</option><option value="USED">Seminovo</option></select></label>
      <label><span>Categoria</span><select name="category" defaultValue={params.category ?? ""}><option value="">Todas</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <button type="submit">Filtrar</button><Link href="/admin/produtos" className={styles.clear}>Limpar</Link>
    </form>
    {!result.items.length ? <div className={styles.empty}><div className={styles.placeholder} aria-hidden="true" /><h2>Nenhum produto cadastrado</h2><p>Cadastre o primeiro produto para começar a montar o catálogo.</p><Link href="/admin/produtos/novo" className={styles.primary}>Novo produto</Link></div> : <>
      <div className={styles.tableCard}><div className={styles.tableScroll}><table><thead><tr><th>Produto</th><th>Categoria</th><th>Condição</th><th>Preço</th><th>Status</th><th>Destaque</th><th>Atualizado em</th><th>Ações</th></tr></thead><tbody>{result.items.map((product) => <tr key={product.id}>
        <td><div className={styles.product}>{product.primaryImage ? <div className={styles.productImage}><Image src={product.primaryImage.url} alt={product.primaryImage.alt} fill sizes="40px" /></div> : <div className={styles.productPlaceholder} aria-hidden="true" />}<div><strong>{product.name}</strong><span>{product.brand}</span><small>Criado: {product.createdByName ?? "—"}</small></div></div></td><td className={styles.category}>{product.categoryName}</td><td>{PRODUCT_CONDITION_LABELS[product.condition]}</td>
        <td>{product.price === null ? <strong>Consultar</strong> : product.promotionalPrice ? <div className={styles.price}><strong>{formatBRL(product.promotionalPrice)}</strong><span>{formatBRL(product.price)}</span></div> : <strong>{formatBRL(product.price)}</strong>}</td>
        <td><span className={`${styles.badge} ${product.active ? styles.active : styles.inactive}`}>{product.active ? "Ativo" : "Inativo"}</span></td><td>{product.featured ? <span className={`${styles.badge} ${styles.featured}`}>Destaque</span> : <span className={styles.muted}>Não</span>}</td><td className={styles.date}><span>{formatAdminDate(product.updatedAt)}</span><small>{product.updatedByName ?? "—"}</small></td>
        <td><div className={styles.rowActions}><Link href={`/admin/produtos/${product.id}/editar`}>Editar</Link><ProductActiveForm active={product.active} action={toggleProductActiveAction.bind(null, product.id, product.active)} className={`${styles.toggle} ${product.active ? styles.deactivate : styles.reactivate}`} /></div></td>
      </tr>)}</tbody></table></div></div>
      <nav className={styles.pagination} aria-label="Paginação de produtos"><span>{result.total} {result.total === 1 ? "produto" : "produtos"}</span><div>{page > 1 ? <Link href={buildHref(params, page - 1)}>Anterior</Link> : <span aria-disabled="true">Anterior</span>}<strong>Página {page} de {totalPages}</strong>{page < totalPages ? <Link href={buildHref(params, page + 1)}>Próxima</Link> : <span aria-disabled="true">Próxima</span>}</div></nav>
    </>}
  </section>;
}

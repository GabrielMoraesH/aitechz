import Image from "next/image";
import Link from "next/link";
import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcons";
import { getRoleLabel } from "@/lib/auth";
import { formatAdminDate } from "@/lib/productFormat";
import type { AdminDashboardDTO } from "@/server/services/adminDashboardService";
import type { AdminUser } from "@/server/services/sessionService";
import styles from "./AdminDashboard.module.css";

type ManagementSection = { href: string; title: string; description: string; icon: AdminIconName; ownerOnly?: boolean };
const sections: ManagementSection[] = [
  { href: "/admin/produtos", title: "Produtos", description: "Gerencie o catálogo da loja.", icon: "products" },
  { href: "/admin/categorias", title: "Categorias", description: "Organize os produtos por categoria.", icon: "categories" },
  { href: "/admin/ofertas", title: "Ofertas", description: "Prepare promoções e destaques.", icon: "offers" },
  { href: "/admin/usuarios", title: "Usuários", description: "Controle os acessos administrativos.", icon: "users", ownerOnly: true },
  { href: "/admin/configuracoes", title: "Configurações", description: "Atualize os dados públicos da loja.", icon: "settings", ownerOnly: true },
];
type Metric = { label: string; value: number; href: string; icon: AdminIconName; helper: string };

export function AdminDashboard({ user, dashboard }: { user: AdminUser; dashboard: AdminDashboardDTO }) {
  const isOwner = user.role === "OWNER";
  const visibleSections = sections.filter((section) => !section.ownerOnly || isOwner);
  const firstName = user.name.trim().split(/\s+/)[0] || "Admin";
  const metrics: Metric[] = [
    { label: "Produtos ativos", value: dashboard.metrics.activeProducts, href: "/admin/produtos?status=active", icon: "products", helper: "Disponíveis no catálogo" },
    { label: "Produtos inativos", value: dashboard.metrics.inactiveProducts, href: "/admin/produtos?status=inactive", icon: "products", helper: "Fora do catálogo" },
    { label: "Categorias ativas", value: dashboard.metrics.activeCategories, href: "/admin/categorias?status=active", icon: "categories", helper: "Disponíveis para organização" },
    { label: "Produtos em oferta", value: dashboard.metrics.offers, href: "/admin/ofertas?offer=yes", icon: "offers", helper: "Com preço promocional" },
    { label: "Produtos em destaque", value: dashboard.metrics.featuredProducts, href: "/admin/produtos", icon: "dashboard", helper: "Ativos e destacados" },
    ...(dashboard.metrics.activeUsers === undefined ? [] : [{ label: "Usuários ativos", value: dashboard.metrics.activeUsers, href: "/admin/usuarios?status=active", icon: "users" as const, helper: "Com acesso administrativo" }]),
  ];
  const attentionItems = [
    { value: dashboard.attention.productsWithoutImages, title: "Produtos sem imagem", text: (value: number) => `${value} ${value === 1 ? "produto ativo está" : "produtos ativos estão"} sem imagem.` },
    { value: dashboard.attention.productsWithoutPrice, title: "Produtos sem preço", text: (value: number) => `${value} ${value === 1 ? "produto ativo está" : "produtos ativos estão"} sem preço definido.` },
    { value: dashboard.attention.categoriesWithoutProducts, title: "Categorias sem produtos", text: (value: number) => `${value} ${value === 1 ? "categoria ativa ainda não possui" : "categorias ativas ainda não possuem"} produtos.` },
  ].filter((item) => item.value > 0);

  return <div className={styles.dashboard}>
    <header className={styles.heading}><span>Painel administrativo</span><h1>Dashboard</h1><p>Visão geral da administração da Aitechz.</p></header>
    <section className={styles.welcome} aria-labelledby="welcome-title"><div><span>Bem-vindo</span><h2 id="welcome-title">Olá, {firstName}</h2><p>Bem-vindo ao painel administrativo da Aitechz.</p></div><p>Perfil: <strong>{getRoleLabel(user.role)}</strong></p></section>
    <section aria-labelledby="overview-title"><div className={styles.sectionHeading}><h2 id="overview-title">Visão geral</h2><p>Indicadores atuais da operação.</p></div><div className={styles.metrics}>{metrics.map((metric) => <Link key={metric.label} href={metric.href} className={styles.metric}><span className={styles.metricIcon}><AdminIcon name={metric.icon} /></span><strong>{metric.value}</strong><h3>{metric.label}</h3><p>{metric.helper}</p></Link>)}</div></section>
    <section aria-labelledby="management-title"><div className={styles.sectionHeading}><h2 id="management-title">Gerenciamento</h2><p>Acesse as principais áreas da administração.</p></div><div className={styles.cards}>{visibleSections.map((section) => <Link key={section.href} href={section.href} className={styles.card}><span className={styles.cardIcon}><AdminIcon name={section.icon} /></span><div><h3>{section.title}</h3><p>{section.description}</p></div><AdminIcon name="arrow" className={styles.arrow} /></Link>)}</div></section>
    <section aria-labelledby="attention-title"><div className={styles.sectionHeading}><h2 id="attention-title">Atenção necessária</h2><p>Pontos do catálogo que podem merecer uma revisão.</p></div>{attentionItems.length ? <div className={styles.attentionList}>{attentionItems.map((item) => <article key={item.title} className={styles.attentionItem}><span>{item.value}</span><div><h3>{item.title}</h3><p>{item.text(item.value)}</p></div></article>)}</div> : <div className={styles.allClear}><span aria-hidden="true">✓</span><div><h3>Tudo certo por aqui.</h3><p>Não há pendências relevantes no catálogo.</p></div></div>}</section>
    <section aria-labelledby="recent-title"><div className={styles.sectionHeading}><h2 id="recent-title">Últimos produtos atualizados</h2><p>Os cinco registros modificados mais recentemente.</p></div>{dashboard.recentProducts.length ? <div className={styles.recentList}>{dashboard.recentProducts.map((product) => <article key={product.id} className={styles.recentProduct}><div className={styles.thumbnail}>{product.primaryImage ? <Image src={product.primaryImage.url} alt={product.primaryImage.alt} fill sizes="48px" /> : <AdminIcon name="products" />}</div><div className={styles.productIdentity}><strong>{product.name}</strong><span>{product.categoryName}</span></div><span className={`${styles.badge} ${product.active ? styles.active : styles.inactive}`}>{product.active ? "Ativo" : "Inativo"}</span><div className={styles.updated}><span>{formatAdminDate(new Date(product.updatedAt))}</span><small>por {product.updatedByName ?? "—"}</small></div><Link href={`/admin/produtos/${product.id}/editar`} className={styles.editLink}>Editar</Link></article>)}</div> : <div className={styles.empty}><AdminIcon name="products" /><h3>Nenhum produto cadastrado</h3><p>Os produtos atualizados aparecerão aqui.</p></div>}</section>
  </div>;
}

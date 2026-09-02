import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OfferForm } from "@/components/admin/OfferForm/OfferForm";
import { formatBRL } from "@/lib/productFormat";
import { setProductPromotionAction } from "@/server/actions/adminOfferActions";
import { offerService } from "@/server/services/offerService";
import styles from "./OfferEditor.module.css";
export default async function OfferProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const product = await offerService.getById(id); if (!product) notFound();
  return <section className={styles.page}><header className={styles.heading}><span>Ofertas</span><h1>Oferta do produto</h1><p>Defina o preço promocional sem alterar o preço normal.</p></header><section className={styles.product}>{product.primaryImage ? <div className={styles.image}><Image src={product.primaryImage.url} alt={product.primaryImage.alt} fill sizes="96px" /></div> : <div className={styles.placeholder} aria-hidden="true" />}<div><h2>{product.name}</h2><p>{product.brand} · {product.categoryName}</p><dl><div><dt>Preço normal</dt><dd>{product.price ? formatBRL(product.price) : "Sem preço"}</dd></div><div><dt>Status</dt><dd>{product.active ? "Ativo" : "Inativo"}</dd></div></dl></div></section>{product.price ? <OfferForm initialValue={product.promotionalPrice?.replace(".", ",") ?? ""} action={setProductPromotionAction.bind(null, id, Boolean(product.promotionalPrice))} /> : <section className={styles.notice}><p>Defina um preço normal para este produto antes de criar uma oferta.</p><Link href={`/admin/produtos/${id}/editar`}>Editar produto</Link></section>}<Link href={`/admin/produtos/${id}/editar`} className={styles.edit}>Editar produto</Link></section>;
}

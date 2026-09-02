import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { createWhatsAppUrl } from "@/lib/storeSettings";
import { formatBRL } from "@/lib/productFormat";
import type { PublicProduct } from "@/types/publicProduct";

import styles from "./MobilityModels.module.css";

type MobilityModelsProps = { products: PublicProduct[]; whatsapp: string };

export function MobilityModels({ products, whatsapp }: MobilityModelsProps) {
  return <section id="modelos" className={styles.section}><Container><SectionHeading eyebrow="MODELOS" title="Conheça algumas opções" description="Modelos apresentados para consulta. Fale com a equipe para verificar a disponibilidade atual." />{products.length > 0 ? <div className={styles.grid}>{products.map((product) => { const message = `Olá, vim pelo site da Aitechz e gostaria de saber mais sobre ${product.name}.`; const image = product.images[0]; return <article key={product.id} className={styles.card}><Link href={`/produtos/${product.slug}`} className={styles.productLink}><div className={styles.imageFrame}>{image ? <Image src={image.url} alt={image.alt} fill sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 50vw, 33vw" className={styles.image} /> : <div className={styles.placeholder} aria-label="Produto sem imagem"><Icon name="scooter" /></div>}</div><div className={styles.content}><p className={styles.category}>{product.brand} <span aria-hidden="true">•</span> {product.category}</p><h3>{product.name}</h3><p className={styles.description}>{product.description}</p><div className={styles.priceArea}>{product.promotionalPrice && product.price ? <p className={styles.originalPrice}>{formatBRL(product.price)}</p> : null}<p className={product.promotionalPrice ? styles.promotionalPrice : styles.price}>{product.promotionalPrice ? formatBRL(product.promotionalPrice) : product.price ? formatBRL(product.price) : "Consultar valor"}</p></div></div></Link><div className={styles.actionArea}><Link href={createWhatsAppUrl(whatsapp, message)} target="_blank" rel="noopener noreferrer" aria-label={`Consultar disponibilidade de ${product.name} pelo WhatsApp`} className={styles.action}>Consultar disponibilidade <Icon name="arrow" className={styles.arrow} /></Link></div></article>; })}</div> : <div className={styles.emptyState}><Icon name="scooter" className={styles.emptyIcon} /><h3>Nenhum modelo disponível no momento.</h3><p>Fale com a equipe para consultar novidades de mobilidade elétrica.</p><Link href={createWhatsAppUrl(whatsapp, "Olá, vim pelo site da Aitechz e gostaria de consultar novidades de mobilidade elétrica.")} target="_blank" rel="noopener noreferrer" className={styles.emptyAction}>Falar no WhatsApp <Icon name="arrow" className={styles.arrow} /></Link></div>}</Container></section>;
}

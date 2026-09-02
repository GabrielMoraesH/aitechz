import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/Icons";
import { createWhatsAppUrl } from "@/lib/storeSettings";
import { formatBRL } from "@/lib/productFormat";
import type { PublicProduct } from "@/types/publicProduct";

import styles from "./ProductCard.module.css";

type ProductCardProps = { product: PublicProduct; whatsapp: string };

export function ProductCard({ product, whatsapp }: ProductCardProps) {
  const message = `Olá, vim pelo site da Aitechz e gostaria de saber mais sobre o ${product.name}.`;
  const image = product.images[0];

  return (
    <article className={styles.card}>
      <Link href={`/produtos/${product.slug}`} className={styles.productLink}>
        <div className={styles.imageFrame}>
          {image ? <Image src={image.url} alt={image.alt} fill sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw" className={styles.image} /> : <div className={styles.placeholder} aria-label="Produto sem imagem"><Icon name="computer" /></div>}
        </div>
        <div className={styles.productContent}>
          <p className={styles.meta}>{product.brand} <span aria-hidden="true">•</span> {product.category}</p>
          <h2 className={styles.name}>{product.name}</h2>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.priceArea}>
            {product.promotionalPrice && product.price ? <p className={styles.originalPrice}>{formatBRL(product.price)}</p> : null}
            <p className={product.promotionalPrice ? styles.promotionalPrice : styles.price}>{product.promotionalPrice ? formatBRL(product.promotionalPrice) : product.price ? formatBRL(product.price) : "Consultar valor"}</p>
          </div>
        </div>
      </Link>
      <div className={styles.actionArea}>
        <Link href={createWhatsAppUrl(whatsapp, message)} target="_blank" rel="noopener noreferrer" aria-label={`Saber mais sobre ${product.name} pelo WhatsApp`} className={styles.action}>
          Saber mais <Icon name="arrow" className={styles.arrow} />
        </Link>
      </div>
    </article>
  );
}

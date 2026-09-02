import Link from "next/link";

import { ProductCard } from "@/components/products/ProductCard/ProductCard";
import { Container } from "@/components/ui/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import type { PublicProduct } from "@/types/publicProduct";

import styles from "./FeaturedProducts.module.css";

type FeaturedProductsProps = { products: PublicProduct[]; whatsapp: string };

export function FeaturedProducts({ products, whatsapp }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  const allProductsLink = <Link href="/produtos" className={styles.actionLink}>Ver todos os produtos →</Link>;

  return (
    <section id="produtos" className={styles.section}>
      <Container>
        <SectionHeading eyebrow="Destaques Aitechz" title="Produtos em destaque" action={allProductsLink} />
        <div className={styles.grid}>
          {products.map((product) => <ProductCard key={product.id} product={product} whatsapp={whatsapp} />)}
        </div>
        <div className={styles.mobileAction}>{allProductsLink}</div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import type { PublicProduct } from "@/types/publicProduct";

import styles from "./ElectricMobility.module.css";

type ElectricMobilityProps = { products: PublicProduct[] };

export function ElectricMobility({ products }: ElectricMobilityProps) {
  if (products.length === 0) return null;

  const allModelsLink = <Link href="/mobilidade-eletrica" className={styles.actionLink}>Ver todos os modelos →</Link>;

  return (
    <section id="mobilidade" className={styles.section}>
      <Container>
        <SectionHeading eyebrow="Mobilidade elétrica" title="Mais liberdade para o seu dia a dia" action={allModelsLink} />
        <div className={`${styles.grid} ${styles[`items${products.length}`]}`}>
          {products.map((product) => (
            <article key={product.id} className={styles.card}>
              <Link href={`/produtos/${product.slug}`} className={styles.productLink}>
                <div className={styles.imageFrame}>
                  <div className={styles.shadow} aria-hidden="true" />
                  {product.images[0] ? (
                    <Image src={product.images[0].url} alt={product.images[0].alt} fill sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 50vw, 33vw" className={styles.image} />
                  ) : (
                    <div className={styles.placeholder} aria-label="Produto sem imagem"><Icon name="scooter" /></div>
                  )}
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <span className={styles.itemLink}>Conhecer <Icon name="arrow" className={styles.arrow} /></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className={styles.mobileAction}>{allModelsLink}</div>
      </Container>
    </section>
  );
}

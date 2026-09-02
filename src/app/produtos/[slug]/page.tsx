import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { ProductCard } from "@/components/products/ProductCard/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery/ProductGallery";
import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { createWhatsAppUrl } from "@/lib/storeSettings";
import { formatBRL } from "@/lib/productFormat";
import { publicProductService } from "@/server/services/publicProductService";
import { storeSettingsService } from "@/server/services/storeSettingsService";

import styles from "./ProductDetail.module.css";

type ProductPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await publicProductService.getBySlug(slug);
  if (!result) return { title: "Produto não encontrado | Aitechz" };
  return { title: `${result.dto.name} | Aitechz`, description: result.dto.description };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await publicProductService.getBySlug(slug);
  if (!result) notFound();

  const product = result.dto;
  const relatedProducts = await publicProductService.getRelated(product.id, result.categoryId);
  const settings = await storeSettingsService.get();
  const whatsappMessage = `Olá, vim pelo site da Aitechz e gostaria de saber mais sobre o ${product.name}.`;
  const currentPrice = product.promotionalPrice ?? product.price;

  return (
    <>
      <Header settings={settings} />
      <main>
        <section className={styles.hero} aria-labelledby="product-title">
          <Container>
            <Link href="/produtos" className={styles.backLink}><span aria-hidden="true">←</span> Voltar para produtos</Link>
            <div className={styles.productGrid}>
              <ProductGallery images={product.images} productName={product.name} />
              <div className={styles.summary}>
                <p className={styles.meta}>{product.brand} <span aria-hidden="true">•</span> {product.category}</p>
                <h1 id="product-title" className={styles.title}>{product.name}</h1>
                <p className={styles.lead}>{product.description}</p>
                <div className={styles.purchaseBox}>
                  {product.promotionalPrice && product.price ? <p className={styles.originalPrice}>{formatBRL(product.price)}</p> : null}
                  <p className={styles.currentPrice}>{currentPrice ? formatBRL(currentPrice) : "Consultar valor"}</p>
                  <Link href={createWhatsAppUrl(settings.whatsapp, whatsappMessage)} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                    Saber mais no WhatsApp <Icon name="arrow" className={styles.buttonIcon} />
                  </Link>
                  <ul className={styles.benefits}>
                    <li><Icon name="check" /> Atendimento especializado</li>
                    <li><Icon name="check" /> Loja física em Cascavel</li>
                    <li><Icon name="check" /> Consulte disponibilidade</li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className={styles.details} aria-labelledby="details-title">
          <Container>
            <div className={styles.sectionHeader}><p className={styles.eyebrow}>DETALHES</p><h2 id="details-title">Informações do produto</h2></div>
            <dl className={styles.infoList}>
              <div><dt>Marca</dt><dd>{product.brand}</dd></div>
              <div><dt>Categoria</dt><dd>{product.category}</dd></div>
              <div><dt>Condição</dt><dd>{product.condition === "NEW" ? "Novo" : "Seminovo"}</dd></div>
              <div><dt>Descrição</dt><dd>{product.description}</dd></div>
            </dl>
          </Container>
        </section>

        {relatedProducts.length ? <section className={styles.related} aria-labelledby="related-title">
          <Container>
            <div className={styles.sectionHeader}><p className={styles.eyebrow}>MAIS TECNOLOGIA PARA VOCÊ</p><h2 id="related-title">Você também pode gostar</h2></div>
            <div className={styles.relatedGrid}>{relatedProducts.map((item) => <ProductCard key={item.id} product={item} whatsapp={settings.whatsapp} />)}</div>
          </Container>
        </section> : null}
      </main>
      <Footer settings={settings} />
    </>
  );
}

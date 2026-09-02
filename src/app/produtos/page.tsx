import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { ProductCatalog } from "@/components/products/ProductCatalog/ProductCatalog";
import { publicProductService } from "@/server/services/publicProductService";
import { storeSettingsService } from "@/server/services/storeSettingsService";

import styles from "./Produtos.module.css";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{ categoria?: string | string[] }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categoryParam = (await searchParams).categoria;
  const initialCategorySlug = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const [catalog, settings] = await Promise.all([publicProductService.getCatalog(), storeSettingsService.get()]);
  return (
    <>
      <Header settings={settings} />
      <main className={styles.main}>
        <ProductCatalog products={catalog.products} categories={catalog.categories} initialCategorySlug={initialCategorySlug} whatsapp={settings.whatsapp} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

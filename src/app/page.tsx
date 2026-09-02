import { Categories } from "@/components/home/Categories/Categories";
import { Customers } from "@/components/home/Customers/Customers";
import { ElectricMobility } from "@/components/home/ElectricMobility/ElectricMobility";
import { FeaturedProducts } from "@/components/home/FeaturedProducts/FeaturedProducts";
import { Hero } from "@/components/home/Hero/Hero";
import { StoreLocation } from "@/components/home/StoreLocation/StoreLocation";
import { TechnicalSupport } from "@/components/home/TechnicalSupport/TechnicalSupport";
import { TradeIn } from "@/components/home/TradeIn/TradeIn";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { publicCategoryService } from "@/server/services/publicCategoryService";
import { publicProductService } from "@/server/services/publicProductService";
import { storeSettingsService } from "@/server/services/storeSettingsService";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featuredProducts, mobilityProducts, settings] = await Promise.all([
    publicCategoryService.getHomeCategories(),
    publicProductService.getFeatured(),
    publicProductService.getByCategorySlug("mobilidade-eletrica"),
    storeSettingsService.get(),
  ]);

  return (
    <>
      <Header settings={settings} />
      <main>
        <Hero settings={settings} />
        <Categories categories={categories} />
        <FeaturedProducts products={featuredProducts} whatsapp={settings.whatsapp} />
        <TradeIn settings={settings} />
        <ElectricMobility products={mobilityProducts.slice(0, 3)} />
        <TechnicalSupport settings={settings} />
        <Customers settings={settings} />
        <StoreLocation settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

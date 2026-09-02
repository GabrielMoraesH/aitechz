import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { MobilityBenefits } from "@/components/mobility/MobilityBenefits/MobilityBenefits";
import { MobilityCategories } from "@/components/mobility/MobilityCategories/MobilityCategories";
import { MobilityCTA } from "@/components/mobility/MobilityCTA/MobilityCTA";
import { MobilityGuide } from "@/components/mobility/MobilityGuide/MobilityGuide";
import { MobilityHero } from "@/components/mobility/MobilityHero/MobilityHero";
import { MobilityModels } from "@/components/mobility/MobilityModels/MobilityModels";
import { publicProductService } from "@/server/services/publicProductService";
import { storeSettingsService } from "@/server/services/storeSettingsService";

import styles from "./MobilidadeEletrica.module.css";

export const metadata: Metadata = {
  title: "Mobilidade Elétrica | Aitechz",
  description: "Conheça opções de scooters, patinetes e motos elétricas na Aitechz em Cascavel-PR.",
};

export default async function MobilityPage() {
  const [products, settings] = await Promise.all([publicProductService.getByCategorySlug("mobilidade-eletrica"), storeSettingsService.getPublic()]);

  return <><Header settings={settings} /><main className={styles.main}><MobilityHero settings={settings} /><MobilityCategories /><MobilityModels products={products} whatsapp={settings.whatsapp} /><MobilityBenefits /><MobilityGuide /><MobilityCTA settings={settings} /></main><Footer settings={settings} /></>;
}

import type { Metadata } from "next";

import { AssistanceCTA } from "@/components/assistance/AssistanceCTA/AssistanceCTA";
import { AssistanceHero } from "@/components/assistance/AssistanceHero/AssistanceHero";
import { CommonServices } from "@/components/assistance/CommonServices/CommonServices";
import { ServiceCategories } from "@/components/assistance/ServiceCategories/ServiceCategories";
import { ServiceProcess } from "@/components/assistance/ServiceProcess/ServiceProcess";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { storeSettingsService } from "@/server/services/storeSettingsService";

import styles from "./Assistencia.module.css";

export const metadata: Metadata = {
  title: "Assistência Técnica | Aitechz",
  description: "Assistência técnica para celulares, drones DJI, robôs Xiaomi, televisores, consoles, áudio e mobilidade elétrica em Cascavel-PR.",
};

export default async function AssistancePage() {
  const settings = await storeSettingsService.get();
  return <><Header settings={settings} /><main className={styles.main}><AssistanceHero settings={settings} /><ServiceCategories /><CommonServices /><ServiceProcess /><AssistanceCTA settings={settings} /></main><Footer settings={settings} /></>;
}

import type { Metadata } from "next";

import { AboutBusiness } from "@/components/about/AboutBusiness/AboutBusiness";
import { AboutCommunity } from "@/components/about/AboutCommunity/AboutCommunity";
import { AboutCTA } from "@/components/about/AboutCTA/AboutCTA";
import { AboutDifferentials } from "@/components/about/AboutDifferentials/AboutDifferentials";
import { AboutHero } from "@/components/about/AboutHero/AboutHero";
import { AboutLocation } from "@/components/about/AboutLocation/AboutLocation";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { storeSettingsService } from "@/server/services/storeSettingsService";

import styles from "./Sobre.module.css";

export const metadata: Metadata = {
  title: "Sobre nós | Aitechz",
  description: "Conheça a Aitechz, loja de tecnologia em Cascavel-PR com celulares, eletrônicos, acessórios, mobilidade elétrica e assistência técnica.",
};

export default async function AboutPage() {
  const settings = await storeSettingsService.getPublic();
  return (
    <>
      <Header settings={settings} />
      <main className={styles.main}>
        <AboutHero settings={settings} />
        <AboutBusiness />
        <AboutDifferentials />
        <AboutCommunity />
        <AboutLocation settings={settings} />
        <AboutCTA settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

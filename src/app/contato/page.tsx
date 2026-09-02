import type { Metadata } from "next";

import { ContactChannels } from "@/components/contact/ContactChannels/ContactChannels";
import { ContactCTA } from "@/components/contact/ContactCTA/ContactCTA";
import { ContactHero } from "@/components/contact/ContactHero/ContactHero";
import { ContactLocation } from "@/components/contact/ContactLocation/ContactLocation";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { storeSettingsService } from "@/server/services/storeSettingsService";

import styles from "./Contato.module.css";

export const metadata: Metadata = {
  title: "Contato | Aitechz",
  description: "Entre em contato com a Aitechz em Cascavel-PR pelo WhatsApp, Instagram ou visite nossa loja física.",
};

export default async function ContactPage() {
  const settings = await storeSettingsService.getPublic();
  return (
    <>
      <Header settings={settings} />
      <main className={styles.main}>
        <ContactHero settings={settings} />
        <ContactChannels settings={settings} />
        <ContactLocation settings={settings} />
        <ContactCTA settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

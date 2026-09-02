"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/Container/Container";
import { Icon, WhatsAppIcon, type IconName } from "@/components/ui/Icons";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./Header.module.css";

const navigation = [["Início", "/"], ["Produtos", "/produtos"], ["Mobilidade Elétrica", "/mobilidade-eletrica"], ["Assistência Técnica", "/assistencia"], ["Sobre nós", "/sobre"], ["Contato", "/contato"]] as const;
const highlights: [IconName, string][] = [["location", "Loja física em Cascavel - PR"], ["headset", "Atendimento especializado"], ["spark", "Parcelamento facilitado"], ["shield", "Produtos com garantia"]];

export function Header({ settings }: { settings: PublicStoreSettings }) {
  const [open, setOpen] = useState(false);
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp, whatsappMessages.general);

  return (
    <header className={styles.header}>
      <div className={styles.highlights}>
        <Container className={styles.highlightsInner}>
          {highlights.map(([icon, label]) => (
            <span key={label} className={styles.highlight}><Icon name={icon} className={styles.highlightIcon} />{label}</span>
          ))}
        </Container>
      </div>
      <div className={styles.main}>
        <Container className={styles.mainInner}>
          <Link href="/" aria-label="Aitechz - início" onClick={() => setOpen(false)}>
            <Image src="/brand/logo-horizontal.png" alt="Aitechz" width={300} height={100} preload className={styles.logo} />
          </Link>
          <nav aria-label="Navegação principal" className={styles.desktopNav}>
            {navigation.map(([label, href]) => <Link key={label} href={href} className={styles.navLink}>{label}</Link>)}
          </nav>
          <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp" className={styles.whatsapp}><WhatsAppIcon className={styles.whatsappIcon} />WhatsApp</Link>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Fechar menu" : "Abrir menu"} className={styles.menuButton}>
            <Icon name={open ? "x" : "menu"} className={styles.menuIcon} />
          </button>
        </Container>
        {open ? (
          <nav id="mobile-navigation" aria-label="Navegação mobile" className={styles.mobileNav}>
            <Container className={styles.mobileNavInner}>
              {navigation.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)} className={styles.mobileLink}>{label}</Link>)}
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp" onClick={() => setOpen(false)} className={styles.mobileWhatsapp}><WhatsAppIcon className={styles.whatsappIcon} />WhatsApp</Link>
            </Container>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

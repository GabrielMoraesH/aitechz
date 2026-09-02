import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./AboutHero.module.css";

export function AboutHero({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <Container className={styles.layout}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Conheça a Aitechz</p>
          <h1 className={styles.title}>Tecnologia, atendimento e <span>conexão</span> em um só lugar</h1>
          <p className={styles.description}>A Aitechz reúne produtos, mobilidade e assistência técnica para aproximar você da tecnologia que faz parte do dia a dia.</p>
          <div className={styles.actions}>
            <ButtonLink href="/produtos">Conhecer produtos</ButtonLink>
            <ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.general)} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp" variant="outline">Falar conosco</ButtonLink>
          </div>
        </div>
        <div className={styles.visual} aria-label="Proprietário e tecnologia Aitechz">
          <div className={styles.brandCard}>
            <Image src="/brand/logo-horizontal.png" alt="Aitechz" width={300} height={100} className={styles.logo} preload />
            <p>Tecnologia para o dia a dia</p>
          </div>
          <div className={styles.ownerFrame}><Image src="/owner/DONO-AITECHZ.jpg" alt="Proprietário da Aitechz apresentando smartphones" fill preload sizes="(max-width: 639px) 60vw, (max-width: 1023px) 300px, 300px" className={styles.ownerImage} /></div>
          <div className={styles.productFrame}><Image src="/products/APPLEWATCH.png" alt="Apple Watch" fill sizes="(max-width: 639px) 32vw, 170px" className={styles.productImage} /></div>
          <span className={styles.location}>Cascavel — PR</span>
        </div>
      </Container>
    </section>
  );
}

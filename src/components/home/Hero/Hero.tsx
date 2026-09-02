import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./Hero.module.css";

const benefits = ["Loja física em Cascavel - PR", "Produtos com garantia", "Atendimento especializado"];

export function Hero({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.decoration} aria-hidden="true" />
      <Container className={styles.layout}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Tecnologia para todos os momentos</p>
          <h1 className={styles.title}>Tecnologia que<br /><span className={styles.titleAccent}>conecta você.</span></h1>
          <p className={styles.description}>Celulares, eletrônicos, acessórios, mobilidade e assistência técnica especializada em um só lugar.</p>
          <div className={styles.actions}>
            <ButtonLink href="/produtos">Explorar produtos</ButtonLink>
            <ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.general)} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp" variant="outline">Falar no WhatsApp</ButtonLink>
          </div>
          <ul className={styles.benefits}>
            {benefits.map((benefit) => (
              <li key={benefit} className={styles.benefit}><span className={styles.check}><Icon name="check" className={styles.checkIcon} /></span>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className={styles.showcase} aria-label="Vitrine com iPhone laranja, AirPods Pro 2, Apple Watch e caixa de som JBL">
          <div className={styles.showcaseBase} aria-hidden="true" />
          <div className={styles.showcaseCircleRight} aria-hidden="true" />
          <div className={styles.showcaseCircleLeft} aria-hidden="true" />
          <div className={styles.phone}><Image src="/products/IPHONE-17.png" alt="iPhone laranja" fill preload sizes="(max-width: 639px) 59vw, (max-width: 1023px) 57vw, 325px" className={styles.productImage} /></div>
          <div className={styles.airpods}><Image src="/products/AIRPODS-PRO-2.png" alt="AirPods Pro 2" fill sizes="(max-width: 1023px) 24vw, 135px" className={styles.productImage} /></div>
          <div className={styles.watch}><Image src="/products/APPLEWATCH.png" alt="Apple Watch" fill sizes="(max-width: 1023px) 27vw, 155px" className={styles.productImage} /></div>
          <div className={styles.speaker}><Image src="/products/JBL.png" alt="Caixa de som JBL" fill sizes="(max-width: 1023px) 31vw, 175px" className={styles.productImage} /></div>
        </div>
      </Container>
    </section>
  );
}

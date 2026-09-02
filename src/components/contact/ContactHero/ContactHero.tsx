import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./ContactHero.module.css";

export function ContactHero({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <Container className={styles.layout}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Fale com a Aitechz</p>
          <h1 className={styles.title}>Estamos prontos para atender <span>você</span></h1>
          <p className={styles.description}>Entre em contato para tirar dúvidas, consultar produtos ou falar sobre assistência técnica.</p>
          <div className={styles.actions}>
            <ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.general)} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp">Falar no WhatsApp</ButtonLink>
            <ButtonLink href="#localizacao" variant="outline">Ver localização</ButtonLink>
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <span className={styles.ring} />
          <span className={styles.icon}><Icon name="headset" /></span>
          <span className={styles.badge}>Cascavel — PR</span>
        </div>
      </Container>
    </section>
  );
}

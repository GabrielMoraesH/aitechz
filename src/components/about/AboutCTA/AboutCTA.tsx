import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./AboutCTA.module.css";

export function AboutCTA({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.card}><div className={styles.decoration} aria-hidden="true" /><div className={styles.content}><p className={styles.eyebrow}>Venha se conectar</p><h2 className={styles.title}>Quer conhecer a Aitechz de perto?</h2><p className={styles.description}>Explore os produtos ou fale com a equipe para saber mais.</p><div className={styles.actions}><ButtonLink href="/produtos" variant="light">Ver produtos</ButtonLink><ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.general)} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp" className={styles.whatsapp}>Falar no WhatsApp</ButtonLink></div></div></div>
      </Container>
    </section>
  );
}

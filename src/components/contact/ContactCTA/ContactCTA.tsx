import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./ContactCTA.module.css";

export function ContactCTA({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.panel}>
          <div className={styles.content}>
            <h2 className={styles.title}>Prefere começar pelos produtos?</h2>
            <p className={styles.description}>Explore o catálogo ou fale diretamente com a equipe.</p>
          </div>
          <div className={styles.actions}>
            <ButtonLink href="/produtos" variant="light">Ver produtos</ButtonLink>
            <ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.general)} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp" className={styles.whatsapp}>Falar no WhatsApp</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

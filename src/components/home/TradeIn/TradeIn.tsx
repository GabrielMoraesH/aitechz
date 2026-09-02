import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./TradeIn.module.css";

const benefits = ["Avaliação rápida e justa", "Processo simples", "Use como entrada", "Aparelhos revisados com garantia"];

export function TradeIn({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section id="troca" className={styles.section}>
      <Container>
        <div className={styles.panel}>
          <div className={styles.layout}>
            <div className={styles.content}>
              <p className={styles.eyebrow}>Troque seu aparelho</p>
              <h2 className={styles.title}>Seu antigo vale mais do que você imagina!</h2>
              <p className={styles.description}>Traga seu aparelho usado e consulte as condições para trocar por um novo com a gente.</p>
              <ul className={styles.benefits}>
                {benefits.map((benefit) => (
                  <li key={benefit} className={styles.benefit}><span className={styles.check}><Icon name="check" className={styles.checkIcon} /></span>{benefit}</li>
                ))}
              </ul>
            </div>
            <div className={styles.aside}>
              <Icon name="phone" className={styles.phone} />
              <p className={styles.asideText}>Dê um novo destino ao seu aparelho e encontre sua próxima tecnologia.</p>
              <ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.tradeIn)} target="_blank" rel="noopener noreferrer" aria-label="Avaliar meu aparelho pelo WhatsApp" variant="light">Avaliar meu aparelho</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";
import styles from "./AssistanceCTA.module.css";

export function AssistanceCTA({ settings }: { settings: PublicStoreSettings }) {
  return <section className={styles.section}><Container><div className={styles.panel}><div className={styles.decoration} aria-hidden="true"><Icon name="tools" className={styles.decorationIcon} /></div><div className={styles.content}><p className={styles.eyebrow}>Atendimento Aitechz</p><h2 className={styles.title}>Precisa de assistência?</h2><p className={styles.description}>Fale com a Aitechz e conte o que aconteceu com seu equipamento.</p></div><ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.technicalSupport)} target="_blank" rel="noopener noreferrer" aria-label="Solicitar atendimento de assistência técnica no WhatsApp" variant="light" className={styles.button}>Solicitar atendimento no WhatsApp</ButtonLink></div></Container></section>;
}

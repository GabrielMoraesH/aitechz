import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";
import styles from "./MobilityCTA.module.css";

export function MobilityCTA({ settings }: { settings: PublicStoreSettings }) { return <section className={styles.section}><Container><div className={styles.panel}><div><p className={styles.eyebrow}>FALE COM A AITECHZ</p><h2>Quer conhecer a mobilidade elétrica de perto?</h2><p className={styles.description}>Fale com a Aitechz e consulte os modelos disponíveis.</p></div><div className={styles.actions}><ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.general)} target="_blank" rel="noopener noreferrer" variant="light">Falar no WhatsApp</ButtonLink><ButtonLink href="/produtos?categoria=mobilidade-eletrica" variant="outline" className={styles.products}>Ver produtos</ButtonLink></div></div></Container></section>; }

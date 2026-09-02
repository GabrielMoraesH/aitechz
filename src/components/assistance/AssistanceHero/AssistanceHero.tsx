import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { Icon, type IconName } from "@/components/ui/Icons";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";
import styles from "./AssistanceHero.module.css";

const highlights: { icon: IconName; label: string }[] = [
  { icon: "search", label: "Diagnóstico" }, { icon: "tools", label: "Avaliação técnica" }, { icon: "check", label: "Atendimento alinhado" },
];

export function AssistanceHero({ settings }: { settings: PublicStoreSettings }) {
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp, whatsappMessages.technicalSupport);
  return (
    <section className={styles.hero}>
      <Container className={styles.layout}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Assistência técnica Aitechz</p>
          <h1 className={styles.title}>Seu equipamento em boas mãos</h1>
          <p className={styles.description}>Atendimento especializado para diferentes tipos de equipamentos e tecnologias.</p>
          <div className={styles.actions}>
            <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Solicitar atendimento de assistência técnica pelo WhatsApp">Solicitar atendimento</ButtonLink>
            <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Aitechz pelo WhatsApp sobre assistência técnica" variant="outline">Falar no WhatsApp</ButtonLink>
          </div>
        </div>
        <div className={styles.visual} aria-label="Smartphone e etapas de atendimento técnico">
          <div className={styles.grid} aria-hidden="true" /><div className={styles.orbit} aria-hidden="true" />
          <div className={styles.device}><div className={styles.deviceGlow} aria-hidden="true" /><Image src="/products/IPHONE-16-PRO-MAX-256.png" width={447} height={447} sizes="(max-width: 640px) 230px, 300px" alt="Smartphone visto pela frente e por trás" className={styles.deviceImage} priority /></div>
          <ul className={styles.highlights}>{highlights.map((item) => <li key={item.label} className={styles.highlight}><span className={styles.icon}><Icon name={item.icon} className={styles.iconSvg} /></span>{item.label}</li>)}</ul>
        </div>
      </Container>
    </section>
  );
}

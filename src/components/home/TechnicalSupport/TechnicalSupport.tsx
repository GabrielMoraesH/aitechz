import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { Icon, type IconName } from "@/components/ui/Icons";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./TechnicalSupport.module.css";

const equipment = ["Celulares", "Drones DJI", "Robôs Xiaomi", "Televisores", "Consoles", "Áudio", "Mobilidade elétrica"];
const repairServices: { label: string; icon: IconName }[] = [
  { label: "Troca de tela", icon: "phone" }, { label: "Troca de bateria", icon: "battery" },
  { label: "Conector", icon: "connector" }, { label: "Reparo em placa", icon: "circuitBoard" },
];

export function TechnicalSupport({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section id="assistencia" className={styles.section}>
      <Container className={styles.layout}>
        <div>
          <p className={styles.eyebrow}>Assistência técnica especializada</p>
          <h2 className={styles.title}>Cuidamos do que é importante para você</h2>
          <p className={styles.description}>Atendimento especializado para diferentes tipos de equipamentos e tecnologias.</p>
          <div className={styles.equipment}>{equipment.map((item) => <span key={item} className={styles.equipmentItem}>{item}</span>)}</div>
          <div className={styles.actions}>
            <ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.technicalSupport)} target="_blank" rel="noopener noreferrer" aria-label="Solicitar assistência técnica pelo WhatsApp" variant="light">Solicitar atendimento</ButtonLink>
            <Link href="/assistencia" className={styles.detailsLink}>Conhecer assistência <Icon name="arrow" className={styles.arrow} /></Link>
          </div>
        </div>
        <div className={styles.visual}>
          <div aria-hidden="true" className={styles.glow} />
          <div aria-hidden="true" className={styles.innerBorder} />
          <div className={styles.visualContent}>
            <div className={styles.device}>
              <div aria-hidden="true" className={styles.deviceCircle} />
              <div aria-hidden="true" className={styles.deviceCircleDashed} />
              <Image src="/products/IPHONE-16-PRO-MAX-256.png" width={440} height={440} sizes="(max-width: 640px) 180px, 230px" alt="Smartphone visto pela frente e por trás" className={styles.deviceImage} />
            </div>
            <ul className={styles.services} aria-label="Serviços de assistência técnica">
              {repairServices.map((service) => (
                <li key={service.label} className={styles.service}><span className={styles.serviceIcon}><Icon name={service.icon} className={styles.serviceIconSvg} /></span><span>{service.label}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

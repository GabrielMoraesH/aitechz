import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { createWhatsAppUrl, whatsappMessages, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./MobilityHero.module.css";

const decorativeVehicles = [
  { image: "/mobility/SCOOTER-X15-MAX.png", alt: "Scooter elétrica" },
  { image: "/mobility/PATINETE-FOSTON.jpg.png", alt: "Patinete elétrico" },
  { image: "/mobility/MOTO-X13-MAX.png", alt: "Moto elétrica" },
] as const;

export function MobilityHero({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section className={styles.hero}>
      <Container className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>MOBILIDADE ELÉTRICA</p>
          <h1 className={styles.title}>Mais liberdade para o seu dia a dia</h1>
          <p className={styles.description}>Explore alternativas de mobilidade elétrica para diferentes rotinas e necessidades.</p>
          <div className={styles.actions}>
            <ButtonLink href="#modelos">Conhecer modelos</ButtonLink>
            <ButtonLink href={createWhatsAppUrl(settings.whatsapp, whatsappMessages.general)} target="_blank" rel="noopener noreferrer" variant="outline">Falar no WhatsApp</ButtonLink>
          </div>
        </div>
        <div className={styles.visual} aria-label="Scooter, patinete e moto elétricos">
          <div className={styles.orbit} aria-hidden="true" />
          {decorativeVehicles.map((vehicle, index) => (
            <div key={vehicle.image} className={`${styles.vehicle} ${styles[`vehicle${index + 1}`]}`}>
              <Image src={vehicle.image} alt={vehicle.alt} fill sizes={index === 0 ? "(max-width: 767px) 72vw, 36vw" : "(max-width: 767px) 32vw, 16vw"} className={styles.image} preload={index === 0} />
            </div>
          ))}
          <span className={styles.note}>3 formas de viver a cidade</span>
        </div>
      </Container>
    </section>
  );
}

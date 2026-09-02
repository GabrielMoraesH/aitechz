import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { createInstagramUrl, type PublicStoreSettings } from "@/lib/storeSettings";

import styles from "./Customers.module.css";

const customerImages = Array.from({ length: 10 }, (_, index) => `/customers/CLIENTE-${index + 1}.png`);

export function Customers({ settings }: { settings: PublicStoreSettings }) {
  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading eyebrow="Quem compra na Aitechz" title="Clientes que confiam e recomendam" description="Alguns registros de quem já passou pela Aitechz." centered />
        <div className={styles.marquee}>
          <div className={styles.track}>
            {[false, true].map((duplicate) => (
              <div key={String(duplicate)} className={styles.group} aria-hidden={duplicate || undefined}>
                {customerImages.map((src) => (
                  <div key={`${duplicate ? "duplicate" : "original"}-${src}`} className={styles.imageFrame}>
                    <Image src={src} alt="Cliente da Aitechz na loja" fill sizes="(max-width: 639px) 62vw, (max-width: 1023px) 30vw, (max-width: 1439px) 22vw, 240px" className={styles.image} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.action}>
          {settings.instagram && <Link href={createInstagramUrl(settings.instagram)} target="_blank" rel="noopener noreferrer" aria-label={`Acompanhar @${settings.instagram} no Instagram`} className={styles.instagramLink}>Acompanhar no Instagram</Link>}
        </div>
      </Container>
    </section>
  );
}

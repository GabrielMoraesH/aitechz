import Image from "next/image";

import { Container } from "@/components/ui/Container/Container";

import styles from "./AboutCommunity.module.css";

const images = ["/customers/CLIENTE-1.png", "/customers/CLIENTE-5.png", "/customers/CLIENTE-7.png", "/customers/CLIENTE-10.png"];

export function AboutCommunity() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.heading}><p className={styles.eyebrow}>Nossa comunidade</p><h2 className={styles.title}>Quem passa pela Aitechz faz parte da nossa história</h2><p className={styles.description}>Alguns registros de clientes que já passaram pela loja.</p></div>
        <div className={styles.gallery}>{images.map((src, index) => <figure key={src} className={styles.frame}><Image src={src} alt={`Cliente da Aitechz na loja — registro ${index + 1}`} fill sizes="(max-width: 639px) 46vw, (max-width: 1023px) 32vw, 280px" className={styles.image} /></figure>)}</div>
      </Container>
    </section>
  );
}

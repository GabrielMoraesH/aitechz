import { Container } from "@/components/ui/Container/Container";
import { Icon, type IconName } from "@/components/ui/Icons";

import styles from "./AboutDifferentials.module.css";

const differentials: { title: string; icon: IconName }[] = [
  { title: "Atendimento especializado", icon: "headset" }, { title: "Loja física em Cascavel", icon: "location" },
  { title: "Diversidade de tecnologias", icon: "spark" }, { title: "Assistência técnica", icon: "tools" },
  { title: "Atendimento pelo WhatsApp", icon: "phone" }, { title: "Produtos com garantia", icon: "shield" },
];

export function AboutDifferentials() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.heading}><p className={styles.eyebrow}>Nosso jeito de atender</p><h2 className={styles.title}>Uma experiência mais próxima</h2><p className={styles.description}>Tecnologia e atendimento caminham juntos para ajudar você a encontrar produtos e soluções para diferentes momentos.</p></div>
        <ul className={styles.grid}>{differentials.map((item, index) => <li key={item.title} className={styles.card}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><span className={styles.icon}><Icon name={item.icon} /></span><h3>{item.title}</h3></li>)}</ul>
      </Container>
    </section>
  );
}

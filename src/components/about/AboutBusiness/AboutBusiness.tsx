import { Container } from "@/components/ui/Container/Container";
import { Icon, type IconName } from "@/components/ui/Icons";

import styles from "./AboutBusiness.module.css";

const areas: { label: string; icon: IconName }[] = [
  { label: "Celulares", icon: "phone" }, { label: "Acessórios", icon: "spark" },
  { label: "Informática", icon: "computer" }, { label: "Áudio", icon: "audio" },
  { label: "Games", icon: "game" }, { label: "Smartwatches", icon: "watch" },
  { label: "Mobilidade elétrica", icon: "scooter" }, { label: "Assistência técnica", icon: "tools" },
];

export function AboutBusiness() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.intro}>
          <div><p className={styles.eyebrow}>Quem somos</p><h2 className={styles.title}>Seu ponto de conexão com o mundo</h2></div>
          <div className={styles.copy}><p>A Aitechz é uma loja de tecnologia em Cascavel-PR que reúne diferentes soluções em um só lugar.</p><p>Celulares, acessórios, informática, áudio, games, smartwatches, mobilidade elétrica e assistência técnica fazem parte do atendimento da loja.</p></div>
        </div>
        <ul className={styles.grid} aria-label="Áreas de atuação da Aitechz">
          {areas.map((area) => <li key={area.label} className={styles.card}><span className={styles.icon}><Icon name={area.icon} /></span><span>{area.label}</span></li>)}
        </ul>
      </Container>
    </section>
  );
}

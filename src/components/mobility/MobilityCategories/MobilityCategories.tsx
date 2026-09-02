import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";

import styles from "./MobilityCategories.module.css";

const categories = [
  ["Scooters elétricas", "Praticidade para deslocamentos do dia a dia."],
  ["Patinetes elétricos", "Mobilidade urbana compacta e fácil de integrar à rotina."],
  ["Motos elétricas", "Uma alternativa elétrica para quem busca mais presença e mobilidade."],
] as const;

export function MobilityCategories() {
  return <section className={styles.section}><Container><SectionHeading eyebrow="ESCOLHA SEU ESTILO" title="Uma opção para cada tipo de rotina" /><div className={styles.grid}>{categories.map(([title, description], index) => <article key={title} className={styles.card}><span className={styles.number}>0{index + 1}</span><Icon name="scooter" className={styles.icon} /><h3>{title}</h3><p>{description}</p></article>)}</div></Container></section>;
}

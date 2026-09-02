import { Container } from "@/components/ui/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./MobilityGuide.module.css";

const guide = [["Scooter", "Para quem busca conforto e praticidade em deslocamentos cotidianos."], ["Patinete", "Para quem prefere uma alternativa compacta e fácil de integrar ao dia."], ["Moto elétrica", "Para quem procura uma solução com formato mais próximo de uma motocicleta."]] as const;

export function MobilityGuide() { return <section className={styles.section}><Container className={styles.inner}><SectionHeading eyebrow="QUAL COMBINA COM VOCÊ?" title="Escolha de acordo com a sua rotina" description="O melhor formato começa pela forma como você pretende se deslocar." /><div className={styles.list}>{guide.map(([title, description], index) => <article key={title} className={styles.row}><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></Container></section>; }

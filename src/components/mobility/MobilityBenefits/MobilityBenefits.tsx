import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./MobilityBenefits.module.css";

const benefits = [["Mobilidade prática", "Alternativas pensadas para acompanhar os deslocamentos cotidianos."], ["Uso urbano", "Formatos que podem fazer parte de diferentes trajetos pela cidade."], ["Alternativas compactas", "Opções que se adaptam a espaços e necessidades variadas."], ["Diferentes formatos", "Scooter, patinete ou moto para diferentes rotinas."]] as const;

export function MobilityBenefits() { return <section className={styles.section}><Container><SectionHeading eyebrow="MOBILIDADE PARA O DIA A DIA" title="Por que considerar uma opção elétrica?" centered /><div className={styles.grid}>{benefits.map(([title, description]) => <article key={title} className={styles.item}><span className={styles.icon}><Icon name="check" /></span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></Container></section>; }

import { Container } from "@/components/ui/Container/Container";
import { Icon, type IconName } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./ServiceCategories.module.css";

const categories: { name: string; description: string; icon: IconName }[] = [
  { name: "Celulares", description: "Manutenção e diagnóstico para smartphones.", icon: "phone" },
  { name: "Drones DJI", description: "Análise e suporte para equipamentos DJI.", icon: "drone" },
  { name: "Robôs Xiaomi", description: "Atendimento para robôs e dispositivos compatíveis.", icon: "watch" },
  { name: "Televisores", description: "Diagnóstico e reparos conforme avaliação.", icon: "computer" },
  { name: "Consoles", description: "Suporte para problemas de funcionamento.", icon: "game" },
  { name: "Áudio", description: "Atendimento para caixas e dispositivos de áudio.", icon: "audio" },
  { name: "Mobilidade elétrica", description: "Diagnóstico para scooters, patinetes e equipamentos elétricos.", icon: "scooter" },
];

export function ServiceCategories() {
  return <section className={styles.section}><Container><SectionHeading eyebrow="Equipamentos atendidos" title="Assistência para diferentes tecnologias" /><ul className={styles.grid}>{categories.map((category) => <li key={category.name} className={styles.card}><span className={styles.icon}><Icon name={category.icon} className={styles.iconSvg} /></span><h3 className={styles.title}>{category.name}</h3><p className={styles.description}>{category.description}</p></li>)}</ul></Container></section>;
}

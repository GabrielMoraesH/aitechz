import { Container } from "@/components/ui/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./ServiceProcess.module.css";

const steps = [
  { title: "Entre em contato", description: "Fale com a equipe e explique o problema do equipamento." },
  { title: "Leve o equipamento", description: "Apresente o equipamento para avaliação presencial." },
  { title: "Avaliação técnica", description: "A equipe analisa o caso e orienta sobre os próximos passos." },
  { title: "Aprovação", description: "O serviço segue somente após alinhamento com o cliente." },
];

export function ServiceProcess() {
  return <section className={styles.section}><Container><SectionHeading eyebrow="Como funciona" title="Um processo simples do início ao atendimento" centered /><ol className={styles.steps}>{steps.map((step, index) => <li key={step.title} className={styles.step}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><h3 className={styles.title}>{step.title}</h3><p className={styles.description}>{step.description}</p></li>)}</ol></Container></section>;
}

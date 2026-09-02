import { Container } from "@/components/ui/Container/Container";
import { Icon, type IconName } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./CommonServices.module.css";

const services: { title: string; description: string; icon: IconName }[] = [
  { title: "Troca de tela", description: "Substituição e avaliação conforme o modelo do equipamento.", icon: "phone" },
  { title: "Troca de bateria", description: "Análise da bateria e necessidade de substituição.", icon: "battery" },
  { title: "Conector", description: "Diagnóstico de problemas de carregamento e conexão.", icon: "connector" },
  { title: "Reparo em placa", description: "Avaliação técnica de falhas eletrônicas.", icon: "circuitBoard" },
  { title: "Diagnóstico", description: "Identificação inicial do problema apresentado.", icon: "search" },
  { title: "Avaliação técnica", description: "Análise do equipamento antes da definição do serviço.", icon: "check" },
];

export function CommonServices() {
  return <section className={styles.section}><Container><SectionHeading eyebrow="Serviços" title="Principais tipos de atendimento" /><ul className={styles.grid}>{services.map((service) => <li key={service.title} className={styles.card}><Icon name={service.icon} className={styles.icon} /><div><h3 className={styles.title}>{service.title}</h3><p className={styles.description}>{service.description}</p></div></li>)}</ul></Container></section>;
}

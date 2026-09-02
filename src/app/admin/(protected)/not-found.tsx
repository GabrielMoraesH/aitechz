import Link from "next/link";
import styles from "./RouteState.module.css";

export default function AdminNotFound() {
  return <section className={styles.state}><span aria-hidden="true">?</span><h1>Registro não encontrado</h1><p>O item que você tentou acessar não existe ou não está mais disponível.</p><div><Link href="/admin">Voltar ao Dashboard</Link></div></section>;
}

import Image from "next/image";
import Link from "next/link";
import styles from "./RouteState.module.css";

export default function NotFound() {
  return <main className={styles.page}><div className={styles.card}><Link href="/" aria-label="Aitechz — início"><Image src="/brand/logo-horizontal.png" alt="Aitechz" width={210} height={70} className={styles.logo} /></Link><span className={styles.code}>404</span><h1>Página não encontrada</h1><p>A página que você procura não existe ou não está mais disponível.</p><div className={styles.actions}><Link href="/" className={styles.primary}>Voltar ao início</Link><Link href="/produtos" className={styles.secondary}>Ver produtos</Link></div></div></main>;
}

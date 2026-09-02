"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./RouteState.module.css";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className={styles.page}><div className={styles.card} role="alert"><span className={styles.code} aria-hidden="true">!</span><h1>Algo não saiu como esperado.</h1><p>Tente carregar a página novamente.</p><div className={styles.actions}><button type="button" className={styles.primary} onClick={retry}>Tentar novamente</button><Link href="/" className={styles.secondary}>Voltar ao início</Link></div></div></main>;
}

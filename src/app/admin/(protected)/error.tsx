"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./RouteState.module.css";

export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <section className={styles.state} role="alert"><span aria-hidden="true">!</span><h1>Não foi possível carregar esta área.</h1><p>Tente novamente. Se o problema continuar, volte ao Dashboard.</p><div><button type="button" onClick={retry}>Tentar novamente</button><Link href="/admin">Voltar ao Dashboard</Link></div></section>;
}

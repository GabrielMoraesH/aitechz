import styles from "./AdminPlaceholder.module.css";
export function AdminPlaceholder({ title, description }: { title: string; description: string }) { return <section className={styles.page}><span>Painel administrativo</span><h1>{title}</h1><p>{description}</p><div><i aria-hidden="true"/><strong>Em desenvolvimento.</strong></div></section>; }

import styles from "./ProductLoading.module.css";

export function ProductLoading() {
  return <main className={styles.page} aria-busy="true" aria-label="Carregando produtos"><div className={styles.header}><span /><strong /><i /></div><div className={styles.grid}>{Array.from({ length: 8 }, (_, index) => <div className={styles.card} key={index}><span /><strong /><i /><button tabIndex={-1} /></div>)}</div></main>;
}

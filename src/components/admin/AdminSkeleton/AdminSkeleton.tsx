import styles from "./AdminSkeleton.module.css";

export function AdminSkeleton() {
  return <div className={styles.page} aria-busy="true" aria-label="Carregando área administrativa">
    <div className={styles.heading}><span /><strong /><i /></div>
    <div className={styles.banner}><span /><strong /><i /></div>
    <div className={styles.cards}>{Array.from({ length: 3 }, (_, index) => <div key={index} className={styles.card}><span /><strong /><i /></div>)}</div>
    <div className={styles.sectionTitle}><strong /><span /></div>
    <div className={styles.table}><div className={styles.tableHeader} />{Array.from({ length: 4 }, (_, index) => <div key={index} className={styles.row}><span /><span /><span /><span /></div>)}</div>
  </div>;
}

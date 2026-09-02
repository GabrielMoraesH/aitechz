import { Icon } from "@/components/ui/Icons";

import styles from "./ProductSearch.module.css";

type ProductSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  return (
    <label className={styles.field}>
      <span className={styles.srOnly}>Buscar produtos</span>
      <Icon name="search" className={styles.icon} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar produtos..."
        className={styles.input}
      />
    </label>
  );
}

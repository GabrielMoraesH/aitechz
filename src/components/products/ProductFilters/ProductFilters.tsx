import styles from "./ProductFilters.module.css";

type ProductFiltersProps = {
  categories: readonly string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

export function ProductFilters({ categories, selectedCategory, onSelect }: ProductFiltersProps) {
  return (
    <div className={styles.scroller} aria-label="Filtrar por categoria">
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            aria-pressed={isActive}
            className={`${styles.filter} ${isActive ? styles.active : ""}`.trim()}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

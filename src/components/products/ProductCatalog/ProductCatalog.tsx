"use client";

import { useState } from "react";

import { ProductCard } from "@/components/products/ProductCard/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters/ProductFilters";
import { ProductSearch } from "@/components/products/ProductSearch/ProductSearch";
import { Container } from "@/components/ui/Container/Container";
import type { PublicCategory } from "@/types/publicCategory";
import type { PublicProduct } from "@/types/publicProduct";

import styles from "./ProductCatalog.module.css";

type ProductCatalogProps = {
  products: PublicProduct[];
  categories: PublicCategory[];
  initialCategorySlug?: string;
  whatsapp: string;
};

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}

export function ProductCatalog({ products, categories, initialCategorySlug, whatsapp }: ProductCatalogProps) {
  const initialCategory = categories.find((category) => category.slug === initialCategorySlug)?.name ?? "Todos";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const normalizedSearch = normalizeText(search);
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const searchableText = normalizeText([product.name, product.brand, product.category, product.description].join(" "));

    return matchesCategory && searchableText.includes(normalizedSearch);
  });
  const hasActiveFilters = normalizedSearch.length > 0 || selectedCategory !== "Todos";

  function clearFilters() {
    setSearch("");
    setSelectedCategory("Todos");
  }

  return (
    <section className={styles.catalog} aria-labelledby="catalog-title">
      <Container>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>CATÁLOGO AITECHZ</p>
          <h1 id="catalog-title" className={styles.title}>Encontre a tecnologia ideal para você</h1>
          <p className={styles.description}>Explore celulares, acessórios, áudio, informática, smartwatches, games e mobilidade elétrica.</p>
        </header>

        <div className={styles.controls}>
          <ProductSearch value={search} onChange={setSearch} />
          <ProductFilters categories={["Todos", ...categories.map((category) => category.name)]} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className={styles.resultsHeader} aria-live="polite">
          <p>{filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}</p>
          {hasActiveFilters ? <button type="button" onClick={clearFilters} className={styles.clearButton}>Limpar filtros</button> : null}
        </div>

        {filteredProducts.length > 0 ? (
          <div className={styles.grid}>
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} whatsapp={whatsapp} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <h2>Nenhum produto encontrado</h2>
            <p>Tente buscar outro termo ou remover os filtros.</p>
            <button type="button" onClick={clearFilters} className={styles.emptyButton}>Limpar filtros</button>
          </div>
        )}
      </Container>
    </section>
  );
}

import Link from "next/link";

import { Container } from "@/components/ui/Container/Container";
import { Icon } from "@/components/ui/Icons";
import type { IconName } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import type { PublicCategory } from "@/types/publicCategory";

import styles from "./Categories.module.css";

const categoryIcons: Record<string, IconName> = {
  acessorios: "headset",
  audio: "audio",
  celulares: "phone",
  computadores: "computer",
  games: "game",
  informatica: "computer",
  "mobilidade-eletrica": "scooter",
  smartwatches: "watch",
};

type CategoriesProps = { categories: PublicCategory[] };

export function Categories({ categories }: CategoriesProps) {
  if (categories.length === 0) return null;

  const allCategoriesLink = <Link href="/produtos" className={styles.actionLink}>Ver todas as categorias →</Link>;

  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading eyebrow="Compre por categoria" title="Encontre o que você precisa" action={allCategoriesLink} />
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link key={category.id} href={{ pathname: "/produtos", query: { categoria: category.slug } }} className={styles.card}>
              <span className={styles.icon}><Icon name={categoryIcons[category.slug] ?? "category"} className={styles.iconSvg} /></span>
              <span className={styles.name}>{category.name}</span>
            </Link>
          ))}
        </div>
        <div className={styles.mobileAction}>{allCategoriesLink}</div>
      </Container>
    </section>
  );
}

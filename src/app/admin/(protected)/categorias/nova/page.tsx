import { CategoryForm } from "@/components/admin/CategoryForm/CategoryForm";
import { createCategoryAction } from "@/server/actions/adminCategoryActions";
import type { CategoryFormValues } from "@/server/services/categoryService";
import styles from "../CategoryEditor.module.css";

const initialValues: CategoryFormValues = { name: "", active: true };

export default function NewCategoryPage() {
  return <section className={styles.page}>
    <header className={styles.heading}><span>Categorias</span><h1>Nova categoria</h1><p>Cadastre uma categoria para organizar os produtos.</p></header>
    <CategoryForm initialValues={initialValues} action={createCategoryAction} />
  </section>;
}

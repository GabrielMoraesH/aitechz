import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm/CategoryForm";
import { updateCategoryAction } from "@/server/actions/adminCategoryActions";
import { categoryService } from "@/server/services/categoryService";
import styles from "../../CategoryEditor.module.css";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await categoryService.getForEdit(id);
  if (!category) notFound();
  return <section className={styles.page}>
    <header className={styles.heading}><span>Categorias</span><h1>Editar categoria</h1><p>Atualize os dados da categoria. Alterar o nome não modifica seu endereço.</p></header>
    <CategoryForm initialValues={{ name: category.name, active: category.active }} productCount={category.productCount} action={updateCategoryAction.bind(null, id)} />
  </section>;
}

import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm/ProductForm";
import { updateProductAction } from "@/server/actions/adminProductActions";
import { productService } from "@/server/services/productService";
import styles from "../../ProductEditor.module.css";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const product = await productService.getForEdit(id);
  if (!product) notFound();
  return <section className={styles.page}><header className={styles.heading}><span>Produtos</span><h1>Editar produto</h1><p>Atualize os dados do produto. Alterar o nome não modifica seu endereço.</p></header><ProductForm mode="edit" productId={id} initialValues={product.values} categories={product.categories} existingImages={product.images} action={updateProductAction.bind(null, id)} /></section>;
}

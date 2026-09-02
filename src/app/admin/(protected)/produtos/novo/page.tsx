import { ProductForm } from "@/components/admin/ProductForm/ProductForm";
import { createProductAction } from "@/server/actions/adminProductActions";
import { productService, type ProductFormValues } from "@/server/services/productService";
import styles from "../ProductEditor.module.css";

const initialValues: ProductFormValues = { name: "", brand: "", categoryId: "", description: "", condition: "NEW", price: "", promotionalPrice: "", active: true, featured: false };
export default async function NewProductPage() {
  const categories = await productService.getActiveCategories();
  return <section className={styles.page}><header className={styles.heading}><span>Produtos</span><h1>Novo produto</h1><p>Cadastre os dados principais do produto. O endereço será gerado automaticamente.</p></header><ProductForm mode="create" initialValues={initialValues} categories={categories} action={createProductAction} /></section>;
}

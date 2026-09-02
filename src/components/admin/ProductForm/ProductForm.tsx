"use client";

import { useActionState, useState } from "react";
import type { ProductActionState } from "@/server/actions/adminProductActions";
import type { CategoryOptionDto, ProductField, ProductFormValues } from "@/server/services/productService";
import { ProductImageManager, type PendingProductImage, type ProductImageDto } from "@/components/admin/ProductImageManager/ProductImageManager";
import { UnsavedChangesCancel } from "@/components/admin/UnsavedChangesCancel/UnsavedChangesCancel";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import styles from "./ProductForm.module.css";

type ProductFormProps = {
  mode: "create" | "edit";
  initialValues: ProductFormValues;
  categories: CategoryOptionDto[];
  action: (state: ProductActionState, formData: FormData) => Promise<ProductActionState>;
  productId?: string;
  existingImages?: ProductImageDto[];
};

export function ProductForm({ mode, initialValues, categories, action, productId, existingImages = [] }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [pendingImages, setPendingImages] = useState<PendingProductImage[]>([]);
  const { formRef, dirty, checkDirty, setDirty, onSubmitCapture } = useUnsavedChanges(pending);
  const values = state?.values ?? initialValues;
  const error = (field: ProductField) => state?.fieldErrors?.[field];
  const describedBy = (field: ProductField) => error(field) ? `${field}-error` : undefined;
  return (
    <form ref={formRef} action={(formData) => { pendingImages.forEach(({ file }) => formData.append("images", file)); formAction(formData); }} onInput={checkDirty} onChange={checkDirty} onSubmitCapture={onSubmitCapture} className={styles.form} noValidate>
      {state?.message && <div className={styles.formError} role="alert">{state.message}</div>}
      <section className={styles.section}>
        <div className={styles.sectionHeading}><h2>Informações principais</h2><p>Dados usados para identificar e apresentar o produto.</p></div>
        <div className={styles.grid}>
          <Field label="Nome" name="name" error={error("name")}><input id="name" name="name" defaultValue={values.name} minLength={2} maxLength={150} required aria-invalid={!!error("name")} aria-describedby={describedBy("name")} /></Field>
          <Field label="Marca" name="brand" error={error("brand")}><input id="brand" name="brand" defaultValue={values.brand} minLength={2} maxLength={100} required aria-invalid={!!error("brand")} aria-describedby={describedBy("brand")} /></Field>
          <Field label="Categoria" name="categoryId" error={error("categoryId")}>
            <select id="categoryId" name="categoryId" defaultValue={values.categoryId} required disabled={!categories.length} aria-invalid={!!error("categoryId")} aria-describedby={describedBy("categoryId")}>
              <option value="">Selecione</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.active ? "" : " (inativa — atual)"}</option>)}
            </select>
            {!categories.length && <p className={styles.notice}>Nenhuma categoria disponível.</p>}
          </Field>
          <Field label="Condição" name="condition" error={error("condition")}><select id="condition" name="condition" defaultValue={values.condition} required aria-invalid={!!error("condition")} aria-describedby={describedBy("condition")}><option value="NEW">Novo</option><option value="USED">Seminovo</option></select></Field>
          <div className={styles.full}><Field label="Descrição" name="description" error={error("description")}><textarea id="description" name="description" defaultValue={values.description} rows={7} minLength={5} maxLength={5000} required aria-invalid={!!error("description")} aria-describedby={describedBy("description")} /></Field></div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}><h2>Imagens do produto</h2><p>Adicione fotos para apresentar o produto no site.</p></div>
        <ProductImageManager productId={productId} existingImages={existingImages} pendingImages={pendingImages} onPendingImagesChange={(images) => { setPendingImages(images); setDirty(true); }} error={state?.imageError} />
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}><h2>Preço e publicação</h2><p>Preços são opcionais; sem preço, o produto será exibido como “Consultar”.</p></div>
        <div className={styles.grid}>
          <Field label="Preço" name="price" error={error("price")}><input id="price" name="price" inputMode="decimal" placeholder="1999,90" defaultValue={values.price} aria-invalid={!!error("price")} aria-describedby={describedBy("price")} /></Field>
          <Field label="Preço promocional" name="promotionalPrice" error={error("promotionalPrice")}><input id="promotionalPrice" name="promotionalPrice" inputMode="decimal" placeholder="1799,90" defaultValue={values.promotionalPrice} aria-invalid={!!error("promotionalPrice")} aria-describedby={describedBy("promotionalPrice")} /></Field>
          <label className={styles.check}><input type="checkbox" name="active" defaultChecked={values.active} /><span><strong>Produto ativo</strong><small>Disponível para uso futuro no catálogo.</small></span></label>
          <label className={styles.check}><input type="checkbox" name="featured" defaultChecked={values.featured} /><span><strong>Destacar produto</strong><small>Produtos em destaque poderão aparecer em áreas especiais do site.</small></span></label>
        </div>
      </section>
      <div className={styles.actions}><UnsavedChangesCancel href="/admin/produtos" dirty={dirty} className={styles.cancel} /><button type="submit" disabled={pending || !categories.length}>{pending ? "Salvando..." : mode === "create" ? "Cadastrar produto" : "Salvar alterações"}</button></div>
    </form>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return <div className={styles.field}><label htmlFor={name}>{label}</label>{children}{error && <p id={`${name}-error`} className={styles.error} role="alert">{error}</p>}</div>;
}

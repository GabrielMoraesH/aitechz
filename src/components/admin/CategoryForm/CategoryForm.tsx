"use client";

import { useActionState } from "react";
import { UnsavedChangesCancel } from "@/components/admin/UnsavedChangesCancel/UnsavedChangesCancel";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import type { CategoryActionState } from "@/server/actions/adminCategoryActions";
import type { CategoryField, CategoryFormValues } from "@/server/services/categoryService";
import styles from "./CategoryForm.module.css";

type CategoryFormProps = {
  initialValues: CategoryFormValues;
  action: (state: CategoryActionState, formData: FormData) => Promise<CategoryActionState>;
  productCount?: number;
};

export function CategoryForm({ initialValues, action, productCount }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const { formRef, dirty, checkDirty, onSubmitCapture } = useUnsavedChanges(pending);
  const values = state?.values ?? initialValues;
  const error = (field: CategoryField) => state?.fieldErrors?.[field];

  return <form ref={formRef} action={formAction} onInput={checkDirty} onChange={checkDirty} onSubmitCapture={onSubmitCapture} className={styles.form} noValidate>
    {state?.message && <div className={styles.formError} role="alert">{state.message}</div>}
    <section className={styles.section}>
      <div className={styles.sectionHeading}>
        <h2>Informações da categoria</h2>
        <p>O endereço da categoria será gerado automaticamente no cadastro.</p>
      </div>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" defaultValue={values.name} minLength={2} maxLength={80} required aria-invalid={!!error("name")} aria-describedby={error("name") ? "name-error" : undefined} />
          {error("name") && <p id="name-error" className={styles.error} role="alert">{error("name")}</p>}
        </div>
        <label className={styles.check}>
          <input type="checkbox" name="active" defaultChecked={values.active} />
          <span><strong>Categoria ativa</strong><small>Disponível para seleção no cadastro de novos produtos.</small></span>
        </label>
        {productCount !== undefined && <p className={styles.associated}>Produtos associados: <strong>{productCount}</strong></p>}
      </div>
    </section>
    <div className={styles.actions}>
      <UnsavedChangesCancel href="/admin/categorias" dirty={dirty} className={styles.cancel} />
      <button type="submit" disabled={pending}>{pending ? "Salvando..." : "Salvar categoria"}</button>
    </div>
  </form>;
}

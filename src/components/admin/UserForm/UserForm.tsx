"use client";

import { useActionState } from "react";
import { UnsavedChangesCancel } from "@/components/admin/UnsavedChangesCancel/UnsavedChangesCancel";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { getRoleLabel } from "@/lib/auth";
import type { UserActionState } from "@/server/actions/adminUserActions";
import type { UserField, UserFormValues } from "@/server/services/userService";
import type { UserRole } from "@prisma/client";
import styles from "./UserForm.module.css";

export function UserForm({ initialValues, action, role, create = false }: { initialValues: UserFormValues; action: (state: UserActionState, data: FormData) => Promise<UserActionState>; role?: UserRole; create?: boolean }) {
  const [state, formAction, pending] = useActionState(action, null);
  const { formRef, dirty, checkDirty, onSubmitCapture } = useUnsavedChanges(pending);
  const values = state?.values ?? initialValues;
  const error = (field: UserField) => state?.fieldErrors?.[field];
  return <form ref={formRef} action={formAction} onInput={checkDirty} onChange={checkDirty} onSubmitCapture={onSubmitCapture} className={styles.form} noValidate>
    {state?.message && <div className={styles.formError} role="alert">{state.message}</div>}
    <section className={styles.section}><div className={styles.sectionHeading}><h2>Informações do usuário</h2><p>{create ? "Todo usuário criado aqui terá o perfil Funcionário." : "O perfil é somente leitura nesta etapa."}</p></div>
      <div className={styles.fields}>
        <Field id="name" label="Nome" defaultValue={values.name} error={error("name")} minLength={2} maxLength={100} />
        <Field id="email" label="Email" type="email" defaultValue={values.email} error={error("email")} />
        {role && <div className={styles.readonly}><span>Perfil</span><strong>{getRoleLabel(role)}</strong></div>}
        {create && <><Field id="password" label="Senha" type="password" error={error("password")} minLength={12} autoComplete="new-password" /><Field id="passwordConfirmation" label="Confirmar senha" type="password" error={error("passwordConfirmation")} minLength={12} autoComplete="new-password" /></>}
        <label className={styles.check}><input type="checkbox" name="active" defaultChecked={values.active} /><span><strong>Usuário ativo</strong><small>Permite acesso ao painel administrativo.</small></span></label>
      </div>
    </section>
    <div className={styles.actions}><UnsavedChangesCancel href="/admin/usuarios" dirty={dirty} className={styles.cancel} /><button disabled={pending}>{pending ? "Salvando..." : create ? "Criar funcionário" : "Salvar usuário"}</button></div>
  </form>;
}

function Field({ id, label, error, ...props }: { id: UserField; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div className={styles.field}><label htmlFor={id}>{label}</label><input id={id} name={id} required aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} {...props} />{error && <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>}</div>;
}

"use client";

import { useActionState } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { MIN_PASSWORD_LENGTH } from "@/lib/passwordPolicy";
import type { PasswordActionState } from "@/server/actions/adminUserActions";
import styles from "../UserForm/UserForm.module.css";

export function UserPasswordForm({ action }: { action: (state: PasswordActionState, data: FormData) => Promise<PasswordActionState> }) {
  const [state, formAction, pending] = useActionState(action, null);
  const { formRef, checkDirty, onSubmitCapture } = useUnsavedChanges(pending);
  return <form ref={formRef} action={formAction} onInput={checkDirty} onChange={checkDirty} onSubmitCapture={onSubmitCapture} className={styles.form} noValidate><section className={styles.section}>
    <div className={styles.sectionHeading}><h2>Redefinir senha</h2><p>A alteração encerra todas as sessões ativas deste usuário.</p></div>
    {state?.message && <div className={styles.formError} role="alert">{state.message}</div>}
    <div className={styles.fields}><div className={styles.field}><label htmlFor="password">Nova senha</label><input id="password" name="password" type="password" minLength={MIN_PASSWORD_LENGTH} required autoComplete="new-password" aria-invalid={!!state?.fieldErrors?.password} />{state?.fieldErrors?.password && <p className={styles.error}>{state.fieldErrors.password}</p>}</div>
    <div className={styles.field}><label htmlFor="passwordConfirmation">Confirmar nova senha</label><input id="passwordConfirmation" name="passwordConfirmation" type="password" minLength={MIN_PASSWORD_LENGTH} required autoComplete="new-password" aria-invalid={!!state?.fieldErrors?.passwordConfirmation} />{state?.fieldErrors?.passwordConfirmation && <p className={styles.error}>{state.fieldErrors.passwordConfirmation}</p>}</div></div>
  </section><div className={styles.actions}><button disabled={pending}>{pending ? "Redefinindo..." : "Redefinir senha"}</button></div></form>;
}

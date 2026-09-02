"use client";

import { useActionState } from "react";
import { UnsavedChangesCancel } from "@/components/admin/UnsavedChangesCancel/UnsavedChangesCancel";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import type { OfferActionState } from "@/server/actions/adminOfferActions";
import styles from "./OfferForm.module.css";

export function OfferForm({ initialValue, action }: { initialValue: string; action: (state: OfferActionState, data: FormData) => Promise<OfferActionState> }) {
  const [state, formAction, pending] = useActionState(action, null);
  const { formRef, dirty, checkDirty, onSubmitCapture } = useUnsavedChanges(pending);
  const error = state?.fieldErrors?.promotionalPrice;
  return <form ref={formRef} action={formAction} onInput={checkDirty} onChange={checkDirty} onSubmitCapture={onSubmitCapture} className={styles.form} noValidate>
    {state?.message && <div className={styles.formError} role="alert">{state.message}</div>}
    <label className={styles.field} htmlFor="promotionalPrice"><span>Preço promocional</span><input id="promotionalPrice" name="promotionalPrice" inputMode="decimal" placeholder="1999,90" defaultValue={state?.value ?? initialValue} required aria-invalid={!!error} aria-describedby={error ? "promotionalPrice-error" : undefined} />{error && <small id="promotionalPrice-error" role="alert">{error}</small>}</label>
    <div className={styles.actions}><UnsavedChangesCancel href="/admin/ofertas" dirty={dirty} /><button type="submit" disabled={pending}>{pending ? "Salvando..." : initialValue ? "Salvar oferta" : "Adicionar oferta"}</button></div>
  </form>;
}

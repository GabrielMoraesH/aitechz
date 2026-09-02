"use client";

import { useActionState } from "react";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import type { StoreSettingsActionState } from "@/server/actions/storeSettingsActions";
import type { StoreSettingsField, StoreSettingsInput } from "@/server/services/storeSettingsService";
import styles from "./StoreSettingsForm.module.css";

type Props = { initialValues: StoreSettingsInput; action: (state: StoreSettingsActionState, data: FormData) => Promise<StoreSettingsActionState> };

export function StoreSettingsForm({ initialValues, action }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const { formRef, checkDirty, onSubmitCapture } = useUnsavedChanges(pending);
  const values = state?.values ?? initialValues;
  const field = (name: StoreSettingsField, label: string, options: { required?: boolean; maxLength?: number; type?: string; placeholder?: string } = {}) => {
    const error = state?.fieldErrors?.[name];
    return <div className={styles.field}><label htmlFor={name}>{label}</label><input id={name} name={name} defaultValue={values[name]} required={options.required} maxLength={options.maxLength} type={options.type} placeholder={options.placeholder} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} />{error && <p id={`${name}-error`} className={styles.error} role="alert">{error}</p>}</div>;
  };
  return <form ref={formRef} action={formAction} onInput={checkDirty} onChange={checkDirty} onSubmitCapture={onSubmitCapture} className={styles.form} noValidate>
    {state?.message && <div className={styles.formError} role="alert">{state.message}</div>}
    <section className={styles.section}><div className={styles.heading}><h2>Identidade</h2><p>Informações que identificam a loja.</p></div><div className={styles.grid}>{field("storeName", "Nome da loja", { required: true, maxLength: 100 })}{field("slogan", "Slogan", { maxLength: 160 })}</div></section>
    <section className={styles.section}><div className={styles.heading}><h2>Atendimento</h2><p>Canais públicos usados em links e chamadas do site.</p></div><div className={styles.grid}>{field("whatsapp", "WhatsApp", { required: true, placeholder: "(45) 99832-6062" })}{field("instagram", "Instagram", { placeholder: "gabriel_heidrich" })}</div></section>
    <section className={styles.section}><div className={styles.heading}><h2>Localização</h2><p>Endereço estruturado da loja física.</p></div><div className={styles.grid}>{field("street", "Rua", { required: true })}{field("number", "Número", { required: true })}{field("complement", "Complemento")}{field("neighborhood", "Bairro", { required: true })}{field("city", "Cidade", { required: true })}<div className={styles.row}>{field("state", "Estado (UF)", { required: true, maxLength: 2 })}{field("zipCode", "CEP", { required: true })}</div><div className={styles.full}>{field("mapsUrl", "Link do Google Maps", { type: "url", placeholder: "https://..." })}</div></div></section>
    <div className={styles.actions}><button type="submit" disabled={pending}>{pending ? "Salvando..." : "Salvar configurações"}</button></div>
  </form>;
}

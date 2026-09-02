"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/services/sessionService";
import { storeSettingsService, StoreSettingsValidationError, type StoreSettingsFieldErrors, type StoreSettingsInput } from "@/server/services/storeSettingsService";
import { invalidatePublicStoreSettings } from "@/server/cache/publicCache";
export type StoreSettingsActionState = { success: false; message?: string; fieldErrors?: StoreSettingsFieldErrors; values?: StoreSettingsInput } | null;
function read(formData: FormData): StoreSettingsInput { const value = (key: keyof StoreSettingsInput) => { const entry = formData.get(key); return typeof entry === "string" ? entry : ""; }; return { storeName: value("storeName"), slogan: value("slogan"), whatsapp: value("whatsapp"), instagram: value("instagram"), street: value("street"), number: value("number"), complement: value("complement"), neighborhood: value("neighborhood"), city: value("city"), state: value("state"), zipCode: value("zipCode"), mapsUrl: value("mapsUrl") }; }
export async function updateStoreSettingsAction(_state: StoreSettingsActionState, formData: FormData): Promise<StoreSettingsActionState> { const owner = await requireRole(["OWNER"]); const values = read(formData); try { await storeSettingsService.update(values, owner.id); } catch (error) { if (error instanceof StoreSettingsValidationError) return { success: false, fieldErrors: error.fieldErrors, values }; console.error("Falha ao atualizar configurações institucionais.", error); return { success: false, message: "Não foi possível salvar as configurações.", values }; } invalidatePublicStoreSettings(); revalidatePath("/admin/configuracoes"); redirect("/admin/configuracoes?updated=1"); }

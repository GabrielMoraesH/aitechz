import "server-only";

import { storeSettingsRepository } from "@/server/repositories/storeSettingsRepository";
import type { StoreSettingsDTO } from "@/lib/storeSettings";

export type StoreSettingsField = "storeName" | "slogan" | "whatsapp" | "instagram" | "street" | "number" | "complement" | "neighborhood" | "city" | "state" | "zipCode" | "mapsUrl";
export type StoreSettingsInput = Record<StoreSettingsField, string>;
export type StoreSettingsFieldErrors = Partial<Record<StoreSettingsField, string>>;

export class StoreSettingsValidationError extends Error {
  constructor(public readonly fieldErrors: StoreSettingsFieldErrors) { super("Dados institucionais inválidos."); }
}

function optional(value: string) { const result = value.trim(); return result || null; }

function validate(input: StoreSettingsInput) {
  const errors: StoreSettingsFieldErrors = {};
  const storeName = input.storeName.trim();
  const slogan = optional(input.slogan);
  let whatsapp = input.whatsapp.replace(/\D/g, "");
  const instagram = optional(input.instagram)?.replace(/^@+/, "") ?? null;
  const street = input.street.trim(); const number = input.number.trim();
  const complement = optional(input.complement); const neighborhood = input.neighborhood.trim();
  const city = input.city.trim(); const state = input.state.trim().toUpperCase();
  const zipDigits = input.zipCode.replace(/\D/g, "");
  const zipCode = zipDigits.length === 8 ? `${zipDigits.slice(0, 5)}-${zipDigits.slice(5)}` : input.zipCode.trim();
  const mapsUrl = optional(input.mapsUrl);
  if (!storeName) errors.storeName = "Informe o nome da loja."; else if (storeName.length > 100) errors.storeName = "Use no máximo 100 caracteres.";
  if (slogan && slogan.length > 160) errors.slogan = "Use no máximo 160 caracteres.";
  if (whatsapp.length === 11) whatsapp = `55${whatsapp}`;
  if (whatsapp.length < 12 || whatsapp.length > 15) errors.whatsapp = "Informe um telefone com DDI e DDD válidos.";
  if (instagram && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) errors.instagram = "Informe somente o username do Instagram.";
  if (!street) errors.street = "Informe a rua."; if (!number) errors.number = "Informe o número.";
  if (!neighborhood) errors.neighborhood = "Informe o bairro."; if (!city) errors.city = "Informe a cidade.";
  if (!/^[A-Z]{2}$/.test(state)) errors.state = "Informe a UF com 2 letras.";
  if (zipDigits.length !== 8) errors.zipCode = "Informe um CEP válido com 8 dígitos.";
  if (mapsUrl) { try { const url = new URL(mapsUrl); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); } catch { errors.mapsUrl = "Informe uma URL http ou https válida."; } }
  if (Object.keys(errors).length) throw new StoreSettingsValidationError(errors);
  return { storeName, slogan, whatsapp, instagram, street, number, complement, neighborhood, city, state, zipCode, mapsUrl };
}

function toDto(record: Awaited<ReturnType<typeof storeSettingsRepository.get>>): StoreSettingsDTO {
  if (!record) throw new Error("StoreSettings não foi inicializado. Execute npm run store-settings:seed.");
  return {
    storeName: record.storeName, slogan: record.slogan, whatsapp: record.whatsapp,
    instagram: record.instagram, street: record.street, number: record.number,
    complement: record.complement, neighborhood: record.neighborhood, city: record.city,
    state: record.state, zipCode: record.zipCode, mapsUrl: record.mapsUrl,
    updatedAt: record.updatedAt, updatedByName: record.updatedBy?.name ?? null,
  };
}

export const storeSettingsService = {
  async get(): Promise<StoreSettingsDTO> { return toDto(await storeSettingsRepository.get()); },
  async update(input: StoreSettingsInput, actorUserId: string): Promise<StoreSettingsDTO> {
    const data = validate(input);
    const existing = await storeSettingsRepository.get();
    if (!existing) throw new Error("StoreSettings não foi inicializado. Execute npm run store-settings:seed.");
    return toDto(await storeSettingsRepository.upsert(
      { ...data, updatedBy: { connect: { id: actorUserId } } },
      { ...data, updatedBy: { connect: { id: actorUserId } } },
    ));
  },
};

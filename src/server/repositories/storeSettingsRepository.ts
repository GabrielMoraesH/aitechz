import "server-only";

import type { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";

export const STORE_SETTINGS_KEY = "global";

const select = {
  storeName: true, slogan: true, whatsapp: true, instagram: true,
  street: true, number: true, complement: true, neighborhood: true,
  city: true, state: true, zipCode: true, mapsUrl: true, updatedAt: true,
  updatedBy: { select: { name: true } },
} satisfies Prisma.StoreSettingsSelect;

const publicSelect = {
  storeName: true, slogan: true, whatsapp: true, instagram: true,
  street: true, number: true, complement: true, neighborhood: true,
  city: true, state: true, zipCode: true, mapsUrl: true,
} satisfies Prisma.StoreSettingsSelect;

export const storeSettingsRepository = {
  get() {
    return getDb().storeSettings.findUnique({ where: { singletonKey: STORE_SETTINGS_KEY }, select });
  },
  getPublic() {
    return getDb().storeSettings.findUnique({ where: { singletonKey: STORE_SETTINGS_KEY }, select: publicSelect });
  },
  upsert(data: Prisma.StoreSettingsUpdateInput, create: Prisma.StoreSettingsCreateInput) {
    return getDb().storeSettings.upsert({
      where: { singletonKey: STORE_SETTINGS_KEY },
      update: data,
      create: { ...create, singletonKey: STORE_SETTINGS_KEY },
      select,
    });
  },
};

import "server-only";

import { updateTag } from "next/cache";

export const PUBLIC_CACHE_TAGS = {
  storeSettings: "store-settings",
  categories: "public-categories",
  products: "public-products",
} as const;

export function invalidatePublicStoreSettings() {
  updateTag(PUBLIC_CACHE_TAGS.storeSettings);
}

export function invalidatePublicCategories() {
  updateTag(PUBLIC_CACHE_TAGS.categories);
  updateTag(PUBLIC_CACHE_TAGS.products);
}

export function invalidatePublicProducts() {
  updateTag(PUBLIC_CACHE_TAGS.products);
}

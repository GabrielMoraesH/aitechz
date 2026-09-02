import "server-only";

import { unstable_cache } from "next/cache";

import { PUBLIC_CACHE_TAGS } from "@/server/cache/publicCache";
import { publicCategoryRepository } from "@/server/repositories/publicCategoryRepository";
import type { PublicCategory } from "@/types/publicCategory";

function toPublicCategory(category: PublicCategory): PublicCategory {
  return { id: category.id, name: category.name, slug: category.slug };
}

const getActiveCategories = unstable_cache(
  async () => {
    const categories = await publicCategoryRepository.findActive();
    return categories.map(toPublicCategory);
  },
  ["active-public-categories"],
  { tags: [PUBLIC_CACHE_TAGS.categories] },
);

const getHomeCategories = unstable_cache(
  async () => {
    const categories = await publicCategoryRepository.findForHome();
    return categories.map(toPublicCategory);
  },
  ["home-public-categories"],
  { tags: [PUBLIC_CACHE_TAGS.categories] },
);

export const publicCategoryService = {
  getActiveCategories,
  getHomeCategories,
};

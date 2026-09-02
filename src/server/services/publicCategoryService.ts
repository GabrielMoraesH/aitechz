import "server-only";

import { publicCategoryRepository } from "@/server/repositories/publicCategoryRepository";
import type { PublicCategory } from "@/types/publicCategory";

function toPublicCategory(category: PublicCategory): PublicCategory {
  return { id: category.id, name: category.name, slug: category.slug };
}

export const publicCategoryService = {
  async getActiveCategories() {
    const categories = await publicCategoryRepository.findActive();
    return categories.map(toPublicCategory);
  },

  async getHomeCategories() {
    const categories = await publicCategoryRepository.findForHome();
    return categories.map(toPublicCategory);
  },
};

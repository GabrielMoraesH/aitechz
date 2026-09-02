import "server-only";

import { getDb } from "@/lib/db";

const publicCategoryFields = { id: true, name: true, slug: true } as const;
const categoryOrder = [{ name: "asc" as const }, { id: "asc" as const }];

export const publicCategoryRepository = {
  findActive() {
    return getDb().category.findMany({
      where: { active: true },
      select: publicCategoryFields,
      orderBy: categoryOrder,
    });
  },

  findForHome() {
    return getDb().category.findMany({
      where: { active: true },
      select: publicCategoryFields,
      orderBy: categoryOrder,
      take: 7,
    });
  },
};

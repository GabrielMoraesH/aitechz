import "server-only";

import type { Prisma } from "@prisma/client";

import { getDb } from "@/lib/db";

const publicProductWhere = {
  active: true,
  category: { active: true },
} satisfies Prisma.ProductWhereInput;

const publicProductFields = {
  id: true,
  slug: true,
  name: true,
  brand: true,
  description: true,
  condition: true,
  price: true,
  promotionalPrice: true,
  categoryId: true,
  category: { select: { name: true } },
} satisfies Prisma.ProductSelect;

const primaryImage = {
  select: { url: true, alt: true },
  orderBy: [{ position: "asc" as const }, { createdAt: "asc" as const }],
  take: 1,
};

const productOrder = [{ name: "asc" as const }, { id: "asc" as const }];

export const publicProductRepository = {
  findCatalog() {
    return getDb().product.findMany({
      where: publicProductWhere,
      select: { ...publicProductFields, images: primaryImage },
      orderBy: productOrder,
    });
  },

  findFeatured(take: number) {
    return getDb().product.findMany({
      where: { ...publicProductWhere, featured: true },
      select: { ...publicProductFields, images: primaryImage },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take,
    });
  },

  findByCategorySlug(categorySlug: string) {
    return getDb().product.findMany({
      where: { ...publicProductWhere, category: { active: true, slug: categorySlug } },
      select: { ...publicProductFields, images: primaryImage },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    });
  },

  findBySlug(slug: string) {
    return getDb().product.findFirst({
      where: { ...publicProductWhere, slug },
      select: {
        ...publicProductFields,
        images: {
          select: { url: true, alt: true },
          orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        },
      },
    });
  },

  async findRelated(productId: string, categoryId: string, take: number) {
    const db = getDb();
    const sameCategory = await db.product.findMany({
      where: { ...publicProductWhere, id: { not: productId }, categoryId },
      select: { ...publicProductFields, images: primaryImage },
      orderBy: productOrder,
      take,
    });
    if (sameCategory.length === take) return sameCategory;

    const otherCategories = await db.product.findMany({
      where: { ...publicProductWhere, id: { not: productId }, categoryId: { not: categoryId } },
      select: { ...publicProductFields, images: primaryImage },
      orderBy: productOrder,
      take: take - sameCategory.length,
    });
    return [...sameCategory, ...otherCategories];
  },
};

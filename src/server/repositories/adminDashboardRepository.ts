import "server-only";

import { getDb } from "@/lib/db";

const recentProductSelect = {
  id: true,
  name: true,
  active: true,
  updatedAt: true,
  category: { select: { name: true } },
  images: { select: { url: true, alt: true }, orderBy: { position: "asc" as const }, take: 1 },
  updatedBy: { select: { name: true } },
};

export const adminDashboardRepository = {
  async getOverview(includeActiveUsers: boolean) {
    const db = getDb();
    const [activeProducts, inactiveProducts, activeCategories, offers, featuredProducts, activeUsers, productsWithoutImages, productsWithoutPrice, categoriesWithoutProducts, recentProducts] = await Promise.all([
      db.product.count({ where: { active: true } }),
      db.product.count({ where: { active: false } }),
      db.category.count({ where: { active: true } }),
      db.product.count({ where: { promotionalPrice: { not: null } } }),
      db.product.count({ where: { featured: true, active: true } }),
      includeActiveUsers ? db.user.count({ where: { active: true } }) : Promise.resolve(null),
      db.product.count({ where: { active: true, images: { none: {} } } }),
      db.product.count({ where: { active: true, price: null } }),
      db.category.count({ where: { active: true, products: { none: {} } } }),
      db.product.findMany({ select: recentProductSelect, orderBy: { updatedAt: "desc" }, take: 5 }),
    ]);
    return {
      metrics: { activeProducts, inactiveProducts, activeCategories, offers, featuredProducts, activeUsers },
      attention: { productsWithoutImages, productsWithoutPrice, categoriesWithoutProducts },
      recentProducts,
    };
  },
};

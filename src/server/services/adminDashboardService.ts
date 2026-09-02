import "server-only";

import type { UserRole } from "@prisma/client";
import { adminDashboardRepository } from "@/server/repositories/adminDashboardRepository";

export type AdminDashboardDTO = {
  metrics: { activeProducts: number; inactiveProducts: number; activeCategories: number; offers: number; featuredProducts: number; activeUsers?: number };
  attention: { productsWithoutImages: number; productsWithoutPrice: number; categoriesWithoutProducts: number };
  recentProducts: Array<{ id: string; name: string; categoryName: string; active: boolean; updatedAt: string; updatedByName: string | null; primaryImage: { url: string; alt: string } | null }>;
};

export const adminDashboardService = {
  async getDashboard(role: UserRole): Promise<AdminDashboardDTO> {
    const data = await adminDashboardRepository.getOverview(role === "OWNER");
    return {
      metrics: {
        activeProducts: data.metrics.activeProducts,
        inactiveProducts: data.metrics.inactiveProducts,
        activeCategories: data.metrics.activeCategories,
        offers: data.metrics.offers,
        featuredProducts: data.metrics.featuredProducts,
        ...(data.metrics.activeUsers === null ? {} : { activeUsers: data.metrics.activeUsers }),
      },
      attention: data.attention,
      recentProducts: data.recentProducts.map((product) => ({
        id: product.id,
        name: product.name,
        categoryName: product.category.name,
        active: product.active,
        updatedAt: product.updatedAt.toISOString(),
        updatedByName: product.updatedBy?.name ?? null,
        primaryImage: product.images[0] ?? null,
      })),
    };
  },
};

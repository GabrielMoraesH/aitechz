import "server-only";

import { cache } from "react";

import { publicProductRepository } from "@/server/repositories/publicProductRepository";
import { publicCategoryService } from "@/server/services/publicCategoryService";
import type { PublicProduct } from "@/types/publicProduct";

type RepositoryProduct = Awaited<ReturnType<typeof publicProductRepository.findCatalog>>[number];

function toPublicProduct(product: RepositoryProduct): PublicProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    description: product.description,
    condition: product.condition,
    price: product.price?.toFixed(2) ?? null,
    promotionalPrice: product.promotionalPrice?.toFixed(2) ?? null,
    category: product.category.name,
    images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
  };
}

const getBySlug = cache(async (slug: string) => {
  const product = await publicProductRepository.findBySlug(slug);
  return product ? { dto: toPublicProduct(product), categoryId: product.categoryId } : null;
});

export const publicProductService = {
  async getCatalog() {
    const [products, categories] = await Promise.all([
      publicProductRepository.findCatalog(),
      publicCategoryService.getActiveCategories(),
    ]);

    return {
      products: products.map(toPublicProduct),
      categories,
    };
  },

  async getFeatured() {
    const products = await publicProductRepository.findFeatured(4);
    return products.map(toPublicProduct);
  },

  async getByCategorySlug(categorySlug: string) {
    const products = await publicProductRepository.findByCategorySlug(categorySlug);
    return products.map(toPublicProduct);
  },

  getBySlug,

  async getRelated(productId: string, categoryId: string) {
    const products = await publicProductRepository.findRelated(productId, categoryId, 3);
    return products.map(toPublicProduct);
  },
};

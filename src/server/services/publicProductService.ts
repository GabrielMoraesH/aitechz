import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import { PUBLIC_CACHE_TAGS } from "@/server/cache/publicCache";
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

const getCatalog = unstable_cache(async () => {
  const [products, categories] = await Promise.all([
    publicProductRepository.findCatalog(),
    publicCategoryService.getActiveCategories(),
  ]);
  return { products: products.map(toPublicProduct), categories };
}, ["public-product-catalog"], { tags: [PUBLIC_CACHE_TAGS.products] });

const getFeatured = unstable_cache(async () => {
  const products = await publicProductRepository.findFeatured(4);
  return products.map(toPublicProduct);
}, ["featured-public-products"], { tags: [PUBLIC_CACHE_TAGS.products] });

const getByCategorySlug = unstable_cache(async (categorySlug: string) => {
  const products = await publicProductRepository.findByCategorySlug(categorySlug);
  return products.map(toPublicProduct);
}, ["public-products-by-category"], { tags: [PUBLIC_CACHE_TAGS.products] });

const getBySlugPersistent = unstable_cache(async (slug: string) => {
  const product = await publicProductRepository.findBySlug(slug);
  return product ? { dto: toPublicProduct(product), categoryId: product.categoryId } : null;
}, ["public-product-by-slug"], { tags: [PUBLIC_CACHE_TAGS.products] });

const getBySlug = cache(getBySlugPersistent);

const getRelated = unstable_cache(async (productId: string, categoryId: string) => {
  const products = await publicProductRepository.findRelated(productId, categoryId, 3);
  return products.map(toPublicProduct);
}, ["related-public-products"], { tags: [PUBLIC_CACHE_TAGS.products] });

export const publicProductService = {
  getCatalog,
  getFeatured,
  getByCategorySlug,
  getBySlug,
  getRelated,
};

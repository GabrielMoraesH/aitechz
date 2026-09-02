import "server-only";

import { Prisma } from "@prisma/client";
import { categoryRepository } from "@/server/repositories/categoryRepository";
import { productRepository, type AdminOfferFilters } from "@/server/repositories/productRepository";

export type OfferFieldErrors = { promotionalPrice?: string };
export type OfferProductDto = {
  id: string; slug: string; name: string; brand: string; categoryName: string; active: boolean;
  price: string | null; promotionalPrice: string | null; updatedAt: Date;
  createdByName: string | null; updatedByName: string | null;
  primaryImage: { id: string; url: string; alt: string; position: number } | null;
};

export class OfferValidationError extends Error {
  constructor(public readonly fieldErrors: OfferFieldErrors) { super("Dados da oferta inválidos."); }
}

function normalizeMoney(value: string): string | undefined {
  const raw = value.trim().replace(/\s/g, "").replace(/^R\$/i, "");
  if (!raw || !/^[0-9.,]+$/.test(raw)) return undefined;
  const comma = raw.lastIndexOf(","); const dot = raw.lastIndexOf(".");
  let normalized: string;
  if (comma >= 0 && dot >= 0) {
    const decimalSeparator = comma > dot ? "," : ".";
    normalized = raw.replace(decimalSeparator === "," ? /\./g : /,/g, "").replace(decimalSeparator, ".");
  } else if (comma >= 0) normalized = raw.replace(/\./g, "").replace(",", ".");
  else normalized = raw;
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return undefined;
  return new Prisma.Decimal(normalized).toFixed(2);
}

function toDto(product: Awaited<ReturnType<typeof productRepository.findOfferProductById>> & {}) : OfferProductDto {
  return { id: product!.id, slug: product!.slug, name: product!.name, brand: product!.brand,
    categoryName: product!.category.name, active: product!.active, price: product!.price?.toFixed(2) ?? null,
    promotionalPrice: product!.promotionalPrice?.toFixed(2) ?? null, updatedAt: product!.updatedAt,
    createdByName: product!.createdBy?.name ?? null, updatedByName: product!.updatedBy?.name ?? null,
    primaryImage: product!.images[0] ?? null };
}

export const offerService = {
  async listAdmin(filters: AdminOfferFilters) {
    const result = await productRepository.findOfferPage(filters);
    return { total: result.total, items: result.items.map((item) => toDto(item)) };
  },
  getFilterCategories: () => categoryRepository.findAllOptions(),
  async getById(id: string): Promise<OfferProductDto | null> {
    const product = await productRepository.findOfferProductById(id);
    return product ? toDto(product) : null;
  },
  async setPromotion(id: string, input: string, actorUserId: string) {
    const product = await productRepository.findOfferProductById(id);
    if (!product) return null;
    if (!product.price) throw new OfferValidationError({ promotionalPrice: "Defina um preço normal para este produto antes de criar uma oferta." });
    const normalized = normalizeMoney(input);
    if (!normalized) throw new OfferValidationError({ promotionalPrice: "Informe o preço promocional." });
    const promotionalPrice = new Prisma.Decimal(normalized);
    if (promotionalPrice.lessThanOrEqualTo(0)) throw new OfferValidationError({ promotionalPrice: "O preço promocional deve ser maior que zero." });
    if (promotionalPrice.greaterThanOrEqualTo(product.price)) throw new OfferValidationError({ promotionalPrice: "O preço promocional deve ser menor que o preço normal." });
    return productRepository.setPromotionalPrice(id, promotionalPrice, actorUserId);
  },
  async removePromotion(id: string, actorUserId: string) {
    const product = await productRepository.findOfferProductById(id);
    if (!product) return null;
    return productRepository.clearPromotionalPrice(id, actorUserId);
  },
};

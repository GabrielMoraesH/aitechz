import "server-only";
import { Prisma, type ProductCondition } from "@prisma/client";
import { categoryRepository } from "@/server/repositories/categoryRepository";
import { productRepository } from "@/server/repositories/productRepository";
import { createUniqueSlug } from "@/server/services/slugService";

export type ProductField = "name" | "brand" | "categoryId" | "description" | "condition" | "price" | "promotionalPrice";
export type ProductFieldErrors = Partial<Record<ProductField, string>>;
export type ProductFormInput = { name: string; brand: string; categoryId: string; description: string; condition: string; price: string; promotionalPrice: string; active: boolean; featured: boolean };
export type ProductFormValues = ProductFormInput;
export type CategoryOptionDto = { id: string; name: string; active: boolean };

export class ProductValidationError extends Error {
  constructor(public readonly fieldErrors: ProductFieldErrors) { super("Dados de produto inválidos."); }
}

function normalizeMoney(value: string): string | null | undefined {
  const raw = value.trim().replace(/\s/g, "").replace(/^R\$/i, "");
  if (!raw) return null;
  if (!/^[0-9.,]+$/.test(raw)) return undefined;
  const comma = raw.lastIndexOf(",");
  const dot = raw.lastIndexOf(".");
  let normalized: string;
  if (comma >= 0 && dot >= 0) {
    const decimalSeparator = comma > dot ? "," : ".";
    normalized = raw.replace(decimalSeparator === "," ? /\./g : /,/g, "").replace(decimalSeparator, ".");
  } else if (comma >= 0) normalized = raw.replace(/\./g, "").replace(",", ".");
  else normalized = raw;
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return undefined;
  return new Prisma.Decimal(normalized).toFixed(2);
}

async function validateInput(input: ProductFormInput, currentCategoryId?: string) {
  const fieldErrors: ProductFieldErrors = {};
  const name = input.name.trim(); const brand = input.brand.trim(); const description = input.description.trim();
  if (!name) fieldErrors.name = "Informe o nome do produto.";
  else if (name.length < 2 || name.length > 150) fieldErrors.name = "O nome deve ter entre 2 e 150 caracteres.";
  if (!brand) fieldErrors.brand = "Informe a marca do produto.";
  else if (brand.length < 2 || brand.length > 100) fieldErrors.brand = "A marca deve ter entre 2 e 100 caracteres.";
  if (!description) fieldErrors.description = "Informe a descrição do produto.";
  else if (description.length < 5 || description.length > 5000) fieldErrors.description = "A descrição deve ter entre 5 e 5.000 caracteres.";
  const condition = input.condition === "NEW" || input.condition === "USED" ? input.condition as ProductCondition : undefined;
  if (!condition) fieldErrors.condition = "Selecione uma condição válida.";
  const category = input.categoryId ? await categoryRepository.findById(input.categoryId) : null;
  if (!category || (!category.active && category.id !== currentCategoryId)) fieldErrors.categoryId = "Selecione uma categoria válida.";
  const price = normalizeMoney(input.price); const promotionalPrice = normalizeMoney(input.promotionalPrice);
  if (price === undefined) fieldErrors.price = "Informe um preço válido com até duas casas decimais.";
  else if (price !== null && new Prisma.Decimal(price).lessThanOrEqualTo(0)) fieldErrors.price = "O preço deve ser maior que zero.";
  if (promotionalPrice === undefined) fieldErrors.promotionalPrice = "Informe um preço promocional válido.";
  else if (promotionalPrice !== null && new Prisma.Decimal(promotionalPrice).lessThanOrEqualTo(0)) fieldErrors.promotionalPrice = "O preço promocional deve ser maior que zero.";
  else if (promotionalPrice !== null && price === null) fieldErrors.promotionalPrice = "Informe o preço normal antes do preço promocional.";
  else if (promotionalPrice !== null && price && new Prisma.Decimal(promotionalPrice).greaterThanOrEqualTo(price)) fieldErrors.promotionalPrice = "O preço promocional deve ser menor que o preço normal.";
  if (Object.keys(fieldErrors).length) throw new ProductValidationError(fieldErrors);
  return { name, brand, description, categoryId: category!.id, condition: condition!, price, promotionalPrice, active: input.active, featured: input.featured };
}

function isSlugUniqueError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") return false;
  const values = [error.meta?.target, error.meta?.constraint];
  return values.some((value) => (Array.isArray(value) ? value : [value]).some((part) => typeof part === "string" && part.toLowerCase().includes("slug")));
}

export const productService = {
  async listAdmin(filters: Parameters<typeof productRepository.findAdminPage>[0]) {
    const result = await productRepository.findAdminPage(filters);
    return { ...result, items: result.items.map((item) => ({
      id: item.id, name: item.name, brand: item.brand, categoryName: item.category.name,
      condition: item.condition, active: item.active, featured: item.featured,
      price: item.price?.toFixed(2) ?? null, promotionalPrice: item.promotionalPrice?.toFixed(2) ?? null,
      updatedAt: item.updatedAt, primaryImage: item.images[0] ?? null,
      createdByName: item.createdBy?.name ?? null, updatedByName: item.updatedBy?.name ?? null,
    })) };
  },
  getActiveCategories: () => categoryRepository.findActive(),
  getAdminFilterCategories: () => categoryRepository.findAllOptions(),
  async getForEdit(id: string) {
    const product = await productRepository.findById(id);
    if (!product) return null;
    const values: ProductFormValues = { name: product.name, brand: product.brand, categoryId: product.categoryId, description: product.description, condition: product.condition, price: product.price?.toFixed(2).replace(".", ",") ?? "", promotionalPrice: product.promotionalPrice?.toFixed(2).replace(".", ",") ?? "", active: product.active, featured: product.featured };
    return { values, categories: await categoryRepository.findForProductEdit(product.categoryId), images: product.images.map((image) => ({ id: image.id, url: image.url, alt: image.alt, position: image.position })) };
  },
  async create(input: ProductFormInput, actorUserId: string) {
    const data = await validateInput(input);
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const slug = await createUniqueSlug(data.name, productRepository.findSlugExists);
      try { return await productRepository.create({ ...data, slug, createdById: actorUserId, updatedById: actorUserId }); }
      catch (error) { if (!isSlugUniqueError(error) || attempt === 3) throw error; }
    }
    throw new Error("Não foi possível gerar um slug único.");
  },
  async update(id: string, input: ProductFormInput, actorUserId: string) {
    const existing = await productRepository.findById(id); if (!existing) return false;
    await productRepository.update(id, { ...await validateInput(input, existing.categoryId), updatedById: actorUserId }); return true;
  },
  async toggleActive(id: string, actorUserId: string) {
    const existing = await productRepository.findById(id); if (!existing) return false;
    await productRepository.setActive(id, !existing.active, actorUserId); return true;
  },
  rollbackCreatedProduct: (id: string) => productRepository.rollbackCreatedProduct(id),
};

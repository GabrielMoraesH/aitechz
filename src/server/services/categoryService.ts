import "server-only";

import { Prisma } from "@prisma/client";
import { categoryRepository, type AdminCategoryFilters } from "@/server/repositories/categoryRepository";
import { createUniqueSlug } from "@/server/services/slugService";

export type CategoryField = "name" | "active";
export type CategoryFieldErrors = Partial<Record<CategoryField, string>>;
export type CategoryFormInput = { name: string; active: boolean };
export type CategoryFormValues = CategoryFormInput;
export type AdminCategoryDto = { id: string; name: string; slug: string; active: boolean; productCount: number; updatedAt: Date; createdByName: string | null; updatedByName: string | null };
export type CategoryFormDto = { id: string; name: string; active: boolean; productCount: number };

export class CategoryValidationError extends Error {
  constructor(public readonly fieldErrors: CategoryFieldErrors) {
    super("Dados de categoria inválidos.");
  }
}

function validateInput(input: CategoryFormInput): CategoryFormInput {
  const fieldErrors: CategoryFieldErrors = {};
  const name = input.name.trim();
  if (!name) fieldErrors.name = "Informe o nome da categoria.";
  else if (name.length < 2 || name.length > 80) fieldErrors.name = "O nome deve ter entre 2 e 80 caracteres.";
  if (typeof input.active !== "boolean") fieldErrors.active = "Informe um status válido para a categoria.";
  if (Object.keys(fieldErrors).length) throw new CategoryValidationError(fieldErrors);
  return { name, active: input.active };
}

function isSlugUniqueError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") return false;
  const values = [error.meta?.target, error.meta?.constraint];
  return values.some((value) => (Array.isArray(value) ? value : [value]).some(
    (part) => typeof part === "string" && part.toLowerCase().includes("slug"),
  ));
}

export const categoryService = {
  async listAdmin(filters: AdminCategoryFilters) {
    const result = await categoryRepository.findAdminPage(filters);
    const items: AdminCategoryDto[] = result.items.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      active: item.active,
      productCount: item._count.products,
      updatedAt: item.updatedAt,
      createdByName: item.createdBy?.name ?? null,
      updatedByName: item.updatedBy?.name ?? null,
    }));
    return { items, total: result.total };
  },
  async getForEdit(id: string): Promise<CategoryFormDto | null> {
    const category = await categoryRepository.findById(id);
    if (!category) return null;
    return { id: category.id, name: category.name, active: category.active, productCount: category._count.products };
  },
  async create(input: CategoryFormInput, actorUserId: string) {
    const data = validateInput(input);
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const slug = await createUniqueSlug(data.name, categoryRepository.findSlugExists);
      try {
        return await categoryRepository.create({ ...data, slug, createdBy: { connect: { id: actorUserId } }, updatedBy: { connect: { id: actorUserId } } });
      } catch (error) {
        if (!isSlugUniqueError(error) || attempt === 3) throw error;
      }
    }
    throw new Error("Não foi possível gerar um slug único.");
  },
  async update(id: string, input: CategoryFormInput, actorUserId: string) {
    const existing = await categoryRepository.findById(id);
    if (!existing) return false;
    await categoryRepository.update(id, { ...validateInput(input), updatedBy: { connect: { id: actorUserId } } });
    return true;
  },
  async toggleActive(id: string, actorUserId: string) {
    const existing = await categoryRepository.findById(id);
    if (!existing) return false;
    await categoryRepository.setActive(id, !existing.active, actorUserId);
    return true;
  },
};

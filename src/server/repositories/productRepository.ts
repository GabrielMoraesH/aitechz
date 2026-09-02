import "server-only";

import type { Prisma, ProductCondition } from "@prisma/client";
import { getDb } from "@/lib/db";

export type AdminProductFilters = { page: number; pageSize: number; search?: string; active?: boolean; condition?: ProductCondition; categoryId?: string };
export type AdminOfferFilters = { page: number; pageSize: number; search?: string; offered?: boolean; active?: boolean; categoryId?: string };
const adminProductSelect = {
  id: true, slug: true, name: true, brand: true, description: true, active: true,
  featured: true, condition: true, price: true, promotionalPrice: true, categoryId: true,
  updatedAt: true, category: { select: { id: true, name: true, active: true } },
  images: { select: { id: true, url: true, alt: true, position: true }, orderBy: { position: "asc" as const }, take: 1 },
  createdBy: { select: { id: true, name: true } }, updatedBy: { select: { id: true, name: true } },
} satisfies Prisma.ProductSelect;
const adminProductDetailSelect = {
  ...adminProductSelect,
  images: { select: { id: true, url: true, alt: true, position: true }, orderBy: { position: "asc" as const } },
} satisfies Prisma.ProductSelect;

export const productRepository = {
  async findAdminPage(filters: AdminProductFilters) {
    const where: Prisma.ProductWhereInput = {
      ...(filters.active === undefined ? {} : { active: filters.active }),
      ...(filters.condition ? { condition: filters.condition } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.search ? { OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { brand: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ] } : {}),
    };
    const db = getDb();
    const [items, total] = await db.$transaction([
      db.product.findMany({ where, select: adminProductSelect, orderBy: { updatedAt: "desc" }, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }),
      db.product.count({ where }),
    ]);
    return { items, total };
  },
  async findOfferPage(filters: AdminOfferFilters) {
    const where: Prisma.ProductWhereInput = {
      ...(filters.offered === undefined ? {} : { promotionalPrice: filters.offered ? { not: null } : null }),
      ...(filters.active === undefined ? {} : { active: filters.active }),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.search ? { OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { brand: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ] } : {}),
    };
    const db = getDb();
    const [items, total] = await db.$transaction([
      db.product.findMany({ where, select: adminProductSelect, orderBy: [{ promotionalPrice: { sort: "asc", nulls: "last" } }, { updatedAt: "desc" }], skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }),
      db.product.count({ where }),
    ]);
    return { items, total };
  },
  findOfferProductById(id: string) { return getDb().product.findUnique({ where: { id }, select: adminProductSelect }); },
  setPromotionalPrice(id: string, promotionalPrice: Prisma.Decimal, actorUserId: string) { return getDb().product.update({ where: { id }, data: { promotionalPrice, updatedById: actorUserId }, select: { id: true, slug: true } }); },
  clearPromotionalPrice(id: string, actorUserId: string) { return getDb().product.update({ where: { id }, data: { promotionalPrice: null, updatedById: actorUserId }, select: { id: true, slug: true } }); },
  findById(id: string) { return getDb().product.findUnique({ where: { id }, select: adminProductDetailSelect }); },
  create(data: Prisma.ProductUncheckedCreateInput) { return getDb().product.create({ data, select: { id: true, slug: true } }); },
  update(id: string, data: Prisma.ProductUncheckedUpdateInput) { return getDb().product.update({ where: { id }, data, select: { id: true } }); },
  setActive(id: string, active: boolean, actorUserId: string) { return getDb().product.update({ where: { id }, data: { active, updatedById: actorUserId }, select: { id: true } }); },
  rollbackCreatedProduct(id: string) { return getDb().product.delete({ where: { id }, select: { id: true } }); },
  async findSlugExists(slug: string): Promise<boolean> {
    return (await getDb().product.findUnique({ where: { slug }, select: { id: true } })) !== null;
  },
};

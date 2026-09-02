import "server-only";
import type { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";

const categoryOptionSelect = { id: true, name: true, active: true } as const;
const adminCategorySelect = {
  id: true,
  name: true,
  slug: true,
  active: true,
  updatedAt: true,
  _count: { select: { products: true } },
  createdBy: { select: { id: true, name: true } },
  updatedBy: { select: { id: true, name: true } },
} satisfies Prisma.CategorySelect;

export type AdminCategoryFilters = {
  page: number;
  pageSize: number;
  search?: string;
  active?: boolean;
};

export const categoryRepository = {
  async findAdminPage(filters: AdminCategoryFilters) {
    const where: Prisma.CategoryWhereInput = {
      ...(filters.active === undefined ? {} : { active: filters.active }),
      ...(filters.search ? {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { slug: { contains: filters.search, mode: "insensitive" } },
        ],
      } : {}),
    };
    const db = getDb();
    const [items, total] = await db.$transaction([
      db.category.findMany({
        where,
        select: adminCategorySelect,
        orderBy: { name: "asc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      db.category.count({ where }),
    ]);
    return { items, total };
  },
  async findSlugExists(slug: string): Promise<boolean> { return (await getDb().category.findUnique({ where: { slug }, select: { id: true } })) !== null; },
  findActive() { return getDb().category.findMany({ where: { active: true }, select: categoryOptionSelect, orderBy: { name: "asc" } }); },
  findAllOptions() { return getDb().category.findMany({ select: categoryOptionSelect, orderBy: { name: "asc" } }); },
  findForProductEdit(currentCategoryId: string) { return getDb().category.findMany({ where: { OR: [{ active: true }, { id: currentCategoryId }] }, select: categoryOptionSelect, orderBy: { name: "asc" } }); },
  findById(id: string) { return getDb().category.findUnique({ where: { id }, select: { ...categoryOptionSelect, slug: true, _count: { select: { products: true } } } }); },
  create(data: Prisma.CategoryCreateInput) { return getDb().category.create({ data, select: { id: true, slug: true } }); },
  update(id: string, data: Prisma.CategoryUpdateInput) { return getDb().category.update({ where: { id }, data, select: { id: true } }); },
  setActive(id: string, active: boolean, actorUserId: string) { return getDb().category.update({ where: { id }, data: { active, updatedBy: { connect: { id: actorUserId } } }, select: { id: true } }); },
};

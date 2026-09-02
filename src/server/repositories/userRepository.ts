import "server-only";

import type { Prisma, UserRole } from "@prisma/client";
import { getDb } from "@/lib/db";

const adminUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type AdminUserFilters = {
  page: number;
  pageSize: number;
  search?: string;
  active?: boolean;
  role?: UserRole;
};

export const userRepository = {
  async findAdminPage(filters: AdminUserFilters) {
    const where: Prisma.UserWhereInput = {
      ...(filters.active === undefined ? {} : { active: filters.active }),
      ...(filters.role ? { role: filters.role } : {}),
      ...(filters.search ? { OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ] } : {}),
    };
    const db = getDb();
    const [items, total] = await db.$transaction([
      db.user.findMany({ where, select: adminUserSelect, orderBy: [{ name: "asc" }, { id: "asc" }], skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }),
      db.user.count({ where }),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return getDb().user.findUnique({ where: { id }, select: adminUserSelect });
  },

  findByEmail(email: string) {
    return getDb().user.findUnique({ where: { email }, select: { id: true } });
  },

  findByEmailForAuthentication(email: string) {
    return getDb().user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true, role: true, active: true },
    });
  },

  createEmployee(data: { name: string; email: string; passwordHash: string; active: boolean }) {
    return getDb().user.create({ data: { ...data, role: "EMPLOYEE" }, select: adminUserSelect });
  },

  update(id: string, data: { name: string; email: string; active: boolean }) {
    return getDb().user.update({ where: { id }, data, select: adminUserSelect });
  },

  setActive(id: string, active: boolean) {
    return getDb().user.update({ where: { id }, data: { active }, select: adminUserSelect });
  },

  updatePassword(id: string, passwordHash: string) {
    return getDb().user.update({ where: { id }, data: { passwordHash }, select: { id: true } });
  },

  countActiveOwners() {
    return getDb().user.count({ where: { role: "OWNER", active: true } });
  },

  async deactivateWithOwnerProtection(id: string, data?: { name: string; email: string }) {
    return getDb().$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id }, select: { id: true, role: true, active: true } });
      if (!user) return { status: "not-found" as const };
      if (!user.active) return { status: "unchanged" as const };
      if (user.role === "OWNER") {
        const activeOwners = await tx.user.count({ where: { role: "OWNER", active: true } });
        if (activeOwners <= 1) return { status: "last-owner" as const };
      }
      await tx.user.update({ where: { id }, data: { ...data, active: false } });
      await tx.authSession.deleteMany({ where: { userId: id } });
      return { status: "updated" as const };
    }, { isolationLevel: "Serializable" });
  },
};

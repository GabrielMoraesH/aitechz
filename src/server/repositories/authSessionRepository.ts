import "server-only";

import { getDb } from "@/lib/db";

export const authSessionRepository = {
  create(userId: string, tokenHash: string, expiresAt: Date) {
    return getDb().authSession.create({
      data: { userId, tokenHash, expiresAt },
      select: { id: true, expiresAt: true },
    });
  },

  findByTokenHash(tokenHash: string) {
    return getDb().authSession.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        expiresAt: true,
        user: { select: { id: true, name: true, email: true, role: true, active: true } },
      },
    });
  },

  deleteByTokenHash(tokenHash: string) {
    return getDb().authSession.deleteMany({ where: { tokenHash } });
  },

  deleteByUserId(userId: string) {
    return getDb().authSession.deleteMany({ where: { userId } });
  },
};

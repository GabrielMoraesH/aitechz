import "server-only";

import { createHash, randomBytes } from "node:crypto";
import type { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_DURATION_MS } from "@/lib/auth";
import { authSessionRepository } from "@/server/repositories/authSessionRepository";

export type AdminUser = { id: string; name: string; email: string; role: UserRole };

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_DURATION_MS);

  await authSessionRepository.create(userId, hashSessionToken(token), expiresAt);
  (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: expiresAt,
    priority: "high",
  });
}

export const getCurrentSession = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const session = await authSessionRepository.findByTokenHash(tokenHash);
  if (!session) return null;

  if (session.expiresAt <= new Date() || !session.user.active) {
    await authSessionRepository.deleteByTokenHash(tokenHash);
    return null;
  }

  const { id, name, email, role } = session.user;
  return { id, name, email, role };
});

export async function invalidateCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) await authSessionRepository.deleteByTokenHash(hashSessionToken(token));

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(0),
  });
}

export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getCurrentSession();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireRole(roles: readonly UserRole[]): Promise<AdminUser> {
  const user = await requireAdminUser();
  if (!roles.includes(user.role)) redirect("/admin");
  return user;
}

import type { UserRole } from "@prisma/client";

export const ADMIN_SESSION_COOKIE = "aitechz_admin_session";
export const ADMIN_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getRoleLabel(role: UserRole): string {
  return role === "OWNER" ? "Proprietário" : "Funcionário";
}

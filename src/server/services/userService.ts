import "server-only";

import { Prisma, type UserRole } from "@prisma/client";
import { normalizeEmail } from "@/lib/auth";
import { authSessionRepository } from "@/server/repositories/authSessionRepository";
import { userRepository, type AdminUserFilters } from "@/server/repositories/userRepository";
import { hashPassword } from "@/server/services/passwordService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UserField = "name" | "email" | "password" | "passwordConfirmation" | "active";
export type UserFieldErrors = Partial<Record<UserField, string>>;
export type CreateEmployeeInput = { name: string; email: string; password: string; passwordConfirmation: string; active: boolean };
export type UpdateUserInput = { name: string; email: string; active: boolean };
export type ResetPasswordInput = { password: string; passwordConfirmation: string };
export type UserFormValues = { name: string; email: string; active: boolean };
export type AdminUserDto = { id: string; name: string; email: string; role: UserRole; active: boolean; createdAt: Date; updatedAt: Date };
export type UserFormDto = { id: string; name: string; email: string; role: UserRole; active: boolean };

export class UserValidationError extends Error {
  constructor(public readonly fieldErrors: UserFieldErrors) { super("Dados de usuário inválidos."); }
}
export class DuplicateUserEmailError extends Error {}
export class UserRuleError extends Error {}

function validateIdentity(input: UpdateUserInput): UpdateUserInput {
  const fieldErrors: UserFieldErrors = {};
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  if (!name) fieldErrors.name = "Informe o nome do usuário.";
  else if (name.length < 2 || name.length > 100) fieldErrors.name = "O nome deve ter entre 2 e 100 caracteres.";
  if (!email) fieldErrors.email = "Informe o email do usuário.";
  else if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Informe um email válido.";
  if (typeof input.active !== "boolean") fieldErrors.active = "Informe um status válido.";
  if (Object.keys(fieldErrors).length) throw new UserValidationError(fieldErrors);
  return { name, email, active: input.active };
}

function validatePassword(input: ResetPasswordInput): string {
  const fieldErrors: UserFieldErrors = {};
  if (input.password.length < 12) fieldErrors.password = "A senha deve ter no mínimo 12 caracteres.";
  if (input.password !== input.passwordConfirmation) fieldErrors.passwordConfirmation = "As senhas não coincidem.";
  if (Object.keys(fieldErrors).length) throw new UserValidationError(fieldErrors);
  return input.password;
}

function isEmailUniqueError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") return false;
  return [error.meta?.target, error.meta?.constraint].some((value) => (Array.isArray(value) ? value : [value]).some(
    (part) => typeof part === "string" && part.toLowerCase().includes("email"),
  ));
}

async function withDuplicateEmailHandling<T>(operation: () => Promise<T>): Promise<T> {
  try { return await operation(); }
  catch (error) { if (isEmailUniqueError(error)) throw new DuplicateUserEmailError(); throw error; }
}

export const userService = {
  async listAdmin(filters: AdminUserFilters) {
    const result = await userRepository.findAdminPage(filters);
    return { items: result.items as AdminUserDto[], total: result.total };
  },
  async getForEdit(id: string): Promise<UserFormDto | null> {
    const user = await userRepository.findById(id);
    return user ? { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active } : null;
  },
  async createEmployee(input: CreateEmployeeInput) {
    const data = validateIdentity(input);
    const password = validatePassword(input);
    const passwordHash = await hashPassword(password);
    return withDuplicateEmailHandling(() => userRepository.createEmployee({ ...data, passwordHash }));
  },
  async update(id: string, input: UpdateUserInput, actorUserId: string) {
    const existing = await userRepository.findById(id);
    if (!existing) return false;
    const data = validateIdentity(input);
    if (id === actorUserId && existing.active && !data.active) throw new UserRuleError("Você não pode desativar seu próprio usuário.");
    if (existing.active && !data.active) {
      let result;
      try { result = await userRepository.deactivateWithOwnerProtection(id, { name: data.name, email: data.email }); }
      catch (error) { if (isEmailUniqueError(error)) throw new DuplicateUserEmailError(); throw error; }
      if (result.status === "last-owner") throw new UserRuleError("Não é possível desativar o último proprietário ativo.");
      if (result.status === "not-found") return false;
      return true;
    }
    await withDuplicateEmailHandling(() => userRepository.update(id, data));
    return true;
  },
  async toggleActive(id: string, actorUserId: string) {
    const existing = await userRepository.findById(id);
    if (!existing) return { found: false, active: false };
    if (existing.active) {
      if (id === actorUserId) throw new UserRuleError("Você não pode desativar seu próprio usuário.");
      const result = await userRepository.deactivateWithOwnerProtection(id);
      if (result.status === "last-owner") throw new UserRuleError("Não é possível desativar o último proprietário ativo.");
      return { found: result.status !== "not-found", active: false };
    }
    await userRepository.setActive(id, true);
    return { found: true, active: true };
  },
  async resetPassword(id: string, input: ResetPasswordInput) {
    if (!(await userRepository.findById(id))) return false;
    const passwordHash = await hashPassword(validatePassword(input));
    await userRepository.updatePassword(id, passwordHash);
    await authSessionRepository.deleteByUserId(id);
    return true;
  },
};

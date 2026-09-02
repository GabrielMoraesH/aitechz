"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/server/services/sessionService";
import {
  DuplicateUserEmailError, UserRuleError, UserValidationError, userService,
  type CreateEmployeeInput, type ResetPasswordInput, type UpdateUserInput, type UserFieldErrors,
} from "@/server/services/userService";

export type UserActionState = { success: false; message?: string; fieldErrors?: UserFieldErrors; values?: { name: string; email: string; active: boolean } } | null;
export type PasswordActionState = { success: false; message?: string; fieldErrors?: UserFieldErrors } | null;

const value = (formData: FormData, key: string) => typeof formData.get(key) === "string" ? String(formData.get(key)) : "";
function identityInput(formData: FormData): UpdateUserInput { return { name: value(formData, "name"), email: value(formData, "email"), active: formData.get("active") === "on" }; }
function passwordInput(formData: FormData): ResetPasswordInput { return { password: value(formData, "password"), passwordConfirmation: value(formData, "passwordConfirmation") }; }

function userError(error: unknown, values: UpdateUserInput): UserActionState {
  if (error instanceof UserValidationError) return { success: false, fieldErrors: error.fieldErrors, values };
  if (error instanceof DuplicateUserEmailError) return { success: false, fieldErrors: { email: "Já existe um usuário com este email." }, values };
  if (error instanceof UserRuleError) return { success: false, message: error.message, values };
  console.error("Falha ao salvar usuário administrativo.", error);
  return { success: false, message: "Não foi possível salvar o usuário.", values };
}

export async function createEmployeeAction(_state: UserActionState, formData: FormData): Promise<UserActionState> {
  await requireRole(["OWNER"]);
  const identity = identityInput(formData);
  const input: CreateEmployeeInput = { ...identity, ...passwordInput(formData) };
  try { await userService.createEmployee(input); }
  catch (error) { return userError(error, identity); }
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?created=1");
}

export async function updateUserAction(id: string, _state: UserActionState, formData: FormData): Promise<UserActionState> {
  const actor = await requireRole(["OWNER"]);
  const input = identityInput(formData);
  try { if (!(await userService.update(id, input, actor.id))) return { success: false, message: "Usuário não encontrado.", values: input }; }
  catch (error) { return userError(error, input); }
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?updated=1");
}

export async function toggleUserActiveAction(id: string): Promise<void> {
  const actor = await requireRole(["OWNER"]);
  let active: boolean;
  let found: boolean;
  try {
    const result = await userService.toggleActive(id, actor.id);
    found = result.found;
    active = result.active;
  } catch (error) {
    if (error instanceof UserRuleError) return redirect(`/admin/usuarios?error=${encodeURIComponent(error.message)}`);
    console.error("Falha ao alterar status do usuário.", error);
    return redirect("/admin/usuarios?error=status");
  }
  if (!found) redirect("/admin/usuarios?error=not-found");
  revalidatePath("/admin/usuarios");
  redirect(`/admin/usuarios?${active ? "reactivated" : "deactivated"}=1`);
}

export async function resetUserPasswordAction(id: string, _state: PasswordActionState, formData: FormData): Promise<PasswordActionState> {
  const actor = await requireRole(["OWNER"]);
  try { if (!(await userService.resetPassword(id, passwordInput(formData)))) return { success: false, message: "Usuário não encontrado." }; }
  catch (error) {
    if (error instanceof UserValidationError) return { success: false, fieldErrors: error.fieldErrors };
    console.error("Falha ao redefinir senha administrativa.", error);
    return { success: false, message: "Não foi possível redefinir a senha." };
  }
  revalidatePath("/admin/usuarios");
  if (id === actor.id) redirect("/admin/login");
  redirect(`/admin/usuarios/${id}/editar?password=1`);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/server/services/sessionService";
import { categoryService, CategoryValidationError, type CategoryFieldErrors, type CategoryFormInput } from "@/server/services/categoryService";

export type CategoryActionState = {
  success: false;
  message?: string;
  fieldErrors?: CategoryFieldErrors;
  values?: CategoryFormInput;
} | null;

function readInput(formData: FormData): CategoryFormInput {
  const name = formData.get("name");
  return { name: typeof name === "string" ? name : "", active: formData.get("active") === "on" };
}

function actionError(error: unknown, values: CategoryFormInput): CategoryActionState {
  if (error instanceof CategoryValidationError) return { success: false, fieldErrors: error.fieldErrors, values };
  console.error("Falha ao salvar categoria administrativa.", error);
  return { success: false, message: "Não foi possível salvar a categoria.", values };
}

export async function createCategoryAction(_state: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  const currentUser = await requireAdminUser();
  const values = readInput(formData);
  try { await categoryService.create(values, currentUser.id); }
  catch (error) { return actionError(error, values); }
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  redirect("/admin/categorias?created=1");
}

export async function updateCategoryAction(id: string, _state: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  const currentUser = await requireAdminUser();
  const values = readInput(formData);
  try {
    const updated = await categoryService.update(id, values, currentUser.id);
    if (!updated) return { success: false, message: "Categoria não encontrada.", values };
  } catch (error) { return actionError(error, values); }
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  redirect("/admin/categorias?updated=1");
}

export async function toggleCategoryActiveAction(id: string, wasActive: boolean): Promise<void> {
  const currentUser = await requireAdminUser();
  await categoryService.toggleActive(id, currentUser.id);
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  redirect(`/admin/categorias?${wasActive ? "deactivated" : "reactivated"}=1`);
}

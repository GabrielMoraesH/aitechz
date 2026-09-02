"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productService, ProductValidationError, type ProductFieldErrors, type ProductFormInput } from "@/server/services/productService";
import { productImageService, ProductImageValidationError } from "@/server/services/productImageService";
import { requireAdminUser } from "@/server/services/sessionService";

export type ProductActionState = { success: false; message?: string; imageError?: string; fieldErrors?: ProductFieldErrors; values?: ProductFormInput } | null;

function readInput(formData: FormData): ProductFormInput {
  const text = (name: string) => { const value = formData.get(name); return typeof value === "string" ? value : ""; };
  return { name: text("name"), brand: text("brand"), categoryId: text("categoryId"), description: text("description"), condition: text("condition"), price: text("price"), promotionalPrice: text("promotionalPrice"), active: formData.get("active") === "on", featured: formData.get("featured") === "on" };
}

function actionError(error: unknown, values: ProductFormInput): ProductActionState {
  if (error instanceof ProductValidationError) return { success: false, fieldErrors: error.fieldErrors, values };
  if (error instanceof ProductImageValidationError) return { success: false, imageError: error.message, values };
  console.error("Falha ao salvar produto administrativo.", error);
  return { success: false, message: "Não foi possível salvar o produto.", values };
}

function readImages(formData: FormData): File[] {
  return formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
}

export async function createProductAction(_state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const currentUser = await requireAdminUser();
  const values = readInput(formData);
  let createdProductId: string | undefined;
  try {
    const prepared = await productImageService.prepareUploads(readImages(formData), 0);
    const product = await productService.create(values, currentUser.id);
    createdProductId = product.id;
    await productImageService.addPrepared(product.id, prepared);
  }
  catch (error) {
    if (createdProductId) {
      try {
        await productImageService.cleanupCreatedProduct(createdProductId);
        await productService.rollbackCreatedProduct(createdProductId);
      } catch (rollbackError) { console.error("Falha no rollback do produto criado durante upload.", rollbackError); }
    }
    return actionError(error, values);
  }
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos?created=1");
}

export async function updateProductAction(id: string, _state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const currentUser = await requireAdminUser();
  const values = readInput(formData);
  try {
    const files = readImages(formData);
    const existing = await productService.getForEdit(id);
    if (!existing) return { success: false, message: "Produto não encontrado.", values };
    const prepared = await productImageService.prepareUploads(files, existing.images.length);
    const updated = await productService.update(id, values, currentUser.id);
    if (!updated) return { success: false, message: "Produto não encontrado.", values };
    await productImageService.addPrepared(id, prepared);
  } catch (error) { return actionError(error, values); }
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos?updated=1");
}

export async function removeProductImageAction(productId: string, imageId: string): Promise<void> {
  await requireAdminUser();
  try {
    await productImageService.remove(productId, imageId);
  } catch (error) {
    console.error("Falha ao remover imagem administrativa.", error);
    redirect(`/admin/produtos/${productId}/editar?imageError=remove`);
  }
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}/editar`);
  redirect(`/admin/produtos/${productId}/editar?imageRemoved=1`);
}

export async function moveProductImageAction(productId: string, imageId: string, direction: "previous" | "next"): Promise<void> {
  await requireAdminUser();
  try { await productImageService.move(productId, imageId, direction); }
  catch (error) {
    console.error("Falha ao reordenar imagem administrativa.", error);
    redirect(`/admin/produtos/${productId}/editar?imageError=order`);
  }
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}/editar`);
}

export async function toggleProductActiveAction(id: string, wasActive: boolean): Promise<void> {
  const currentUser = await requireAdminUser();
  await productService.toggleActive(id, currentUser.id);
  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos?${wasActive ? "deactivated" : "reactivated"}=1`);
}

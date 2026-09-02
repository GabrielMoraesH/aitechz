"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { offerService, OfferValidationError, type OfferFieldErrors } from "@/server/services/offerService";
import { requireAdminUser } from "@/server/services/sessionService";

export type OfferActionState = { success: false; message?: string; fieldErrors?: OfferFieldErrors; value?: string } | null;

export async function setProductPromotionAction(id: string, hadPromotion: boolean, _state: OfferActionState, formData: FormData): Promise<OfferActionState> {
  const currentUser = await requireAdminUser();
  const raw = formData.get("promotionalPrice"); const value = typeof raw === "string" ? raw : "";
  try {
    const updated = await offerService.setPromotion(id, value, currentUser.id);
    if (!updated) return { success: false, message: "Produto não encontrado.", value };
  } catch (error) {
    if (error instanceof OfferValidationError) return { success: false, fieldErrors: error.fieldErrors, value };
    console.error("Falha ao salvar oferta administrativa.", error);
    return { success: false, message: "Não foi possível salvar a oferta.", value };
  }
  revalidatePath("/admin/ofertas"); revalidatePath(`/admin/ofertas/${id}`); revalidatePath("/produtos"); revalidatePath("/produtos/[slug]", "page");
  redirect(`/admin/ofertas?${hadPromotion ? "updated" : "added"}=1`);
}

export async function removeProductPromotionAction(id: string): Promise<void> {
  const currentUser = await requireAdminUser();
  await offerService.removePromotion(id, currentUser.id);
  revalidatePath("/admin/ofertas"); revalidatePath(`/admin/ofertas/${id}`); revalidatePath("/produtos"); revalidatePath("/produtos/[slug]", "page");
  redirect("/admin/ofertas?removed=1");
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type Feedback = { key: string; type: "success" | "error" | "warning" | "info"; message: string; duration: number };
const FEEDBACK_KEYS = ["created", "updated", "deactivated", "reactivated", "added", "removed", "error", "password", "imageRemoved", "imageError"];

function getFeedback(pathname: string, params: URLSearchParams): Feedback | null {
  const success = (key: string, message: string): Feedback | null => params.get(key) === "1" ? { key, type: "success", message, duration: 3500 } : null;

  if (pathname === "/admin/produtos") return success("created", "Produto criado com sucesso.") ?? success("updated", "Produto atualizado com sucesso.") ?? success("deactivated", "Produto desativado com sucesso.") ?? success("reactivated", "Produto reativado com sucesso.");
  if (pathname === "/admin/categorias") return success("created", "Categoria criada com sucesso.") ?? success("updated", "Categoria atualizada com sucesso.") ?? success("deactivated", "Categoria desativada com sucesso.") ?? success("reactivated", "Categoria reativada com sucesso.");
  if (pathname === "/admin/ofertas") return success("added", "Oferta adicionada com sucesso.") ?? success("updated", "Oferta atualizada com sucesso.") ?? success("removed", "Oferta removida com sucesso.");
  if (pathname === "/admin/usuarios") {
    const result = success("created", "Funcionário criado com sucesso.") ?? success("updated", "Usuário atualizado com sucesso.") ?? success("deactivated", "Usuário desativado com sucesso.") ?? success("reactivated", "Usuário reativado com sucesso.");
    if (result) return result;
    const error = params.get("error");
    if (error) return { key: "error", type: "error", message: error === "status" ? "Não foi possível alterar o status do usuário." : error === "not-found" ? "Usuário não encontrado." : error, duration: 5500 };
  }
  if (pathname === "/admin/configuracoes") return success("updated", "Configurações atualizadas com sucesso.");
  if (/^\/admin\/usuarios\/[^/]+\/editar$/.test(pathname)) return success("password", "Senha redefinida com sucesso.");
  if (/^\/admin\/produtos\/[^/]+\/editar$/.test(pathname)) {
    const removed = success("imageRemoved", "Imagem removida com sucesso.");
    if (removed) return removed;
    const imageError = params.get("imageError");
    if (imageError) return { key: "imageError", type: "error", message: imageError === "order" ? "Não foi possível alterar a ordem das imagens." : "Não foi possível remover a imagem.", duration: 5500 };
  }
  return null;
}

export function ToastFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const feedback = getFeedback(pathname, new URLSearchParams(searchParams.toString()));
    if (!feedback) { handled.current = null; return; }
    const signature = `${pathname}?${searchParams.toString()}`;
    if (handled.current === signature) return;
    handled.current = signature;

    toast[feedback.type](feedback.message, { duration: feedback.duration });
    const nextParams = new URLSearchParams(searchParams.toString());
    for (const key of FEEDBACK_KEYS) nextParams.delete(key);
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}

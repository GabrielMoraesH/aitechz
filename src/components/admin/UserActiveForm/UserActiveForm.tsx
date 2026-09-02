"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import { useFormStatus } from "react-dom";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog/ConfirmDialog";

export function UserActiveForm({ active, action, className }: { active: boolean; action: () => Promise<void>; className?: string }) {
  const [open, setOpen] = useState(false); const formRef = useRef<HTMLFormElement>(null); const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  return <form ref={formRef} action={action}><Button active={active} className={className} triggerRef={triggerRef} open={open} onOpen={() => setOpen(true)} onClose={close} onConfirm={() => formRef.current?.requestSubmit()} /></form>;
}
function Button({ active, className, triggerRef, open, onOpen, onClose, onConfirm }: { active: boolean; className?: string; triggerRef: RefObject<HTMLButtonElement | null>; open: boolean; onOpen: () => void; onClose: () => void; onConfirm: () => void }) {
  const { pending } = useFormStatus();
  return <><button ref={triggerRef} type={active ? "button" : "submit"} className={className} disabled={pending} onClick={active ? onOpen : undefined}>{pending ? (active ? "Desativando..." : "Reativando...") : active ? "Desativar" : "Reativar"}</button><ConfirmDialog open={open} title="Desativar usuário?" description="O acesso administrativo será encerrado imediatamente e as sessões ativas serão finalizadas." confirmLabel="Desativar" pendingLabel="Desativando..." variant="danger" pending={pending} triggerRef={triggerRef} onCancel={onClose} onConfirm={onConfirm} /></>;
}

"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import { useFormStatus } from "react-dom";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog/ConfirmDialog";

export function CategoryActiveForm({ active, action, className }: { active: boolean; action: () => Promise<void>; className?: string }) {
  const [open, setOpen] = useState(false); const formRef = useRef<HTMLFormElement>(null); const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  return <form ref={formRef} action={action}><ToggleButton active={active} className={className} triggerRef={triggerRef} open={open} onOpen={() => setOpen(true)} onClose={close} onConfirm={() => formRef.current?.requestSubmit()} /></form>;
}

function ToggleButton({ active, className, triggerRef, open, onOpen, onClose, onConfirm }: { active: boolean; className?: string; triggerRef: RefObject<HTMLButtonElement | null>; open: boolean; onOpen: () => void; onClose: () => void; onConfirm: () => void }) {
  const { pending } = useFormStatus();
  return <><button ref={triggerRef} type={active ? "button" : "submit"} className={className} disabled={pending} aria-label={`${active ? "Desativar" : "Reativar"} categoria`} onClick={active ? onOpen : undefined}>{pending ? (active ? "Desativando..." : "Reativando...") : active ? "Desativar" : "Reativar"}</button><ConfirmDialog open={open} title="Desativar categoria?" description="A categoria deixará de ficar disponível para novos produtos e poderá ser reativada depois." confirmLabel="Desativar" pendingLabel="Desativando..." variant="danger" pending={pending} triggerRef={triggerRef} onCancel={onClose} onConfirm={onConfirm} /></>;
}

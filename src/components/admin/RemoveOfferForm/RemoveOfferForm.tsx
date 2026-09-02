"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import { useFormStatus } from "react-dom";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog/ConfirmDialog";

export function RemoveOfferForm({ action, className }: { action: () => Promise<void>; className?: string }) { const [open, setOpen] = useState(false); const formRef = useRef<HTMLFormElement>(null); const triggerRef = useRef<HTMLButtonElement>(null); const close = useCallback(() => setOpen(false), []); return <form ref={formRef} action={action}><Submit className={className} triggerRef={triggerRef} open={open} onOpen={() => setOpen(true)} onClose={close} onConfirm={() => formRef.current?.requestSubmit()} /></form>; }
function Submit({ className, triggerRef, open, onOpen, onClose, onConfirm }: { className?: string; triggerRef: RefObject<HTMLButtonElement | null>; open: boolean; onOpen: () => void; onClose: () => void; onConfirm: () => void }) { const { pending } = useFormStatus(); return <><button ref={triggerRef} type="button" className={className} disabled={pending} title="Remover oferta" onClick={onOpen}>{pending ? "Removendo..." : "Remover"}</button><ConfirmDialog open={open} title="Remover oferta?" description="O preço promocional será removido e o produto voltará a exibir o preço normal." confirmLabel="Remover oferta" pendingLabel="Removendo..." variant="danger" pending={pending} triggerRef={triggerRef} onCancel={onClose} onConfirm={onConfirm} /></>; }

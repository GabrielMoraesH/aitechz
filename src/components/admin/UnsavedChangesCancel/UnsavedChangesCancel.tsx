"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog/ConfirmDialog";

export function UnsavedChangesCancel({ href, dirty, className }: { href: string; dirty: boolean; className?: string }) {
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const leave = () => router.push(href);

  return <>
    <button ref={triggerRef} type="button" data-unsaved-cancel className={className} onClick={() => dirty ? setOpen(true) : leave()}>Cancelar</button>
    <ConfirmDialog open={open} title="Descartar alterações?" description="Existem alterações que ainda não foram salvas." cancelLabel="Continuar editando" confirmLabel="Descartar alterações" variant="danger" triggerRef={triggerRef} onCancel={() => setOpen(false)} onConfirm={leave} />
  </>;
}

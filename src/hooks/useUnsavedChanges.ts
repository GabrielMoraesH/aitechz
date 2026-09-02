"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function snapshot(form: HTMLFormElement) {
  return Array.from(new FormData(form).entries())
    .map(([name, value]) => [name, typeof value === "string" ? value : `${value.name}:${value.size}:${value.type}`] as const)
    .sort(([aName, aValue], [bName, bValue]) => aName.localeCompare(bName) || aValue.localeCompare(bValue));
}

export function useUnsavedChanges(isSubmitting = false) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialSnapshot = useRef<ReturnType<typeof snapshot>>([]);
  const submittingRef = useRef(false);
  const [dirty, setDirty] = useState(false);

  const checkDirty = useCallback(() => {
    if (!formRef.current) return;
    setDirty(JSON.stringify(snapshot(formRef.current)) !== JSON.stringify(initialSnapshot.current));
  }, []);

  useEffect(() => {
    if (formRef.current) initialSnapshot.current = snapshot(formRef.current);
  }, []);

  useEffect(() => {
    submittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (submittingRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const onSubmitCapture = useCallback(() => {
    submittingRef.current = true;
  }, []);

  return { formRef, dirty, checkDirty, setDirty, onSubmitCapture };
}

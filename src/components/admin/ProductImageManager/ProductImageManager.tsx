"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { moveProductImageAction, removeProductImageAction } from "@/server/actions/adminProductActions";
import styles from "./ProductImageManager.module.css";

export type ProductImageDto = { id: string; url: string; alt: string; position: number };
export type PendingProductImage = { id: string; file: File; previewUrl: string };

type ImageSource = "câmera" | "galeria";

export function ProductImageManager({ productId, existingImages, pendingImages, onPendingImagesChange, error }: { productId?: string; existingImages: ProductImageDto[]; pendingImages: PendingProductImage[]; onPendingImagesChange: (images: PendingProductImage[]) => void; error?: string }) {
  const pendingImagesRef = useRef<PendingProductImage[]>([]);
  const nextPendingIdRef = useRef(0);
  const lastSelectionRef = useRef<{ signature: string; time: number } | undefined>(undefined);
  const [clientError, setClientError] = useState<string>();
  const [pendingId, setPendingId] = useState<string>();
  const [pending, startTransition] = useTransition();

  useEffect(() => { pendingImagesRef.current = pendingImages; }, [pendingImages]);
  useEffect(() => () => pendingImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl)), []);

  function addFiles(files: File[]) {
    setClientError(undefined);
    const unsupported = files.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type));
    const oversized = files.find((file) => file.size > 5 * 1024 * 1024);
    if (unsupported) {
      setClientError("Este formato de imagem não é suportado. Use JPG, PNG ou WebP.");
    } else if (oversized) {
      setClientError(`Esta imagem possui ${(oversized.size / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB. O limite é 5 MB.`);
    } else if (existingImages.length + pendingImages.length + files.length > 8) {
      setClientError("Você pode adicionar no máximo 8 imagens.");
    } else {
      try {
        const newImages = files.map((file) => {
          nextPendingIdRef.current += 1;
          return { id: `pending-${Date.now()}-${nextPendingIdRef.current}`, file, previewUrl: URL.createObjectURL(file) };
        });
        onPendingImagesChange([...pendingImages, ...newImages]);
      } catch {
        setClientError("Não foi possível preparar a pré-visualização da imagem.");
      }
    }
  }

  function handleReceivedFiles(source: ImageSource, files: File[]) {
    const signature = `${source}:${files.map((file) => `${file.name}:${file.size}:${file.lastModified}`).join("|")}`;
    const now = Date.now();
    if (lastSelectionRef.current?.signature === signature && now - lastSelectionRef.current.time < 1500) return;
    lastSelectionRef.current = { signature, time: now };
    addFiles(files);
  }

  function handleFileEvent(source: ImageSource, input: HTMLInputElement) {
    const files = Array.from(input.files ?? []);
    if (files.length) {
      handleReceivedFiles(source, files);
      input.value = "";
    }
  }

  function removePreview(id: string) {
    const removed = pendingImages.find((image) => image.id === id);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    onPendingImagesChange(pendingImages.filter((image) => image.id !== id));
  }

  function run(id: string, operation: () => Promise<void>) {
    setPendingId(id); startTransition(async () => { try { await operation(); } finally { setPendingId(undefined); } });
  }

  return <div className={styles.manager}>
    {(error || clientError) && <p id="images-error" className={styles.error} role="alert">{error || clientError}</p>}
    {!!existingImages.length && <div className={styles.gallery}>{existingImages.map((image, index) => <article className={styles.card} key={image.id}>
      <div className={styles.image}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 640px) 45vw, 160px" />{index === 0 && <span>Principal</span>}</div>
      <div className={styles.controls}>
        <button type="button" disabled={pending || index === 0} onClick={() => run(image.id, () => moveProductImageAction(productId!, image.id, "previous"))} aria-label={`Mover ${image.alt} para a esquerda`}>←</button>
        <button type="button" disabled={pending || index === existingImages.length - 1} onClick={() => run(image.id, () => moveProductImageAction(productId!, image.id, "next"))} aria-label={`Mover ${image.alt} para a direita`}>→</button>
        <button type="button" className={styles.remove} disabled={pending} onClick={() => run(image.id, () => removeProductImageAction(productId!, image.id))}>{pending && pendingId === image.id ? "Removendo..." : "Remover"}</button>
      </div>
    </article>)}</div>}
    {!!pendingImages.length && <div className={styles.gallery} aria-label="Novas imagens selecionadas">{pendingImages.map((image) => <article className={styles.card} key={image.id}>
      <div className={styles.image}>
        {/* blob: URLs are local and temporary, so the native element is intentional. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.previewImage} src={image.previewUrl} alt={`Preview de ${image.file.name}`} />
        <span className={styles.newBadge}>Nova</span>
      </div>
      <button type="button" className={styles.previewRemove} onClick={() => removePreview(image.id)}>Remover seleção</button>
    </article>)}</div>}
    <div className={styles.picker}>
      <div className={styles.pickerActions}>
        <label htmlFor="product-images" className={styles.primaryAction}><ImageIcon />Selecionar imagens</label>
        <label htmlFor="product-camera" className={styles.cameraAction}><CameraIcon />Abrir câmera</label>
      </div>
      <input className={styles.fileInput} id="product-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFileEvent("galeria", event.currentTarget)} onInput={(event) => handleFileEvent("galeria", event.currentTarget)} aria-describedby="images-help images-error" />
      <input className={styles.fileInput} id="product-camera" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event) => handleFileEvent("câmera", event.currentTarget)} onInput={(event) => handleFileEvent("câmera", event.currentTarget)} aria-describedby="images-help images-error" />
      <p id="images-help">JPG, PNG ou WebP. Máximo de 5 MB por imagem. Até 8 imagens.</p>
      <small>Você poderá adicionar imagens agora ou posteriormente.</small>
    </div>
  </div>;
}

function ImageIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4zM7 15l3-3 2.5 2.5 2-2L18 16M8 9h.01" /></svg>;
}

function CameraIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v10H4z" /><circle cx="12" cy="13" r="3" /></svg>;
}

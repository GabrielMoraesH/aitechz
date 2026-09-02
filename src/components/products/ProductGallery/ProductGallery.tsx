"use client";

import Image from "next/image";
import { useState } from "react";

import { Icon } from "@/components/ui/Icons";
import type { PublicProductImage } from "@/types/publicProduct";

import styles from "./ProductGallery.module.css";

type ProductGalleryProps = { images: PublicProductImage[]; productName: string };

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex] ?? images[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.imagePanel}>
        {selected ? <Image src={selected.url} alt={selected.alt} fill preload sizes="(max-width: 767px) calc(100vw - 2rem), 50vw" className={styles.productImage} /> : <div className={styles.placeholder} aria-label={`${productName} sem imagem`}><Icon name="computer" /></div>}
      </div>
      {images.length > 1 ? <div className={styles.thumbnails} aria-label="Galeria de imagens">{images.map((image, index) => (
        <button key={`${image.url}-${index}`} type="button" className={`${styles.thumbnail} ${index === selectedIndex ? styles.selected : ""}`.trim()} onClick={() => setSelectedIndex(index)} aria-label={`Ver imagem ${index + 1} de ${productName}`} aria-pressed={index === selectedIndex}>
          <Image src={image.url} alt="" fill sizes="5rem" className={styles.thumbnailImage} />
        </button>
      ))}</div> : null}
    </div>
  );
}

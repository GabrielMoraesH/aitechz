import "server-only";

import { productImageRepository } from "@/server/repositories/productImageRepository";
import { productRepository } from "@/server/repositories/productRepository";
import { localProductImageStorage, type ProductImageStorage } from "@/server/storage/productImageStorage";

export const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 8;
const MIME_EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;

export class ProductImageValidationError extends Error {}
export class ProductImageStorageError extends Error {}

type ValidatedImage = { bytes: Uint8Array; extension: string };

function detectMime(bytes: Uint8Array): keyof typeof MIME_EXTENSIONS | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte)) return "image/png";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

async function validateFiles(files: File[]): Promise<ValidatedImage[]> {
  const validated: ValidatedImage[] = [];
  for (const file of files) {
    if (!(file.type in MIME_EXTENSIONS)) throw new ProductImageValidationError("Formato de imagem não suportado.");
    if (file.size > MAX_PRODUCT_IMAGE_SIZE) throw new ProductImageValidationError("A imagem deve ter no máximo 5 MB.");
    if (file.size === 0) throw new ProductImageValidationError("Formato de imagem não suportado.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const detectedMime = detectMime(bytes);
    if (!detectedMime || detectedMime !== file.type) throw new ProductImageValidationError("Formato de imagem não suportado.");
    validated.push({ bytes, extension: MIME_EXTENSIONS[detectedMime] });
  }
  return validated;
}

async function removeStored(storage: ProductImageStorage, urls: string[]) {
  const results = await Promise.allSettled(urls.map((url) => storage.remove(url)));
  if (results.some((result) => result.status === "rejected")) console.error("Falha ao limpar um ou mais arquivos de imagem do produto.");
}

export const productImageService = {
  async prepareUploads(files: File[], existingCount: number) {
    if (existingCount + files.length > MAX_PRODUCT_IMAGES) throw new ProductImageValidationError("Cada produto pode ter no máximo 8 imagens.");
    return validateFiles(files);
  },
  async addPrepared(productId: string, prepared: ValidatedImage[], storage: ProductImageStorage = localProductImageStorage) {
    if (!prepared.length) return;
    const product = await productRepository.findById(productId);
    if (!product) throw new ProductImageValidationError("Produto não encontrado.");
    const existingCount = await productImageRepository.countByProductId(productId);
    if (existingCount + prepared.length > MAX_PRODUCT_IMAGES) throw new ProductImageValidationError("Cada produto pode ter no máximo 8 imagens.");
    const storedUrls: string[] = [];
    try {
      for (const image of prepared) storedUrls.push((await storage.save(image.bytes, image.extension)).url);
      await productImageRepository.createMany(storedUrls.map((url, index) => ({ productId, url, position: existingCount + index, alt: existingCount + index === 0 ? product.name : `${product.name} - imagem ${existingCount + index + 1}` })));
    } catch (error) {
      await removeStored(storage, storedUrls);
      throw error;
    }
  },
  async add(productId: string, files: File[]) {
    const count = await productImageRepository.countByProductId(productId);
    const prepared = await this.prepareUploads(files, count);
    await this.addPrepared(productId, prepared);
  },
  async remove(productId: string, imageId: string, storage: ProductImageStorage = localProductImageStorage) {
    const product = await productRepository.findById(productId);
    const image = await productImageRepository.findById(imageId);
    if (!product || !image || image.productId !== productId) throw new ProductImageValidationError("Imagem não encontrada.");
    await productImageRepository.deleteAndNormalize(imageId, productId);
    try { await storage.remove(image.url); }
    catch (error) {
      console.error("Registro removido, mas não foi possível remover o arquivo físico da imagem.", error);
      throw new ProductImageStorageError("Não foi possível remover o arquivo da imagem.");
    }
  },
  async move(productId: string, imageId: string, direction: "previous" | "next") {
    if (!await productRepository.findById(productId)) throw new ProductImageValidationError("Produto não encontrado.");
    const images = await productImageRepository.findByProductId(productId);
    const index = images.findIndex((image) => image.id === imageId);
    if (index < 0) throw new ProductImageValidationError("Imagem não encontrada.");
    const target = direction === "previous" ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    await productImageRepository.updatePositions(productId, images.map((image) => image.id));
  },
  async cleanupCreatedProduct(productId: string, storage: ProductImageStorage = localProductImageStorage) {
    const images = await productImageRepository.findByProductId(productId);
    await productImageRepository.deleteByProductId(productId);
    await removeStored(storage, images.map((image) => image.url));
  },
};

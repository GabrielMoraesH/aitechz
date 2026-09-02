import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredProductImage = { url: string };
export interface ProductImageStorage {
  save(bytes: Uint8Array, extension: string): Promise<StoredProductImage>;
  remove(url: string): Promise<void>;
}

const publicRoot = path.resolve(process.cwd(), "public");
const uploadDirectory = path.resolve(publicRoot, "uploads", "products");
const SAFE_URL = /^\/uploads\/products\/[0-9a-f-]+\.(?:jpe?g|png|webp)$/i;

/**
 * Development/local-persistent-server provider. Serverless deployments usually
 * have ephemeral filesystems; replace this implementation with S3/R2/etc.
 */
export const localProductImageStorage: ProductImageStorage = {
  async save(bytes, extension) {
    await mkdir(uploadDirectory, { recursive: true });
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(path.join(uploadDirectory, filename), bytes, { flag: "wx" });
    return { url: `/uploads/products/${filename}` };
  },
  async remove(url) {
    if (!SAFE_URL.test(url)) throw new Error("Unsafe product image URL.");
    const target = path.resolve(publicRoot, url.slice(1));
    if (path.dirname(target) !== uploadDirectory) throw new Error("Unsafe product image path.");
    await rm(target, { force: true });
  },
};

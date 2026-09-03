import "server-only";

import type { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCloudinary } from "@/server/storage/cloudinary";

export type StoredProductImage = { url: string };
export interface ProductImageStorage {
  save(bytes: Buffer, extension: string): Promise<StoredProductImage>;
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

const CLOUDINARY_FOLDER = "aitechz/products";
const CLOUDINARY_PUBLIC_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getCloudinaryPublicId(url: string): string | null {
  let parsed: URL;
  try { parsed = new URL(url); }
  catch { return null; }

  if (parsed.protocol !== "https:" || parsed.hostname !== "res.cloudinary.com") return null;

  let pathname: string;
  try { pathname = decodeURIComponent(parsed.pathname); }
  catch { return null; }

  const match = pathname.match(/^\/([^/]+)\/image\/upload\/(?:v\d+\/)?aitechz\/products\/([^/.]+)(?:\.(?:jpe?g|png|webp))?$/i);
  if (!match || !CLOUDINARY_PUBLIC_ID.test(match[2])) return null;

  const configuredCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (configuredCloudName && match[1] !== configuredCloudName) return null;
  return `${CLOUDINARY_FOLDER}/${match[2]}`;
}

export const cloudinaryProductImageStorage: ProductImageStorage = {
  async save(bytes) {
    const publicId = randomUUID();
    try {
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = getCloudinary().uploader.upload_stream(
          {
            folder: CLOUDINARY_FOLDER,
            public_id: publicId,
            resource_type: "image",
            overwrite: false,
            unique_filename: false,
          },
          (error, uploaded) => {
            if (error || !uploaded?.secure_url) reject(error ?? new Error("Cloudinary did not return a secure URL."));
            else resolve({ secure_url: uploaded.secure_url });
          },
        );
        stream.end(bytes);
      });
      return { url: result.secure_url };
    } catch (error) {
      console.error("Cloudinary product image upload failed.", error);
      throw new Error("Não foi possível enviar a imagem.");
    }
  },
  async remove(url) {
    const publicId = getCloudinaryPublicId(url);
    if (!publicId) throw new Error("Unsafe Cloudinary product image URL.");
    await getCloudinary().uploader.destroy(publicId, { resource_type: "image" });
  },
};

export type ProductImageStorageProvider = "local" | "cloudinary";

export function getProductImageStorageProvider(): ProductImageStorageProvider {
  const configured = process.env.PRODUCT_IMAGE_STORAGE?.trim().toLowerCase();
  if (configured === "local" || configured === "cloudinary") return configured;
  if (configured) throw new Error(`Unsupported PRODUCT_IMAGE_STORAGE provider: ${configured}.`);
  return process.env.NODE_ENV === "production" ? "cloudinary" : "local";
}

export const productImageStorage: ProductImageStorage = {
  save(bytes, extension) {
    const provider = getProductImageStorageProvider();
    if (provider === "cloudinary") return cloudinaryProductImageStorage.save(bytes, extension);
    return localProductImageStorage.save(bytes, extension);
  },
  remove(url) {
    if (getCloudinaryPublicId(url)) return cloudinaryProductImageStorage.remove(url);
    return localProductImageStorage.remove(url);
  },
};

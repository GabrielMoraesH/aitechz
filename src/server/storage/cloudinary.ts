import "server-only";

import { v2 as cloudinary, type ConfigOptions } from "cloudinary";

export type CloudinaryCredentials = Required<
  Pick<ConfigOptions, "cloud_name" | "api_key" | "api_secret">
>;

export function getCloudinaryCredentials(): CloudinaryCredentials {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary storage is enabled, but CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET is missing.",
    );
  }

  return { cloud_name, api_key, api_secret };
}

export function getCloudinary() {
  cloudinary.config(getCloudinaryCredentials());
  return cloudinary;
}

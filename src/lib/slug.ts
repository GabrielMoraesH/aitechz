/**
 * Normalizes a display name into a predictable, URL-safe slug.
 * Database uniqueness is intentionally handled by the server layer.
 */
export function generateSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

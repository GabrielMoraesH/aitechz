import "server-only";

import { generateSlug } from "@/lib/slug";

type SlugExists = (slug: string) => Promise<boolean>;

/**
 * Resolves collisions for create operations. Update flows should keep the
 * persisted slug unchanged unless a dedicated URL-change feature is used.
 */
export async function createUniqueSlug(
  value: string,
  slugExists: SlugExists,
): Promise<string> {
  const baseSlug = generateSlug(value);

  if (!baseSlug) {
    throw new Error("A name with at least one letter or number is required.");
  }

  let candidate = baseSlug;
  let suffix = 2;

  while (await slugExists(candidate)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

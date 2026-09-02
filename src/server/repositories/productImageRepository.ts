import "server-only";

import { getDb } from "@/lib/db";

export type NewProductImage = { url: string; alt: string; position: number; productId: string };

export const productImageRepository = {
  findByProductId(productId: string) {
    return getDb().productImage.findMany({ where: { productId }, select: { id: true, url: true, alt: true, position: true }, orderBy: { position: "asc" } });
  },
  findById(id: string) {
    return getDb().productImage.findUnique({ where: { id }, select: { id: true, url: true, position: true, productId: true } });
  },
  countByProductId(productId: string) { return getDb().productImage.count({ where: { productId } }); },
  createMany(data: NewProductImage[]) { return getDb().productImage.createMany({ data }); },
  async deleteAndNormalize(imageId: string, productId: string) {
    const db = getDb();
    await db.$transaction(async (tx) => {
      await tx.productImage.delete({ where: { id: imageId, productId } });
      const remaining = await tx.productImage.findMany({ where: { productId }, select: { id: true }, orderBy: [{ position: "asc" }, { createdAt: "asc" }] });
      for (let position = 0; position < remaining.length; position += 1) await tx.productImage.update({ where: { id: remaining[position].id }, data: { position } });
    });
  },
  async updatePositions(productId: string, orderedIds: string[]) {
    const db = getDb();
    await db.$transaction(orderedIds.map((id, position) => db.productImage.update({ where: { id, productId }, data: { position } })));
  },
  deleteByProductId(productId: string) { return getDb().productImage.deleteMany({ where: { productId } }); },
};

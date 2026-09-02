export type PublicProductCondition = "NEW" | "USED";

export type PublicProductImage = {
  url: string;
  alt: string;
};

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  condition: PublicProductCondition;
  price: string | null;
  promotionalPrice: string | null;
  category: string;
  images: PublicProductImage[];
};


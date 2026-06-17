export type Section = "men" | "women" | "kids";

export type Variant = {
  id: string;
  size: string;
  color?: string;
  sku?: string;
  stock: number;
};

export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  section: Section;
  categoryName?: string;
  price: number;
  compareAtPrice?: number;
  discountPct: number;
  image?: string | null;
  rating: number;
  numReviews: number;
  inStock: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
};

export type Product = ProductCard & {
  description?: string;
  shortDescription?: string;
  category: string;
  images: string[];
  variants: Variant[];
  totalStock: number;
  fabric?: string;
  color?: string;
  careInstructions?: string;
  tags: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductQuery = {
  search?: string;
  section?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  isNewArrival?: boolean;
  isActive?: boolean;
  tag?: string;
  page?: number;
  limit?: number;
};

export type VariantPayload = { size: string; color?: string; sku?: string; stock: number };

export type ProductPayload = {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category: string;
  section: Section;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: VariantPayload[];
  fabric?: string;
  color?: string;
  careInstructions?: string;
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
};

import type { Section } from "@/modules/product/types";

export type Category = {
  id: string;
  name: string;
  slug: string;
  section: Section;
  description?: string;
  image?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryPayload = {
  name: string;
  slug: string;
  section: Section;
  description?: string;
  image?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
};

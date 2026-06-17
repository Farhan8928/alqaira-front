import { http, adminHttp } from "@/shared/api/http";
import type { Paginated } from "@/modules/common/types";
import type { Category, CategoryPayload } from "../types";

// ── Storefront (public) ──────────────────────────────────────────────────────
export async function fetchActiveCategories(section?: string) {
  const res = await http.get<{ data: Category[] }>("/categories/active", {
    params: section ? { section } : undefined,
  });
  return res.data.data;
}

export async function fetchFeaturedCategories() {
  const res = await http.get<{ data: Category[] }>("/categories/featured");
  return res.data.data;
}

export async function fetchCategoryBySlug(slug: string) {
  const res = await http.get<{ data: Category }>(`/categories/slug/${slug}`);
  return res.data.data;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function adminListCategories(query: { search?: string; page: number; limit: number }) {
  const res = await adminHttp.get<{ data: Category[]; meta: Paginated<Category>["meta"] }>(
    "/categories",
    { params: query },
  );
  return { items: res.data.data, meta: res.data.meta };
}

export async function createCategory(payload: CategoryPayload) {
  const res = await adminHttp.post<{ data: Category }>("/categories", payload);
  return res.data.data;
}

export async function updateCategory(id: string, payload: Partial<CategoryPayload>) {
  const res = await adminHttp.patch<{ data: Category }>(`/categories/${id}`, payload);
  return res.data.data;
}

export async function deleteCategory(id: string) {
  await adminHttp.delete(`/categories/${id}`);
}

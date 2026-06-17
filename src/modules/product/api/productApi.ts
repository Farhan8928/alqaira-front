import { http, adminHttp } from "@/shared/api/http";
import type { Paginated } from "@/modules/common/types";
import type { Product, ProductCard, ProductQuery, ProductPayload } from "../types";

// ── Storefront (public) ──────────────────────────────────────────────────────
export async function fetchProducts(query: ProductQuery) {
  const res = await http.get<{ data: ProductCard[]; meta: Paginated<ProductCard>["meta"] }>(
    "/products",
    { params: query },
  );
  return { items: res.data.data, meta: res.data.meta };
}

export async function fetchFeatured() {
  const res = await http.get<{ data: ProductCard[] }>("/products/featured");
  return res.data.data;
}

export async function fetchNewArrivals() {
  const res = await http.get<{ data: ProductCard[] }>("/products/new-arrivals");
  return res.data.data;
}

export async function fetchProductBySlug(slug: string) {
  const res = await http.get<{ data: { product: Product; related: ProductCard[] } }>(
    `/products/slug/${slug}`,
  );
  return res.data.data;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function adminListProducts(query: ProductQuery) {
  const res = await adminHttp.get<{ data: Product[]; meta: Paginated<Product>["meta"] }>(
    "/products/admin/list",
    { params: query },
  );
  return { items: res.data.data, meta: res.data.meta };
}

export async function adminGetProduct(id: string) {
  const res = await adminHttp.get<{ data: Product }>(`/products/admin/${id}`);
  return res.data.data;
}

export async function createProduct(payload: ProductPayload) {
  const res = await adminHttp.post<{ data: Product }>("/products", payload);
  return res.data.data;
}

export async function updateProduct(id: string, payload: Partial<ProductPayload>) {
  const res = await adminHttp.patch<{ data: Product }>(`/products/${id}`, payload);
  return res.data.data;
}

export async function deleteProduct(id: string) {
  await adminHttp.delete(`/products/${id}`);
}

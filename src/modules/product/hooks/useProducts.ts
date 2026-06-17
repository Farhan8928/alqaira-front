import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchFeatured,
  fetchNewArrivals,
  fetchProductBySlug,
  adminListProducts,
  adminGetProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";
import type { ProductQuery, ProductPayload } from "../types";

// ── Storefront ────────────────────────────────────────────────────────────────
export function useProducts(query: ProductQuery) {
  return useQuery({ queryKey: ["products", query], queryFn: () => fetchProducts(query) });
}

export function useFeaturedProducts() {
  return useQuery({ queryKey: ["products", "featured"], queryFn: fetchFeatured });
}

export function useNewArrivals() {
  return useQuery({ queryKey: ["products", "new"], queryFn: fetchNewArrivals });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export function useAdminProducts(query: ProductQuery) {
  return useQuery({ queryKey: ["admin", "products", query], queryFn: () => adminListProducts(query) });
}

export function useAdminProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "product", id],
    queryFn: () => adminGetProduct(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProductPayload> }) =>
      updateProduct(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

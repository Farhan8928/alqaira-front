import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveCategories,
  fetchFeaturedCategories,
  adminListCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";
import type { CategoryPayload } from "../types";

export function useCategories(section?: string) {
  return useQuery({
    queryKey: ["categories", section ?? "all"],
    queryFn: () => fetchActiveCategories(section),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFeaturedCategories() {
  return useQuery({
    queryKey: ["categories", "featured"],
    queryFn: fetchFeaturedCategories,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAdminCategories(query: { search?: string; page: number; limit: number }) {
  return useQuery({
    queryKey: ["admin", "categories", query],
    queryFn: () => adminListCategories(query),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CategoryPayload> }) =>
      updateCategory(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

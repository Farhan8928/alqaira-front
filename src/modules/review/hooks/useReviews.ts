import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductReviews,
  postReview,
  adminListReviews,
  setReviewApproval,
  deleteReview,
} from "../api/reviewApi";
import type { ReviewListQuery } from "../types";

export function useProductReviews(productId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchProductReviews(productId as string),
    enabled: Boolean(productId),
  });
}

export function usePostReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { rating: number; title?: string; comment?: string }) =>
      postReview(productId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useAdminReviews(query: ReviewListQuery) {
  return useQuery({ queryKey: ["admin", "reviews", query], queryFn: () => adminListReviews(query) });
}

export function useSetReviewApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      setReviewApproval(id, isApproved),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });
}

import { http, adminHttp } from "@/shared/api/http";
import type { Paginated } from "@/modules/common/types";
import type { Review, ReviewListQuery } from "../types";

// Storefront
export async function fetchProductReviews(productId: string) {
  const res = await http.get<{ data: Review[] }>(`/reviews/product/${productId}`);
  return res.data.data;
}

export async function postReview(
  productId: string,
  payload: { rating: number; title?: string; comment?: string },
) {
  const res = await http.post<{ data: Review }>(`/reviews/product/${productId}`, payload);
  return res.data.data;
}

// Admin
export async function adminListReviews(query: ReviewListQuery) {
  const res = await adminHttp.get<{ data: Review[]; meta: Paginated<Review>["meta"] }>(
    "/admin/reviews",
    { params: query },
  );
  return { items: res.data.data, meta: res.data.meta };
}

export async function setReviewApproval(id: string, isApproved: boolean) {
  const res = await adminHttp.patch<{ data: Review }>(`/admin/reviews/${id}/approval`, {
    isApproved,
  });
  return res.data.data;
}

export async function deleteReview(id: string) {
  await adminHttp.delete(`/admin/reviews/${id}`);
}

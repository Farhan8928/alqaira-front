import { adminHttp } from "@/shared/api/http";
import type { Paginated } from "@/modules/common/types";
import type { Coupon, CouponPayload, CouponListQuery } from "../types";

export async function adminListCoupons(query: CouponListQuery) {
  const res = await adminHttp.get<{ data: Coupon[]; meta: Paginated<Coupon>["meta"] }>("/coupons", {
    params: query,
  });
  return { items: res.data.data, meta: res.data.meta };
}

export async function createCoupon(payload: CouponPayload) {
  const res = await adminHttp.post<{ data: Coupon }>("/coupons", payload);
  return res.data.data;
}

export async function updateCoupon(id: string, payload: Partial<CouponPayload>) {
  const res = await adminHttp.patch<{ data: Coupon }>(`/coupons/${id}`, payload);
  return res.data.data;
}

export async function deleteCoupon(id: string) {
  await adminHttp.delete(`/coupons/${id}`);
}

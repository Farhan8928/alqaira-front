import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListCoupons, createCoupon, updateCoupon, deleteCoupon } from "../api/couponApi";
import type { CouponListQuery, CouponPayload } from "../types";

export function useCoupons(query: CouponListQuery) {
  return useQuery({
    queryKey: ["admin", "coupons", query],
    queryFn: () => adminListCoupons(query),
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CouponPayload) => createCoupon(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CouponPayload> }) =>
      updateCoupon(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  placeOrder,
  fetchPaymentConfig,
  fetchMyOrders,
  fetchMyOrder,
  adminListOrders,
  adminGetOrder,
  updateOrderStatus,
} from "../api/orderApi";
import type { OrderListQuery, PlaceOrderPayload } from "../types";

// ── Storefront ────────────────────────────────────────────────────────────────
export function usePaymentConfig() {
  return useQuery({ queryKey: ["payment-config"], queryFn: fetchPaymentConfig });
}

export function usePlaceOrder() {
  return useMutation({ mutationFn: (payload: PlaceOrderPayload) => placeOrder(payload) });
}

export function useMyOrders() {
  return useQuery({ queryKey: ["my-orders"], queryFn: fetchMyOrders });
}

export function useMyOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["my-order", id],
    queryFn: () => fetchMyOrder(id as string),
    enabled: Boolean(id),
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export function useAdminOrders(query: OrderListQuery) {
  return useQuery({ queryKey: ["admin", "orders", query], queryFn: () => adminListOrders(query) });
}

export function useAdminOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => adminGetOrder(id as string),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      updateOrderStatus(id, status, note),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "order", vars.id] });
    },
  });
}

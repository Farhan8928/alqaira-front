import { http, adminHttp } from "@/shared/api/http";
import type { Paginated } from "@/modules/common/types";
import type {
  Order,
  PaymentConfig,
  PlaceOrderPayload,
  RazorpayInit,
  OrderListQuery,
} from "../types";

// ── Storefront ────────────────────────────────────────────────────────────────
export async function placeOrder(payload: PlaceOrderPayload) {
  const res = await http.post<{ data: { order: Order; payment: RazorpayInit | null } }>(
    "/orders",
    payload,
  );
  return res.data.data;
}

export async function verifyPayment(payload: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const res = await http.post<{ data: Order }>("/orders/verify-payment", payload);
  return res.data.data;
}

export async function fetchPaymentConfig() {
  const res = await http.get<{ data: PaymentConfig }>("/payments/config");
  return res.data.data;
}

export async function validateCoupon(code: string, subtotal: number) {
  const res = await http.post<{
    data: { code: string; type: string; value: number; discount: number };
  }>("/coupons/validate", { code, subtotal });
  return res.data.data;
}

export async function fetchMyOrders() {
  const res = await http.get<{ data: Order[] }>("/orders/mine");
  return res.data.data;
}

export async function fetchMyOrder(id: string) {
  const res = await http.get<{ data: Order }>(`/orders/mine/${id}`);
  return res.data.data;
}

export async function trackOrder(orderNumber: string, email: string) {
  const res = await http.get<{ data: Order }>(`/orders/track/${orderNumber}`, { params: { email } });
  return res.data.data;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function adminListOrders(query: OrderListQuery) {
  const res = await adminHttp.get<{ data: Order[]; meta: Paginated<Order>["meta"] }>(
    "/admin/orders",
    { params: query },
  );
  return { items: res.data.data, meta: res.data.meta };
}

export async function adminGetOrder(id: string) {
  const res = await adminHttp.get<{ data: Order }>(`/admin/orders/${id}`);
  return res.data.data;
}

export async function updateOrderStatus(id: string, status: string, note?: string) {
  const res = await adminHttp.patch<{ data: Order }>(`/admin/orders/${id}/status`, { status, note });
  return res.data.data;
}

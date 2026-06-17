import { cn } from "@/lib/utils";
import type { OrderStatus } from "../types";

const STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600",
  confirmed: "bg-sky-500/15 text-sky-600",
  processing: "bg-indigo-500/15 text-indigo-600",
  shipped: "bg-violet-500/15 text-violet-600",
  delivered: "bg-emerald-500/15 text-emerald-600",
  cancelled: "bg-rose-500/15 text-rose-600",
};

const PAYMENT_STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600",
  paid: "bg-emerald-500/15 text-emerald-600",
  failed: "bg-rose-500/15 text-rose-600",
  refunded: "bg-slate-500/15 text-slate-600",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        STYLES[status] || "bg-secondary text-foreground",
      )}
    >
      {status}
    </span>
  );
}

export function PaymentBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        PAYMENT_STYLES[status] || "bg-secondary text-foreground",
      )}
    >
      {status}
    </span>
  );
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

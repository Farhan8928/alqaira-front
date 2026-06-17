import { Check } from "lucide-react";
import { ORDER_STATUS_FLOW } from "./OrderStatusBadge";
import { cn, formatDateTime } from "@/lib/utils";
import type { Order } from "../types";

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-600">
        This order was cancelled.
      </div>
    );
  }
  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const eventFor = (status: string) => order.statusHistory.find((e) => e.status === status);

  return (
    <ol className="relative ml-2 border-l border-border">
      {ORDER_STATUS_FLOW.map((status, idx) => {
        const done = idx <= currentIdx;
        const event = eventFor(status);
        return (
          <li key={status} className="mb-6 ml-6">
            <span
              className={cn(
                "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background",
                done ? "bg-gold text-navy" : "bg-secondary text-muted-foreground",
              )}
            >
              {done && <Check className="h-3.5 w-3.5" />}
            </span>
            <p
              className={cn(
                "text-sm font-medium capitalize",
                done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {status}
            </p>
            {event && <p className="text-xs text-muted-foreground">{formatDateTime(event.at)}</p>}
          </li>
        );
      })}
    </ol>
  );
}

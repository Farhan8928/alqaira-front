import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { trackOrder } from "../api/orderApi";
import { OrderTimeline } from "../components/OrderTimeline";
import { OrderStatusBadge, PaymentBadge } from "../components/OrderStatusBadge";
import { getApiErrorMessage } from "@/shared/api/http";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "../types";

export function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await trackOrder(orderNumber.trim(), email.trim());
      setOrder(result);
    } catch (err) {
      setOrder(null);
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="aq-page mx-auto max-w-3xl px-4 py-14 md:px-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Order Tracking</p>
        <h1 className="mt-2 font-display text-4xl text-foreground">Track your order</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your order number and email to view status.</p>
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="ALQ-2026-00001"
          required
          className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@email.com"
          required
          className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Track
        </button>
      </form>

      {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}

      {order && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="font-display text-2xl text-foreground">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">Placed {formatDate(order.placedAt)}</p>
            </div>
            <div className="flex gap-2">
              <OrderStatusBadge status={order.status} />
              <PaymentBadge status={order.paymentStatus} />
            </div>
          </div>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium text-foreground">Progress</h3>
              <OrderTimeline order={order} />
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium text-foreground">Items</h3>
              <div className="space-y-3">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {i.productName} · {i.size} × {i.quantity}
                    </span>
                    <span className="aq-nums text-foreground">{formatCurrency(i.lineTotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="aq-nums font-bold text-foreground">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

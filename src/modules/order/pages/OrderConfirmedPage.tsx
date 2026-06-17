import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "../types";

export function OrderConfirmedPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  return (
    <div className="aq-page mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-10 w-10 text-success" />
      </div>
      <h1 className="mt-6 font-display text-4xl text-foreground">Thank you for your order!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your order <span className="font-semibold text-gold-dark">{orderNumber}</span> has been
        placed successfully. A confirmation has been sent to your email.
      </p>

      {order && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Package className="h-4 w-4 text-gold-dark" /> Order Summary
            </span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {i.productName} · {i.size} × {i.quantity}
                </span>
                <span className="aq-nums text-foreground">{formatCurrency(i.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Total</span>
            <span className="aq-nums text-lg font-bold text-foreground">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/shop"
          className="rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white"
        >
          Continue Shopping
        </Link>
        <Link
          to="/track"
          className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}

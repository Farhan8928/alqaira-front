import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAdminOrder, useUpdateOrderStatus } from "../hooks/useOrders";
import { OrderTimeline } from "../components/OrderTimeline";
import { OrderStatusBadge, PaymentBadge } from "../components/OrderStatusBadge";
import { PageLoader } from "@/shared/components/PageLoader";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { formatCurrency, formatDate } from "@/lib/utils";

const NEXT_STATUS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const [note, setNote] = useState("");

  if (isLoading || !order) return <PageLoader />;

  async function setStatus(status: string) {
    try {
      await updateStatus.mutateAsync({ id: order!.id, status, note: note || undefined });
      toast.success(`Order marked ${status}`);
      setNote("");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  const a = order.shippingAddress;
  const transitions = NEXT_STATUS[order.status] || [];

  return (
    <div className="aq-page space-y-6">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-foreground">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Placed {formatDate(order.placedAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <div className="aq-tile">
            <h2 className="mb-4 font-medium text-foreground">Items</h2>
            <div className="divide-y divide-border">
              {order.items.map((i, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3">
                  <div className="h-16 w-14 overflow-hidden rounded-md bg-secondary">
                    {i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{i.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      Size {i.size}
                      {i.color ? ` · ${i.color}` : ""} · Qty {i.quantity}
                    </p>
                  </div>
                  <span className="aq-nums font-medium text-foreground">
                    {formatCurrency(i.lineTotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
              {order.discount > 0 && (
                <Row
                  label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
                  value={`− ${formatCurrency(order.discount)}`}
                />
              )}
              <Row
                label="Shipping"
                value={order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee)}
              />
              <Row label="Total" value={formatCurrency(order.total)} bold />
            </div>
          </div>

          {/* Status update */}
          <div className="aq-tile">
            <h2 className="mb-4 font-medium text-foreground">Update Status</h2>
            {transitions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No further status changes available.</p>
            ) : (
              <>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note (optional, e.g. tracking #)"
                  className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex flex-wrap gap-2">
                  {transitions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      disabled={updateStatus.isPending}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium capitalize disabled:opacity-50 ${
                        s === "cancelled"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-navy text-white"
                      }`}
                    >
                      {updateStatus.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Mark {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="aq-tile">
            <h2 className="mb-3 font-medium text-foreground">Customer</h2>
            <p className="text-sm text-foreground">{order.contact?.name}</p>
            <p className="text-sm text-muted-foreground">{order.contact?.email}</p>
            <p className="text-sm text-muted-foreground">{order.contact?.phone}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {order.isGuest ? "Guest checkout" : "Registered customer"}
            </p>
          </div>
          <div className="aq-tile">
            <h2 className="mb-3 font-medium text-foreground">Shipping Address</h2>
            <p className="text-sm text-muted-foreground">
              {a.fullName}
              <br />
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
              <br />
              {a.city}
              {a.state ? `, ${a.state}` : ""} - {a.pincode}
              <br />
              {a.country}
              <br />
              {a.phone}
            </p>
          </div>
          <div className="aq-tile">
            <h2 className="mb-3 font-medium text-foreground">Timeline</h2>
            <OrderTimeline order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      <span
        className={bold ? "aq-nums text-lg font-bold text-foreground" : "aq-nums text-foreground"}
      >
        {value}
      </span>
    </div>
  );
}

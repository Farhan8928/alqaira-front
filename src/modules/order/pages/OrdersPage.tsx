import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminOrders } from "../hooks/useOrders";
import { OrderStatusBadge, PaymentBadge } from "../components/OrderStatusBadge";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const STATUSES = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminOrders({
    search,
    status: status || undefined,
    page,
    limit: 20,
  });
  const meta = data?.meta;

  return (
    <div className="aq-page space-y-5">
      <div>
        <h1 className="font-display text-3xl text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">{meta?.total ?? 0} orders</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-input px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search order #, name, email…"
            className="flex-1 bg-transparent py-2 text-sm outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s || "all"}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize",
                status === s
                  ? "border-navy bg-navy text-white"
                  : "border-border hover:bg-secondary",
              )}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            ) : (
              data?.items.map((o) => (
                <tr key={o.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="font-medium text-foreground hover:text-gold-dark"
                    >
                      {o.orderNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground">{o.items.length} item(s)</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{o.contact?.name}</p>
                    <p className="text-xs text-muted-foreground">{o.contact?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(o.placedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase text-muted-foreground">
                        {o.paymentMethod}
                      </span>
                      <PaymentBadge status={o.paymentStatus} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="aq-nums px-4 py-3 text-right font-semibold text-foreground">
                    {formatCurrency(o.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={!meta.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            disabled={!meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

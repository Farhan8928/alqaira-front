import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { IndianRupee, ShoppingCart, Package, Users, AlertTriangle } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { StatCard } from "@/shared/components/StatCard";
import { OrderStatusBadge } from "@/modules/order/components/OrderStatusBadge";
import { PageLoader } from "@/shared/components/PageLoader";
import { formatCurrency, formatDate } from "@/lib/utils";

export function DashboardPage() {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) return <PageLoader />;

  return (
    <div className="aq-page space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your store at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(data.summary.revenue)} icon={IndianRupee} tone="gold" hint={`${formatCurrency(data.summary.thisMonthRevenue)} this month`} />
        <StatCard label="Total Orders" value={data.summary.orders} icon={ShoppingCart} tone="navy" hint={`${data.summary.thisMonthOrders} this month`} />
        <StatCard label="Products" value={data.catalog.totalProducts} icon={Package} tone="info" hint={`${data.catalog.activeProducts} active`} />
        <StatCard label="Customers" value={data.catalog.customers} icon={Users} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="aq-tile lg:col-span-2">
          <h2 className="mb-4 font-medium text-foreground">Revenue · Last 30 days</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByDay}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A24B" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#C9A24B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => String(d).slice(5)} />
                <YAxis tick={{ fontSize: 11 }} width={50} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Area type="monotone" dataKey="revenue" stroke="#A6822F" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="aq-tile">
          <h2 className="mb-4 font-medium text-foreground">Orders by Status</h2>
          <div className="space-y-3">
            {data.statusBreakdown.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
            {data.statusBreakdown.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <OrderStatusBadge status={s.status} />
                <span className="aq-nums text-sm font-semibold text-foreground">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="aq-tile lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-foreground">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-gold-dark">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5">
                      <Link to={`/admin/orders/${o.id}`} className="font-medium text-foreground hover:text-gold-dark">
                        {o.orderNumber}
                      </Link>
                      <p className="text-xs text-muted-foreground">{formatDate(o.placedAt)}</p>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{o.contact?.name}</td>
                    <td className="py-2.5"><OrderStatusBadge status={o.status} /></td>
                    <td className="aq-nums py-2.5 text-right font-medium text-foreground">{formatCurrency(o.total)}</td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock + top products */}
        <div className="space-y-4">
          <div className="aq-tile">
            <h2 className="mb-3 flex items-center gap-2 font-medium text-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" /> Low Stock
            </h2>
            <div className="space-y-2">
              {data.lowStock.length === 0 && <p className="text-sm text-muted-foreground">All good.</p>}
              {data.lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1 text-foreground">{p.name}</span>
                  <span className="aq-nums font-semibold text-destructive">{p.totalStock}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="aq-tile">
            <h2 className="mb-3 font-medium text-foreground">Best Sellers</h2>
            <div className="space-y-2">
              {data.topProducts.length === 0 && <p className="text-sm text-muted-foreground">No sales yet.</p>}
              {data.topProducts.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1 text-foreground">{p.name}</span>
                  <span className="aq-nums text-muted-foreground">{p.units} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

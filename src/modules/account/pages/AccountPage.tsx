import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Package, MapPin, LogOut, Plus, Trash2, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCustomer, setCustomer, updateCustomer } from "../accountSlice";
import { useMyOrders } from "@/modules/order/hooks/useOrders";
import { useUpdateProfile, useAddAddress, useDeleteAddress } from "../hooks/useAccount";
import { OrderStatusBadge, PaymentBadge } from "@/modules/order/components/OrderStatusBadge";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { AddressPayload } from "../types";

type Tab = "orders" | "profile" | "addresses";

export function AccountPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((s) => s.customerAuth.customer);
  const token = useAppSelector((s) => s.customerAuth.accessToken);
  const [tab, setTab] = useState<Tab>("orders");

  if (!customer || !token) {
    return <Navigate to="/login" replace />;
  }

  function logout() {
    dispatch(clearCustomer());
    navigate("/");
  }

  return (
    <div className="aq-page mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">My Account</p>
          <h1 className="mt-1 font-display text-4xl text-foreground">Hello, {customer.name}</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
          <TabButton active={tab === "orders"} onClick={() => setTab("orders")} icon={Package}>
            Orders
          </TabButton>
          <TabButton active={tab === "addresses"} onClick={() => setTab("addresses")} icon={MapPin}>
            Addresses
          </TabButton>
          <TabButton active={tab === "profile"} onClick={() => setTab("profile")} icon={User}>
            Profile
          </TabButton>
        </nav>

        <div>
          {tab === "orders" && <OrdersTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-navy text-white" : "hover:bg-secondary",
      )}
    >
      <Icon className="h-4 w-4" /> {children}
    </button>
  );
}

function OrdersTab() {
  const { data: orders = [], isLoading } = useMyOrders();
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading orders…</p>;
  if (!orders.length)
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        You haven't placed any orders yet.
      </div>
    );
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <p className="font-medium text-foreground">{o.orderNumber}</p>
              <p className="text-xs text-muted-foreground">Placed {formatDate(o.placedAt)}</p>
            </div>
            <div className="flex gap-2">
              <OrderStatusBadge status={o.status} />
              <PaymentBadge status={o.paymentStatus} />
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {o.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {i.productName} · {i.size} × {i.quantity}
                </span>
                <span className="aq-nums text-foreground">{formatCurrency(i.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-foreground">
              Total ({o.paymentMethod === "cod" ? "COD" : "Online"})
            </span>
            <span className="aq-nums font-bold text-foreground">{formatCurrency(o.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddressesTab() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector((s) => s.customerAuth.customer)!;
  const addAddr = useAddAddress();
  const delAddr = useDeleteAddress();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressPayload>({
    label: "Home",
    fullName: customer.name,
    phone: customer.phone || "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  async function save() {
    try {
      const updated = await addAddr.mutateAsync(form);
      dispatch(updateCustomer(updated));
      toast.success("Address added");
      setShowForm(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  async function remove(id: string) {
    try {
      const updated = await delAddr.mutateAsync(id);
      dispatch(updateCustomer(updated));
      toast.success("Address removed");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(customer.addresses || []).map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{a.label || "Address"}</span>
              {a.isDefault && (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold-dark">
                  Default
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {a.fullName} · {a.phone}
            </p>
            <p className="text-sm text-muted-foreground">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}, {a.city} {a.state} - {a.pincode}
            </p>
            <button
              onClick={() => remove(a.id)}
              className="mt-3 flex items-center gap-1 text-xs text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mt-5 flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary"
        >
          <Plus className="h-4 w-4" /> Add Address
        </button>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-medium text-foreground">New Address</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Label (Home/Office)"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inp}
            />
            <input
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className={inp}
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inp}
            />
            <input
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className={inp}
            />
            <input
              placeholder="Address line 1"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className={cn(inp, "sm:col-span-2")}
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={inp}
            />
            <input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className={inp}
            />
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            Set as default
          </label>
          <div className="mt-4 flex gap-3">
            <button
              onClick={save}
              disabled={addAddr.isPending}
              className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {addAddr.isPending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-full border border-border px-5 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector((s) => s.customerAuth.customer)!;
  const token = useAppSelector((s) => s.customerAuth.accessToken)!;
  const update = useUpdateProfile();
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  async function save() {
    try {
      const payload: Record<string, string> = { name, phone };
      if (password) {
        payload.password = password;
        payload.currentPassword = currentPassword;
      }
      const updated = await update.mutateAsync(payload);
      dispatch(setCustomer({ accessToken: token, customer: updated }));
      setPassword("");
      setCurrentPassword("");
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="max-w-lg rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-4 font-medium text-foreground">Profile details</h3>
      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className={inp}
        />
        <input value={customer.email} disabled className={cn(inp, "opacity-60")} />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className={inp}
        />
        <div className="border-t border-border pt-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Change password (optional)
          </p>
          <input
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            placeholder="Current password"
            className={inp}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="New password"
            className={cn(inp, "mt-3")}
          />
        </div>
      </div>
      <button
        onClick={save}
        disabled={update.isPending}
        className="mt-5 flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {update.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
      </button>
    </div>
  );
}

const inp =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

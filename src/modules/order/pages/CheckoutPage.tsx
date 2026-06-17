import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, Loader2, Banknote, CreditCard } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCart, selectCartSubtotal } from "@/modules/cart/cartSlice";
import { useStoreSettings } from "@/modules/settings/hooks/useSettings";
import { usePaymentConfig, usePlaceOrder } from "../hooks/useOrders";
import { validateCoupon, verifyPayment } from "../api/orderApi";
import { openRazorpay } from "../lib/razorpay";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { formatCurrency, cn } from "@/lib/utils";
import type { PlaceOrderPayload } from "../types";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().min(5, "Phone is required"),
  line1: z.string().trim().min(1, "Address is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().optional(),
  pincode: z.string().trim().min(3, "Pincode is required"),
});
type FormValues = z.infer<typeof schema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = useAppSelector((s) => selectCartSubtotal(s.cart.items));
  const customer = useAppSelector((s) => s.customerAuth.customer);
  const { data: settings } = useStoreSettings();
  const { data: paymentConfig } = usePaymentConfig();
  const placeOrder = usePlaceOrder();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [method, setMethod] = useState<"cod" | "razorpay">("cod");
  const [submitting, setSubmitting] = useState(false);

  const defaultAddr = customer?.addresses?.find((a) => a.isDefault) || customer?.addresses?.[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || defaultAddr?.phone || "",
      line1: defaultAddr?.line1 || "",
      line2: defaultAddr?.line2 || "",
      city: defaultAddr?.city || "",
      state: defaultAddr?.state || "",
      pincode: defaultAddr?.pincode || "",
    },
  });

  useEffect(() => {
    if (paymentConfig && !paymentConfig.codEnabled && paymentConfig.onlinePaymentEnabled) {
      setMethod("razorpay");
    }
  }, [paymentConfig]);

  const threshold = settings?.freeShippingThreshold ?? 0;
  const netGoods = subtotal - discount;
  const shipping = threshold && netGoods >= threshold ? 0 : (settings?.shippingFee ?? 0);
  const total = netGoods + shipping;

  const canOnline = paymentConfig?.onlinePaymentEnabled && paymentConfig?.razorpayConfigured;

  const orderItems = useMemo(
    () =>
      items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">Your bag is empty</h1>
        <button
          onClick={() => navigate("/shop")}
          className="mt-6 rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white"
        >
          Shop now
        </button>
      </div>
    );
  }

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setCouponBusy(true);
    try {
      const res = await validateCoupon(coupon.trim(), subtotal);
      setDiscount(res.discount);
      setAppliedCode(res.code);
      toast.success(`Coupon ${res.code} applied`);
    } catch (err) {
      setDiscount(0);
      setAppliedCode(null);
      toast.error(getApiErrorMessage(err));
    } finally {
      setCouponBusy(false);
    }
  }

  async function onSubmit(values: FormValues) {
    const payload: PlaceOrderPayload = {
      items: orderItems,
      contact: { name: values.name, email: values.email, phone: values.phone },
      shippingAddress: {
        fullName: values.name,
        phone: values.phone,
        line1: values.line1,
        line2: values.line2,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        country: "India",
      },
      paymentMethod: method,
      couponCode: appliedCode || undefined,
    };

    setSubmitting(true);
    try {
      const { order, payment } = await placeOrder.mutateAsync(payload);

      if (method === "cod" || !payment) {
        dispatch(clearCart());
        navigate(`/order-confirmed/${order.orderNumber}`, { state: { order } });
        return;
      }

      // Razorpay flow
      await openRazorpay({
        key: payment.key,
        orderId: payment.orderId,
        amount: payment.amount,
        name: settings?.storeName || "ALQAIRA",
        description: `Order ${order.orderNumber}`,
        prefill: { name: values.name, email: values.email, contact: values.phone },
        onSuccess: async (resp) => {
          try {
            await verifyPayment({
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpaySignature: resp.razorpay_signature,
            });
            dispatch(clearCart());
            navigate(`/order-confirmed/${order.orderNumber}`, { state: { order } });
          } catch (err) {
            toast.error(getApiErrorMessage(err));
          }
        },
        onDismiss: () => {
          toast.info("Payment cancelled. Your order is awaiting payment.");
          setSubmitting(false);
        },
      });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="aq-page mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-foreground">Checkout</h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]"
      >
        {/* Left: forms */}
        <div className="space-y-8">
          <Section title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" error={form.formState.errors.name?.message}>
                <input {...form.register("name")} className={inputCls} />
              </Field>
              <Field label="Phone" error={form.formState.errors.phone?.message}>
                <input {...form.register("phone")} className={inputCls} />
              </Field>
              <Field
                label="Email"
                error={form.formState.errors.email?.message}
                className="sm:col-span-2"
              >
                <input {...form.register("email")} className={inputCls} />
              </Field>
            </div>
          </Section>

          <Section title="Shipping Address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Address Line 1"
                error={form.formState.errors.line1?.message}
                className="sm:col-span-2"
              >
                <input {...form.register("line1")} className={inputCls} />
              </Field>
              <Field label="Address Line 2 (optional)" className="sm:col-span-2">
                <input {...form.register("line2")} className={inputCls} />
              </Field>
              <Field label="City" error={form.formState.errors.city?.message}>
                <input {...form.register("city")} className={inputCls} />
              </Field>
              <Field label="State">
                <input {...form.register("state")} className={inputCls} />
              </Field>
              <Field label="Pincode" error={form.formState.errors.pincode?.message}>
                <input {...form.register("pincode")} className={inputCls} />
              </Field>
            </div>
          </Section>

          <Section title="Payment Method">
            <div className="space-y-3">
              <PayOption
                active={method === "cod"}
                disabled={paymentConfig ? !paymentConfig.codEnabled : false}
                onClick={() => setMethod("cod")}
                icon={Banknote}
                title="Cash on Delivery"
                desc="Pay in cash when your order arrives."
              />
              <PayOption
                active={method === "razorpay"}
                disabled={!canOnline}
                onClick={() => canOnline && setMethod("razorpay")}
                icon={CreditCard}
                title="Pay Online (Razorpay)"
                desc={canOnline ? "UPI, cards, netbanking & wallets." : "Currently unavailable."}
              />
            </div>
          </Section>
        </div>

        {/* Right: summary */}
        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl text-foreground">Your Order</h2>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {items.map((i) => (
              <div key={i.variantId} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                  {i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
                    {i.quantity}
                  </span>
                </div>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 text-foreground">{i.name}</p>
                  <p className="text-xs text-muted-foreground">Size {i.size}</p>
                </div>
                <span className="aq-nums text-sm text-foreground">
                  {formatCurrency(i.price * i.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mt-5 flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-input px-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="flex-1 bg-transparent py-2 text-sm outline-none"
              />
            </div>
            <button
              type="button"
              onClick={applyCoupon}
              disabled={couponBusy}
              className="rounded-lg bg-navy px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              {couponBusy ? "…" : "Apply"}
            </button>
          </div>

          <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            {discount > 0 && (
              <Row
                label={`Discount (${appliedCode})`}
                value={`− ${formatCurrency(discount)}`}
                accent
              />
            )}
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} />
            <div className="border-t border-border pt-2.5">
              <Row label="Total" value={formatCurrency(total)} bold />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm font-semibold text-navy disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {method === "cod" ? "Place Order" : `Pay ${formatCurrency(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            By placing your order you agree to our terms &amp; privacy policy.
          </p>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 font-display text-xl text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PayOption({
  active,
  disabled,
  onClick,
  icon: Icon,
  title,
  desc,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
        active ? "border-navy bg-navy/5" : "border-border",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          active ? "bg-navy text-white" : "bg-secondary text-navy",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span
        className={cn(
          "h-4 w-4 rounded-full border-2",
          active ? "border-navy bg-navy" : "border-muted-foreground",
        )}
      />
    </button>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      <span
        className={cn(
          "aq-nums",
          bold
            ? "text-lg font-bold text-foreground"
            : accent
              ? "text-gold-dark"
              : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

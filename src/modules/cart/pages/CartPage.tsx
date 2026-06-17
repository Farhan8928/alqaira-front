import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setQuantity, removeFromCart, selectCartSubtotal } from "../cartSlice";
import { useStoreSettings } from "@/modules/settings/hooks/useSettings";
import { formatCurrency } from "@/lib/utils";

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = useAppSelector((s) => selectCartSubtotal(s.cart.items));
  const { data: settings } = useStoreSettings();

  const threshold = settings?.freeShippingThreshold ?? 0;
  const shipping = threshold && subtotal >= threshold ? 0 : (settings?.shippingFee ?? 0);
  const remaining = Math.max(0, threshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-6 font-display text-3xl text-foreground">Your bag is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Discover our premium thobes and kurtas.</p>
        <Link to="/shop" className="mt-6 rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="aq-page mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-foreground">Shopping Bag</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 py-5">
              <Link to={`/product/${item.slug}`} className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
                {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to={`/product/${item.slug}`} className="font-display text-lg text-foreground">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Size: {item.size}
                      {item.color ? ` · ${item.color}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.variantId))}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      onClick={() => dispatch(setQuantity({ variantId: item.variantId, quantity: item.quantity - 1 }))}
                      className="px-3 py-1.5"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(setQuantity({ variantId: item.variantId, quantity: item.quantity + 1 }))}
                      className="px-3 py-1.5"
                    >
                      +
                    </button>
                  </div>
                  <span className="aq-nums font-semibold text-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl text-foreground">Order Summary</h2>
          {remaining > 0 && threshold > 0 && (
            <p className="mt-3 rounded-lg bg-gold/10 px-3 py-2 text-xs text-gold-dark">
              Add {formatCurrency(remaining)} more for free shipping.
            </p>
          )}
          <div className="mt-5 space-y-3 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} />
            <div className="border-t border-border pt-3">
              <Row label="Total" value={formatCurrency(subtotal + shipping)} bold />
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-navy py-3.5 text-sm font-semibold text-white"
          >
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-sm text-gold-dark">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold text-foreground" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "aq-nums text-lg font-bold text-foreground" : "aq-nums text-foreground"}>
        {value}
      </span>
    </div>
  );
}

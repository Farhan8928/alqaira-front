import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, Check } from "lucide-react";
import { useProduct } from "../hooks/useProducts";
import { ProductGrid } from "../components/ProductGrid";
import { Price } from "@/shared/components/Price";
import { RatingStars } from "@/shared/components/RatingStars";
import { PageLoader } from "@/shared/components/PageLoader";
import { ReviewSection } from "@/modules/review/components/ReviewSection";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addToCart } from "@/modules/cart/cartSlice";
import { toggleWishlist } from "@/modules/wishlist/wishlistSlice";
import { toast } from "@/shared/lib/toast";
import { cn, formatCurrency } from "@/lib/utils";
import type { Variant } from "../types";

export function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useProduct(slug);

  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);

  const wished = useAppSelector((s) => (data ? s.wishlist.items.some((i) => i.id === data.product.id) : false));

  if (isLoading) return <PageLoader />;
  if (!data) return <div className="py-24 text-center text-muted-foreground">Product not found.</div>;

  const { product, related } = data;
  const images = product.images.length ? product.images : [""];

  function add(buyNow = false) {
    if (!variant) {
      toast.error("Please select a size");
      return;
    }
    dispatch(
      addToCart({
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        size: variant.size,
        color: variant.color,
        price: product.price,
        quantity: qty,
        maxStock: variant.stock,
      }),
    );
    if (buyNow) navigate("/cart");
    else toast.success("Added to bag");
  }

  return (
    <div className="aq-page mx-auto max-w-7xl px-4 py-10 md:px-6">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-gold-dark">Home</Link> /{" "}
        <Link to={`/shop?section=${product.section}`} className="hover:text-gold-dark capitalize">
          {product.section}
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "h-20 w-16 overflow-hidden rounded-lg border-2 bg-secondary",
                  activeImage === i ? "border-gold" : "border-transparent",
                )}
              >
                {img && <img src={img} alt="" className="h-full w-full object-cover" />}
              </button>
            ))}
          </div>
          <div className="aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-secondary">
            {images[activeImage] && (
              <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">{product.categoryName}</p>
          <h1 className="mt-2 font-display text-4xl text-foreground md:text-5xl">{product.name}</h1>

          {product.numReviews > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <RatingStars value={product.rating} />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} · {product.numReviews} reviews
              </span>
            </div>
          )}

          <div className="mt-5">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            {product.discountPct > 0 && (
              <span className="ml-3 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-dark">
                Save {product.discountPct}%
              </span>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>

          {product.shortDescription && (
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          )}

          {/* Sizes */}
          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Select Size</span>
              {variant && variant.stock <= 5 && (
                <span className="text-xs font-medium text-destructive">Only {variant.stock} left</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const disabled = v.stock <= 0;
                return (
                  <button
                    key={v.id}
                    disabled={disabled}
                    onClick={() => setVariant(v)}
                    className={cn(
                      "min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                      variant?.id === v.id
                        ? "border-navy bg-navy text-white"
                        : "border-border hover:border-navy",
                      disabled && "cursor-not-allowed opacity-40 line-through",
                    )}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qty + actions */}
          <div className="mt-7 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-lg">
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(variant?.stock ?? 10, q + 1))}
                className="px-4 py-2.5 text-lg"
              >
                +
              </button>
            </div>
            <button
              onClick={() =>
                dispatch(
                  toggleWishlist({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    image: product.images[0],
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                  }),
                )
              }
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-border hover:border-navy"
              aria-label="Wishlist"
            >
              <Heart className={cn("h-5 w-5", wished ? "fill-gold text-gold" : "text-navy")} />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => add(false)}
              disabled={!product.inStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-navy py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white disabled:opacity-40"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Bag
            </button>
            <button
              onClick={() => add(true)}
              disabled={!product.inStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm font-semibold text-navy transition-transform hover:scale-[1.02] disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          {/* Perks */}
          <div className="mt-7 grid grid-cols-3 gap-3 border-y border-border py-5 text-center">
            <Perk icon={Truck} label="Fast delivery" />
            <Perk icon={RefreshCw} label="7-day returns" />
            <Perk icon={ShieldCheck} label="Secure payment" />
          </div>

          {/* Details */}
          <div className="mt-6 space-y-5 text-sm">
            {product.description && (
              <Detail title="Description"><p className="leading-relaxed text-muted-foreground">{product.description}</p></Detail>
            )}

            {/* Material & Craft — fabric storytelling, the primary premium signal */}
            {product.fabric && (
              <div className="overflow-hidden rounded-sm border border-gold/20 bg-secondary/50">
                <div className="border-b border-gold/15 bg-navy px-5 py-3">
                  <p className="eyebrow text-gold-light">Material &amp; Craft</p>
                </div>
                <div className="px-5 py-4">
                  <p className="font-display text-2xl leading-tight text-foreground">{product.fabric}</p>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">
                    Cut and finished with subtle detailing along the placket and cuffs — refined
                    simplicity made to last and to wear with ease.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {product.color && <Spec label="Colour" value={product.color} />}
              {product.careInstructions && <Spec label="Care" value={product.careInstructions} />}
              <Spec label="Price" value={formatCurrency(product.price)} />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product.id} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl text-foreground">You may also like</h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}

function Perk({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon className="h-5 w-5 text-gold-dark" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 flex items-center gap-1.5 font-medium text-foreground">
        <Check className="h-4 w-4 text-gold-dark" /> {title}
      </h3>
      {children}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

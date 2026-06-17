import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Price } from "@/shared/components/Price";
import { RatingStars } from "@/shared/components/RatingStars";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleWishlist } from "@/modules/wishlist/wishlistSlice";
import { cn } from "@/lib/utils";
import type { ProductCard as TProductCard } from "../types";

export function ProductCard({ product }: { product: TProductCard }) {
  const dispatch = useAppDispatch();
  const wished = useAppSelector((s) => s.wishlist.items.some((i) => i.id === product.id));

  return (
    <div className="group">
      <div className="relative aq-zoom overflow-hidden rounded-2xl bg-secondary">
        <Link to={`/product/${product.slug}`} className="block aspect-[4/5]">
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.discountPct > 0 && (
            <span className="rounded-full bg-navy/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-light backdrop-blur">
              −{product.discountPct}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy">
              New
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground backdrop-blur">
              Sold out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          aria-label="Toggle wishlist"
          onClick={() =>
            dispatch(
              toggleWishlist({
                id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
              }),
            )
          }
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart className={cn("h-4 w-4", wished ? "fill-gold text-gold" : "text-navy")} />
        </button>

        {/* Hover CTA */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            to={`/product/${product.slug}`}
            className="flex w-full items-center justify-center rounded-full bg-navy/95 py-2.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur hover:bg-navy"
          >
            View Product
          </Link>
        </div>
      </div>

      <Link to={`/product/${product.slug}`} className="mt-4 block">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{product.categoryName}</p>
        <h3 className="mt-1 line-clamp-1 font-display text-xl leading-tight text-foreground transition-colors group-hover:text-gold-dark">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-3">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          {product.numReviews > 0 && (
            <span className="flex items-center gap-1">
              <RatingStars value={product.rating} size={12} />
              <span className="text-[11px] text-muted-foreground">({product.numReviews})</span>
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { removeWishlist } from "../wishlistSlice";
import { Price } from "@/shared/components/Price";

export function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.wishlist.items);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Heart className="h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-6 font-display text-3xl text-foreground">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap the heart on a product to save it here.
        </p>
        <Link
          to="/shop"
          className="mt-6 rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="aq-page mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-foreground">Wishlist</h1>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="group relative">
            <button
              onClick={() => dispatch(removeWishlist(item.id))}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur"
              aria-label="Remove"
            >
              <X className="h-4 w-4 text-navy" />
            </button>
            <Link to={`/product/${item.slug}`}>
              <div className="aq-zoom aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
                {item.image && (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                )}
              </div>
              <h3 className="mt-3 line-clamp-1 font-display text-lg text-foreground">
                {item.name}
              </h3>
              <Price price={item.price} compareAtPrice={item.compareAtPrice} size="sm" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

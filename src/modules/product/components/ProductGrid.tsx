import { ProductCard } from "./ProductCard";
import type { ProductCard as TProductCard } from "../types";

export function ProductGrid({
  products,
  loading,
  skeletonCount = 8,
}: {
  products: TProductCard[];
  loading?: boolean;
  skeletonCount?: number;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] rounded-xl bg-secondary" />
            <div className="mt-3 h-3 w-1/2 rounded bg-secondary" />
            <div className="mt-2 h-4 w-3/4 rounded bg-secondary" />
            <div className="mt-2 h-3 w-1/3 rounded bg-secondary" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-2xl text-foreground">Nothing here yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or explore another collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

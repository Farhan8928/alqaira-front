import { useCallback } from "react";
import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { useAdminProducts, useDeleteProduct } from "../hooks/useProducts";
import { ProductDialog } from "../components/ProductDialog";
import { formatCurrency } from "@/lib/utils";
import type { Product, ProductQuery } from "../types";

export function ProductsPage() {
  const buildQuery = useCallback(
    ({ search, page, limit }: { search: string; page: number; limit: number }): ProductQuery => ({
      search,
      page,
      limit,
    }),
    [],
  );

  return (
    <ResourceListPage<Product, ProductQuery>
      title="Products"
      subtitle="Catalog"
      newButtonText="New Product"
      searchPlaceholder="Search products…"
      minTableWidth="min-w-[820px]"
      useList={useAdminProducts}
      useDelete={useDeleteProduct}
      buildQuery={buildQuery}
      columns={[
        {
          header: "Product",
          getValue: (p) => (
            <div className="flex items-center gap-3">
              <div className="h-12 w-10 overflow-hidden rounded-md bg-secondary">
                {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <div>
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.categoryName}</p>
              </div>
            </div>
          ),
        },
        { header: "Section", getValue: (p) => <span className="capitalize">{p.section}</span> },
        { header: "Price", getValue: (p) => formatCurrency(p.price) },
        {
          header: "Stock",
          getValue: (p) => (
            <span className={p.totalStock <= 5 ? "font-semibold text-destructive" : "text-foreground"}>
              {p.totalStock}
            </span>
          ),
        },
        {
          header: "Status",
          getValue: (p) =>
            p.isActive ? (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600">Active</span>
            ) : (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">Hidden</span>
            ),
        },
      ]}
      renderDialog={(args) => <ProductDialog {...args} />}
    />
  );
}

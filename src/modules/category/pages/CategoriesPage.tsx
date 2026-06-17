import { useCallback } from "react";
import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { useAdminCategories, useDeleteCategory } from "../hooks/useCategories";
import { CategoryDialog } from "../components/CategoryDialog";
import type { Category } from "../types";

export function CategoriesPage() {
  const buildQuery = useCallback(
    ({ search, page, limit }: { search: string; page: number; limit: number }) => ({
      search,
      page,
      limit,
    }),
    [],
  );

  return (
    <ResourceListPage<Category, { search: string; page: number; limit: number }>
      title="Categories"
      subtitle="Catalog taxonomy"
      newButtonText="New Category"
      searchPlaceholder="Search categories…"
      minTableWidth="min-w-[700px]"
      useList={useAdminCategories}
      useDelete={useDeleteCategory}
      buildQuery={buildQuery}
      columns={[
        {
          header: "Name",
          getValue: (c) => <span className="font-medium text-foreground">{c.name}</span>,
        },
        { header: "Section", getValue: (c) => <span className="capitalize">{c.section}</span> },
        {
          header: "Slug",
          getValue: (c) => <span className="text-muted-foreground">{c.slug}</span>,
        },
        { header: "Order", getValue: (c) => c.displayOrder ?? 0 },
        {
          header: "Featured",
          getValue: (c) => (c.isFeatured ? <span className="text-gold-dark">★</span> : "—"),
        },
        {
          header: "Status",
          getValue: (c) =>
            c.isActive ? (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600">
                Active
              </span>
            ) : (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                Hidden
              </span>
            ),
        },
      ]}
      renderDialog={(args) => <CategoryDialog {...args} />}
    />
  );
}

import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "@/modules/category/hooks/useCategories";
import { cn } from "@/lib/utils";
import type { Section } from "../types";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
];

const SECTION_LABELS: Record<string, string> = {
  men: "Men",
  women: "Women",
  kids: "Kids & Boys",
};

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const section = params.get("section") || undefined;
  const category = params.get("category") || undefined;
  const search = params.get("search") || undefined;
  const sort = params.get("sort") || "newest";
  const page = Number(params.get("page") || 1);

  const { data: categories = [] } = useCategories(section);

  const categoryId = useMemo(
    () => categories.find((c) => c.slug === category)?.id,
    [categories, category],
  );

  const { data, isLoading } = useProducts({
    section,
    category: categoryId,
    search,
    sort,
    page,
    limit: 12,
  });

  function update(next: Record<string, string | undefined>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (v) merged.set(k, v);
      else merged.delete(k);
    });
    if (!("page" in next)) merged.set("page", "1");
    setParams(merged);
  }

  const meta = data?.meta;
  const heading = category
    ? categories.find((c) => c.slug === category)?.name
    : section
      ? SECTION_LABELS[section]
      : search
        ? `Results for “${search}”`
        : "All Products";

  return (
    <div className="aq-page mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">ALQAIRA Collection</p>
        <h1 className="mt-2 font-display text-4xl text-foreground md:text-5xl">{heading}</h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar filters */}
        <aside className="hidden lg:block">
          <FilterGroup title="Sections">
            {(["men", "women", "kids"] as Section[]).map((s) => (
              <button
                key={s}
                onClick={() =>
                  update({ section: section === s ? undefined : s, category: undefined })
                }
                className={cn(
                  "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  section === s ? "bg-navy text-white" : "hover:bg-secondary",
                )}
              >
                {SECTION_LABELS[s]}
              </button>
            ))}
          </FilterGroup>

          {categories.length > 0 && (
            <FilterGroup title="Categories">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => update({ category: category === c.slug ? undefined : c.slug })}
                  className={cn(
                    "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    category === c.slug
                      ? "bg-gold/20 font-medium text-gold-dark"
                      : "hover:bg-secondary",
                  )}
                >
                  {c.name}
                  {!section && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {c.section === "kids" ? "Kids" : c.section === "women" ? "Women" : "Men"}
                    </span>
                  )}
                </button>
              ))}
            </FilterGroup>
          )}
        </aside>

        {/* Results */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              {meta?.total ?? 0} products
            </span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile section chips */}
          <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            {(["men", "women", "kids"] as Section[]).map((s) => (
              <button
                key={s}
                onClick={() =>
                  update({ section: section === s ? undefined : s, category: undefined })
                }
                className={cn(
                  "shrink-0 rounded-full border px-4 py-1.5 text-sm",
                  section === s ? "border-navy bg-navy text-white" : "border-border",
                )}
              >
                {SECTION_LABELS[s]}
              </button>
            ))}
          </div>

          <ProductGrid products={data?.items ?? []} loading={isLoading} skeletonCount={9} />

          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                disabled={!meta.hasPrevPage}
                onClick={() => update({ page: String(page - 1) })}
                className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                disabled={!meta.hasNextPage}
                onClick={() => update({ page: String(page + 1) })}
                className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

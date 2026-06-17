import { useCallback } from "react";
import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { useCoupons, useDeleteCoupon } from "../hooks/useCoupons";
import { CouponDialog } from "../components/CouponDialog";
import { formatCurrency } from "@/lib/utils";
import type { Coupon } from "../types";

export function CouponsPage() {
  const buildQuery = useCallback(
    ({ search, page, limit }: { search: string; page: number; limit: number }) => ({ search, page, limit }),
    [],
  );

  return (
    <ResourceListPage<Coupon, { search: string; page: number; limit: number }>
      title="Coupons"
      subtitle="Discount codes"
      newButtonText="New Coupon"
      searchPlaceholder="Search by code…"
      minTableWidth="min-w-[760px]"
      useList={useCoupons}
      useDelete={useDeleteCoupon}
      buildQuery={buildQuery}
      columns={[
        { header: "Code", getValue: (c) => <span className="font-mono font-semibold text-foreground">{c.code}</span> },
        {
          header: "Discount",
          getValue: (c) => (c.type === "percent" ? `${c.value}%` : formatCurrency(c.value)),
        },
        { header: "Min Order", getValue: (c) => (c.minOrderValue ? formatCurrency(c.minOrderValue) : "—") },
        { header: "Used", getValue: (c) => `${c.usedCount}${c.usageLimit ? ` / ${c.usageLimit}` : ""}` },
        {
          header: "Status",
          getValue: (c) =>
            c.isActive ? (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600">Active</span>
            ) : (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">Inactive</span>
            ),
        },
      ]}
      renderDialog={(args) => <CouponDialog {...args} />}
    />
  );
}

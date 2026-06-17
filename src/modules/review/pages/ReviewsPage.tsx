import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { useAdminReviews, useSetReviewApproval, useDeleteReview } from "../hooks/useReviews";
import { RatingStars } from "@/shared/components/RatingStars";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { formatDate, cn } from "@/lib/utils";

export function ReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminReviews({ page, limit: 20 });
  const approve = useSetReviewApproval();
  const del = useDeleteReview();

  async function toggle(id: string, isApproved: boolean) {
    try {
      await approve.mutateAsync({ id, isApproved });
      toast.success(isApproved ? "Review approved" : "Review hidden");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  async function remove(id: string) {
    try {
      await del.mutateAsync(id);
      toast.success("Review deleted");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  return (
    <div className="aq-page space-y-5">
      <div>
        <h1 className="font-display text-3xl text-foreground">Reviews</h1>
        <p className="text-sm text-muted-foreground">{data?.meta?.total ?? 0} reviews</p>
      </div>

      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {data?.items.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No reviews yet.
          </div>
        )}
        {data?.items.map((r) => {
          const product = typeof r.product === "object" && r.product ? r.product : null;
          return (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <RatingStars value={r.rating} />
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        r.isApproved
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600",
                      )}
                    >
                      {r.isApproved ? "Published" : "Hidden"}
                    </span>
                  </div>
                  {r.title && <p className="mt-2 font-medium text-foreground">{r.title}</p>}
                  {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {r.customerName} · {product?.name || "Product"} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => toggle(r.id, !r.isApproved)}
                    className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-secondary"
                  >
                    {r.isApproved ? (
                      <X className="h-3.5 w-3.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {r.isApproved ? "Hide" : "Approve"}
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="flex items-center gap-1 rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={!data.meta.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <button
            disabled={!data.meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

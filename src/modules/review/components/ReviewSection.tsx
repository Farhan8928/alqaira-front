import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useProductReviews, usePostReview } from "../hooks/useReviews";
import { RatingStars } from "@/shared/components/RatingStars";
import { useAppSelector } from "@/app/hooks";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { formatDate, cn } from "@/lib/utils";

export function ReviewSection({ productId }: { productId: string }) {
  const { data: reviews = [] } = useProductReviews(productId);
  const customer = useAppSelector((s) => s.customerAuth.customer);
  const post = usePostReview(productId);

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await post.mutateAsync({ rating, title: title || undefined, comment: comment || undefined });
      toast.success("Thanks for your review");
      setTitle("");
      setComment("");
      setRating(5);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="font-display text-3xl text-foreground">Customer Reviews</h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        {/* Write */}
        <div>
          {customer ? (
            <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-medium text-foreground">Write a review</h3>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        n <= (hover || rating) ? "fill-gold text-gold" : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                ))}
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts…"
                rows={4}
                className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={post.isPending}
                className="mt-3 w-full rounded-full bg-navy py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {post.isPending ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              <Link to="/login" className="font-semibold text-gold-dark">
                Sign in
              </Link>{" "}
              to write a review.
            </div>
          )}
        </div>

        {/* List */}
        <div className="space-y-5">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet — be the first to review.
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-border pb-5">
                <div className="flex items-center justify-between">
                  <RatingStars value={r.rating} />
                  <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                </div>
                {r.title && <p className="mt-2 font-medium text-foreground">{r.title}</p>}
                {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                <p className="mt-2 text-xs font-medium text-gold-dark">
                  {r.customerName || "Verified buyer"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

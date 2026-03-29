import { useState, useEffect, useCallback } from "react";
import { Star, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { StarRating, RatingBreakdown } from "./StarRating";
import { ReviewCard, type Review } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

interface ReviewSectionProps {
  productId: number;
  productName: string;
  sessionId: string;
  apiBase: string;
}

type SortOption = "recent" | "helpful" | "highest" | "lowest";

export function ReviewSection({ productId, productName, sessionId, apiBase }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [avgRating, setAvgRating] = useState(0);
  const [breakdown, setBreakdown] = useState<Record<number, number>>({});
  const [sort, setSort] = useState<SortOption>("recent");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ productId: String(productId), sort, page: String(page) });
      if (starFilter) params.set("starFilter", String(starFilter));
      const res = await fetch(`${apiBase}/api/reviews?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setAvgRating(data.avgRating ?? 0);
      setBreakdown(data.breakdown ?? {});

      // Detect if current session has a review
      const mine = data.reviews?.find((r: Review) => r.sessionId === sessionId);
      if (mine) setUserReview(mine);
    } catch {}
    finally { setLoading(false); }
  }, [productId, sort, page, starFilter, sessionId, apiBase]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleFormSuccess = (review: Review) => {
    setShowForm(false);
    setEditingReview(null);
    setUserReview(review);
    fetchReviews();
  };

  const handleDelete = (id: number) => {
    setReviews(r => r.filter(x => x.id !== id));
    setTotal(t => t - 1);
    if (userReview?.id === id) setUserReview(null);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
    window.scrollTo({ top: document.getElementById("review-form")?.offsetTop ?? 0, behavior: "smooth" });
  };

  return (
    <section id="reviews" className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
          {total > 0 && <p className="text-slate-500 text-sm mt-1">{total} review{total !== 1 ? "s" : ""} for {productName}</p>}
        </div>
        {!userReview && !showForm && sessionId && (
          <button onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {(showForm || editingReview) && (
        <div id="review-form" className="mb-8">
          <ReviewForm
            productId={productId}
            sessionId={sessionId}
            apiBase={apiBase}
            editingReview={editingReview}
            onSuccess={handleFormSuccess}
            onCancel={() => { setShowForm(false); setEditingReview(null); }}
          />
        </div>
      )}

      {/* Rating Summary */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Big Score */}
            <div className="flex flex-col items-center text-center shrink-0 min-w-[120px]">
              <div className="text-6xl font-extrabold text-slate-900 leading-none mb-2">{avgRating.toFixed(1)}</div>
              <StarRating value={Math.round(avgRating)} readOnly size="md" />
              <div className="text-sm text-slate-500 mt-1">{total} review{total !== 1 ? "s" : ""}</div>
            </div>

            {/* Breakdown Bar */}
            <div className="flex-1 w-full">
              <RatingBreakdown breakdown={breakdown} total={total} />
            </div>

            {/* Star Filter Buttons */}
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => { setStarFilter(null); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!starFilter ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                All Stars
              </button>
              {[5, 4, 3, 2, 1].map(star => (
                <button key={star} onClick={() => { setStarFilter(star === starFilter ? null : star); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${starFilter === star ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {star} <Star className="w-3 h-3 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Controls */}
      {total > 0 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-500 font-medium">Sort by:</span>
          {(["recent", "helpful", "highest", "lowest"] as SortOption[]).map(s => (
            <button key={s} onClick={() => { setSort(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${sort === s ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {s === "recent" ? "Most Recent" : s === "helpful" ? "Most Helpful" : s === "highest" ? "Highest Rated" : "Lowest Rated"}
            </button>
          ))}
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-600 mb-1">No reviews yet</p>
          <p className="text-sm text-slate-400 mb-5">Be the first to review {productName}</p>
          {!showForm && sessionId && (
            <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm">
              Write a Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              sessionId={sessionId}
              apiBase={apiBase}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === p ? "bg-primary text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

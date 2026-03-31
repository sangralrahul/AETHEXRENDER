import { useState, useEffect } from "react";
import { Star, ArrowLeft, Edit3, Trash2, Clock } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import type { Review } from "@/components/ReviewCard";
import { useSession } from "@/hooks/use-session";
import { Link } from "wouter";

export default function MyReviews() {
  const sessionId = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    if (!sessionId) return;
    fetch(`${apiBase}/api/reviews/my?sessionId=${sessionId}`)
      .then(r => r.json())
      .then(d => setReviews(d.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      await fetch(`${apiBase}/api/reviews/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      setReviews(r => r.filter(x => x.id !== id));
    } catch {}
  };

  const handleEditSuccess = (updated: Review) => {
    setReviews(r => r.map(x => x.id === updated.id ? updated : x));
    setEditingReview(null);
  };

  const canEdit = (review: Review) =>
    (Date.now() - new Date(review.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen  bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">My Reviews</h1>
        <p className="text-slate-500 text-sm mb-8">Reviews you've written for Aethex products</p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-36 bg-white animate-pulse rounded-2xl border border-slate-100" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Star className="w-14 h-14 text-slate-200 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 text-lg mb-2">No reviews yet</h3>
            <p className="text-slate-400 text-sm mb-6">Purchase and review products to share your experience.</p>
            <Link href="/products" className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              editingReview?.id === review.id ? (
                <ReviewForm
                  key={review.id}
                  productId={review.productId!}
                  sessionId={sessionId}
                  apiBase={apiBase}
                  editingReview={editingReview}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingReview(null)}
                />
              ) : (
                <div key={review.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <StarRating value={review.starRating} readOnly size="sm" />
                      <h4 className="font-bold text-slate-900 mt-1.5">{review.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {canEdit(review) && (
                        <button onClick={() => setEditingReview(review)}
                          className="flex items-center gap-1 text-xs text-primary font-medium hover:underline px-2 py-1 rounded-lg hover:bg-primary/10 transition-all">
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                      <button onClick={() => handleDelete(review.id)}
                        className="flex items-center gap-1 text-xs text-rose-500 font-medium hover:underline px-2 py-1 rounded-lg hover:bg-rose-50 transition-all">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{review.body}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    {review.verifiedPurchase && (
                      <span className="text-emerald-600 font-semibold">✓ Verified Purchase</span>
                    )}
                    {review.status === "pending" && (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                    <span>{review.helpfulCount} found helpful</span>
                  </div>

                  {!canEdit(review) && (
                    <p className="text-xs text-slate-400 mt-2">Review editing period (7 days) has expired</p>
                  )}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Flag, MessageSquare, RefreshCw, Star, ArrowLeft } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { Link } from "wouter";

interface AnyReview {
  id: number;
  customerName: string;
  customerRole: string;
  starRating?: number;
  overallRating?: number;
  title: string;
  body: string;
  status: string;
  reported: boolean;
  productId?: number;
  platformName?: string;
  verifiedPurchase?: boolean;
  createdAt: string;
  adminReply?: string | null;
}

const STATUS_TABS = ["pending", "approved", "rejected", "flagged"] as const;

export default function AdminReviews() {
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "flagged">("pending");
  const [productReviews, setProductReviews] = useState<AnyReview[]>([]);
  const [platformRevs, setPlatformRevs] = useState<AnyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<{ id: number; type: string } | null>(null);
  const [replyText, setReplyText] = useState("");

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/reviews?status=${tab}`);
      const data = await res.json();
      setProductReviews(data.productReviews ?? []);
      setPlatformRevs(data.platformReviews ?? []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [tab]);

  const moderate = async (id: number, status: string, type: string) => {
    await fetch(`${apiBase}/api/admin/reviews/${id}/moderate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, type }),
    });
    fetchReviews();
  };

  const submitReply = async () => {
    if (!replyId || !replyText.trim()) return;
    await fetch(`${apiBase}/api/admin/reviews/${replyId.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText.trim(), type: replyId.type }),
    });
    setReplyId(null);
    setReplyText("");
    fetchReviews();
  };

  const ReviewRow = ({ review, type }: { review: AnyReview; type: string }) => {
    const rating = review.starRating ?? review.overallRating ?? 0;
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-800">{review.customerName}</span>
              <span className="text-xs text-slate-400">{review.customerRole}</span>
              {type === "product" && review.verifiedPurchase && (
                <span className="text-xs text-emerald-600 font-semibold">✓ Verified</span>
              )}
              {type === "platform" && (
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">{review.platformName}</span>
              )}
              {review.reported && (
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <Flag className="w-3 h-3" /> Reported
                </span>
              )}
            </div>
            <StarRating value={rating} readOnly size="sm" />
          </div>
          <span className="text-xs text-slate-400 shrink-0">
            {new Date(review.createdAt).toLocaleDateString("en-IN")}
          </span>
        </div>
        <h4 className="font-bold text-slate-900 mb-1">{review.title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{review.body}</p>

        {review.adminReply && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
            <p className="text-xs font-bold text-primary mb-1">Aethex Reply:</p>
            <p className="text-xs text-slate-600">{review.adminReply}</p>
          </div>
        )}

        {/* Reply form inline */}
        {replyId?.id === review.id && replyId.type === type && (
          <div className="mb-4">
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
              placeholder="Write an official reply from Aethex..." rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <div className="flex gap-2 mt-2">
              <button onClick={submitReply} className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg">Post Reply</button>
              <button onClick={() => setReplyId(null)} className="px-4 py-1.5 text-xs text-slate-500 font-semibold">Cancel</button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {tab !== "approved" && (
            <button onClick={() => moderate(review.id, "approved", type)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
            </button>
          )}
          {tab !== "rejected" && (
            <button onClick={() => moderate(review.id, "rejected", type)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-all">
              <XCircle className="w-3.5 h-3.5" /> Reject
            </button>
          )}
          {tab !== "flagged" && (
            <button onClick={() => moderate(review.id, "flagged", type)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all">
              <Flag className="w-3.5 h-3.5" /> Flag
            </button>
          )}
          <button onClick={() => { setReplyId({ id: review.id, type }); setReplyText(review.adminReply ?? ""); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all">
            <MessageSquare className="w-3.5 h-3.5" /> Reply
          </button>
        </div>
      </div>
    );
  };

  const total = productReviews.length + platformRevs.length;

  return (
    <div className="min-h-screen pt-[72px] bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Review Moderation</h1>
            <p className="text-slate-500 text-sm mt-1">Manage all product and platform reviews</p>
          </div>
          <button onClick={fetchReviews} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px">
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold transition-all capitalize border-b-2 -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white animate-pulse rounded-2xl border border-slate-100" />)}
          </div>
        ) : total === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No {tab} reviews</p>
            <p className="text-sm text-slate-400 mt-1">All caught up!</p>
          </div>
        ) : (
          <>
            {productReviews.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Product Reviews ({productReviews.length})</h3>
                <div className="space-y-4">
                  {productReviews.map(r => <ReviewRow key={r.id} review={r} type="product" />)}
                </div>
              </div>
            )}
            {platformRevs.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Platform Reviews ({platformRevs.length})</h3>
                <div className="space-y-4">
                  {platformRevs.map(r => <ReviewRow key={r.id} review={r} type="platform" />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

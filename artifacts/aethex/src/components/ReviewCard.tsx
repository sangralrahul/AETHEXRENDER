import { useState } from "react";
import { ThumbsUp, Flag, CheckCircle2, Pencil, Trash2, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { StarRating } from "./StarRating";

export interface Review {
  id: number;
  productId?: number;
  sessionId: string;
  customerName: string;
  customerRole: string;
  starRating: number;
  title: string;
  body: string;
  photos: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  status: string;
  adminReply?: string | null;
  adminReplyAt?: string | null;
  reported: boolean;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  sessionId: string;
  apiBase: string;
  onEdit?: (review: Review) => void;
  onDelete?: (id: number) => void;
  onHelpfulChange?: (id: number, voted: boolean, newCount: number) => void;
}

export function ReviewCard({ review, sessionId, apiBase, onEdit, onDelete, onHelpfulChange }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [showPhotos, setShowPhotos] = useState(false);
  const [reported, setReported] = useState(review.reported);

  const isOwn = review.sessionId === sessionId;
  const isLong = review.body.length > 200;
  const canEdit = isOwn && (Date.now() - new Date(review.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

  const daysSince = Math.floor((Date.now() - new Date(review.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const dateStr = daysSince === 0 ? "Today" : daysSince === 1 ? "Yesterday" : `${daysSince} days ago`;

  const handleHelpful = async () => {
    try {
      const res = await fetch(`${apiBase}/api/reviews/${review.id}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      const newCount = data.voted ? helpfulCount + 1 : Math.max(0, helpfulCount - 1);
      setHelpfulVoted(data.voted);
      setHelpfulCount(newCount);
      onHelpfulChange?.(review.id, data.voted, newCount);
    } catch {}
  };

  const handleReport = async () => {
    if (reported) return;
    try {
      await fetch(`${apiBase}/api/reviews/${review.id}/report`, { method: "POST" });
      setReported(true);
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;
    try {
      await fetch(`${apiBase}/api/reviews/${review.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      onDelete?.(review.id);
    } catch {}
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
            {review.customerName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{review.customerName}</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">{review.customerRole}</span>
              {review.verifiedPurchase && (
                <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StarRating value={review.starRating} readOnly size="sm" />
          <span className="text-xs text-slate-400">{dateStr}</span>
        </div>
      </div>

      {/* Content */}
      <h4 className="font-bold text-slate-900 mb-2">{review.title}</h4>
      <div className="text-sm text-slate-600 leading-relaxed">
        {isLong && !expanded ? review.body.slice(0, 200) + "…" : review.body}
        {isLong && (
          <button onClick={() => setExpanded(e => !e)} className="ml-1 text-primary font-medium text-xs hover:underline">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Photos */}
      {review.photos?.length > 0 && (
        <div className="mt-3">
          <button onClick={() => setShowPhotos(s => !s)} className="flex items-center gap-1 text-xs text-primary font-medium">
            {showPhotos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {review.photos.length} Photo{review.photos.length !== 1 ? "s" : ""}
          </button>
          {showPhotos && (
            <div className="flex gap-2 mt-2">
              {review.photos.map((src, i) => (
                <img key={i} src={src} alt={`Review photo ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90"
                  onClick={() => window.open(src, "_blank")} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Reply */}
      {review.adminReply && (
        <div className="mt-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">Aethex Response</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{review.adminReply}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={handleHelpful}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${helpfulVoted ? "text-primary" : "text-slate-500 hover:text-primary"}`}>
            <ThumbsUp className={`w-3.5 h-3.5 ${helpfulVoted ? "fill-primary" : ""}`} />
            Helpful ({helpfulCount})
          </button>
          {!isOwn && !reported && (
            <button onClick={handleReport} className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors">
              <Flag className="w-3 h-3" /> Report
            </button>
          )}
          {reported && <span className="text-xs text-slate-400">Reported</span>}
        </div>
        {isOwn && (
          <div className="flex items-center gap-2">
            {canEdit && onEdit && (
              <button onClick={() => onEdit(review)} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                <Pencil className="w-3 h-3" /> Edit
              </button>
            )}
            <button onClick={handleDelete} className="flex items-center gap-1 text-xs text-rose-500 font-medium hover:underline">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

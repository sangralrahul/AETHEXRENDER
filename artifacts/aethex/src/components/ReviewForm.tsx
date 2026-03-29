import { useState, useRef } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Review } from "./ReviewCard";

interface ReviewFormProps {
  productId: number;
  sessionId: string;
  apiBase: string;
  editingReview?: Review | null;
  onSuccess: (review: Review) => void;
  onCancel?: () => void;
}

const ROLES = ["Doctor", "Resident", "Student", "Nurse", "Pharmacist", "Other"];

function resizeImage(file: File, maxSize = 600): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ReviewForm({ productId, sessionId, apiBase, editingReview, onSuccess, onCancel }: ReviewFormProps) {
  const [starRating, setStarRating] = useState(editingReview?.starRating ?? 0);
  const [title, setTitle] = useState(editingReview?.title ?? "");
  const [body, setBody] = useState(editingReview?.body ?? "");
  const [customerName, setCustomerName] = useState(editingReview?.customerName ?? "");
  const [customerRole, setCustomerRole] = useState(editingReview?.customerRole ?? "Doctor");
  const [photos, setPhotos] = useState<string[]>((editingReview?.photos as string[]) ?? []);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - photos.length);
    const resized = await Promise.all(files.map(f => resizeImage(f)));
    setPhotos(p => [...p, ...resized].slice(0, 3));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (starRating === 0) { setError("Please select a star rating"); return; }
    if (!title.trim()) { setError("Please add a title"); return; }
    if (body.trim().length < 20) { setError("Review must be at least 20 characters"); return; }
    if (!customerName.trim()) { setError("Please enter your name"); return; }

    setSubmitting(true);
    try {
      const isEdit = !!editingReview;
      const url = isEdit ? `${apiBase}/api/reviews/${editingReview!.id}` : `${apiBase}/api/reviews`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, sessionId, starRating, title: title.trim(), body: body.trim(), customerName: customerName.trim(), customerRole, photos }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to submit review"); return; }
      onSuccess(data.review);
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 text-lg mb-5">
        {editingReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      {/* Star Rating */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Overall Rating *</label>
        <div className="flex items-center gap-3">
          <StarRating value={starRating} onChange={setStarRating} size="lg" />
          {starRating > 0 && (
            <span className="text-sm font-semibold text-amber-600">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][starRating]}
            </span>
          )}
        </div>
      </div>

      {/* Name + Role */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name *</label>
          <input value={customerName} onChange={e => setCustomerName(e.target.value)}
            placeholder="e.g. Dr. Priya S." maxLength={60}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
          <select value={customerRole} onChange={e => setCustomerRole(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white">
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Review Title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Excellent stethoscope for daily use" maxLength={120}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Your Review * <span className="font-normal text-slate-400">({body.length}/500 — min 20)</span>
        </label>
        <textarea value={body} onChange={e => setBody(e.target.value.slice(0, 500))}
          placeholder="Share your experience with this product — sound quality, build, comfort, value for money..."
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
      </div>

      {/* Photos */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Photos (optional, max 3)</label>
        <div className="flex gap-2 flex-wrap">
          {photos.map((src, i) => (
            <div key={i} className="relative w-20 h-20">
              <img src={src} className="w-full h-full object-cover rounded-xl border border-slate-200" alt="" />
              <button type="button" onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-md">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {photos.length < 3 && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-primary hover:text-primary transition-all">
              <Camera className="w-5 h-5" />
              <span className="text-[10px] font-medium">Add Photo</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handlePhotoAdd} />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 mb-4 font-medium">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {editingReview ? "Update Review" : "Submit Review"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

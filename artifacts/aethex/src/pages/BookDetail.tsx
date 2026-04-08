import { useRoute, Link } from "wouter";
import { useEffect, useState } from "react";
import {
  Star, Truck, ShieldCheck, Plus, Minus, ShoppingCart, ChevronRight,
  Tag, RotateCcw, BadgeCheck, Zap, MapPin, CreditCard,
  HeartHandshake, CheckCircle2, Info, ArrowLeft, Share2, Heart,
  Clock, ThumbsUp, Building2, BookOpen, GraduationCap, Award,
  FileText, Package,
} from "lucide-react";
import { useAddToCart, useListProducts } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";
import { CURRICULUM, type CurrBook, type Degree } from "@/data/curriculumBooks";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Slug helpers ───────────────────────────────────────────────────────────
export function bookSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function findBook(slug: string): { book: CurrBook; degree: Degree; subjectName: string; subjectColor: string } | null {
  for (const deg of CURRICULUM) {
    for (const year of deg.years) {
      for (const subj of year.subjects) {
        for (const book of subj.books) {
          if (bookSlug(book.name) === slug) {
            return { book, degree: deg, subjectName: subj.name, subjectColor: subj.color };
          }
        }
      }
    }
  }
  return null;
}

// ── Book cover hook ────────────────────────────────────────────────────────
function useBookCover(title: string, author: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${BASE}/api/book-cover?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`,
      { signal: AbortSignal.timeout(15000) })
      .then(r => r.json())
      .then((d: { url: string | null }) => { if (!cancelled) { setUrl(d.url); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [title, author]);
  return { url, loading };
}

// ── Rating bars ────────────────────────────────────────────────────────────
function RatingBar({ stars, pct }: { stars: number; pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-6 text-right shrink-0" style={{ color: "#636366" }}>{stars}★</span>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "#E5E5EA" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 40 ? "#34C759" : pct > 20 ? "#FF9500" : "#FF3B30" }} />
      </div>
      <span className="text-xs w-7 shrink-0" style={{ color: "#8E8E93" }}>{pct}%</span>
    </div>
  );
}

const BANK_OFFERS = [
  { icon: CreditCard, text: "10% instant discount on SBI Credit/Debit Cards", code: "SBI10" },
  { icon: Tag, text: "Extra ₹50 off via PhonePe UPI on orders above ₹499", code: "PHONEPAY50" },
  { icon: Zap, text: "No-cost EMI available — 0% interest", code: null },
];

// ── Main Page ──────────────────────────────────────────────────────────────
export default function BookDetail() {
  const [, params] = useRoute("/books/:slug");
  const slug = params?.slug || "";
  const result = findBook(slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const sessionId = useSession();
  const { toast } = useToast();
  const addToCartMutation = useAddToCart();

  const { data: relatedProducts } = useListProducts(
    { category: "books", limit: 5 },
    { query: { enabled: true } }
  );

  const { url: coverUrl, loading: coverLoading } = useBookCover(
    result?.book.name || "",
    result?.book.author || ""
  );

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F2F2F7" }}>
        <div className="text-center px-8">
          <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: "#C7C7CC" }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1C1C1E" }}>Book not found</h2>
          <p className="mb-6" style={{ color: "#8E8E93" }}>This book may have been removed or the link is invalid.</p>
          <Link href="/books" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "#00C2A8" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Medical Books
          </Link>
        </div>
      </div>
    );
  }

  const { book, degree, subjectName, subjectColor } = result;
  const discount = book.mrp > book.price ? Math.round(((book.mrp - book.price) / book.mrp) * 100) : 0;
  const savings = book.mrp > book.price ? book.mrp - book.price : 0;
  const rating = book.featured ? 4.6 : 4.2;

  const thumbnails = coverUrl
    ? [coverUrl, coverUrl, coverUrl]
    : [];

  const deliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + (pincodeChecked ? 3 : 5));
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  })();

  const ratingBars = [
    { stars: 5, pct: book.featured ? 62 : 45 },
    { stars: 4, pct: book.featured ? 22 : 28 },
    { stars: 3, pct: 10 },
    { stars: 2, pct: 5 },
    { stars: 1, pct: 3 },
  ];

  const specs = [
    { key: "Author", value: book.author },
    { key: "Publisher", value: book.publisher },
    { key: "Edition", value: book.edition },
    { key: "Language", value: "English" },
    { key: "Subject", value: subjectName },
    { key: "Degree", value: degree.label },
    ...(book.forExam?.length ? [{ key: "Relevant Exams", value: book.forExam.join(", ") }] : []),
    { key: "Country of Origin", value: "India / International" },
    { key: "Sold by", value: "AETHEX Medical Pvt. Ltd." },
    { key: "Availability", value: "In Stock" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>

      {/* ── BREADCRUMB ── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5EA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="text-xs font-medium transition-colors hover:text-[#00C2A8]" style={{ color: "#8E8E93" }}>Home</Link>
          <ChevronRight className="w-3 h-3" style={{ color: "#C7C7CC" }} />
          <Link href="/books" className="text-xs font-medium transition-colors hover:text-[#00C2A8]" style={{ color: "#8E8E93" }}>Medical Books</Link>
          <ChevronRight className="w-3 h-3" style={{ color: "#C7C7CC" }} />
          <span className="text-xs font-medium" style={{ color: "#8E8E93" }}>{degree.label}</span>
          <ChevronRight className="w-3 h-3" style={{ color: "#C7C7CC" }} />
          <span className="text-xs font-medium" style={{ color: "#8E8E93" }}>{subjectName}</span>
          <ChevronRight className="w-3 h-3" style={{ color: "#C7C7CC" }} />
          <span className="text-xs font-semibold truncate max-w-[200px]" style={{ color: "#1C1C1E" }}>
            {book.name.replace(/\s+\d+(?:st|nd|rd|th)\s+Ed(?:ition)?.*$/i, "")}
          </span>
        </div>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── LEFT: Book Cover Gallery ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-[148px]">
              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E5EA" }}>
                {/* Main Cover */}
                <div
                  className="relative flex items-center justify-center overflow-hidden cursor-zoom-in"
                  style={{ height: 440, background: `linear-gradient(160deg, ${subjectColor}18, ${subjectColor}06)` }}
                >
                  {book.featured && (
                    <span className="absolute top-4 left-4 text-xs font-extrabold px-2.5 py-1 rounded-lg z-10" style={{ background: "#FF9500", color: "#fff" }}>
                      ★ Editor's Pick
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-4 right-16 text-xs font-extrabold px-2.5 py-1 rounded-lg z-10" style={{ background: "#FF3B30", color: "#fff" }}>
                      {discount}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => setWishlisted(w => !w)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
                    style={{ background: wishlisted ? "#FFE5E5" : "#F2F2F7", border: "1px solid #E5E5EA" }}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </button>

                  {coverLoading ? (
                    <div className="w-48 h-72 rounded-xl animate-pulse" style={{ background: `${subjectColor}22` }} />
                  ) : coverUrl ? (
                    <img
                      src={thumbnails[selectedImg] || coverUrl}
                      alt={book.name}
                      className="max-h-[380px] max-w-full object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105"
                    />
                  ) : (
                    /* Elegant book spine fallback */
                    <div className="w-52 h-72 rounded-xl flex flex-col items-center justify-center gap-4 p-6 text-center shadow-2xl"
                      style={{ background: `linear-gradient(160deg, ${subjectColor}EE, ${subjectColor}99)` }}>
                      <BookOpen className="w-10 h-10 text-white opacity-80" />
                      <p className="text-sm font-bold text-white leading-snug">{book.name.replace(/\s+\d+(?:st|nd|rd|th)\s+Ed(?:ition)?.*$/i, "")}</p>
                      <p className="text-xs text-white/70">{book.author}</p>
                      <div className="mt-auto px-3 py-1 rounded-full text-xs font-bold text-white/90"
                        style={{ background: "rgba(0,0,0,0.2)" }}>{book.edition}</div>
                    </div>
                  )}
                </div>

                {/* Thumbnail strip */}
                {coverUrl && (
                  <div className="flex gap-3 p-4" style={{ borderTop: "1px solid #E5E5EA" }}>
                    {thumbnails.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImg(i)}
                        className="w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all"
                        style={{ border: selectedImg === i ? `2px solid ${subjectColor}` : "2px solid #E5E5EA", background: "#FAFAFA" }}
                      >
                        <img src={src} alt="" className="w-full h-full object-contain p-1" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Edition + Exam badges */}
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: `${subjectColor}14`, color: subjectColor }}>
                    <FileText className="w-3 h-3" /> {book.edition}
                  </span>
                  {book.forExam?.map(e => (
                    <span key={e} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#FF9F0A18", color: "#FF9500" }}>
                      {e}
                    </span>
                  ))}
                  <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ml-auto transition-all hover:bg-[#F2F2F7]" style={{ color: "#636366", border: "1px solid #E5E5EA" }}>
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Book Info ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Card 1: Core Info */}
            <div className="bg-white rounded-2xl p-6 lg:p-8" style={{ border: "1px solid #E5E5EA" }}>
              {/* Subject + degree */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg" style={{ color: subjectColor, background: `${subjectColor}14` }}>
                  <GraduationCap className="w-3.5 h-3.5" /> {subjectName}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ color: degree.color, background: `${degree.color}14` }}>
                  {degree.label}
                </span>
                {book.featured && (
                  <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg" style={{ background: "#FF9F0A18", color: "#FF9500" }}>
                    <Award className="w-3.5 h-3.5" /> Recommended
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 leading-tight" style={{ color: "#1C1C1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {book.name.replace(/\s+\d+(?:st|nd|rd|th)\s+Ed(?:ition)?.*$/i, "")}
              </h1>
              <p className="text-base font-semibold mb-1" style={{ color: "#636366" }}>
                {book.edition}
              </p>

              {/* Author & Publisher */}
              <div className="flex items-center gap-3 mb-4 flex-wrap text-sm">
                <span style={{ color: "#3C3C43" }}>
                  by <span className="font-bold" style={{ color: "#007AFF" }}>{book.author}</span>
                </span>
                <span className="text-[#C7C7CC]">|</span>
                <span style={{ color: "#8E8E93" }}>{book.publisher}</span>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: "1px solid #F2F2F7" }}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "#34C75920", border: "1px solid #34C75940" }}>
                  <Star className="w-4 h-4 fill-[#34C759] text-[#34C759]" />
                  <span className="font-bold text-sm" style={{ color: "#1C7A3B" }}>{rating}</span>
                </div>
                <span className="text-sm font-medium underline decoration-dashed underline-offset-2 cursor-pointer" style={{ color: "#636366" }}>
                  {book.featured ? "847" : "312"} Ratings &amp; Reviews
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#8E8E93" }}>
                  <BadgeCheck className="w-4 h-4 text-[#007AFF]" />
                  Verified Doctors
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-5">
                <div className="flex items-end gap-3 mb-1 flex-wrap">
                  <span className="text-4xl font-extrabold" style={{ color: "#1C1C1E" }}>
                    ₹{book.price.toLocaleString("en-IN")}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-xl line-through font-medium mb-0.5" style={{ color: "#AEAEB2" }}>
                        ₹{book.mrp.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xl font-extrabold mb-0.5" style={{ color: "#FF3B30" }}>
                        {discount}% off
                      </span>
                    </>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-sm font-semibold" style={{ color: "#34C759" }}>
                    You save ₹{savings.toLocaleString("en-IN")} 🎉
                  </p>
                )}
                <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#8E8E93" }}>
                  <Info className="w-3.5 h-3.5" /> Inclusive of all taxes
                </p>
              </div>

              {/* EMI */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm font-semibold" style={{ background: "#007AFF0D", border: "1px solid #007AFF20" }}>
                <CreditCard className="w-4 h-4 shrink-0" style={{ color: "#007AFF" }} />
                <span style={{ color: "#007AFF" }}>
                  No-cost EMI from ₹{Math.round(book.price / 6).toLocaleString("en-IN")}/month
                </span>
                <span className="ml-auto text-xs font-semibold" style={{ color: "#007AFF" }}>View Plans →</span>
              </div>
            </div>

            {/* Card 2: Offers */}
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E5EA" }}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#1C1C1E" }}>
                <Tag className="w-4 h-4 text-[#FF9500]" /> Available Offers
              </h3>
              <div className="space-y-3">
                {BANK_OFFERS.map((offer, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#FF9500", minWidth: 24 }}>
                      <offer.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-sm leading-snug" style={{ color: "#3C3C43" }}>
                      {offer.text}
                      {offer.code && <span className="ml-1 font-bold" style={{ color: "#FF9500" }}>Use: {offer.code}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Delivery */}
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E5EA" }}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#1C1C1E" }}>
                <Truck className="w-4 h-4 text-[#34C759]" /> Delivery &amp; Services
              </h3>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8E8E93" }} />
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setPincodeChecked(false); }}
                    placeholder="Enter Pincode"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ border: "1px solid #E5E5EA", background: "#F9F9FB", color: "#1C1C1E" }}
                  />
                </div>
                <button
                  onClick={() => { if (pincode.length === 6) setPincodeChecked(true); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: "#00C2A8", color: "#fff" }}
                >
                  Check
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#D1FAE5" }}>
                    <Truck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>Free Delivery by {deliveryDate}</p>
                    <p className="text-xs" style={{ color: "#8E8E93" }}>Free shipping on orders above ₹499</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#EDE9FE" }}>
                    <RotateCcw className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>7-Day Easy Return</p>
                    <p className="text-xs" style={{ color: "#8E8E93" }}>Unused books accepted — full refund</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>Same Day Dispatch</p>
                    <p className="text-xs" style={{ color: "#8E8E93" }}>Order before 2 PM for same day shipping</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Add to Cart */}
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E5EA" }}>
              <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: "1px solid #F2F2F7" }}>
                <Building2 className="w-4 h-4" style={{ color: "#8E8E93" }} />
                <span className="text-sm" style={{ color: "#636366" }}>Sold by</span>
                <span className="text-sm font-bold" style={{ color: "#007AFF" }}>AETHEX Medical Pvt. Ltd.</span>
                <BadgeCheck className="w-4 h-4" style={{ color: "#007AFF" }} />
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-semibold" style={{ color: "#636366" }}>Quantity</span>
                <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #E5E5EA" }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[#F2F2F7]" style={{ color: "#636366" }}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-base" style={{ color: "#1C1C1E", borderLeft: "1px solid #E5E5EA", borderRight: "1px solid #E5E5EA", lineHeight: "40px", height: 40 }}>
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-[#F2F2F7]" style={{ color: "#636366" }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    toast({ title: "Added to Cart!", description: `${quantity}× ${book.name} added.` });
                  }}
                  className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-2xl text-base font-extrabold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "#00C2A8", color: "#FFFFFF" }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-2xl text-base font-extrabold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "#FF9500", color: "#FFFFFF" }}
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
              </div>

              {/* Trust Strip */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4" style={{ borderTop: "1px solid #F2F2F7" }}>
                {[
                  { icon: BadgeCheck, text: "100% Original", sub: "Latest Edition" },
                  { icon: RotateCcw, text: "Easy Returns", sub: "7-day policy" },
                  { icon: ShieldCheck, text: "Secure Pay", sub: "SSL Encrypted" },
                ].map(item => (
                  <div key={item.text} className="flex flex-col items-center text-center gap-1.5 py-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#00C2A81A" }}>
                      <item.icon className="w-4 h-4" style={{ color: "#00C2A8" }} />
                    </div>
                    <p className="text-xs font-bold" style={{ color: "#1C1C1E" }}>{item.text}</p>
                    <p className="text-[10px]" style={{ color: "#8E8E93" }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── DETAILS ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

          {/* About + Specs */}
          <div className="lg:col-span-8">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6" style={{ border: "1px solid #E5E5EA" }}>
              <h2 className="text-xl font-bold mb-4 pb-3" style={{ color: "#1C1C1E", borderBottom: "1px solid #F2F2F7" }}>About this Book</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#3C3C43" }}>
                <strong>{book.name}</strong> by <strong>{book.author}</strong> ({book.edition}) is a definitive textbook for {subjectName} in the {degree.label} curriculum. Published by {book.publisher}, this edition incorporates the latest guidelines, clinical correlations, and exam-focused content.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#3C3C43" }}>
                Recommended by faculty across AIIMS, MAMC, KEM, and leading medical colleges in India, this book is essential for understanding core concepts and excelling in your examinations.
              </p>
              {book.forExam && book.forExam.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #F2F2F7" }}>
                  <p className="w-full text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#8E8E93" }}>Relevant for</p>
                  {book.forExam.map(e => (
                    <span key={e} className="px-3 py-1.5 text-xs font-bold rounded-lg" style={{ background: "#FF9F0A14", color: "#FF9500" }}>
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Specs Table */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E5EA" }}>
              <div className="px-6 lg:px-8 py-4" style={{ borderBottom: "1px solid #F2F2F7" }}>
                <h2 className="text-xl font-bold" style={{ color: "#1C1C1E" }}>Book Details</h2>
              </div>
              <div>
                {specs.map((spec, i) => (
                  <div key={i} className="flex" style={{ borderBottom: i < specs.length - 1 ? "1px solid #F2F2F7" : "none" }}>
                    <div className="w-44 lg:w-56 px-6 lg:px-8 py-3.5 text-sm font-semibold shrink-0" style={{ color: "#636366", background: "#FAFAFA" }}>
                      {spec.key}
                    </div>
                    <div className="flex-1 px-6 py-3.5 text-sm" style={{ color: "#1C1C1E" }}>
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ratings Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 sticky top-[148px]" style={{ border: "1px solid #E5E5EA" }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: "#1C1C1E" }}>Ratings &amp; Reviews</h2>

              <div className="flex items-center gap-4 mb-5 pb-4" style={{ borderBottom: "1px solid #F2F2F7" }}>
                <div className="text-center">
                  <div className="text-5xl font-extrabold" style={{ color: "#1C1C1E" }}>{rating}</div>
                  <div className="flex items-center gap-0.5 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#8E8E93" }}>{book.featured ? "847" : "312"} ratings</p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingBars.map(bar => <RatingBar key={bar.stars} stars={bar.stars} pct={bar.pct} />)}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "#3C3C43" }}>
                  <ThumbsUp className="w-4 h-4 text-[#34C759] shrink-0" />
                  <span>Well explained with clinical correlations</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "#3C3C43" }}>
                  <ThumbsUp className="w-4 h-4 text-[#34C759] shrink-0" />
                  <span>Latest edition with updated guidelines</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "#3C3C43" }}>
                  <HeartHandshake className="w-4 h-4 text-[#00C2A8] shrink-0" />
                  <span>Trusted by students across AIIMS &amp; PGI</span>
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #F2F2F7" }}>
                <p className="text-xs text-center" style={{ color: "#8E8E93" }}>
                  Verified by NMC curriculum standards
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MORE BOOKS ── */}
        {relatedProducts && relatedProducts.products.length > 0 && (
          <div className="mt-6">
            <div className="bg-white rounded-2xl p-6 lg:p-8" style={{ border: "1px solid #E5E5EA" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1C1C1E" }}>
                <BookOpen className="w-5 h-5 text-[#FF9500]" />
                More Medical Books
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {relatedProducts.products.slice(0, 5).map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={(id) => {
                      if (!sessionId) return;
                      addToCartMutation.mutate(
                        { data: { productId: id, sessionId, quantity: 1 } },
                        { onSuccess: () => toast({ title: "Added to cart" }) }
                      );
                    }}
                    isAdding={addToCartMutation.isPending}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

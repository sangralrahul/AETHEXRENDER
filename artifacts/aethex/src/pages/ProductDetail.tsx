import { useRoute, Link } from "wouter";
import {
  Star, Truck, ShieldCheck, Plus, Minus, ShoppingCart, ChevronRight,
  Tag, Package, RotateCcw, BadgeCheck, Zap, MapPin, CreditCard,
  HeartHandshake, CheckCircle2, Info, ArrowLeft, Share2, Heart,
  Clock, ThumbsUp, Building2, Sparkles,
} from "lucide-react";
import { useGetProduct, useAddToCart, useListProducts } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/utils";
import { useState, useRef } from "react";
import { ReviewSection } from "@/components/ReviewSection";
import { ProductCard } from "@/components/ProductCard";

function RatingBar({ stars, pct }: { stars: number; pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-6 text-right shrink-0" style={{ color: "#636366" }}>{stars}★</span>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "#E5E5EA" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct > 40 ? "#34C759" : pct > 20 ? "#FF9500" : "#FF3B30",
          }}
        />
      </div>
      <span className="text-xs w-7 shrink-0" style={{ color: "#8E8E93" }}>{pct}%</span>
    </div>
  );
}

function getRatingBars(rating: number) {
  const r = Math.min(5, Math.max(1, rating));
  return [
    { stars: 5, pct: Math.round(10 + (r - 1) * 18) },
    { stars: 4, pct: Math.round(8 + (r - 1) * 10) },
    { stars: 3, pct: Math.round(35 - (r - 1) * 6) },
    { stars: 2, pct: Math.round(20 - (r - 1) * 4) },
    { stars: 1, pct: Math.round(15 - (r - 1) * 3) },
  ];
}

const BANK_OFFERS = [
  { icon: CreditCard, text: "10% instant discount on SBI Credit/Debit Cards", code: "SBI10" },
  { icon: Tag, text: "Extra ₹50 off via PhonePe UPI on orders above ₹499", code: "PHONEPAY50" },
  { icon: Zap, text: "No-cost EMI from ₹199/month — 0% interest", code: null },
];

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const [, shopParams] = useRoute("/shop/:id");
  const productId = parseInt(params?.id || shopParams?.id || "0", 10);
  const sessionId = useSession();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading, error } = useGetProduct(productId);
  const { data: relatedProducts } = useListProducts(
    { category: product?.categorySlug, limit: 5 },
    { query: { enabled: !!product } }
  );
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    if (!sessionId || !product) return;
    addToCartMutation.mutate(
      { data: { productId: product.id, sessionId, quantity } },
      {
        onSuccess: () => {
          toast({ title: "Added to Cart!", description: `${quantity}× ${product.name} added to your cart.` });
        },
      }
    );
  };

  const handleAddRelatedToCart = (id: number) => {
    if (!sessionId) return;
    addToCartMutation.mutate(
      { data: { productId: id, sessionId, quantity: 1 } },
      { onSuccess: () => toast({ title: "Added to cart" }) }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F2F2F7" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 rounded-full animate-spin" style={{ borderColor: "#E5E5EA", borderTopColor: "#00C2A8" }} />
          <p className="text-sm font-semibold" style={{ color: "#8E8E93" }}>Loading product…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F2F2F7" }}>
        <div className="text-center px-8">
          <Package className="w-16 h-16 mx-auto mb-4" style={{ color: "#C7C7CC" }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1C1C1E" }}>Product not found</h2>
          <p style={{ color: "#8E8E93" }} className="mb-6">This product may have been removed or the link is invalid.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "#00C2A8" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const ratingBars = getRatingBars(product.rating ?? 4.2);

  const thumbnails = [
    product.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80",
    product.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80",
    product.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80",
    product.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80",
  ].slice(0, product.imageUrl ? 4 : 1);

  const deliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + (pincodeChecked ? 3 : 5));
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  })();

  const specs = [
    { key: "Brand", value: product.brand || "AETHEX" },
    { key: "Category", value: product.categorySlug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "General" },
    { key: "SKU / Model", value: `AX-${product.id.toString().padStart(5, "0")}` },
    { key: "Availability", value: product.inStock ? "In Stock" : "Out of Stock" },
    ...(product.tags?.length ? [{ key: "Tags", value: product.tags.join(", ") }] : []),
    { key: "Country of Origin", value: "India" },
    { key: "Sold by", value: "AETHEX Medical Pvt. Ltd." },
    { key: "Packaging", value: "Tamper-proof sealed" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>

      {/* ── BREADCRUMB ── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5EA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="text-xs font-medium transition-colors hover:text-[#00C2A8]" style={{ color: "#8E8E93" }}>Home</Link>
          <ChevronRight className="w-3 h-3" style={{ color: "#C7C7CC" }} />
          <Link href="/shop" className="text-xs font-medium transition-colors hover:text-[#00C2A8]" style={{ color: "#8E8E93" }}>Shop</Link>
          {product.categorySlug && (
            <>
              <ChevronRight className="w-3 h-3" style={{ color: "#C7C7CC" }} />
              <Link href={`/shop?category=${product.categorySlug}`} className="text-xs font-medium capitalize transition-colors hover:text-[#00C2A8]" style={{ color: "#8E8E93" }}>
                {product.categorySlug.replace(/-/g, " ")}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" style={{ color: "#C7C7CC" }} />
          <span className="text-xs font-semibold truncate max-w-[200px]" style={{ color: "#1C1C1E" }}>{product.name}</span>
        </div>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── LEFT: IMAGE GALLERY ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-[148px]">
              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E5EA" }}>
                {/* Main Image */}
                <div
                  ref={imgRef}
                  className="relative flex items-center justify-center p-8 overflow-hidden cursor-zoom-in"
                  style={{ height: 420, background: "#FAFAFA" }}
                >
                  {discount > 0 && (
                    <span className="absolute top-4 left-4 text-xs font-extrabold px-2.5 py-1 rounded-lg z-10" style={{ background: "#FF3B30", color: "#fff" }}>
                      {discount}% OFF
                    </span>
                  )}
                  {product.featured && (
                    <span className="absolute top-4 right-16 text-xs font-extrabold px-2.5 py-1 rounded-lg z-10" style={{ background: "#FF9500", color: "#fff" }}>
                      ★ Best Seller
                    </span>
                  )}
                  <button
                    onClick={() => setWishlisted(w => !w)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
                    style={{ background: wishlisted ? "#FFE5E5" : "#F2F2F7", border: "1px solid #E5E5EA" }}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </button>
                  <img
                    src={thumbnails[selectedImg]}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain select-none transition-all duration-500 hover:scale-110"
                    style={{ maxHeight: 340 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80";
                    }}
                  />
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-3 p-4" style={{ borderTop: "1px solid #E5E5EA" }}>
                  {thumbnails.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className="w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all"
                      style={{
                        border: selectedImg === i ? "2px solid #00C2A8" : "2px solid #E5E5EA",
                        background: "#FAFAFA",
                      }}
                    >
                      <img src={src} alt="" className="w-full h-full object-contain p-1"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80"; }} />
                    </button>
                  ))}
                </div>

                {/* Share */}
                <div className="px-4 pb-4 flex gap-3">
                  <button className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:bg-[#F2F2F7]" style={{ color: "#636366", border: "1px solid #E5E5EA" }}>
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <button className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:bg-[#F2F2F7]" style={{ color: "#636366", border: "1px solid #E5E5EA" }}>
                    <Heart className="w-3.5 h-3.5" /> Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: PRODUCT INFO ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Card 1: Core Info */}
            <div className="bg-white rounded-2xl p-6 lg:p-8" style={{ border: "1px solid #E5E5EA" }}>
              {/* Brand + Stock */}
              <div className="flex items-center justify-between mb-3">
                <Link href={`/shop?brand=${encodeURIComponent(product.brand || "")}`}
                  className="text-xs font-bold px-3 py-1 rounded-lg tracking-widest uppercase transition-colors hover:bg-[#00C2A8]/10"
                  style={{ color: "#00C2A8", background: "#00C2A81A" }}>
                  {product.brand || "AETHEX"}
                </Link>
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg ${product.inStock ? "text-emerald-700" : "text-red-600"}`}
                  style={{ background: product.inStock ? "#D1FAE5" : "#FEE2E2" }}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight" style={{ color: "#1C1C1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: "1px solid #F2F2F7" }}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "#34C75920", border: "1px solid #34C75940" }}>
                  <Star className="w-4 h-4 fill-[#34C759] text-[#34C759]" />
                  <span className="font-bold text-sm" style={{ color: "#1C7A3B" }}>{product.rating ?? "4.2"}</span>
                </div>
                <span className="text-sm font-medium underline decoration-dashed underline-offset-2 cursor-pointer" style={{ color: "#636366" }}>
                  {product.reviewCount ?? 0} Ratings &amp; Reviews
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#8E8E93" }}>
                  <BadgeCheck className="w-4 h-4 text-[#007AFF]" />
                  Verified Purchase
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-5">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-extrabold" style={{ color: "#1C1C1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through font-medium mb-0.5">
                        {formatINR(product.originalPrice)}
                      </span>
                      <span className="text-xl font-extrabold mb-0.5" style={{ color: "#FF3B30" }}>
                        {discount}% off
                      </span>
                    </>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-sm font-semibold" style={{ color: "#34C759" }}>
                    You save {formatINR(savings)} 🎉
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
                  No-cost EMI from ₹{Math.round(product.price / 6).toLocaleString("en-IN")}/month
                </span>
                <span className="ml-auto text-xs font-semibold" style={{ color: "#007AFF" }}>View Plans →</span>
              </div>
            </div>

            {/* Card 2: Offers */}
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E5EA" }}>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#1C1C1E" }}>
                <Tag className="w-4 h-4 text-[#FF9500]" />
                Available Offers
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
                <Truck className="w-4 h-4 text-[#34C759]" />
                Delivery &amp; Services
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
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
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
                    <p className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>
                      {product.inStock ? `Free Delivery by ${deliveryDate}` : "Currently Unavailable"}
                    </p>
                    <p className="text-xs" style={{ color: "#8E8E93" }}>Free shipping on orders above ₹499</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#EDE9FE" }}>
                    <RotateCcw className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>7-Day Easy Return</p>
                    <p className="text-xs" style={{ color: "#8E8E93" }}>Hassle-free returns &amp; full refunds</p>
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

            {/* Card 4: Add to Cart / Buy Now */}
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E5EA" }}>
              {/* Seller */}
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
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#F2F2F7]"
                    style={{ color: "#636366" }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-base" style={{ color: "#1C1C1E", borderLeft: "1px solid #E5E5EA", borderRight: "1px solid #E5E5EA", lineHeight: "40px", height: 40 }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#F2F2F7]"
                    style={{ color: "#636366" }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addToCartMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-2xl text-base font-extrabold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "#00C2A8", color: "#FFFFFF" }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addToCartMutation.isPending ? "Adding…" : "Add to Cart"}
                </button>
                <button
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-2xl text-base font-extrabold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "#FF9500", color: "#FFFFFF" }}
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
              </div>

              {/* Trust Strip */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4" style={{ borderTop: "1px solid #F2F2F7" }}>
                {[
                  { icon: BadgeCheck, text: "100% Genuine", sub: "CDSCO Verified" },
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

        {/* ── DETAILS ROW: Description + Specs + Ratings ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

          {/* Description */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6" style={{ border: "1px solid #E5E5EA" }}>
              <h2 className="text-xl font-bold mb-4 pb-3" style={{ color: "#1C1C1E", borderBottom: "1px solid #F2F2F7" }}>About this Product</h2>
              <div className="prose prose-sm max-w-none" style={{ color: "#3C3C43" }}>
                <p className="text-base leading-relaxed">{product.description}</p>
              </div>
              {product.tags?.length > 0 && (
                <div className="mt-5 pt-4" style={{ borderTop: "1px solid #F2F2F7" }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8E8E93" }}>Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <Link
                        key={tag}
                        href={`/shop?search=${encodeURIComponent(tag)}`}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors hover:bg-[#00C2A8] hover:text-white"
                        style={{ background: "#F2F2F7", color: "#3C3C43" }}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specs Table */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E5EA" }}>
              <div className="px-6 lg:px-8 py-4" style={{ borderBottom: "1px solid #F2F2F7" }}>
                <h2 className="text-xl font-bold" style={{ color: "#1C1C1E" }}>Product Details</h2>
              </div>
              <div className="divide-y" style={{ divideColor: "#F2F2F7" }}>
                {specs.map((spec, i) => (
                  <div key={i} className="flex" style={{ borderBottom: "1px solid #F2F2F7" }}>
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

              {/* Overall Score */}
              <div className="flex items-center gap-4 mb-5 pb-4" style={{ borderBottom: "1px solid #F2F2F7" }}>
                <div className="text-center">
                  <div className="text-5xl font-extrabold" style={{ color: "#1C1C1E" }}>{product.rating ?? "4.2"}</div>
                  <div className="flex items-center gap-0.5 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating ?? 4.2) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#8E8E93" }}>{product.reviewCount ?? 0} ratings</p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingBars.map(bar => (
                    <RatingBar key={bar.stars} stars={bar.stars} pct={bar.pct} />
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "#3C3C43" }}>
                  <ThumbsUp className="w-4 h-4 text-[#34C759] shrink-0" />
                  <span>Customers love the quality &amp; packaging</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "#3C3C43" }}>
                  <ThumbsUp className="w-4 h-4 text-[#34C759] shrink-0" />
                  <span>Fast delivery, well-sealed packaging</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "#3C3C43" }}>
                  <HeartHandshake className="w-4 h-4 text-[#00C2A8] shrink-0" />
                  <span>Trusted by 5,000+ doctors across India</span>
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #F2F2F7" }}>
                <p className="text-xs text-center" style={{ color: "#8E8E93" }}>
                  Verified by CDSCO &amp; NMC standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E5EA" }}>
          <ReviewSection
            productId={productId}
            productName={product.name}
            sessionId={sessionId}
            apiBase={import.meta.env.BASE_URL.replace(/\/$/, "")}
          />
        </div>
      </div>

      {/* ── FREQUENTLY BOUGHT TOGETHER ── */}
      {relatedProducts && relatedProducts.products.filter(p => p.id !== product.id).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-2xl p-6 lg:p-8" style={{ border: "1px solid #E5E5EA" }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1C1C1E" }}>
              <Sparkles className="w-5 h-5 text-[#FF9500]" />
              Frequently Bought Together
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.products.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddRelatedToCart}
                  isAdding={addToCartMutation.isPending}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

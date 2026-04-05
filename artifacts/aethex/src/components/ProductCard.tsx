import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { type Product } from "@workspace/api-client-react";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  isAdding?: boolean;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, onAddToCart, isAdding, viewMode = "grid" }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const ratingInt = Math.round(Number(product.rating) * 10) / 10;

  if (viewMode === "list") {
    return (
      <div className="group relative flex gap-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 p-4">
        {/* Image */}
        <Link href={`/products/${product.id}`} className="shrink-0 w-32 h-32 sm:w-40 sm:h-40 bg-slate-50 rounded-xl overflow-hidden block">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&q=80"; }}
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-[#1C1C1E] text-base leading-snug line-clamp-2 group-hover:text-[#007AFF] transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-[#636366] mt-0.5">{product.brand}</p>
            </div>
            <button
              onClick={() => setWishlisted(v => !v)}
              className="shrink-0 p-1.5 rounded-full hover:bg-red-50 transition-colors"
            >
              <Heart className={cn("w-4 h-4 transition-colors", wishlisted ? "fill-red-500 text-red-500" : "text-slate-400")} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white" style={{ background: ratingInt >= 4 ? "#388E3C" : ratingInt >= 3 ? "#F57C00" : "#C62828" }}>
              {ratingInt} <Star className="w-3 h-3 fill-white" />
            </span>
            <span className="text-xs text-[#636366]">({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            <span className="font-bold text-xl text-[#1C1C1E]">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-[#8E8E93] line-through">{formatINR(product.originalPrice)}</span>
                {discount > 0 && (
                  <span className="text-xs font-bold text-[#388E3C]">{discount}% off</span>
                )}
              </>
            )}
          </div>

          {/* Stock + Add to Cart */}
          <div className="flex items-center gap-3 mt-auto pt-3">
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded", product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            <Button
              size="sm"
              onClick={() => onAddToCart?.(product.id)}
              disabled={!product.inStock || isAdding}
              className="rounded-xl font-bold text-xs h-8 px-4"
              style={{ background: "#007AFF" }}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              {isAdding ? "Adding…" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* Wishlist */}
      <button
        onClick={() => setWishlisted(v => !v)}
        className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition-all"
      >
        <Heart className={cn("w-4 h-4 transition-colors", wishlisted ? "fill-red-500 text-red-500" : "text-slate-400")} />
      </button>

      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-[#388E3C] text-white text-[11px] font-bold px-2 py-0.5 rounded">
            {discount}% off
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block aspect-[4/3] bg-slate-50 overflow-hidden relative shrink-0">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&q=80"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&q=80"; }}
        />
        {/* Hover: Add to Cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart?.(product.id); }}
            disabled={!product.inStock || isAdding}
            className="w-full flex items-center justify-center gap-2 py-2.5 font-bold text-sm text-white disabled:opacity-60"
            style={{ background: "#007AFF" }}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-[#1C1C1E] text-sm leading-snug line-clamp-2 group-hover:text-[#007AFF] transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] text-[#8E8E93] mb-2">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold text-white" style={{ background: ratingInt >= 4 ? "#388E3C" : ratingInt >= 3 ? "#F57C00" : "#C62828" }}>
            {ratingInt} <Star className="w-2.5 h-2.5 fill-white" />
          </span>
          <span className="text-[11px] text-[#8E8E93]">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-bold text-lg text-[#1C1C1E] leading-none">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#8E8E93] line-through">{formatINR(product.originalPrice)}</span>
            )}
          </div>
          {/* Stock indicator */}
          <p className={cn("text-[10px] font-semibold mt-1", product.inStock ? "text-emerald-600" : "text-red-500")}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>
      </div>
    </div>
  );
}

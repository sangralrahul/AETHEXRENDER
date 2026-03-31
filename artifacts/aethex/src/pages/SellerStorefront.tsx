import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, BadgeCheck, Star, Package, ShoppingCart } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function SellerStorefront() {
  const [, params] = useRoute("/seller/:code/store");
  const code = params?.code?.toUpperCase() ?? "";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    if (!code) return;
    fetch(`${apiBase}/api/seller/${code}/storefront`)
      .then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [code]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!data?.seller) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
      <Package className="w-12 h-12 text-slate-400" />
      <p className="text-slate-500 font-semibold">Seller not found</p>
      <Link href="/products" className="text-primary hover:underline text-sm">Browse all products</Link>
    </div>
  );

  const { seller, products } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-[#1c1c1e] mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        {/* Seller Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-black/10 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center font-bold text-primary text-2xl shrink-0">
              {seller.businessName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-[#1c1c1e]">{seller.businessName}</h1>
                {seller.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3 h-3" /> Verified Seller
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(parseFloat(seller.rating)) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                ))}
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{parseFloat(seller.rating).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{seller.businessCategory}</span>
                <span>·</span>
                <span>{products.length} products</span>
                <span>·</span>
                <span className="font-mono">{seller.sellerCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p: any) => (
              <Link key={p.id} href="/products"
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-black/10 overflow-hidden shadow-sm hover:shadow-md dark:hover:border-primary/30 transition-all group">
                {p.images?.[0] ? (
                  <img src={p.images[0]} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" alt={p.name} />
                ) : (
                  <div className="w-full aspect-square bg-slate-100 dark:bg-black/5 flex items-center justify-center">
                    <Package className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
                <div className="p-3">
                  <p className="font-semibold text-slate-800 dark:text-[#1c1c1e] text-sm leading-tight mb-1 line-clamp-2">{p.name}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{parseFloat(p.rating || 0).toFixed(1)} ({p.reviewCount})</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-slate-900 dark:text-[#1c1c1e]">{formatINR(parseFloat(p.price))}</span>
                    <span className="text-xs text-slate-400 line-through">{formatINR(parseFloat(p.mrp))}</span>
                  </div>
                  {p.stock < 10 && <p className="text-[10px] text-orange-500 mt-1">Only {p.stock} left!</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

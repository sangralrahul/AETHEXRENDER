import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import {
  Filter, X, Search as SearchIcon, SlidersHorizontal,
  LayoutGrid, List, ChevronDown, Star, ToggleLeft, ToggleRight,
  Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, Activity, Shield,
  HeartPulse, Pill, Plus, Syringe, Bone, Thermometer, Eye, Baby, Brain, BrainCircuit,
  Microscope, Wind, Droplets, Waves, ScanLine, Heart, AlertTriangle, Scan,
  Dna, Gauge, Dumbbell, Pipette, Apple, HeartHandshake, Radiation, TestTube2,
  Trophy, Zap, type LucideIcon
} from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const categoryIconMap: Record<string, LucideIcon> = {
  Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, Activity, Shield,
  HeartPulse, Pill, Plus, Syringe, Bone, Thermometer, Eye, Baby, Brain, BrainCircuit,
  Microscope, Wind, Droplets, Waves, ScanLine, Heart, AlertTriangle, Scan,
  Dna, Gauge, Dumbbell, Pipette, Apple, HeartHandshake, Radiation, TestTube2,
  Trophy, Zap,
};

const PRICE_RANGES = [
  { id: "u500",      label: "Under ₹500",        test: (p: number) => p < 500 },
  { id: "500-2000",  label: "₹500 – ₹2,000",     test: (p: number) => p >= 500 && p < 2000 },
  { id: "2000-5000", label: "₹2,000 – ₹5,000",   test: (p: number) => p >= 2000 && p < 5000 },
  { id: "5000+",     label: "Above ₹5,000",       test: (p: number) => p >= 5000 },
];

const SORT_OPTIONS = [
  { value: "relevance",   label: "Relevance" },
  { value: "price-asc",   label: "Price: Low to High" },
  { value: "price-desc",  label: "Price: High to Low" },
  { value: "newest",      label: "Newest First" },
  { value: "top-rated",   label: "Top Rated" },
];

function FilterCheckbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={cn(
          "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
          checked ? "border-[#007AFF] bg-[#007AFF]" : "border-slate-300 group-hover:border-[#007AFF]"
        )}
      >
        {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span className="text-sm text-[#3A3A3C] group-hover:text-[#007AFF] transition-colors select-none">{label}</span>
    </label>
  );
}

interface SidebarContentProps {
  categories: any[];
  categoryFilter: string;
  setCategory: (slug: string) => void;
  priceRange: string[];
  setPriceRange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  allBrands: string[];
  minRating: number | null;
  setMinRating: (r: number | null) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

function SidebarContent({
  categories, categoryFilter, setCategory,
  priceRange, setPriceRange,
  selectedBrands, setSelectedBrands, allBrands,
  minRating, setMinRating,
  inStockOnly, setInStockOnly,
  onClearAll, hasActiveFilters
}: SidebarContentProps) {
  const togglePrice = (id: string) =>
    setPriceRange(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleBrand = (brand: string) =>
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(x => x !== brand) : [...prev, brand]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-base text-[#1C1C1E]">Filters</h2>
        {hasActiveFilters && (
          <button onClick={onClearAll} className="text-xs font-semibold text-[#007AFF] hover:underline">
            Clear All
          </button>
        )}
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-3">Availability</h3>
        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className="flex items-center gap-2.5 group"
        >
          {inStockOnly
            ? <ToggleRight className="w-9 h-9 text-[#007AFF]" />
            : <ToggleLeft className="w-9 h-9 text-slate-300 group-hover:text-[#007AFF] transition-colors" />}
          <span className="text-sm text-[#3A3A3C]">In Stock only</span>
        </button>
      </div>

      <hr className="border-slate-200 mb-6" />

      {/* Category */}
      <div className="mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setCategory("")}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium",
              !categoryFilter ? "bg-[#007AFF] text-white" : "text-[#3A3A3C] hover:bg-slate-100"
            )}
          >
            All Categories
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium flex items-center justify-between",
                categoryFilter === cat.slug ? "bg-[#007AFF] text-white" : "text-[#3A3A3C] hover:bg-slate-100"
              )}
            >
              <span>{cat.name}</span>
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", categoryFilter === cat.slug ? "bg-white/20 text-white" : "bg-slate-200 text-[#636366]")}>
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-200 mb-6" />

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-3">Price Range</h3>
        <div className="space-y-2.5">
          {PRICE_RANGES.map(r => (
            <FilterCheckbox
              key={r.id}
              checked={priceRange.includes(r.id)}
              onChange={() => togglePrice(r.id)}
              label={r.label}
            />
          ))}
        </div>
      </div>

      <hr className="border-slate-200 mb-6" />

      {/* Customer Rating */}
      <div className="mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-3">Customer Rating</h3>
        <div className="space-y-2.5">
          {[4, 3].map(r => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setMinRating(minRating === r ? null : r)}
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  minRating === r ? "border-[#007AFF] bg-[#007AFF]" : "border-slate-300 group-hover:border-[#007AFF]"
                )}
              >
                {minRating === r && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold text-white" style={{ background: "#388E3C" }}>
                  {r} <Star className="w-2.5 h-2.5 fill-white" />
                </span>
                <span className="text-sm text-[#3A3A3C]">& above</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      {allBrands.length > 0 && (
        <>
          <hr className="border-slate-200 mb-6" />
          <div className="mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-3">Brand</h3>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {allBrands.map(brand => (
                <FilterCheckbox
                  key={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  label={brand}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Products() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const categoryFilter = searchParams.get("category") || "";
  const searchFilter = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(searchFilter);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [sortDropOpen, setSortDropOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const sessionId = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: loadingProducts } = useListProducts({
    category: categoryFilter || undefined,
    search: searchFilter || undefined,
    limit: 60,
  });

  const { data: categories } = useListCategories();
  const addToCartMutation = useAddToCart();

  useEffect(() => { setLocalSearch(searchFilter); }, [searchFilter]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchString);
    if (localSearch) params.set("search", localSearch);
    else params.delete("search");
    setLocation(`/products?${params.toString()}`);
  };

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchString);
    if (slug) params.set("category", slug);
    else params.delete("category");
    setLocation(`/products?${params.toString()}`);
    setMobileFilterOpen(false);
  };

  const clearAllFilters = () => {
    setPriceRange([]);
    setSelectedBrands([]);
    setMinRating(null);
    setInStockOnly(false);
    setCategory("");
  };

  const handleAddToCart = (productId: number) => {
    if (!sessionId) return;
    addToCartMutation.mutate(
      { data: { productId, sessionId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
          toast({ title: "Added to cart", description: "Item added successfully." });
        },
        onError: () => toast({ variant: "destructive", title: "Error adding to cart" }),
      }
    );
  };

  const allBrands = useMemo(() => {
    const brands = new Set((productsData?.products ?? []).map(p => p.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    let list = productsData?.products ?? [];

    if (priceRange.length > 0) {
      list = list.filter(p => priceRange.some(id => {
        const r = PRICE_RANGES.find(r => r.id === id);
        return r ? r.test(p.price) : false;
      }));
    }
    if (selectedBrands.length > 0) list = list.filter(p => selectedBrands.includes(p.brand));
    if (minRating !== null) list = list.filter(p => Number(p.rating) >= minRating);
    if (inStockOnly) list = list.filter(p => p.inStock);

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "top-rated")  return Number(b.rating) - Number(a.rating);
      if (sortBy === "newest")     return b.id - a.id;
      return 0;
    });
  }, [productsData, priceRange, selectedBrands, minRating, inStockOnly, sortBy]);

  const hasActiveFilters = !!(categoryFilter || priceRange.length || selectedBrands.length || minRating !== null || inStockOnly);
  const activeCategoryName = categories?.find(c => c.slug === categoryFilter)?.name;
  const currentSortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label ?? "Relevance";

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>

      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#1C1C1E] tracking-tight">
              {searchFilter ? `Results for "${searchFilter}"` : activeCategoryName ?? "Medical Store"}
            </h1>
            <p className="text-sm text-[#8E8E93] mt-0.5">
              {loadingProducts ? "Loading…" : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
            />
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-[88px] max-h-[calc(100vh-108px)] overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <SidebarContent
                categories={categories ?? []}
                categoryFilter={categoryFilter}
                setCategory={setCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                allBrands={allBrands}
                minRating={minRating}
                setMinRating={setMinRating}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                onClearAll={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* ── Top filter bar ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
              {/* Results + active filters */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-[#1C1C1E]">
                  {loadingProducts ? "Loading products…" : (
                    <>
                      Showing <span className="text-[#007AFF]">{filteredProducts.length}</span> results
                      {(searchFilter || activeCategoryName) && (
                        <> for <span className="text-[#007AFF]">"{searchFilter || activeCategoryName}"</span></>
                      )}
                    </>
                  )}
                </span>
              </div>

              {/* Active filter chips */}
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="flex items-center gap-1 text-[11px] font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors">
                    <X className="w-3 h-3" /> Clear All
                  </button>
                )}
                {inStockOnly && (
                  <span className="text-[11px] font-semibold bg-[#007AFF]/10 text-[#007AFF] px-2.5 py-1 rounded-full flex items-center gap-1">
                    In Stock <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {minRating !== null && (
                  <span className="text-[11px] font-semibold bg-[#007AFF]/10 text-[#007AFF] px-2.5 py-1 rounded-full flex items-center gap-1">
                    {minRating}★+ <button onClick={() => setMinRating(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="relative hidden lg:block" ref={sortRef}>
                <button
                  onClick={() => setSortDropOpen(v => !v)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#1C1C1E] bg-slate-50 border border-slate-200 hover:border-[#007AFF] rounded-xl px-3 py-2 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#636366]" />
                  <span>{currentSortLabel}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-[#636366] transition-transform", sortDropOpen && "rotate-180")} />
                </button>
                {sortDropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-30 overflow-hidden">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortDropOpen(false); }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                          sortBy === opt.value ? "bg-[#007AFF]/10 text-[#007AFF] font-bold" : "text-[#3A3A3C] hover:bg-slate-50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid / List toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("p-1.5 rounded-md transition-all", viewMode === "grid" ? "bg-white shadow text-[#007AFF]" : "text-slate-400 hover:text-slate-700")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-white shadow text-[#007AFF]" : "text-slate-400 hover:text-slate-700")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Product grid / list ── */}
            {loadingProducts ? (
              <div className={cn(viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-3")}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={cn("animate-pulse rounded-2xl bg-white border border-slate-200", viewMode === "grid" ? "h-72" : "h-36")} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <SearchIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#1C1C1E] mb-2">No products found</h3>
                <p className="text-[#8E8E93] text-sm mb-6 max-w-sm mx-auto">Try adjusting your filters or search for something different.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white"
                  style={{ background: "#007AFF" }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
              )}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAdding={addToCartMutation.isPending}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile bottom fixed bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-slate-200 flex shadow-2xl">
        <button
          onClick={() => { setMobileFilterOpen(true); setMobileSortOpen(false); }}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 font-bold text-sm text-[#1C1C1E] border-r border-slate-200 hover:bg-slate-50 transition-colors active:bg-slate-100"
        >
          <Filter className="w-4 h-4" />
          Filter
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#007AFF]" />}
        </button>
        <button
          onClick={() => { setMobileSortOpen(true); setMobileFilterOpen(false); }}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 font-bold text-sm text-[#1C1C1E] hover:bg-slate-50 transition-colors active:bg-slate-100"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Sort
        </button>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileFilterOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
              <h2 className="font-bold text-lg text-[#1C1C1E]">Filters</h2>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 pb-24">
              <SidebarContent
                categories={categories ?? []}
                categoryFilter={categoryFilter}
                setCategory={setCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                allBrands={allBrands}
                minRating={minRating}
                setMinRating={setMinRating}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                onClearAll={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: "#007AFF" }}
              >
                Show {filteredProducts.length} Result{filteredProducts.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Sort Drawer ── */}
      {mobileSortOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileSortOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-[#1C1C1E]">Sort By</h2>
              <button onClick={() => setMobileSortOpen(false)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 py-2 pb-safe">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setMobileSortOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-3.5 text-sm font-medium flex items-center justify-between rounded-xl transition-colors",
                    sortBy === opt.value ? "text-[#007AFF] font-bold bg-[#007AFF]/8" : "text-[#3A3A3C] hover:bg-slate-50"
                  )}
                >
                  {opt.label}
                  {sortBy === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />}
                </button>
              ))}
            </div>
            <div className="h-8" />
          </div>
        </div>
      )}

      {/* Bottom padding for mobile fixed bar */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}

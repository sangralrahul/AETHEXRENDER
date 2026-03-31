import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Filter, X, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function Products() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const categoryFilter = searchParams.get("category") || "";
  const searchFilter = searchParams.get("search") || "";
  
  const [localSearch, setLocalSearch] = useState(searchFilter);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");

  const sessionId = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: loadingProducts } = useListProducts({
    category: categoryFilter || undefined,
    search: searchFilter || undefined,
    limit: 24
  });
  
  const { data: categories } = useListCategories();
  const addToCartMutation = useAddToCart();

  useEffect(() => {
    setLocalSearch(searchFilter);
  }, [searchFilter]);

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
    setIsMobileFiltersOpen(false);
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
        onError: () => toast({ variant: "destructive", title: "Error adding to cart" })
      }
    );
  };

  return (
    <div className="min-h-screen pt-[72px] bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-border shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground tracking-tight">
                {categoryFilter ? (categories?.find(c => c.slug === categoryFilter)?.name || "Products") : "All Products"}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {productsData?.total || 0} Products
                </span>
                {searchFilter && (
                  <span className="text-muted-foreground text-sm">
                    Results for "{searchFilter}"
                  </span>
                )}
              </div>
            </div>
            
            {/* Sort Dropdown UI */}
            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent text-sm font-bold text-foreground focus:outline-none cursor-pointer">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Mobile filter toggle button ── */}
          <div className="lg:hidden flex gap-4">
            <Button
              variant="outline"
              className="flex-1 rounded-xl bg-white shadow-sm border-border/60 h-12"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter className="w-5 h-5 mr-2" /> Filters & Categories
            </Button>
          </div>

          {/* ── Mobile drawer overlay (portal-like fixed layer) ── */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setIsMobileFiltersOpen(false)}>
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <div
                className="absolute inset-y-0 left-0 w-[300px] bg-white shadow-2xl p-6 overflow-y-auto rounded-r-3xl z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-display font-bold text-2xl">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)} className="rounded-full bg-slate-100">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {/* Search */}
                <div className="mb-10">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Search</h3>
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-border/80 shadow-sm rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium" />
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </form>
                </div>
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button onClick={() => setCategory("")} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-medium flex items-center justify-between group ${!categoryFilter ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-slate-50'}`}>
                      <span>All Categories</span>
                    </button>
                    {categories?.map((cat) => (
                      <button key={cat.id} onClick={() => setCategory(cat.slug)} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-medium flex items-center justify-between group ${categoryFilter === cat.slug ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-slate-50'}`}>
                        <span>{cat.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${categoryFilter === cat.slug ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-primary/10'}`}>{cat.productCount}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Desktop sidebar — sticky, independently scrollable ── */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-[88px] max-h-[calc(100vh-100px)] overflow-y-auto pr-1 pb-10">
              {/* Search */}
              <div className="mb-8">
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Search</h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-border/80 shadow-sm rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium" />
                  <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </form>
              </div>
              {/* Categories */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button onClick={() => setCategory("")} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-medium flex items-center justify-between group ${!categoryFilter ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-slate-50'}`}>
                    <span>All Categories</span>
                  </button>
                  {categories?.map((cat) => (
                    <button key={cat.id} onClick={() => setCategory(cat.slug)} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-medium flex items-center justify-between group ${categoryFilter === cat.slug ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-slate-50'}`}>
                      <span>{cat.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${categoryFilter === cat.slug ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-primary/10'}`}>{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[420px] bg-slate-200/50 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : productsData?.products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">No products found</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">We couldn't find anything matching your current filters. Try adjusting them or search for something else.</p>
                <Button onClick={() => setLocation('/products')} className="rounded-xl h-12 px-8 font-bold">Clear all filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...(productsData?.products ?? [])].sort((a, b) => {
                  if (sortBy === "Price: Low to High") return a.price - b.price;
                  if (sortBy === "Price: High to Low") return b.price - a.price;
                  if (sortBy === "Highest Rated") return (b.rating ?? 0) - (a.rating ?? 0);
                  return 0;
                }).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    isAdding={addToCartMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
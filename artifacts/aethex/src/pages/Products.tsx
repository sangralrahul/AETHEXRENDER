import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Filter, X, Search as SearchIcon } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Products() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const categoryFilter = searchParams.get("category") || "";
  const searchFilter = searchParams.get("search") || "";
  
  const [localSearch, setLocalSearch] = useState(searchFilter);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const sessionId = useSession();
  const { toast } = useToast();

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
        onSuccess: () => toast({ title: "Added to cart" }),
        onError: () => toast({ variant: "destructive", title: "Error adding to cart" })
      }
    );
  };

  return (
    <div className="min-h-screen pt-[72px] bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            {categoryFilter ? (categories?.find(c => c.slug === categoryFilter)?.name || "Products") : "All Products"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {productsData?.total || 0} items found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl bg-white"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>

          {/* Sidebar / Filters */}
          <div className={`
            fixed inset-0 z-50 bg-white/80 backdrop-blur-sm lg:static lg:bg-transparent lg:z-auto lg:block lg:w-64 shrink-0
            ${isMobileFiltersOpen ? 'block' : 'hidden'}
          `}>
            <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl p-6 lg:static lg:w-auto lg:shadow-none lg:p-0 h-full overflow-y-auto lg:overflow-visible">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="font-bold text-lg">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Search</h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </form>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Categories</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoryFilter ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    All Categories
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryFilter === cat.slug ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Backdrop click to close */}
            <div className="absolute inset-0 z-[-1] lg:hidden" onClick={() => setIsMobileFiltersOpen(false)} />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-slate-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : productsData?.products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
                <Button onClick={() => setLocation('/products')}>Clear all filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {productsData?.products.map((product) => (
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

import { useRoute } from "wouter";
import { Star, Truck, ShieldCheck, Plus, Minus, ShoppingCart, Info } from "lucide-react";
import { useGetProduct, useAddToCart, useListProducts } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ReviewSection } from "@/components/ReviewSection";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = parseInt(params?.id || "0", 10);
  const sessionId = useSession();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useGetProduct(productId);
  const { data: relatedProducts } = useListProducts({ category: product?.categorySlug, limit: 4 }, { query: { enabled: !!product }});
  
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    if (!sessionId || !product) return;
    addToCartMutation.mutate(
      { data: { productId: product.id, sessionId, quantity } },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${quantity}x ${product.name} added.`,
          });
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
    return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>;
  }

  if (error || !product) {
    return <div className="min-h-screen pt-32 text-center bg-slate-50">
      <h2 className="text-2xl font-bold">Product not found.</h2>
    </div>;
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen pt-[72px] bg-slate-50">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="bg-slate-50/50 p-8 lg:p-16 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100">
              {discount > 0 && (
                <span className="absolute top-8 left-8 bg-destructive text-white text-sm font-extrabold px-4 py-1.5 rounded-full z-10 shadow-lg shadow-destructive/20">
                  {discount}% OFF
                </span>
              )}
              {product.featured && (
                <span className="absolute top-8 right-8 bg-accent text-white text-sm font-extrabold px-4 py-1.5 rounded-full z-10 shadow-lg shadow-accent/20">
                  Best Seller
                </span>
              )}
              <img 
                src={product.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80"}
                alt={product.name}
                className="max-w-full max-h-[500px] object-contain drop-shadow-2xl mix-blend-multiply hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80";
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 xl:p-16 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 px-3 py-1 rounded-md">
                  {product.brand}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md ${product.inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold text-foreground mb-4 leading-[1.1] tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-amber-700 ml-1">{product.rating}</span>
                </div>
                <span className="text-sm font-semibold text-slate-500 underline decoration-slate-300 decoration-dashed underline-offset-4 cursor-pointer hover:text-slate-800">
                  Read {product.reviewCount} Reviews
                </span>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-5xl font-display font-extrabold text-foreground leading-none">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-slate-400 line-through font-medium mb-1">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                  <Info className="w-4 h-4" /> Inclusive of all taxes
                </p>
              </div>

              <div className="prose prose-slate prose-lg max-w-none mb-8 text-slate-600 font-medium">
                <p>{product.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-10">
                {product.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto space-y-8 bg-slate-50 p-6 lg:p-8 rounded-2xl border border-slate-100">
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl px-4 py-2 w-full sm:w-36 shrink-0 bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-100"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-display font-bold text-xl w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-100"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addToCartMutation.isPending}
                    className="flex-1 h-[60px] rounded-xl text-xl font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
                  >
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                    <ShoppingCart className="ml-3 w-6 h-6" />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Free Delivery<br/><span className="text-slate-500 font-medium">Across India</span></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">100% Genuine<br/><span className="text-slate-500 font-medium">Quality Checked</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection
        productId={productId}
        productName={product.name}
        sessionId={sessionId}
        apiBase={import.meta.env.BASE_URL.replace(/\/$/, "")}
      />

      {/* Related Products */}
      {relatedProducts && relatedProducts.products.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-t border-border">
          <h2 className="text-3xl font-display font-bold mb-10 text-center">Frequently Bought Together</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      )}
    </div>
  );
}
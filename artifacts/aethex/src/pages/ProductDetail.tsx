import { useRoute } from "wouter";
import { Star, Truck, ShieldCheck, Plus, Minus, ShoppingCart } from "lucide-react";
import { useGetProduct, useAddToCart, useListProducts } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";

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
    return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>;
  }

  if (error || !product) {
    return <div className="min-h-screen pt-32 text-center">Product not found.</div>;
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen pt-[72px] bg-slate-50">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="bg-slate-100/50 p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-border/50">
              {discount > 0 && (
                <span className="absolute top-6 left-6 bg-destructive text-white text-sm font-bold px-3 py-1 rounded-xl z-10 shadow-sm">
                  {discount}% OFF
                </span>
              )}
              {/* stock placeholder */}
              {/* product isolated white background */}
              <img 
                src={product.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80"}
                alt={product.name}
                className="max-w-full max-h-[500px] object-contain drop-shadow-2xl mix-blend-multiply"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80";
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-2">
                <span className="text-primary font-semibold tracking-wider text-sm uppercase bg-primary/10 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-5 h-5 ${star <= product.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">{product.rating} Rating ({product.reviewCount} Reviews)</span>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-display font-bold text-foreground">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through mb-1">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                  Inclusive of all taxes
                </p>
              </div>

              <div className="prose prose-slate max-w-none mb-8 text-slate-600">
                <p>{product.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto space-y-6">
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl px-4 py-2 w-full sm:w-32 shrink-0 bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-slate-400 hover:text-primary transition-colors p-1"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-slate-400 hover:text-primary transition-colors p-1"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addToCartMutation.isPending}
                    className="flex-1 h-14 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  >
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                    <ShoppingCart className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">100% Genuine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.products.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-display font-bold mb-8">You might also like</h2>
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

import { Link } from "wouter";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useGetCart, useAddToCart, useRemoveFromCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function Cart() {
  const sessionId = useSession();
  const queryClient = useQueryClient();
  
  const { data: cart, isLoading } = useGetCart(
    { sessionId }, 
    { query: { enabled: !!sessionId } }
  );
  
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    addToCartMutation.mutate(
      { data: { productId, sessionId, quantity: newQuantity } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }) }
    );
  };

  const removeItem = (itemId: number) => {
    removeFromCartMutation.mutate(
      { itemId, params: { sessionId } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }) }
    );
  };

  if (isLoading) {
    return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>;
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen  bg-slate-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
          Your Cart
        </h1>

        {isEmpty ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-border/50 max-w-2xl mx-auto">
            <img 
              src={`${import.meta.env.BASE_URL}images/empty-cart.png`}
              alt="Empty Cart"
              className="w-48 h-48 mx-auto mb-6 opacity-80"
            />
            <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any medical supplies yet.</p>
            <Button asChild size="lg" className="rounded-xl px-8">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cart Items */}
            <div className="flex-1 w-full space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80"} 
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply p-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80";
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <Link href={`/products/${item.productId}`} className="font-display font-bold text-lg hover:text-primary transition-colors line-clamp-2 mb-2">
                      {item.name}
                    </Link>
                    <div className="font-bold text-lg text-foreground mb-4">
                      {formatINR(item.price)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-border rounded-lg bg-slate-50">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || addToCartMutation.isPending}
                          className="px-3 py-2 text-slate-500 hover:text-primary disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={addToCartMutation.isPending}
                          className="px-3 py-2 text-slate-500 hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        disabled={removeFromCartMutation.isPending}
                        className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[400px] bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 sticky top-[100px]">
              <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span className="font-semibold text-foreground">{formatINR(cart.total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-foreground">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-base">Total Total</span>
                  <span className="font-display font-bold text-3xl text-primary">{formatINR(cart.total)}</span>
                </div>
              </div>
              
              <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary group">
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                Secure SSL Encrypted Payment
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

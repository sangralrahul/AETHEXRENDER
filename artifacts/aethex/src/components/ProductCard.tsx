import { Link } from "wouter";
import { Star, ShoppingCart, Plus } from "lucide-react";
import { type Product } from "@workspace/api-client-react";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  isAdding?: boolean;
}

export function ProductCard({ product, onAddToCart, isAdding }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover-lift flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <span className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded-lg">
            {discount}% OFF
          </span>
        )}
        {product.featured && (
          <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-lg">
            Best Seller
          </span>
        )}
      </div>

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block aspect-[4/3] bg-muted/30 overflow-hidden shrink-0">
        <img 
          src={product.imageUrl || `https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80`} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80";
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        
        <Link href={`/products/${product.id}`} className="block mb-1">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{product.brand}</p>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="font-display font-bold text-xl text-foreground">
              {formatINR(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatINR(product.originalPrice)}
              </div>
            )}
          </div>
          
          <Button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product.id);
            }}
            disabled={!product.inStock || isAdding}
            size="icon"
            className="rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white"
          >
            <Plus className={cn("w-5 h-5", isAdding && "animate-spin")} />
          </Button>
        </div>
      </div>
    </div>
  );
}

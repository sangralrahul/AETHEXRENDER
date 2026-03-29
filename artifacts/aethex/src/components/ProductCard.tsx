import { Link } from "wouter";
import { ShoppingCart, Tag } from "lucide-react";
import { type Product } from "@workspace/api-client-react";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  isAdding?: boolean;
}

export function ProductCard({ product, onAddToCart, isAdding }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Derive a subtle color accent from the category slug
  const categoryColorClass = 
    product.categorySlug === 'stethoscopes' ? 'bg-blue-500' :
    product.categorySlug === 'scrubs' ? 'bg-teal-500' :
    product.categorySlug === 'books' ? 'bg-amber-500' :
    product.categorySlug === 'surgical' ? 'bg-rose-500' :
    product.categorySlug === 'equipment' ? 'bg-indigo-500' :
    'bg-primary';

  return (
    <div className="group relative bg-card rounded-2xl border border-border/60 overflow-hidden hover-lift flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      {/* Category Accent Dot */}
      <div className={cn("absolute top-4 right-4 w-2.5 h-2.5 rounded-full z-10", categoryColorClass)} title={product.categorySlug} />

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <span className="bg-destructive/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {discount}% OFF
          </span>
        )}
        {product.featured && (
          <span className="bg-accent/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            Best Seller
          </span>
        )}
      </div>

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block aspect-[4/3] bg-slate-50 overflow-hidden shrink-0 relative">
        <img 
          src={product.imageUrl || `https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80`} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80";
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(product.rating)} readOnly size="sm" />
            <span className="text-sm font-semibold text-foreground">{Number(product.rating).toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm", product.inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        
        <Link href={`/products/${product.id}`} className="block mb-2">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs font-semibold text-muted-foreground mb-4 flex items-center gap-1.5 bg-slate-100 w-fit px-2 py-1 rounded-md">
          <Tag className="w-3 h-3" />
          {product.brand}
        </p>

        <div className="mt-auto pt-4 border-t border-border/50">
          <div className="flex items-end gap-2 mb-4">
            <div className="font-display font-bold text-2xl text-foreground leading-none">
              {formatINR(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through font-medium mb-0.5">
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
            className="w-full rounded-xl font-bold bg-primary hover:bg-primary/90 text-white h-11"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
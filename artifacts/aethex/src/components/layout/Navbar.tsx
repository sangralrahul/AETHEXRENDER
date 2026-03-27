import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Sparkles } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function AethexLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" fill="#0F2A5C"/>
      <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" stroke="#1E3A8A" strokeWidth="0.5"/>
      <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="16">Æ</text>
      <rect x="28" y="6" width="8" height="3" rx="1.5" fill="#00C4B4"/>
      <rect x="30.5" y="3.5" width="3" height="8" rx="1.5" fill="#00C4B4"/>
    </svg>
  );
}

export function Navbar() {
  const [location, setLocation] = useLocation();
  const sessionId = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cart } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, staleTime: 1000 * 60 } }
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-border shadow-sm py-3" 
          : "bg-white border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <AethexLogo size={40} />
            <div className="flex flex-col justify-center">
              <span className="font-display font-bold text-2xl tracking-tight text-[#0F2A5C] leading-none">
                AETHEX
              </span>
              <span className="text-[10px] font-bold text-[#00C4B4] tracking-[0.2em] uppercase mt-[2px] leading-none">
                Medical
              </span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile, shown on md+ */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-2 border-border rounded-2xl leading-5 bg-muted/30 placeholder-muted-foreground focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
              placeholder="Search scrubs, stethoscopes, books..."
            />
          </form>

          {/* Right Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link 
              href="/ai-assistant" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary/50 text-secondary-foreground font-semibold hover:shadow-md transition-all border border-secondary hover-lift"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>SYNAPSE</span>
            </Link>

            <Link 
              href="/products"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors hidden md:block"
            >
              Shop All
            </Link>

            <Link href="/cart" className="relative p-2 text-foreground hover:bg-muted rounded-full transition-colors hover-lift">
              <ShoppingCart className="w-6 h-6" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-destructive rounded-full border-2 border-white">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
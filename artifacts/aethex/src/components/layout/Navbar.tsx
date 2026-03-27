import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Stethoscope, Sparkles } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                AETHEX
              </span>
              <span className="hidden lg:block text-[10px] font-bold text-primary tracking-widest uppercase mt-[-4px]">
                For Indian Doctors
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
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary/50 text-secondary-foreground font-semibold hover:shadow-md transition-all border border-secondary"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Ask AI</span>
            </Link>

            <Link 
              href="/products"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors hidden md:block"
            >
              Shop All
            </Link>

            <Link href="/cart" className="relative p-2 text-foreground hover:bg-muted rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-accent rounded-full border-2 border-white">
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
